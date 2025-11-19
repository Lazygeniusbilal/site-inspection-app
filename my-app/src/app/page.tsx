"use client";
import { useState } from "react";
import Communication from "./communication/page";
import Documentation from "./Documentation/page";
import Media from "./Media/page";
import ViewReport from "./ViewReport/page";
import Projects from "./components/Projects";

export default function Main() {
  const [activepage, setActivepage] = useState("");

  const pages = [
    { name: "Communication", component: <Communication /> },
    { name: "Documentation", component: <Documentation /> },
    { name: "Media", component: <Media /> },
    { name: "View Report", component: <ViewReport /> },
  ];

  return (
    <section className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="bg-black w-1/6 min-h-screen p-6 flex flex-col">
        <Projects />
        <nav className="flex flex-col space-y-8 mt-8">
          {pages.map((item) => (
            <button
              key={item.name}
              onClick={() => setActivepage(item.name)}
              className={`self-start inline-block text-2xl px-4 py-2 font-bold rounded-lg text-white hover:bg-red-600 hover:scale-105 hover:text-2xl transition-all duration-300 cursor-pointer ${
                activepage === item.name
                  ? "bg-red-600 scale-105"
                  : "hover:bg-red-600 hover:scale-105"
              }`}
            >
              {item.name}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main content */}
      <main className="bg-white w-5/6 p-10 relative h-screen overflow-hidden">
        {activepage === "" ? (
          <div className="flex flex-col justify-center items-center min-h-screen">
            <h1 className="text-6xl font-bold mb-6 text-black">Dashboard</h1>
            <p className="text-gray-700 text-xl">
              Welcome! Select an option from the sidebar to get started.
            </p>
          </div>
        ) : (
          pages.find((page) => page.name === activepage)?.component
        )}
      </main>
    </section>
  );
}
