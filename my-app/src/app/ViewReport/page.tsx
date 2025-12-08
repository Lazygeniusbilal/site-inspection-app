"use client";
import { useProject } from "../components/Projects";
import { useState } from "react";

export default function ViewReport() {
  const { projectId } = useProject();
  const [reportType, setReportType] = useState<
    "summary" | "detailed" | "analytics"
  >("summary");

  return (
    <section className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Project Reports
            </h1>
            <p className="text-gray-600">
              {projectId
                ? `Generate and view reports for Project ID: ${projectId}`
                : "Select a project to view reports"}
            </p>
          </div>
          <button
            disabled={!projectId}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
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
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Generate Report
          </button>
        </div>
      </div>

      {/* Report Type Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setReportType("summary")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            reportType === "summary"
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Summary Report
        </button>
        <button
          onClick={() => setReportType("detailed")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            reportType === "detailed"
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Detailed Report
        </button>
        <button
          onClick={() => setReportType("analytics")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            reportType === "analytics"
              ? "bg-red-500 text-white shadow-md"
              : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
          }`}
        >
          Analytics
        </button>
      </div>

      {/* Report Content */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {!projectId ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg
              className="w-20 h-20 mb-4 text-gray-300"
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
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Project Selected
            </h3>
            <p className="text-gray-500">
              Please select a project from the sidebar to view reports
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-blue-700 font-medium text-sm">
                    Total Media
                  </p>
                  <svg
                    className="w-5 h-5 text-blue-600"
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
                </div>
                <p className="text-3xl font-bold text-blue-900">0</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-green-700 font-medium text-sm">
                    Documents
                  </p>
                  <svg
                    className="w-5 h-5 text-green-600"
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
                </div>
                <p className="text-3xl font-bold text-green-900">0</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-purple-700 font-medium text-sm">
                    Messages
                  </p>
                  <svg
                    className="w-5 h-5 text-purple-600"
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
                </div>
                <p className="text-3xl font-bold text-purple-900">0</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-orange-700 font-medium text-sm">
                    Team Members
                  </p>
                  <svg
                    className="w-5 h-5 text-orange-600"
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
                </div>
                <p className="text-3xl font-bold text-orange-900">0</p>
              </div>
            </div>

            {/* Report Preview */}
            <div className="bg-gray-50 rounded-xl p-8 border-2 border-dashed border-gray-300">
              <div className="text-center text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4 text-gray-400"
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
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  {reportType === "summary" && "Summary Report Preview"}
                  {reportType === "detailed" && "Detailed Report Preview"}
                  {reportType === "analytics" && "Analytics Dashboard"}
                </h3>
                <p className="text-gray-600 mb-4">
                  Click "Generate Report" to create a {reportType} report
                </p>
                <p className="text-sm text-gray-500">
                  Report will include project data, media, documents, and team
                  activity
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
