import React, { useState } from "react";
import { generateFlowchart } from "../api";
import Flowchart from "./Flowchart";

export default function FlowchartGenerator({ addOnUISdk, sandboxProxy }) {
  const [url, setUrl] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [adding, setAdding] = useState(false);

  const handleGenerate = async () => {
    if (!url.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await generateFlowchart(url);
      setData(result);
    } catch (e) {
      setError(e.message || "Failed to generate flowchart");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id, updates) => {
    setData((prev) => ({
      ...prev,
      nodes: prev.nodes.map((node) =>
        node.id === id ? { ...node, ...updates } : node
      ),
    }));
  };

  const handleAddToPage = async () => {
    if (!data || !data.nodes) {
      alert("❌ No flowchart to add");
      return;
    }

    if (!sandboxProxy) {
      alert("❌ sandboxProxy not available");
      return;
    }

    setAdding(true);

    try {
      console.log("Calling addFlowchartToPage with nodes:", data.nodes);
      
      // Properly await the promise
      const result = await sandboxProxy.addFlowchartToPage(data.nodes);
      
      console.log("Result:", result);
      
      if (result && result.success) {
        alert("✅ Flowchart added to page!");
      } else {
        alert("❌ Failed: " + (result?.error || "Unknown error"));
      }
      
    } catch (error) {
      console.error("Error:", error);
      alert("❌ Error: " + error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleTestConnection = () => {
    console.log("Test button clicked");
    if (!sandboxProxy) {
      alert("❌ sandboxProxy is null!");
      return;
    }
    try {
      sandboxProxy.createRectangle();
      alert("✅ Test passed! A blue rectangle should appear on your page.");
    } catch (error) {
      alert("❌ Test failed: " + error.message);
      console.error(error);
    }
  };

  const handleDownloadJSON = () => {
    if (!data) return;
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const link = document.createElement('a');
    link.href = dataUri;
    link.download = 'flowchart.json';
    link.click();
  };

  return (
    <div className="p-5 min-h-screen bg-classic">
      <div className="card max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-800 mb-5 tracking-tight">
          🎬 YouTube → Flowchart
        </h2>

        <input
          className="input-classic mb-3"
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white shadow-classic-lg transition-all duration-200 mb-2 ${
            loading 
              ? "bg-slate-400 cursor-not-allowed" 
              : "bg-slate-800 hover:bg-slate-700 active:scale-98"
          }`}
        >
          {loading ? "🔄 Generating..." : "✨ Generate Flowchart"}
        </button>

        <button
          onClick={handleTestConnection}
          className="w-full py-2.5 px-4 mt-2 bg-slate-600 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-slate-500 transition-colors active:scale-98"
        >
          🧪 Test Connection
        </button>

        {error && (
          <div className="mt-4 p-4 bg-red-50 text-red-800 rounded-lg text-sm border-2 border-red-200">
            ⚠️ {error}
          </div>
        )}

        {data && (
          <div className="mt-5">
            <div className="flex justify-between items-center mb-3 gap-2 flex-wrap">
              <p className="text-sm text-slate-600 m-0">
                ✅ {data.metadata.node_count} nodes • Click to edit
              </p>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-4 py-2 bg-slate-600 text-white rounded-lg font-semibold text-sm shadow-md hover:bg-slate-500 transition-colors active:scale-95"
                >
                  💾 JSON
                </button>
                
                <button
                  onClick={handleAddToPage}
                  disabled={adding}
                  className={`px-5 py-2.5 rounded-lg font-bold text-sm shadow-classic-lg transition-all duration-200 ${
                    adding 
                      ? "bg-slate-400 cursor-not-allowed" 
                      : "bg-slate-800 text-white hover:bg-slate-700 active:scale-95"
                  }`}
                >
                  {adding ? "⏳ Adding..." : "➕ Add to Page"}
                </button>
              </div>
            </div>
            
            <Flowchart nodes={data.nodes} onEdit={handleEdit} />

            <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm text-slate-700 border-l-4 border-blue-500">
              <strong className="text-slate-800">💡 How to use:</strong>
              <ul className="mt-2 ml-5 list-disc space-y-1 leading-relaxed">
                <li>Click <strong>"🧪 Test Connection"</strong> to verify it works</li>
                <li>Edit text and colors in the preview above</li>
                <li>Click <strong>"Add to Page"</strong> button</li>
                <li>All shapes will appear on your Adobe Express page</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
