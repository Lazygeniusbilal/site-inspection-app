"use client";
import { useState } from "react";
import { useProject } from "../components/Projects";

export default function Media() {
  const [selectedView, setSelectedView] = useState<"images" | "videos">(
    "images"
  );
  const { projectId } = useProject();

  return (
    <section className="h-full flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Media Gallery
            </h1>
            <p className="text-gray-600">
              {projectId
                ? `Viewing media for Project ID: ${projectId}`
                : "Select a project to view media"}
            </p>
          </div>
          <button
            onClick={() => (window.location.href = "/upload-form")}
            className="flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-6 py-3 rounded-xl hover:shadow-lg transition-all hover:scale-105 font-semibold"
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
            Upload Media
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setSelectedView("images")}
          className={`px-6 py-3 font-semibold transition-all ${
            selectedView === "images"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-2">
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Images
          </div>
        </button>
        <button
          onClick={() => setSelectedView("videos")}
          className={`px-6 py-3 font-semibold transition-all ${
            selectedView === "videos"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          <div className="flex items-center gap-2">
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
                d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
              />
            </svg>
            Videos
          </div>
        </button>
      </div>

      {/* Content Area */}
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
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Project Selected
            </h3>
            <p className="text-gray-500">
              Please select a project from the sidebar to view media
            </p>
          </div>
        ) : (
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
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No {selectedView === "images" ? "Images" : "Videos"} Yet
            </h3>
            <p className="text-gray-500 mb-4">
              Upload {selectedView === "images" ? "images" : "videos"} to see
              them here
            </p>
            <button
              onClick={() => (window.location.href = "/upload-form")}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-lg transition"
            >
              Upload Now
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
