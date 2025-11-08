// src/components/problemPanel/editorUtils.js
export const renderValue = (val) =>
  typeof val === "object" ? JSON.stringify(val, null, 2) : String(val);

export const formatOutput = (val) => String(val).replace(/\n+/g, " ").trim();

export async function runCode(SERVER_URL, problemId, code) {
  const res = await fetch(`${SERVER_URL}/evaluate/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemId, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Run failed");
  return data;
}

export async function submitCode(SERVER_URL, problemId, code) {
  const res = await fetch(`${SERVER_URL}/evaluate/submit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ problemId, code }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Submit failed");
  return data;
}
