"use client";
import { useState } from "react";

export default function MediaForm() {
  const [filetype, setFileType] = useState(["Image", "Video"]);
  const [activefiletype, setActiveFileType] = useState("");

  function handleFileType(e: React.ChangeEvent<HTMLSelectElement>) {
    const file = e.target.value;
    if (file) {
      setActiveFileType(file);
    } else {
      alert("No file found!");
    }
  }
  return (
    <section className="bg-gray-300 min-h-screen flex justify-center items-center p-4">
      {/* Form container */}{" "}
      <form className="bg-white w-7/10 min-h-[700px] p-8 flex flex-col space-y-6 rounded-2xl shadow-lg text-black">
        {/* Media file header */}{" "}
        <div className="p-4 text-center">
          {" "}
          <h1 className="text-3xl font-bold">Upload your Files!</h1>{" "}
          <p className="text-lg mt-2">
            Easily upload and manage your media here
          </p>{" "}
        </div>
        ```
        {/* Title and Date */}
        <div className="flex flex-col space-y-4">
          <input
            type="text"
            placeholder="Enter your title..."
            className="border p-3 rounded-lg focus:outline-none"
          />
          <input
            type="datetime-local"
            placeholder="Enter the date..."
            className="border p-3 rounded-lg focus:outline-none"
          />
        </div>
        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="example@example.com"
            className="border p-3 rounded-lg w-full focus:outline-none"
          />
        </div>
        {/* Select */}
        <div>
          <select
            className="border p-3 rounded-lg w-full focus:outline-none"
            value={activefiletype}
            onChange={handleFileType}
          >
            <option value="">Select an option</option>
            {filetype.map((file) => (
              <option key={file} value={file}>
                {file}
              </option>
            ))}
          </select>
        </div>
        {/* File upload */}
        <div className="border-2 border-dashed border-gray-400 p-6 rounded-xl flex flex-col items-center justify-center cursor-pointer transition">
          <input type="file" className="hidden" id="fileUpload" />
          <label
            htmlFor="fileUpload"
            className="text-black text-3xl cursor-pointer mb-2"
          >
            +
          </label>
          <p className="text-sm text-gray-600">
            Click or drag files here to upload
          </p>
        </div>
        {/* Submit Button */}
        <button className="bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition">
          Submit
        </button>
      </form>
    </section>
  );
}
