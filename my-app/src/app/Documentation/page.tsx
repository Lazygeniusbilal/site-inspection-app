"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useProject } from "@/app/components/Projects";
import { fetchDocuments, UploadDocs } from "@/utils/document";
import { GenerateReport, fetchReports, deleteReport } from "@/utils/report";

interface Document {
  id: number;
  file_name: string;
  file_url: string;
  uploader_username: string;
  project_id: number;
  created_at: string;
}

interface Report {
  id: number;
  report_name: string;
  report_url: string;
  project_id: number;
  created_by: string;
  created_at: string;
}

export default function Documentation() {
  const { token } = useAuth();

  let projectId: number | null = null;
  try {
    const project = useProject();
    projectId = project.projectId;
  } catch (e) {
    console.warn("ProjectProvider not available");
  }

  const [documents, setDocuments] = useState<Document[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [docsLoading, setDocsLoading] = useState(false);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<"documents" | "reports">(
    "documents"
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    file_name: "",
    uploader_username: "",
  });

  const [reportName, setReportName] = useState("");
  const [reportCreatedBy, setReportCreatedBy] = useState("");

  /* ===================== DATA LOADING ===================== */

  useEffect(() => {
    if (!projectId || !token) return;
    loadDocuments();
    loadReports();
  }, [projectId, token]);

  const loadDocuments = async () => {
    if (!projectId || !token) return;
    setDocsLoading(true);
    setError("");

    try {
      const data = await fetchDocuments(projectId, token);
      setDocuments(data?.documents ?? []);
    } catch (err) {
      console.error(err);
      setError("Failed to load documents");
    } finally {
      setDocsLoading(false);
    }
  };

  const loadReports = async () => {
    if (!projectId || !token) return;
    setReportsLoading(true);

    try {
      const data = await fetchReports(projectId, token);
      setReports(data?.reports ?? []);
    } catch (err) {
      console.error(err);
    } finally {
      setReportsLoading(false);
    }
  };

  /* ===================== HANDLERS ===================== */

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file && file.type !== "application/pdf") {
      alert("Only PDF files allowed");
      return;
    }
    setSelectedFile(file);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !token || !selectedFile) return;

    if (!formData.file_name || !formData.uploader_username) {
      alert("Fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await UploadDocs(
        selectedFile,
        formData.file_name,
        formData.uploader_username,
        projectId,
        token
      );
      setIsModalOpen(false);
      setSelectedFile(null);
      setFormData({ file_name: "", uploader_username: "" });
      loadDocuments();
    } catch (err: any) {
      alert(err.message || "Upload failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId || !token) return;

    if (!reportName || !reportCreatedBy) {
      alert("Fill all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await GenerateReport(reportName, reportCreatedBy, projectId, token);
      setReportName("");
      setReportCreatedBy("");
      setIsGenerateReportOpen(false);
      loadReports();
    } catch (err: any) {
      alert(err.message || "Report generation failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (id: number) => {
    if (!token) return;
    if (!confirm("Delete this report?")) return;

    try {
      await deleteReport(id, token);
      loadReports();
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  const openDocumentInNewTab = (doc: Document) => {
    if (doc.file_url) {
      window.open(doc.file_url, "_blank", "noopener,noreferrer");
    } else {
      alert("Document URL not available");
    }
  };

  const openReportInNewTab = (report: Report) => {
    if (report.report_url) {
      window.open(report.report_url, "_blank", "noopener,noreferrer");
    } else {
      alert("Report URL not available");
    }
  };

  /* ===================== FILTERS ===================== */

  const filteredDocs = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredReports = reports.filter((report) =>
    report.report_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /* ===================== RENDER ===================== */

  if (!projectId) {
    return (
      <section className="flex flex-col h-full bg-gray-50 p-6">
        <div className="flex flex-col items-center justify-center h-full text-gray-400">
          <svg
            className="w-16 h-16 mb-4 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.5a2 2 0 00-1 .267"
            />
          </svg>
          <p className="text-lg font-semibold text-gray-600">
            Select a project to view documentation
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col h-full bg-gray-50">
      {/* HEADER */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="p-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Documentation
          </h1>

          {/* SEARCH BAR */}
          <div className="mb-6">
            <input
              className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500 text-black"
              placeholder={`Search ${activeTab}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* TABS & ACTION BUTTONS */}
          <div className="flex justify-between items-center gap-4 flex-wrap">
            <div className="flex gap-0 border-b border-gray-200">
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                  activeTab === "documents"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📄 Documents
              </button>
              <button
                onClick={() => setActiveTab("reports")}
                className={`px-4 sm:px-6 py-3 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
                  activeTab === "reports"
                    ? "text-red-600 border-b-2 border-red-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                📊 Reports
              </button>
            </div>

            <div className="flex gap-2">
              {activeTab === "documents" && (
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold text-sm sm:text-base whitespace-nowrap"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Upload
                </button>
              )}
              {activeTab === "reports" && (
                <button
                  onClick={() => setIsGenerateReportOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 sm:px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold text-sm sm:text-base whitespace-nowrap"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  Generate
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6 overflow-y-auto">
        {/* LOADING STATES */}
        {activeTab === "documents" && docsLoading && (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full mb-4"></div>
            <p className="text-gray-600">Loading documents...</p>
          </div>
        )}
        {activeTab === "reports" && reportsLoading && (
          <div className="flex flex-col items-center justify-center h-48">
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full mb-4"></div>
            <p className="text-gray-600">Loading reports...</p>
          </div>
        )}

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-4">
            <p className="font-semibold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* DOCUMENTS TAB */}
        {activeTab === "documents" && !docsLoading && (
          <div>
            {filteredDocs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
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
                <p className="text-lg font-semibold text-gray-600">
                  {searchTerm
                    ? "No documents match your search"
                    : "No documents uploaded yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all border border-gray-200 hover:border-red-300 group hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition">
                      {doc.file_name}
                    </h3>
                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">By:</span>{" "}
                        {doc.uploader_username}
                      </p>
                      <p className="text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <button
                      onClick={() => openDocumentInNewTab(doc)}
                      className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                      Open Document
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* REPORTS TAB */}
        {activeTab === "reports" && !reportsLoading && (
          <div>
            {filteredReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <svg
                  className="w-16 h-16 mb-4 text-gray-300"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <p className="text-lg font-semibold text-gray-600">
                  {searchTerm
                    ? "No reports match your search"
                    : "No reports generated yet"}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredReports.map((report) => (
                  <div
                    key={report.id}
                    className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition-all border border-gray-200 hover:border-red-300 group hover:scale-105"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-200 transition">
                        <svg
                          className="w-6 h-6 text-red-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                          />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-red-600 transition">
                      {report.report_name}
                    </h3>
                    <div className="space-y-2 text-sm mb-4">
                      <p className="text-gray-600">
                        <span className="font-medium">By:</span>{" "}
                        {report.created_by}
                      </p>
                      <p className="text-gray-500">
                        {new Date(report.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => openReportInNewTab(report)}
                        className="flex-1 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-3 rounded-lg font-semibold hover:shadow-lg transition-all hover:scale-105 flex items-center justify-center gap-2"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
                        }}
                        className="flex-1 bg-red-100 hover:bg-red-200 text-red-700 px-4 py-3 rounded-lg font-semibold transition"
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* UPLOAD MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Upload Document
              </h3>
            </div>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  placeholder="Enter document name"
                  value={formData.file_name}
                  onChange={(e) =>
                    setFormData({ ...formData, file_name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Uploader Name
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={formData.uploader_username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      uploader_username: e.target.value,
                    })
                  }
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-red-400 transition">
                  <input
                    type="file"
                    accept="application/pdf"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                  />
                  <label htmlFor="file-input" className="cursor-pointer">
                    <svg
                      className="w-10 h-10 mx-auto mb-2 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                    <p className="text-gray-600 font-medium">
                      {selectedFile ? selectedFile.name : "Click to select PDF"}
                    </p>
                  </label>
                </div>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setSelectedFile(null);
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  {isSubmitting ? "Uploading..." : "Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* GENERATE REPORT MODAL */}
      {isGenerateReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fadeIn">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                Generate Report
              </h3>
            </div>
            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  placeholder="Enter report name"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <input
                  type="text"
                  placeholder="Enter your name"
                  value={reportCreatedBy}
                  onChange={(e) => setReportCreatedBy(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsGenerateReportOpen(false);
                    setReportName("");
                    setReportCreatedBy("");
                  }}
                  className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-3 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-red-600 to-red-500 hover:shadow-lg disabled:from-gray-400 disabled:to-gray-400 text-white px-4 py-3 rounded-lg font-semibold transition"
                >
                  {isSubmitting ? "Generating..." : "Generate"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
