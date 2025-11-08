import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { PacmanLoader } from "react-spinners";
import { useBattle } from "../../context/BattleContext";
import { GoogleGenAI } from "@google/genai";
import { toast } from "react-toastify";

function RightPanel({ problem }) {
  const geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyCTtqMcXOGlHk_Gh6FQ4GZKVPcDie4qzws";
  console.log("Gemini API Key:", geminiApiKey ? "✓ Loaded" : "✗ Missing");
  
  const { saveUserCode, getUserCode } = useBattle();
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [testCaseHeight, setTestCaseHeight] = useState(200);
  const [output, setOutput] = useState(null);
  const [showOutput, setShowOutput] = useState(false);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!problem?._id) return;
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

  const parseGeminiResponse = (rawText) => {
    try {
      const cleanedText = rawText.replace(/^```json\s*|```\s*$/g, "").trim();
      return JSON.parse(cleanedText);
    } catch (e) {
      console.error("Failed to parse Gemini JSON response:", e);
      console.error("Raw response was:", rawText);
      return {
        error: "Invalid Response",
        message: "Failed to parse AI response. Check console.",
      };
    }
  };

  const getGeminiAI = () => {
    if (!geminiApiKey) {
      throw new Error("Gemini API key not configured");
    }
    try {
      return new GoogleGenAI({ apiKey: geminiApiKey });
    } catch (error) {
      console.error("Failed to initialize Gemini:", error);
      throw new Error(`Failed to initialize Gemini: ${error.message}`);
    }
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
      if (!geminiApiKey) {
        setOutput({
          error: "Configuration Error",
          message: "Gemini API key not configured. Please check .env file.",
        });
        setIsRunning(false);
        return;
      }

      const preparedCode = prepareCode(code, selectedLanguage);
      const firstTestCaseInput = problem.testCases?.[0] || "";

      const prompt = `You are an advanced AI code compiler and runtime environment.
You will receive a snippet of code, a programming language, and a single test case (as STDIN).
Your task is to:
1.  Compile the code.
2.  If compilation fails, return ONLY the compiler error message in a JSON object:
    {"success": false, "error": "Compile Error", "message": "your_compiler_error_message_here"}
3.  If compilation succeeds, execute the code with the provided STDIN.
4.  If a runtime error occurs, return ONLY:
    {"success": false, "error": "Runtime Error", "message": "your_runtime_error_message_here"}
5.  If execution succeeds, return ONLY a JSON object with the result:
    {"success": true, "stdout": "your_code_output", "stderr": "", "time": "X.XX", "memory": "YYYY"}

Do not provide any explanation or conversational text. Only return the JSON object.

---
Language: ${selectedLanguage}
Code:
\`\`\`
${preparedCode}
\`\`\`
STDIN (Test Case 1):
\`\`\`
${firstTestCaseInput}
\`\`\`
---
Respond with ONLY the JSON object.`;

      const ai = getGeminiAI();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      const geminiOutput = parseGeminiResponse(response.text);

      let formattedResult;
      if (geminiOutput.success) {
        formattedResult = {
          testCase: 1,
          passed: true,
          input: firstTestCaseInput,
          output: geminiOutput.stdout,
          time: geminiOutput.time,
          memory: geminiOutput.memory,
        };
      } else {
        formattedResult = {
          testCase: 1,
          passed: false,
          input: firstTestCaseInput,
          error: geminiOutput.error || "Execution Error",
          message: geminiOutput.message,
        };
      }

      setOutput({
        allPassed: formattedResult.passed,
        testResults: [formattedResult],
        totalTests: 1,
        passedTests: formattedResult.passed ? 1 : 0,
      });
    } catch (error) {
      console.error("Code execution error:", error);
      setOutput({
        error: "Execution Failed",
        message: error.message || "Failed to execute code via Gemini",
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setOutput({ error: "Please write some code first!" });
      setShowOutput(true);
      return;
    }

    setIsSubmitting(true);
    setShowOutput(true);
    setOutput(null);

    try {
      if (!geminiApiKey) {
        setOutput({
          error: "Configuration Error",
          message: "Gemini API key not configured. Please check .env file.",
        });
        setIsSubmitting(false);
        return;
      }

      const preparedCode = prepareCode(code, selectedLanguage);

      const allTestCases = problem.testCases.map((input, index) => ({
        input: input,
        expected: problem.expectedOutputs?.[index] || "",
      }));

      if (allTestCases.length === 0) {
        setOutput({ error: "No test cases available for submission" });
        setIsSubmitting(false);
        return;
      }

      const prompt = `You are an advanced AI code judge.
You will receive a snippet of code, a programming language, and an array of test case objects, each with an "input" and "expected" output.
Your task is to:
1.  Compile the code ONCE.
2.  If compilation fails, return ONLY this JSON object:
    {"allPassed": false, "compile_error": true, "message": "your_compiler_error_message_here", "testResults": []}
3.  If compilation succeeds, execute the code against EACH test case.
4.  For each test case, compare the code's STDOUT to the "expected" output.
5.  Return ONLY a single JSON object summarizing the results for all test cases.

The JSON response format must be:
{
  "allPassed": [true/false],
  "totalTests": [number],
  "passedTests": [number],
  "testResults": [
    {
      "testCase": 1,
      "passed": [true/false],
      "input": "input_for_case_1",
      "output": "your_code_output",
      "expected": "expected_output_for_case_1",
      "error": "any_runtime_errors_or_empty_string"
    }
  ]
}

Do not provide any explanation or conversational text. Only return the JSON object.

---
Language: ${selectedLanguage}
Code:
\`\`\`
${preparedCode}
\`\`\`
Test Cases (JSON Array):
${JSON.stringify(allTestCases)}
---
Respond with ONLY the JSON object.`;

      const ai = getGeminiAI();
      const response = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: prompt,
      });
      const geminiOutput = parseGeminiResponse(response.text);

      setOutput(geminiOutput);

      if (geminiOutput.allPassed) {
        toast.success("🎉 All test cases passed! Great job!", {
          position: "top-center",
          autoClose: 3000,
        });
        setShowOutput(false);
      } else if (geminiOutput.compile_error) {
        toast.error("Compilation failed. Check the output for details.", {
          position: "top-center",
          autoClose: 3000,
        });
      } else {
        toast.warning(`${geminiOutput.passedTests}/${geminiOutput.totalTests} test cases passed.`, {
          position: "top-center",
          autoClose: 3000,
        });
      }
    } catch (error) {
      console.error("Code submission error:", error);
      setOutput({
        error: "Submission Failed",
        message: error.message || "Failed to submit code via Gemini",
      });
    } finally {
      setIsSubmitting(false);
    }
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

  const isLoading = isRunning || isSubmitting;

  return (
    <div
      id="right-panel-container"
      className="w-full h-full bg-zinc-950 flex flex-col"
    >
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
            disabled={isLoading}
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
            disabled={isLoading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded font-medium disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>

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

      <div
        onMouseDown={handleMouseDown}
        className="h-1 bg-zinc-800 hover:bg-blue-600 cursor-ns-resize active:bg-blue-500 transition-colors"
      />

      <div
        style={{ height: `${testCaseHeight}px` }}
        className="border-t border-zinc-700 overflow-hidden flex flex-col"
      >
        <div className="p-4 flex-1 overflow-y-auto">
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
                <p className="text-zinc-500 text-sm">
                  No test cases available
                </p>
              )}
            </>
          ) : (
            <div className="space-y-2">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8 gap-4">
                  <PacmanLoader size={25} color="#3b82f6" />
                  <p className="text-zinc-400">Executing code...</p>
                </div>
              ) : output ? (
                output.testResults ? (
                  output.allPassed && output.totalTests > 1 ? (
                    <div className="text-center py-8">
                      <div className="text-6xl mb-4">🎉</div>
                      <h3 className="text-2xl font-bold text-green-400 mb-2">
                        All Tests Passed!
                      </h3>
                      <p className="text-zinc-400">
                        {output.passedTests} / {output.totalTests} test cases passed
                      </p>
                    </div>
                  ) : (
                  <>
                    <div className="mb-3 p-3 rounded bg-zinc-900 border border-zinc-700">
                      <h3
                        className={`text-lg font-bold ${
                          output.allPassed
                            ? "text-green-400"
                            : "text-red-400"
                        }`}
                      >
                        {output.compile_error
                          ? "Compile Error"
                          : output.allPassed
                          ? "Accepted"
                          : "Wrong Answer"}
                      </h3>
                      {!output.compile_error && (
                        <p className="text-zinc-400">
                          {output.passedTests} / {output.totalTests} test cases
                          passed.
                        </p>
                      )}
                      {output.compile_error && (
                        <pre className="text-sm font-mono text-red-300 whitespace-pre-wrap mt-2 bg-zinc-950 p-2 rounded">
                          {output.message}
                        </pre>
                      )}
                    </div>

                    {output.testResults.map((res) => (
                      <div
                        key={res.testCase}
                        className="bg-zinc-900 border border-zinc-700 rounded p-3"
                      >
                        <p className="font-semibold mb-2">
                          Test Case {res.testCase}:{" "}
                          {res.passed ? (
                            <span className="text-green-400">Passed</span>
                          ) : (
                            <span className="text-red-400">Failed</span>
                          )}
                        </p>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-zinc-400 text-xs mb-1">Input:</p>
                            <pre className="font-mono bg-zinc-950 p-2 rounded whitespace-pre-wrap">
                              {res.input}
                            </pre>
                          </div>
                          <div>
                            <p className="text-zinc-400 text-xs mb-1">
                              Your Output:
                            </p>
                            <pre className="font-mono bg-zinc-950 p-2 rounded whitespace-pre-wrap">
                              {res.output || (res.error ? "N/A" : "No output")}
                            </pre>
                          </div>
                        </div>
                        {!res.passed && (
                          <div className="mt-2">
                            <p className="text-zinc-400 text-xs mb-1">
                              Expected Output:
                            </p>
                            <pre className="font-mono bg-zinc-950 p-2 rounded whitespace-pre-wrap">
                              {res.expected}
                            </pre>
                          </div>
                        )}
                        {res.error && (
                          <div className="mt-2">
                            <p className="text-red-400 text-xs mb-1">Error:</p>
                            <pre className="font-mono text-red-300 bg-zinc-950 p-2 rounded whitespace-pre-wrap">
                              {res.error} {res.message}
                            </pre>
                          </div>
                        )}
                      </div>
                    ))}
                  </>
                  )
                ) : (
                  <div className="bg-zinc-900 border border-red-900/30 rounded p-4">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-red-400 font-semibold">
                        ✗ {output.error}
                      </span>
                    </div>
                    <div className="bg-zinc-950 rounded p-3">
                      <pre className="text-sm font-mono text-red-300 whitespace-pre-wrap">
                        {output.message}
                      </pre>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  <p>Click "Run" or "Submit" to execute your code</p>
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