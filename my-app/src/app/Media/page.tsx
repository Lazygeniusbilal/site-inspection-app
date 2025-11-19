import { useState } from "react";
import MediaForm from "../components/media_form";

export default function Media() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null); // for preview

  // handle file selection
  function handleUpload(e) {
    const newFiles = Array.from(e.target.files).map((file) =>
      URL.createObjectURL(file)
    );
    setFiles((prev) => [...prev, ...newFiles]);
  }

  return (
    <section>
      {/* Header */}{" "}
      <div className="flex w-full fixed top-0 left-0 font-bold text-white bg-black justify-center items-center p-4 text-4xl z-10">
        {" "}
        <h1>
          Media{" "}
          <span className="text-2xl text-red-500">
            Upload your media files here..{" "}
          </span>{" "}
        </h1>{" "}
      </div>
      ```
      {/* Uploaded files */}
      <div className="flex flex-wrap gap-4 mt-28 px-4">
        {files.map((file, index) => (
          <img
            key={index}
            src={file}
            onClick={() => setSelected(file)}
            className="w-1/4 h-80 object-cover rounded-xl cursor-pointer hover:scale-105 transition"
          />
        ))}

        {/* Upload button */}
        <div className="flex w-40 h-40 bg-gray-500 justify-center items-center rounded-xl cursor-pointer">
          <label
            htmlFor="fileUpload"
            className="text-black text-4xl cursor-pointer"
          >
            +
          </label>
          <input
            type="file"
            id="fileUpload"
            className="hidden"
            multiple
            onChange={handleUpload}
          />
        </div>
      </div>
      {/* Preview modal */}
      {selected && (
        <div
          className="fixed inset-0 bg-black/70 flex justify-center items-center z-20"
          onClick={() => setSelected(null)}
        >
          <img src={selected} className="max-w-3/4 max-h-3/4 rounded-xl" />
        </div>
      )}
    </section>
  );
}
