const BASE_URL = "http://localhost:3001";

export async function fetchLogs(filters = {}, signal) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value && value !== "") {
      params.append(key, value);
    }
  });

  const res = await fetch(`${BASE_URL}/logs?${params}`, { signal });
  if (!res.ok) throw new Error("Failed to fetch logs");
  return res.json();
}
