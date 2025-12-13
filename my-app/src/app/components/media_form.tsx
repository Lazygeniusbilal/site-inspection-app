"use client";
import { UploadDocs } from "@/utils/document";
import { UploadMedia } from "@/utils/media";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useProject } from "./Projects";
import { useAuth } from "@/context/AuthProvider";

export default function MediaForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { projectId } = useProject();
  const { token } = useAuth();
  const router = useRouter();

  // Handle file selection
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);

    if (file) {
      const url = URL.createObjectURL(file);
      setFilePreview(url);
    } else {
      setFilePreview(null);
    }
  }

  // Handle form submission
  async function handleSubmition(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;

    const formdata = new FormData(form);
    const file_name =
      formdata.get("file_name")?.toString() || selectedFile?.name; // fallback to file name
    const uploader_username = formdata.get("uploader_username")?.toString();

    if (!selectedFile) {
      alert("Please select a file to upload!");
      return;
    }
    if (!file_name || !uploader_username) {
      alert("Please fill in all fields!");
      return;
    }

    try {
      if (
        selectedFile.type.startsWith("image/") ||
        selectedFile.type.startsWith("video/")
      ) {
        const res = await UploadMedia(
          selectedFile,
          file_name,
          uploader_username,
          projectId!,
          token
        );
        alert("Upload successful!");
        setSelectedFile(null);
        setFilePreview(null);
        form.reset();
        router.push("/");
      } else if (selectedFile.type === "application/pdf") {
        const res = await UploadDocs(
          selectedFile,
          file_name,
          uploader_username,
          projectId!,
          token
        );
        alert("Upload successful!");
        setSelectedFile(null);
        setFilePreview(null);
        form.reset();
        router.push("/");
      } else {
        alert("Unsupported file type!");
        return;
      }
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    }
  }

  return (
    <section className="bg-gray-300 min-h-screen flex justify-center items-center p-4">
      <form
        className="bg-white w-full sm:w-11/12 lg:w-7/10 max-w-2xl min-h-[700px] p-4 sm:p-8 flex flex-col space-y-6 rounded-2xl shadow-lg text-black"
        onSubmit={handleSubmition}
      >
        {/* Header */}
        <div className="p-2 sm:p-4 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold">Upload your Files!</h1>
          <p className="text-base sm:text-lg mt-2">
            Easily upload and manage your media here
          </p>
          {projectId ? (
            <p className="text-xs sm:text-sm text-green-600 mt-2 font-semibold">
              ✓ Project ID: {projectId}
            </p>
          ) : (
            <p className="text-sm text-red-600 mt-2 font-semibold">
              ✗ Please select a project from the sidebar
            </p>
          )}
        </div>

        {/* File name input */}
        <div>
          <input
            type="text"
            name="file_name"
            placeholder="Enter your title..."
            className="border p-3 rounded-lg w-full focus:outline-none"
            required
          />
        </div>

        {/* Email input */}
        <div>
          <input
            type="text"
            name="uploader_username"
            placeholder="Enter your Username"
            className="border p-3 rounded-lg w-full focus:outline-none"
            required
          />
        </div>

        {/* File upload */}
        <div className="border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition">
          <input
            type="file"
            name="file"
            id="fileUpload"
            className="hidden"
            onChange={handleFileChange}
            required
          />
          <label
            htmlFor="fileUpload"
            className="text-black text-3xl cursor-pointer mb-2"
          >
            +
          </label>
          <p className="text-sm text-gray-600">
            Click or drag files here to upload
          </p>

          {/* File preview */}
          {filePreview && (
            <div className="mt-4">
              {selectedFile?.type.startsWith("image/") ? (
                <img
                  src={filePreview}
                  alt="preview"
                  className="max-h-40 rounded-lg"
                />
              ) : selectedFile?.type === "application/pdf" ? (
                <iframe
                  src={filePreview}
                  className="max-h-40 rounded-lg w-full"
                ></iframe>
              ) : (
                <video
                  src={filePreview}
                  controls
                  className="max-h-40 rounded-lg"
                />
              )}
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!projectId}
          className={`text-white font-bold py-3 rounded-lg transition ${
            projectId
              ? "bg-red-500 hover:bg-red-600 cursor-pointer"
              : "bg-gray-400 cursor-not-allowed opacity-60"
          }`}
        >
          {projectId ? "Submit" : "Select a Project First"}
        </button>
      </form>
    </section>
  );
}
