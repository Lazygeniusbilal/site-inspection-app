"use client";
import { useState, useEffect } from "react";
import { useProject } from "../components/Projects";
import { useAuth } from "@/context/AuthProvider";
import { fetchMedia } from "@/utils/media";

interface MediaItem {
  id: number;
  filename: string;
  file_name: string;
  file_url: string;
  uploader_username: string;
  project_id: number;
  created_at?: string;
}

export default function Media() {
  const [selectedView, setSelectedView] = useState<"images" | "videos">(
    "images"
  );
  const { projectId } = useProject();
  const { token } = useAuth();
  const [images, setImages] = useState<MediaItem[]>([]);
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (projectId && token) {
      loadMedia();
    }
  }, [projectId, token]);

  const loadMedia = async () => {
    if (!projectId || !token) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchMedia(projectId, token);

      // 🔥 Normalize filenames so frontend works
      data.images = (data.images || []).map((img: any) => ({
        ...img,
        file_name: img.file_name || img.filename,
      }));

      data.videos = (data.videos || []).map((vid: any) => ({
        ...vid,
        file_name: vid.file_name || vid.filename,
      }));

      setImages(data.images || []);
      setVideos(data.videos || []);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to load media");
    } finally {
      setIsLoading(false);
    }
  };

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
          Images
        </button>
        <button
          onClick={() => setSelectedView("videos")}
          className={`px-6 py-3 font-semibold transition-all ${
            selectedView === "videos"
              ? "text-red-600 border-b-2 border-red-600"
              : "text-gray-600 hover:text-gray-900"
          }`}
        >
          Videos
        </button>
      </div>

      {/* Content Area */}
      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        {!projectId ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              No Project Selected
            </h3>
            <p className="text-gray-500">
              Please select a project from the sidebar to view media
            </p>
          </div>
        ) : isLoading ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <div className="animate-spin w-12 h-12 border-4 border-gray-300 border-t-red-500 rounded-full mb-4"></div>
            <p className="text-gray-600">Loading media...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full text-red-500">
            <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
            <p>{error}</p>
          </div>
        ) : selectedView === "images" ? (
          images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {images.map((image: MediaItem) => (
                <div
                  key={image.id}
                  className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <img
                    src={image.file_url || ""}
                    alt={image.file_name || "image"}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all flex flex-col items-center justify-center opacity-0 group-hover:opacity-100">
                    <a
                      href={image.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-red-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition"
                    >
                      View
                    </a>
                  </div>
                  <div className="p-3 bg-white border-t">
                    <p className="text-xs font-semibold text-gray-900 truncate">
                      {image.file_name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {image.uploader_username}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-400">
              <p>No Images Yet</p>
            </div>
          )
        ) : videos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                className="group relative bg-gray-100 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <video
                  src={video.file_url}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 bg-black"
                  controls
                />
                <div className="p-3 bg-white border-t">
                  <p className="text-xs font-semibold text-gray-900 truncate">
                    {video.file_name}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {video.uploader_username}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <p>No Videos Yet</p>
          </div>
        )}
      </div>
    </section>
  );
}
