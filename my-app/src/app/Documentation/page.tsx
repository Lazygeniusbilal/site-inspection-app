export default function Documentation() {
  return (
    <section className="p-6">
      <div className="flex flex-col text-black max-w-xl gap-3">
        <p className="font-semibold text-xl">Our Documentation</p>

        <h1 className="font-bold text-4xl text-red-500 leading-tight">
          All Project PDFs in One Place
        </h1>

        <button
          onClick={() => (window.location.href = "/upload-form")}
          className="mt-4 bg-black text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
        >
          Click here to Upload a File.
        </button>
      </div>
    </section>
  );
}
