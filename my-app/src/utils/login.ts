const API_URL = "https://site-inspection-backend.onrender.com";

export const LoginUser = async (
  username: string,
  password: string,
  setToken: (t: string) => void,
  setUser?: (u: { username: string; role: string }) => void
) => {
  const res = await fetch(`${API_URL}/login/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials!");

  const data = await res.json();

  const token = data.token;
  const userRole = data.role;
  const isAdmin = data.is_admin;

  console.log("Login response:", { username, userRole, isAdmin });

  // Save token
  localStorage.setItem("token", token);
  setToken(token);

  // Save user info
  const userInfo = {
    username: username,
    role: userRole,
  };

  localStorage.setItem("user", JSON.stringify(userInfo));
  console.log("Setting user info:", userInfo);

  if (setUser) setUser(userInfo);

  return token;
};
