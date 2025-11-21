"use client";
import { useState } from "react";

export default function Media() {
  const [image, setImage] = useState("");
  return (
    <section className="p-6">
      <div className="flex flex-col gap-3 text-black max-w-xl">
        <p className="font-semibold text-xl">Our Projects</p>
        <h1 className="font-bold text-4xl text-red-500 leading-tight">
          We Build Projects That Last
        </h1>

        <button
          onClick={() => (window.location.href = "/upload-form")}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Click here to Upload File..
        </button>
      </div>
    </section>
  );
}
