import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";

export default function App() {
  const webcamRef = useRef(null);
  const [raw, setRaw] = useState("...");
  const [cleaned, setCleaned] = useState("...");
  const [error, setError] = useState(null);

  // ✅ Set base URL for backend
  const BASE_URL = process.env.REACT_APP_API_BASE || "http://localhost:8000";

  // ─── Buffer reset ───────────────────────────────────────────────────────
  const resetBuffer = async () => {
    try {
      await axios.post(`${BASE_URL}/reset`);
      setRaw("...");
      setCleaned("...");
    } catch {
      setError("Could not reset buffer.");
    }
  };

  // ─── Poll backend every second ──────────────────────────────────────────
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await axios.get(`${BASE_URL}/buffer`);
        setRaw(res.data.raw || "...");
        setCleaned(res.data.cleaned || "...");
        setError(null);
      } catch {
        setError("Backend offline");
      }
    }, 1000);
    return () => clearInterval(id);
  }, [BASE_URL]);

  return (
    <div className="min-h-screen bg-gray-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-fuchsia-900 via-slate-900 to-black text-white flex flex-col items-center px-4 py-8">
      {/* Animated neon title */}
      <h1 className="text-4xl sm:text-5xl mb-10 font-extrabold tracking-tight neonTitle">
        <span className="pr-3">🤟</span> ASL Translator
      </h1>

      {/* Content card */}
      <div className="w-full max-w-6xl glass border border-fuchsia-900/40 rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col lg:flex-row gap-8">
        {/* Webcam */}
        <div className="flex-1 overflow-hidden rounded-xl border border-fuchsia-800/30 shadow-xl neonEdge">
          <Webcam ref={webcamRef} mirrored className="w-full h-auto object-cover" />
        </div>

        {/* Output panel */}
        <div className="w-full lg:w-96 flex flex-col justify-between gap-6">
          <div>
            <label className="text-xs tracking-wide text-pink-400">RAW BUFFER</label>
            <div className="mt-1 mb-5 bg-black/60 backdrop-blur-sm p-3 font-mono text-pink-200 rounded-md border border-pink-600/40">
              {raw}
            </div>

            <label className="text-xs tracking-wide text-emerald-400">CLEANED SENTENCE</label>
            <div className="mt-1 relative bg-black/80 backdrop-blur-sm p-3 font-semibold text-emerald-200 rounded-md border border-emerald-600/40 typing">
              {cleaned}
              <span className="cursorBlock" />
            </div>
          </div>

          <div className="flex gap-4 pt-2">
            <button
              onClick={resetBuffer}
              className="flex-1 px-4 py-2 bg-gradient-to-r from-fuchsia-600 to-violet-600 hover:brightness-110 transition rounded-md shadow-lg shadow-fuchsia-800/40 font-semibold"
            >
              🔄 Reset
            </button>
          </div>

          {error && <p className="text-sm text-red-400 mt-2 font-mono">❌ {error}</p>}
        </div>
      </div>

      {/* footer */}
      <p className="mt-10 text-xs text-white/40">
        © 2025 Neon ASL • FastAPI · PyTorch · React · Tailwind
      </p>
    </div>
  );
}
