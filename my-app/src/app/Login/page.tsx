// src/app/login/page.tsx
"use client";
import { useState } from "react";
import { useAuth } from "@/context/AuthProvider";
import { LoginUser } from "@/utils/login";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { setToken } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await LoginUser(username, password, setToken);
      setError("");
      // redirect or close popup here
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-200">
      <div className="bg-white p-6 rounded-xl shadow-lg w-80">
        <h1 className="text-2xl font-bold text-center mb-4 text-black">
          Login
        </h1>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="p-2 mb-3 border rounded text-black"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 mb-4 border rounded text-black"
          />
          <button
            type="submit"
            className="bg-red-500 p-3 rounded text-white hover:scale-105 transition"
            onClick={handleSubmit}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
