"use client";
import { UploadDocs } from "@/utils/document";
import { UploadMedia } from "@/utils/media";
import { useState } from "react";
import { useProject } from "./Projects";

export default function MediaForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { projectId } = useProject();

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

    if (!projectId) {
      alert("Please select a project before uploading!");
      return;
    }

    const formdata = new FormData(e.currentTarget);
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
          projectId
        );
        alert("Upload successful! File URL: " + res.file_url);
      } else if (selectedFile.type === "application/pdf") {
        const res = await UploadDocs(
          selectedFile,
          file_name,
          uploader_username,
          projectId
        );
        alert("Upload successful! File URL: " + res.file_url);
      } else {
        alert("Unsupported file type!");
        return;
      }

      // Reset form
      setSelectedFile(null);
      setFilePreview(null);
      e.currentTarget.reset();
    } catch (err: any) {
      alert("Upload failed: " + err.message);
    }
  }

  return (
    <section className="bg-gray-300 min-h-screen flex justify-center items-center p-4">
      <form
        className="bg-white w-7/10 min-h-[700px] p-8 flex flex-col space-y-6 rounded-2xl shadow-lg text-black"
        onSubmit={handleSubmition}
      >
        {/* Header */}
        <div className="p-4 text-center">
          <h1 className="text-3xl font-bold">Upload your Files!</h1>
          <p className="text-lg mt-2">
            Easily upload and manage your media here
          </p>
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
            type="email"
            name="uploader_username"
            placeholder="example@example.com"
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
        <button className="bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition">
          Submit
        </button>
      </form>
    </section>
  );
}
