// define the api url
const API_URL = "https://site-inspection-backend.onrender.com";

export interface Document {
  id: number;
  filename: string;
  file_name: string;
  file_url: string;
  uploader_username: string;
  project_id: number;
  created_at?: string;
}

// Upload document to the backend
export const UploadDocs = async (
  file: File,
  file_name: string,
  uploader_username: string,
  project_id: number,
  token: string | null
) => {
  const formdata = new FormData();
  // create form data object to hold the values
  formdata.append("file", file);
  formdata.append("file_name", file_name);
  formdata.append("uploader_username", uploader_username);
  formdata.append("project_id", project_id.toString());

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/documentation/upload_doc`, {
    method: "POST",
    headers,
    body: formdata,
  });
  if (!response.ok) throw new Error("Failed to upload file!");
  return await response.json();
};

// Fetch documents for a specific project
export const fetchDocuments = async (
  project_id: number,
  token: string | null
) => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/documentation/get_documents?project_id=${project_id}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch documents!");
  return await response.json();
};
    