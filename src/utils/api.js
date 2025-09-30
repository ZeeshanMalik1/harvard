const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:5000";

export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function getJSON(path) {
  const res = await fetch(`${API_BASE}${path}`, { headers: { ...authHeader() } });
  return res.json();
}

export async function postJSON(path, data) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeader() },
    body: JSON.stringify(data)
  });
  return res.json();
}

export async function uploadFiles(path, files) {
  const fd = new FormData();
  files.forEach(f => fd.append("images", f));
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { ...authHeader() }, // no content-type for multipart
    body: fd
  });
  return res.json();
}
