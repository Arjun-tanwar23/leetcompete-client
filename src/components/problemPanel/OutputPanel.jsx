// src/components/problemPanel/OutputPanel.jsx
import { PacmanLoader } from "react-spinners";
import { renderValue, formatOutput } from "./editorUtils";

function OutputPanel({ showOutput, isRunning, isSubmitting, problem, output }) {
  if (isRunning || isSubmitting)
    return (
      <div className="flex justify-center items-center h-full">
        <PacmanLoader size={25} color="#3b82f6" />
      </div>
    );

  if (!output)
    return (
      <p className="text-zinc-500 text-center py-4">
        Click “Run” or “Submit” to see output
      </p>
    );

  // Submit mode — show all cases
  if (output.mode === "submit")
    return (
      <div>
        <h3
          className={`font-bold mb-3 ${
            output.allPassed ? "text-green-400" : "text-yellow-400"
          }`}
        >
          {output.allPassed
            ? "All test cases passed!"
            : `${output.passedTests}/${output.totalTests} passed`}
        </h3>

        {output.results.map((r) => {
          const passed = formatOutput(r.output) === formatOutput(r.expectedOutput);
          return (
            <div
              key={r.testCase}
              className={`rounded-lg border p-4 mb-3 ${
                passed
                  ? "border-green-600 bg-green-950/30"
                  : "border-red-600 bg-red-950/30"
              }`}
            >
              <div className="flex justify-between items-center mb-2">
                <span
                  className={`font-semibold ${
                    passed ? "text-green-400" : "text-red-400"
                  }`}
                >
                  Test {r.testCase}: {passed ? "✅ Passed" : "❌ Failed"}
                </span>
                <span className="text-xs text-zinc-400">{r.status || ""}</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-blue-400 font-medium">Expected:</p>
                  <pre className="bg-zinc-950 p-2 rounded text-white overflow-x-auto">
                    {renderValue(r.expectedOutput)}
                  </pre>
                </div>
                <div>
                  <p className="text-yellow-400 font-medium">Your Output:</p>
                  <pre className="bg-zinc-950 p-2 rounded text-white overflow-x-auto">
                    {renderValue(r.output)}
                  </pre>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );

  // Run mode — single test case
  return (
    <div
      className={`rounded-lg border p-4 ${
        output.passed
          ? "border-green-600 bg-green-950/30"
          : "border-red-600 bg-red-950/30"
      }`}
    >
      <p
        className={`font-semibold mb-2 ${
          output.passed ? "text-green-400" : "text-red-400"
        }`}
      >
        {output.passed ? "✅ Output Matched" : "❌ Output Mismatch"}
      </p>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-blue-400 font-medium">Expected:</p>
          <pre className="bg-zinc-950 p-2 rounded text-white overflow-x-auto">
            {renderValue(output.expectedOutput)}
          </pre>
        </div>
        <div>
          <p className="text-yellow-400 font-medium">Your Output:</p>
          <pre className="bg-zinc-950 p-2 rounded text-white overflow-x-auto">
            {renderValue(output.output)}
          </pre>
        </div>
      </div>
    </div>
  );
}

export default OutputPanel;
