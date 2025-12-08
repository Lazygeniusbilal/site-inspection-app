// src/api/login.ts
const API_URL = "http://127.0.0.1:8000";

export const LoginUser = async (username: string, password: string, setToken: (t: string) => void) => {
  const res = await fetch(`${API_URL}/login/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials!");
  
  const token = await res.text();

  // Save to localStorage
  localStorage.setItem("token", token);

  // Update AuthProvider state
  setToken(token);

  return token;
};
