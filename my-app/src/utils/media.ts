// define the api url
const API_URL = "http://127.0.0.1:8000";

export interface MediaFile {
  id: number;
  filename: string;
  file_name: string;
  file_url: string;
  file_type: string;
  uploader_username: string;
  project_id: number;
  created_at?: string;
}

export const UploadMedia = async (
  file: File,
  file_name: string,
  uploader_username: string,
  project_id: number,
  token: string | null
) => {
  const formdata = new FormData();
  formdata.append("file", file);
  formdata.append("file_name", file_name);
  formdata.append("uploader_email", uploader_username);
  formdata.append("project_id", project_id.toString()); // convert number to string

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/media/upload_media`, {
    method: "POST",
    headers,
    body: formdata,
  });

  if (!response.ok) throw new Error("Failed to upload file!");
  return await response.json();
};

// Fetch media files for a specific project
export const fetchMedia = async (
  project_id: number,
  token: string | null
) => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/media/get_media?project_id=${project_id}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch media!");
  return await response.json();
};
