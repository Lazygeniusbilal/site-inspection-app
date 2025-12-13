const API_URL = "https://site-inspection-backend.onrender.com";

export interface Report {
  id: number;
  report_name: string;
  report_url: string;
  project_id: number;
  created_by: string;
  created_at: string;
}

// Generate report from documents
export const GenerateReport = async (
  reportName: string,
  createdBy: string,
  projectId: number,
  token: string | null
) => {
  const formdata = new FormData();
  formdata.append("report_name", reportName);
  formdata.append("created_by", createdBy);
  formdata.append("project_id", projectId.toString());

  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/reports/generate_report`, {
    method: "POST",
    headers,
    body: formdata,
  });

  if (!response.ok) throw new Error("Failed to generate report!");
  return await response.json();
};

// Fetch reports for a specific project
export const fetchReports = async (
  project_id: number,
  token: string | null
) => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(
    `${API_URL}/reports/get_reports?project_id=${project_id}`,
    {
      method: "GET",
      headers,
    }
  );

  if (!response.ok) throw new Error("Failed to fetch reports!");
  return await response.json();
};

// Delete report
export const deleteReport = async (
  reportId: number,
  token: string | null
) => {
  const headers: HeadersInit = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_URL}/reports/delete_report/${reportId}`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) throw new Error("Failed to delete report!");
  return await response.json();
};
