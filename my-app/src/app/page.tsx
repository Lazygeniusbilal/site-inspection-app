"use client";
import { Component, useState } from "react";
import Communication from "./communication/page";
import Documentation from "./Documentation/page";
import Media from "./Media/page";
import ViewReport from "./ViewReport/page";
import Projects from "./components/Projects";
import AdminDashboard from "./admin-dashboard/page";
import { useAuth } from "@/context/AuthProvider";
import { useRouter } from "next/navigation";

export default function Main() {
  const [activepage, setActivepage] = useState("");
  const { setToken, setUser, user } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    // Clear auth data
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    // Redirect to home (login will show)
    router.push("/");
  };

  const pages = [
    {
      name: "Communication",
      component: <Communication />,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
          />
        </svg>
      ),
    },
    {
      name: "Documentation",
      component: <Documentation />,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Media",
      component: <Media />,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
      ),
    },
    {
      name: "View Report",
      component: <ViewReport />,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
      ),
    },
    {
      name: "Admin Dashboard",
      component: <AdminDashboard />,
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ),
    },
  ];

  return (
    <section className="flex min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Sidebar */}
      <aside className="bg-gradient-to-b from-gray-900 to-gray-800 w-72 min-h-screen p-6 flex flex-col shadow-2xl border-r border-gray-700">
        {/* Logo/Brand */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-1">Site Inspector</h1>
          <p className="text-gray-400 text-sm">Project Management</p>
        </div>

        <Projects />

        <nav className="flex flex-col space-y-2 mt-8">
          {pages.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivepage(item.name)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 ${
                activepage === item.name
                  ? "bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg scale-105"
                  : "text-gray-300 hover:bg-gray-700/50 hover:text-white hover:translate-x-1"
              }`}
            >
              {item.icon}
              <span>{item.name}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="mt-auto pt-6 border-t border-gray-700">
          <div className="mb-4">
            <p className="text-gray-400 text-xs mb-3">
              Logged in as:{" "}
              <span className="font-semibold text-gray-300">
                {user?.username || "User"}
              </span>
            </p>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-lg"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Logout
            </button>
          </div>
          <p className="text-gray-500 text-xs text-center">
            © 2025 Site Inspector
          </p>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 h-screen overflow-y-auto">
        {activepage === "" ? (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-lg mb-6">
                  <svg
                    className="w-10 h-10 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
              </div>
              <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Welcome to Your Dashboard
              </h1>
              <p className="text-gray-600 text-lg mb-8">
                Manage your site inspection projects with ease. Select an option
                from the sidebar to get started.
              </p>
              <div className="grid grid-cols-2 gap-4 mt-12">
                {pages.slice(0, 4).map((page) => (
                  <button
                    key={page.name}
                    onClick={() => setActivepage(page.name)}
                    className="bg-white p-6 rounded-xl shadow-md hover:shadow-xl transition-all hover:scale-105 border border-gray-200"
                  >
                    <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-red-100 text-red-600 mx-auto mb-3">
                      {page.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900">{page.name}</h3>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full">
            {pages.find((page) => page.name === activepage)?.component}
          </div>
        )}
      </main>
    </section>
  );
}
