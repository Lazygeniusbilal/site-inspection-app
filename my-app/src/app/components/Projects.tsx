"use client";

import {
  useState,
  useEffect,
  createContext,
  useContext,
  ReactNode,
} from "react";
import { fetchProjects, createProject } from "@/utils/projects";
import { useAuth } from "@/context/AuthProvider";

// 1️⃣ Create a context for Project ID
interface ProjectContextType {
  projectId: number | null;
  setProjectId: (id: number | null) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// 2️⃣ Context Provider
export function ProjectProvider({ children }: { children: ReactNode }) {
  // Initialize from localStorage immediately
  const [projectId, setProjectId] = useState<number | null>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedProjectId");
      return saved ? parseInt(saved, 10) : null;
    }
    return null;
  });

  // Save to localStorage whenever it changes
  const setProjectIdWithStorage = (id: number | null) => {
    setProjectId(id);
    if (id) {
      localStorage.setItem("selectedProjectId", id.toString());
    } else {
      localStorage.removeItem("selectedProjectId");
    }
  };

  return (
    <ProjectContext.Provider
      value={{ projectId, setProjectId: setProjectIdWithStorage }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

// 3️⃣ Custom hook to use project context
export function useProject() {
  const context = useContext(ProjectContext);
  if (!context)
    throw new Error("useProject must be used within ProjectProvider");
  return context;
}

// 4️⃣ Projects Component
export default function Projects() {
  const [projects, setProjects] = useState<{ id: number; name: string }[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { projectId, setProjectId } = useProject();
  const { token } = useAuth();

  // Fetch projects on mount or when token changes
  useEffect(() => {
    async function load() {
      if (!token) {
        console.log("No token available yet, skipping project fetch");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchProjects(token);
        console.log("Projects data:", data);
        const projArray = Array.isArray(data) ? data : data.projects || [];
        setProjects(projArray);

        // Only set default project if no project is already selected
        if (projArray.length > 0 && !projectId) {
          setActiveProject(projArray[0].name);
          setProjectId(projArray[0].id);
        } else if (projArray.length > 0 && projectId) {
          // If a project is already selected, find and set its name
          const selected = projArray.find((p: any) => p.id === projectId);
          if (selected) {
            setActiveProject(selected.name);
          }
        }
      } catch (err: any) {
        console.error("Fetch failed:", err.message);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [token, setProjectId, projectId]);

  const handleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === "__create") {
      const name = prompt("Enter new project name:");
      if (name?.trim()) {
        try {
          const result = await createProject(name, token);
          setProjects((prev) => [
            ...prev,
            { id: result.id, name: result.projectName },
          ]);
          setActiveProject(result.projectName);
          setProjectId(result.id);
        } catch {
          alert("Failed to create project.");
        }
      }
    } else {
      const selected = projects.find((p) => p.name === value);
      setActiveProject(selected?.name || null);
      setProjectId(selected?.id || null);
    }
  };

  if (isLoading) {
    return (
      <select className="font-bold text-xl p-2 rounded mb-6 bg-gray-600 text-white">
        <option>Loading projects...</option>
      </select>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-sm mb-4 p-3 bg-red-100 rounded">
        Error: {error}
      </div>
    );
  }

  if (!projects.length) {
    return (
      <select className="font-bold text-xl p-2 rounded mb-6\">
        <option>No projects</option>
      </select>
    );
  }

  return (
    <select
      value={activeProject || ""}
      onChange={handleChange}
      className="font-bold text-xl p-2 rounded mb-6"
    >
      {projects.map((proj) => (
        <option key={proj.id} value={proj.name} className="text-black">
          {proj.name}
        </option>
      ))}
      <option value="__create" className="text-black">
        + Create New Project
      </option>
    </select>
  );
}
