// api url localhost
const API_URL = "http://127.0.0.1:8000";

export const createProject = async (
  projectName: string,
  token: string | null
) => {
  // can send form data
  const formdata = new FormData();
  // append the project name into form
  formdata.append("project_name", projectName);

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // fetch the api response
  const response = await fetch(`${API_URL}/projects/`, {
    method: "POST",
    headers,
    body: formdata,
  });

  if (!response.ok) throw new Error("Failed to create a project");
  return await response.json();
};

export const fetchProjects = async (token: string | null) => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/projects/`, {
    method: "GET",
    headers,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to load projects: ${response.status} - ${errorData}`);
  }

  return await response.json();
};
     