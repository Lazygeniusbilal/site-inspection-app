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
  const [documents, setDocuments] = useState<Document[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isGenerateReportOpen, setIsGenerateReportOpen] = useState(false);
  const [previewDoc, setPreviewDoc] = useState<Document | null>(null);
  const [previewReport, setPreviewReport] = useState<Report | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [reportName, setReportName] = useState("");
  const [reportCreatedBy, setReportCreatedBy] = useState("");
  const [formData, setFormData] = useState({
    file_name: "",
    uploader_username: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<"documents" | "reports">(
    "documents"
  );

  const { token } = useAuth();
  const { projectId } = useProject();

  useEffect(() => {
    if (projectId) {
      loadDocuments();
      loadReports();
    }
  }, [projectId]);

  const loadDocuments = async () => {
    if (!projectId || !token) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchDocuments(projectId, token);
      setDocuments(data.documents || []);
    } catch (err: any) {
      console.error(err);
      setError("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  const loadReports = async () => {
    if (!projectId || !token) return;

    try {
      const data = await fetchReports(projectId, token);
      setReports(data.reports || []);
    } catch (err: any) {
      console.error(err);
    }
  };

  const handleGenerateReport = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!reportName || !reportCreatedBy) {
      alert("Please fill in all fields!");
      return;
    }

    setIsSubmitting(true);

    try {
      await GenerateReport(reportName, reportCreatedBy, projectId!, token);
      alert("Report generated successfully!");
      setReportName("");
      setReportCreatedBy("");
      setIsGenerateReportOpen(false);
      loadReports();
    } catch (err: any) {
      alert("Report generation failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteReport = async (reportId: number) => {
    if (!confirm("Are you sure you want to delete this report?")) return;

    try {
      await deleteReport(reportId, token);
      alert("Report deleted successfully!");
      loadReports();
    } catch (err: any) {
      alert("Delete failed: " + err.message);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file && file.type === "application/pdf") {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert("Please select a PDF file!");
      return;
    }

    if (!formData.file_name || !formData.uploader_username) {
      alert("Please fill in all fields!");
      return;
    }

    if (selectedFile.type !== "application/pdf") {
      alert("Only PDF files are allowed!");
      return;
    }

    setIsSubmitting(true);

    try {
      await UploadDocs(
        selectedFile,
        formData.file_name,
        formData.uploader_username,
        projectId!,
        token
      );
      alert("Document uploaded successfully!");
      setFormData({ file_name: "", uploader_username: "" });
      setSelectedFile(null);
      setFilePreview(null);
      setIsModalOpen(false);
      loadDocuments();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredDocs = documents.filter((doc) =>
    doc.file_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="flex flex-col h-full bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 p-4 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Documentation
            </h2>
            <p className="text-xs sm:text-sm text-gray-600">
              {projectId
                ? `Project ID: ${projectId}`
                : "Select a project to view documents"}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-4 items-center w-full sm:w-auto">
            <div className="bg-blue-50 px-3 sm:px-4 py-2 rounded-lg text-center flex-1 sm:flex-none">
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {documents.length}
              </p>
              <p className="text-xs text-gray-600">Documents</p>
            </div>
            <div className="bg-purple-50 px-3 sm:px-4 py-2 rounded-lg text-center flex-1 sm:flex-none">
              <p className="text-2xl font-bold text-purple-600">
                {reports.length}
              </p>
              <p className="text-xs text-gray-600">Reports</p>
            </div>
            {projectId && (
              <div className="flex gap-2 w-full sm:w-auto flex-col sm:flex-row">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5"
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
                  <span className="hidden sm:inline">Upload Document</span>
                  <span className="sm:hidden">Upload</span>
                </button>
                <button
                  onClick={() => setIsGenerateReportOpen(true)}
                  className="flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold text-sm sm:text-base whitespace-nowrap"
                >
                  <svg
                    className="w-4 sm:w-5 h-4 sm:h-5"
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
                  <span className="hidden sm:inline">Generate Report</span>
                  <span className="sm:hidden">Report</span>
                </button>
              </div>
            )}
          </div>
        </div>{" "}
        {/* Tabs */}
        <div className="flex gap-2 sm:gap-4 border-b border-gray-200 mb-4 overflow-x-auto">
          <button
            onClick={() => setActiveTab("documents")}
            className={`px-3 sm:px-4 py-2 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
              activeTab === "documents"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📄 Documents
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-3 sm:px-4 py-2 font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
              activeTab === "reports"
                ? "text-purple-600 border-b-2 border-purple-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            📊 Generated Reports
          </button>
        </div>
        {/* Search Bar */}
        {projectId && (
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        )}
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6">
        {/* No project selected */}
        {!projectId && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">📁 No Project Selected</p>
              <p className="text-sm">
                Select a project from sidebar to view documents
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading documents...</p>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            {error}
          </div>
        )}

        {/* No documents */}
        {activeTab === "documents" &&
          projectId &&
          !isLoading &&
          documents.length === 0 && (
            <div className="flex items-center justify-center h-full text-gray-400">
              <div className="text-center">
                <p className="text-lg">📄 No documents yet</p>
                <p className="text-sm">
                  Upload documents from the button above
                </p>
              </div>
            </div>
          )}

        {/* Documents List */}
        {activeTab === "documents" &&
          projectId &&
          !isLoading &&
          filteredDocs.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredDocs.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200 cursor-pointer"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-blue-600 font-bold text-sm">
                        PDF
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3
                        className="font-semibold text-gray-900 truncate hover:text-blue-600 transition"
                        onClick={() => setPreviewDoc(doc)}
                      >
                        {doc.file_name}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {new Date(doc.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <p className="text-xs text-gray-600 mb-3">
                    Uploaded by:{" "}
                    <span className="font-semibold">
                      {doc.uploader_username}
                    </span>
                  </p>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      className="flex-1 text-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                    >
                      👁️ Preview
                    </button>
                    <a
                      href={doc.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 text-center px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition"
                    >
                      📥 Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

        {/* No search results */}
        {projectId &&
          !isLoading &&
          documents.length > 0 &&
          filteredDocs.length === 0 &&
          activeTab === "documents" && (
            <div className="text-center text-gray-400 py-8">
              <p className="text-lg">No documents match your search</p>
            </div>
          )}

        {/* Reports Section */}
        {activeTab === "reports" && !projectId && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">📊 No Project Selected</p>
              <p className="text-sm">Select a project to view reports</p>
            </div>
          </div>
        )}

        {/* No reports */}
        {activeTab === "reports" && projectId && reports.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">📊 No reports yet</p>
              <p className="text-sm">
                Generate a report using the Generate Report button
              </p>
            </div>
          </div>
        )}

        {/* Reports List */}
        {activeTab === "reports" && projectId && reports.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reports.map((report) => (
              <div
                key={report.id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 border border-gray-200"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-600 font-bold text-sm">
                      📊
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="font-semibold text-gray-900 truncate hover:text-purple-600 transition cursor-pointer"
                      onClick={() => setPreviewReport(report)}
                    >
                      {report.report_name}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  Created by:{" "}
                  <span className="font-semibold">{report.created_by}</span>
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => setPreviewReport(report)}
                    className="flex-1 text-center px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition"
                  >
                    👁️ Preview
                  </button>
                  <a
                    href={report.report_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 text-center px-3 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm font-medium transition"
                  >
                    📥 Download
                  </a>
                  <button
                    onClick={() => handleDeleteReport(report.id)}
                    className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg text-sm font-medium transition"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Document Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Upload Document
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Document Name
                </label>
                <input
                  type="text"
                  value={formData.file_name}
                  onChange={(e) =>
                    setFormData({ ...formData, file_name: e.target.value })
                  }
                  placeholder="Enter document name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.uploader_username}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      uploader_username: e.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PDF File
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 transition">
                  <input
                    type="file"
                    id="fileUpload"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="fileUpload"
                    className="cursor-pointer text-center"
                  >
                    {selectedFile ? (
                      <>
                        <p className="text-sm font-semibold text-gray-900">
                          ✓ {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Click to change
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-2xl mb-2">📄</p>
                        <p className="text-sm font-semibold text-gray-900">
                          Click to upload PDF
                        </p>
                        <p className="text-xs text-gray-500">
                          or drag and drop
                        </p>
                      </>
                    )}
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? "Uploading..." : "Upload Document"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Document Preview Modal */}
      {previewDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {previewDoc.file_name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Uploaded by: {previewDoc.uploader_username} •{" "}
                  {new Date(previewDoc.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewDoc.file_url}
                className="w-full h-full"
                title={previewDoc.file_name}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                Close
              </button>
              <a
                href={previewDoc.file_url}
                download={previewDoc.file_name}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium transition"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Generate Report Modal */}
      {isGenerateReportOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900">
                Generate Report
              </h2>
              <button
                onClick={() => setIsGenerateReportOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleGenerateReport} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report Name
                </label>
                <input
                  type="text"
                  value={reportName}
                  onChange={(e) => setReportName(e.target.value)}
                  placeholder="e.g., Site Inspection Report Q4 2025"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created By
                </label>
                <input
                  type="text"
                  value={reportCreatedBy}
                  onChange={(e) => setReportCreatedBy(e.target.value)}
                  placeholder="Your name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900"
                  required
                />
              </div>

              <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                ℹ️ This will compile all uploaded documents for this project
                into a single report.
              </p>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsGenerateReportOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-500 text-white rounded-lg hover:shadow-lg transition disabled:opacity-50 font-medium"
                >
                  {isSubmitting ? "Generating..." : "Generate Report"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-900">
                  {previewReport.report_name}
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Created by: {previewReport.created_by} •{" "}
                  {new Date(previewReport.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setPreviewReport(null)}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ✕
              </button>
            </div>

            {/* Modal Body - PDF Viewer */}
            <div className="flex-1 overflow-hidden">
              <iframe
                src={previewReport.report_url}
                className="w-full h-full"
                title={previewReport.report_name}
              />
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200 flex justify-between">
              <button
                onClick={() => setPreviewReport(null)}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
              >
                Close
              </button>
              <a
                href={previewReport.report_url}
                download={previewReport.report_name}
                className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
