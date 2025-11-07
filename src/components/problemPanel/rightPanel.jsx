import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { PacmanLoader } from "react-spinners";
import axios from "axios";
import { useBattle } from "../../context/BattleContext";

function RightPanel({ problem }) {
  const { saveUserCode, getUserCode } = useBattle();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const savedLang = localStorage.getItem(`selectedLanguage_${problem?._id}`);
    return savedLang || "javascript";
  });
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [testCaseHeight, setTestCaseHeight] = useState(200);
  const [output, setOutput] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const isDraggingRef = useRef(false);

  const languageIds = {
    cpp: 54,
    javascript: 63,
    python3: 71,
    java: 62,
  };

  useEffect(() => {
    if (problem?._id) {
      localStorage.setItem(`selectedLanguage_${problem._id}`, selectedLanguage);
    }
  }, [selectedLanguage, problem?._id]);

  useEffect(() => {
    return () => {
      if (problem?._id) {
        localStorage.removeItem(`selectedLanguage_${problem._id}`);
      }
    };
  }, []);

  useEffect(() => {
    if (!problem?._id) return;

    // Try to get saved code first
    const savedCode = getUserCode(problem._id, selectedLanguage);

    if (savedCode) {
      setCode(savedCode);
    } else {
      const snippet = problem.codeSnippets?.find(
        (s) => s.langSlug === selectedLanguage
      );
      setCode(snippet?.code || "");
    }

    setOutput(null);
    setShowOutput(false);
  }, [problem, selectedLanguage]);

  useEffect(() => {
    if (problem?._id && code) {
      saveUserCode(problem._id, selectedLanguage, code);
    }
  }, [code, problem?._id, selectedLanguage]);

  const getCodeSnippet = () => {
    if (!problem.codeSnippets) return "";
    const snippet = problem.codeSnippets.find(
      (s) => s.langSlug === selectedLanguage
    );
    return snippet?.code || "";
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);

    const savedCode = getUserCode(problem._id, lang);
    if (savedCode) {
      setCode(savedCode);
    } else {
      const snippet = problem.codeSnippets?.find((s) => s.langSlug === lang);
      setCode(snippet?.code || "");
    }
  };

  const allowedLanguages = ["cpp", "javascript", "python3", "java"];
  const availableLanguages =
    problem.codeSnippets
      ?.filter((s) => allowedLanguages.includes(s.langSlug))
      .map((s) => ({
        value: s.langSlug,
        label: s.lang,
        monacoLang:
          s.langSlug === "cpp"
            ? "cpp"
            : s.langSlug === "python3"
            ? "python"
            : s.langSlug,
      })) || [];

  const currentLanguage =
    availableLanguages.find((l) => l.value === selectedLanguage)?.monacoLang ||
    "javascript";

  const prepareCode = (code, language) => {
    if (language === "cpp") {
      const hasIostream = code.includes("#include <iostream>");
      const hasNamespace = code.includes("using namespace std");
      const hasMain = code.includes("int main");

      let preparedCode = code;

      if (!hasIostream || !hasNamespace) {
        const headers = [];
        if (!hasIostream) headers.push("#include <iostream>");
        if (!code.includes("#include <vector>"))
          headers.push("#include <vector>");
        if (!code.includes("#include <string>"))
          headers.push("#include <string>");
        if (!code.includes("#include <algorithm>"))
          headers.push("#include <algorithm>");
        if (!hasNamespace) headers.push("using namespace std;");

        preparedCode = headers.join("\n") + "\n\n" + code;
      }

      if (!hasMain) {
        const mainFunc = `
int main() {
    Solution sol;
    // Read input and call solution
    int input;
    while(cin >> input) {
        cout << sol.getLeastFrequentDigit(input) << endl;
    }
    return 0;
}`;
        preparedCode += "\n" + mainFunc;
      }

      return preparedCode;
    }

    return code;
  };

  const handleRunCode = async () => {
    if (!code.trim()) {
      setOutput({ error: "Please write some code first!" });
      setShowOutput(true);
      return;
    }

    setIsRunning(true);
    setShowOutput(true);
    setOutput(null);

    try {
      const languageId = languageIds[selectedLanguage];
      const apiKey = import.meta.env.VITE_JUDGE0_API_KEY;

      if (!apiKey) {
        setOutput({
          error: "Configuration Error",
          message: "Judge0 API key not configured. Please check .env file.",
        });
        setIsRunning(false);
        return;
      }

      const preparedCode = prepareCode(code, selectedLanguage);

      const testCases = problem.testCases || [];
      if (testCases.length === 0) {
        setOutput({ error: "No test cases available" });
        setIsRunning(false);
        return;
      }

      const results = [];

      for (let i = 0; i < testCases.length; i++) {
        const testInput = testCases[i];

        const encodedSource = btoa(unescape(encodeURIComponent(preparedCode)));
        const encodedStdin = testInput
          ? btoa(unescape(encodeURIComponent(testInput)))
          : "";

        const submitResponse = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            source_code: encodedSource,
            language_id: languageId,
            stdin: encodedStdin,
          },
          {
            headers: {
              "Content-Type": "application/json",
              "X-RapidAPI-Key": apiKey,
              "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            },
            params: {
              base64_encoded: "true",
              fields: "*",
            },
          }
        );

        const token = submitResponse.data.token;

        // Poll for result
        let result;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const resultResponse = await axios.get(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            {
              headers: {
                "X-RapidAPI-Key": apiKey,
                "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
              },
              params: {
                base64_encoded: "true",
                fields: "*",
              },
            }
          );

          result = resultResponse.data;

          if (result.status.id > 2) {
            break;
          }

          attempts++;
        }

        results.push({
          testCase: i + 1,
          input: testInput,
          result: result,
        });
      }

      const allPassed = results.every((r) => r.result.status.id === 3);
      const formattedResults = results.map((r) => {
        const res = r.result;
        if (res.status.id === 3) {
          return {
            testCase: r.testCase,
            passed: true,
            input: r.input,
            output: res.stdout ? atob(res.stdout) : "No output",
            time: res.time,
            memory: res.memory,
          };
        } else {
          return {
            testCase: r.testCase,
            passed: false,
            input: r.input,
            error: res.compile_output
              ? atob(res.compile_output)
              : res.stderr
              ? atob(res.stderr)
              : res.status.description,
            message: res.message || "",
          };
        }
      });

      setOutput({
        allPassed,
        testResults: formattedResults,
        totalTests: results.length,
        passedTests: formattedResults.filter((r) => r.passed).length,
      });
    } catch (error) {
      console.error("Code execution error:", error);
      setOutput({
        error: "Execution Failed",
        message:
          error.response?.data?.message ||
          error.message ||
          "Failed to execute code",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = () => {
    console.log("Submitting code...");
  };

  const handleResetCode = () => {
    const snippet = problem.codeSnippets?.find(
      (s) => s.langSlug === selectedLanguage
    );
    const defaultCode = snippet?.code || "";
    setCode(defaultCode);
    saveUserCode(problem._id, selectedLanguage, "");
    setOutput(null);
    setShowOutput(false);
  };
  const handleMouseDown = (e) => {
    e.preventDefault();
    isDraggingRef.current = true;
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e) => {
    if (!isDraggingRef.current) return;
    const container = document.getElementById("right-panel-container");
    if (!container) return;

    const containerRect = container.getBoundingClientRect();
    const newHeight = containerRect.bottom - e.clientY;
    const minHeight = 100;
    const maxHeight = containerRect.height * 0.6;

    setTestCaseHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div
      id="right-panel-container"
      className="w-full h-full bg-zinc-950 flex flex-col"
    >
      {/* Header */}
      <div className="p-4 border-b border-zinc-700 flex items-center justify-between">
        <select
          value={selectedLanguage}
          onChange={(e) => handleLanguageChange(e.target.value)}
          className="bg-zinc-800 text-white px-4 py-2 rounded border border-zinc-700 focus:outline-none focus:border-blue-500"
        >
          {availableLanguages.map((lang) => (
            <option key={lang.value} value={lang.value}>
              {lang.label}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          <button
            onClick={handleResetCode}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded border border-zinc-700 flex items-center gap-2"
            title="Reset to default code"
          >
            ↻ Reset
          </button>
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded border border-zinc-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isRunning ? (
              <>
                <span>Running...</span>
              </>
            ) : (
              <>▶ Run</>
            )}
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Code Editor */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          language={currentLanguage}
          theme="vs-dark"
          value={code || getCodeSnippet()}
          onChange={(value) => setCode(value || "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            roundedSelection: false,
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            wordWrap: "on",
          }}
        />
      </div>

      {/* Draggable Divider */}
      <div
        onMouseDown={handleMouseDown}
        className="h-1 bg-zinc-800 hover:bg-blue-600 cursor-ns-resize active:bg-blue-500 transition-colors"
      />

      {/* Test Cases / Output */}
      <div
        style={{ height: `${testCaseHeight}px` }}
        className="border-t border-zinc-700 overflow-hidden flex flex-col"
      >
        <div className="p-4 flex-1 overflow-y-auto">
          {/* Tabs */}
          <div className="flex gap-4 mb-3 border-b border-zinc-700">
            <button
              onClick={() => setShowOutput(false)}
              className={`pb-2 px-1 font-semibold transition-colors ${
                !showOutput
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Test Cases
            </button>
            <button
              onClick={() => setShowOutput(true)}
              className={`pb-2 px-1 font-semibold transition-colors ${
                showOutput
                  ? "text-blue-400 border-b-2 border-blue-400"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Output
            </button>
          </div>

          {!showOutput ? (
            // Test Cases Tab
            <>
              {problem.testCases && problem.testCases.length > 0 ? (
                <div className="space-y-2">
                  {problem.testCases.map((testCase, idx) => (
                    <div
                      key={idx}
                      className="bg-zinc-900 border border-zinc-700 rounded p-3"
                    >
                      <p className="text-zinc-400 text-xs mb-2 font-semibold">
                        Test Case {idx + 1}
                      </p>
                      <pre
                        className="text-sm font-mono whitespace-pre-wrap"
                        style={{ color: "#ffffff" }}
                      >
                        {testCase}
                      </pre>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-zinc-500 text-sm">No test cases available</p>
              )}
            </>
          ) : (
            // Output Tab
            <div className="space-y-2">
              {isRunning ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <PacmanLoader size={25} color="#3b82f6" />
                  <p className="text-zinc-400">Executing code...</p>
                </div>
              ) : output ? (
                <div className="bg-zinc-900 border border-zinc-700 rounded p-4">
                  {output.success ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-green-400 font-semibold">
                          ✓ Success
                        </span>
                        <span className="text-zinc-500 text-xs">
                          Time: {output.time}s | Memory: {output.memory} KB
                        </span>
                      </div>
                      <div className="bg-zinc-950 rounded p-3 border border-zinc-700">
                        <p className="text-zinc-400 text-xs mb-1">Output:</p>
                        <pre className="text-sm font-mono text-white whitespace-pre-wrap">
                          {output.stdout}
                        </pre>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-red-400 font-semibold">
                          ✗ {output.error}
                        </span>
                      </div>
                      <div className="bg-zinc-950 rounded p-3 border border-red-900/30">
                        <pre className="text-sm font-mono text-red-300 whitespace-pre-wrap">
                          {output.message}
                        </pre>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <p>Click "Run" to execute your code</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default RightPanel;
