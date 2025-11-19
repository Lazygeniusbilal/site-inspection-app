"use client";
import { ReactEventHandler, useState } from "react";

export default function Projects() {
  const [projects, setProjects] = useState([
    "Project A",
    "Project B",
    "Project C",
  ]);

  const [activeProject, setActiveProject] = useState("Project A");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "__create") {
      const name = prompt("Enter new project name:");

      if (name && name.trim() !== "") {
        setProjects([...projects, name]);
        setActiveProject(name);
      }
    } else {
      setActiveProject(value);
    }
  };

  return (
    <select
      value={activeProject}
      onChange={handleChange}
      className="font-bold text-xl p-2 rounded mb-6"
    >
      {projects.map((proj) => (
        <option key={proj} value={proj}>
          {proj}
        </option>
      ))}

      {/* Special option for creating a new project */}
      <option value="__create">+ Create New Project</option>
    </select>
  );
}
