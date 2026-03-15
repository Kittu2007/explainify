import Aurora from "@/components/ui/aurora";

export default function Hero() {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Aurora />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6">
        <h1 className="text-5xl md:text-6xl font-bold text-white">
          Transform Documents Into Knowledge
        </h1>
        <p className="text-gray-300 mt-4 max-w-xl">
          Upload any document and get AI explanations, summaries, and visual learning videos instantly.
        </p>
        <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium">
          Upload Document
        </button>
      </div>
    </div>
  );
}
