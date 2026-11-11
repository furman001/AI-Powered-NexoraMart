import { useEffect } from "react";

import "@google/model-viewer";



export default function Product3DViewer({
  modelUrl,
  productName,
}) {
  useEffect(() => {
    import("@google/model-viewer");
  }, []);



  if (!modelUrl) {
    return (
      <div className="rounded-3xl border border-white/10 bg-white/5 p-8 text-center backdrop-blur-xl">
        <div className="text-5xl">🧊</div>


        <h3 className="mt-4 text-xl font-bold text-white">
          3D Preview Not Available
        </h3>


        <p className="mt-2 text-sm text-slate-400">
          This product does not have a 3D model yet.
        </p>
      </div>
    );
  }



  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl">
      <div className="border-b border-white/10 bg-gradient-to-r from-cyan-500/10 via-fuchsia-500/10 to-purple-500/10 p-5">
        <span className="inline-block rounded-full bg-gradient-to-r from-cyan-500 to-fuchsia-600 px-4 py-1 text-xs font-bold uppercase tracking-widest text-white">
          3D + AR Preview
        </span>


        <h3 className="mt-3 text-xl font-bold text-white">
          View {productName} in 3D
        </h3>


        <p className="mt-1 text-sm text-slate-400">
          Drag to rotate. On a supported phone, tap “View in your space” to place it in AR.
        </p>
      </div>


      <model-viewer
        src={modelUrl}
        alt={`3D preview of ${productName}`}
        ar
        ar-modes="webxr scene-viewer quick-look"
        ar-scale="auto"
        auto-rotate
        camera-controls
        shadow-intensity="1"
        exposure="1"
        style={{
          width: "100%",
          height: "480px",
          backgroundColor: "transparent",
        }}
      >
        <button
          slot="ar-button"
          className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-xl bg-gradient-to-r from-fuchsia-600 to-blue-600 px-6 py-3 text-sm font-bold text-white shadow-lg transition duration-300 hover:scale-105"
        >
          View in your space
        </button>
      </model-viewer>
    </div>
  );
}