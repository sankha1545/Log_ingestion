const BASE_URL = import.meta.env.VITE_API_URL;
console.log(import.meta.env.VITE_API_URL)

/* ---------- Value Normalizer ---------- */
function normalizeValue(key, value) {
  if (value === undefined || value === null) return null;
  if (key === "from" || key === "to") return value; // already ISO
  return String(value);
}

/* ---------- Error Normalizer ---------- */
async function handleResponse(res) {
  if (res.ok) {
    return res.json();
  }

  let message = "Failed to fetch logs";

  try {
    const data = await res.json();
    if (data?.error) message = data.error;
    else if (data?.message) message = data.message;
  } catch {
    // fallback to status text
    message = res.statusText || message;
  }

  const error = new Error(message);
  error.status = res.status;
  throw error;
}

/* ---------- Main API ---------- */
export async function fetchLogs(filters = {}, signal) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    const norm = normalizeValue(key, value);
    if (norm !== null && norm !== undefined && norm !== "") {
      if (key === "caseSensitive") {
        params.append("caseSensitive", value ? "true" : "false");
      } else {
        params.append(key, norm);
      }
    }
  });

  const url = `${BASE_URL}/logs?${params.toString()}`;
  console.log("REQUEST URL:", url);

  try {
    const res = await fetch(url, { signal });
    return await handleResponse(res);
  } catch (err) {
    // Abort = not a real error
    if (err.name === "AbortError") {
      console.warn("Request aborted");
      throw err;
    }

    // Network or server error
    if (!err.status) {
      err.message = "Network error: Unable to reach server";
    }

    throw err;
  }
}
