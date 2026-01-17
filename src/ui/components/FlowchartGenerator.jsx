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
      alert("No flowchart to add");
      return;
    }

    if (!sandboxProxy) {
      alert("sandboxProxy not available");
      return;
    }

    setAdding(true);

    try {
      console.log("Calling addFlowchartToPage with nodes:", data.nodes);
      
      const result = await sandboxProxy.addFlowchartToPage(data.nodes);
      
      console.log("Result:", result);
      
      if (result && result.success) {
        alert("Flowchart added to page successfully");
      } else {
        alert("Failed: " + (result?.error || "Unknown error"));
      }
      
    } catch (error) {
      console.error("Error:", error);
      alert("Error: " + error.message);
    } finally {
      setAdding(false);
    }
  };

  const handleTestConnection = () => {
    console.log("Test button clicked");
    if (!sandboxProxy) {
      alert("sandboxProxy is null");
      return;
    }
    try {
      sandboxProxy.createRectangle();
      alert("Test passed! A blue rectangle should appear on your page.");
    } catch (error) {
      alert("Test failed: " + error.message);
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
    <div className="p-6 min-h-screen">
      <div className="card max-w-4xl mx-auto animate-fade-in-up">
        <div className="mb-8 pb-6 border-b border-slate-200">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            YouTube to Flowchart
          </h1>
          <p className="text-sm text-slate-600">Transform video content into visual flowcharts</p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              YouTube URL
            </label>
            <input
              className="input-classic"
              placeholder="https://www.youtube.com/watch?v=..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading}
            className={`w-full btn-primary ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Generating...
              </span>
            ) : (
              "Generate Flowchart"
            )}
          </button>

          <button
            onClick={handleTestConnection}
            className="w-full btn-secondary text-sm"
          >
            Test Connection
          </button>
        </div>

        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800 animate-fade-in-up">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        {data && (
          <div className="mt-6 space-y-5 animate-fade-in-up">
            <div className="flex justify-between items-center p-4 bg-slate-50 rounded-lg border border-slate-200">
              <div className="flex items-center gap-3">
                <span className="badge">{data.metadata.node_count} nodes</span>
                <span className="text-sm text-slate-600">Click nodes to edit</span>
              </div>
              
              <div className="flex gap-2">
                <button
                  onClick={handleDownloadJSON}
                  className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 border border-slate-300 active:scale-[0.98]"
                >
                  Download JSON
                </button>
                
                <button
                  onClick={handleAddToPage}
                  disabled={adding}
                  className={`px-5 py-2 rounded-lg font-medium text-sm shadow-sm hover:shadow-md transition-all duration-200 ${
                    adding 
                      ? "bg-slate-400 cursor-not-allowed text-white" 
                      : "btn-primary"
                  }`}
                >
                  {adding ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Adding...
                    </span>
                  ) : (
                    "Add to Page"
                  )}
                </button>
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
              <Flowchart nodes={data.nodes} onEdit={handleEdit} />
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <div>
                  <strong className="text-slate-900 block mb-2 text-sm font-medium">How to use:</strong>
                  <ul className="space-y-1.5 text-sm text-slate-700 leading-relaxed">
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Click <strong className="text-slate-900">"Test Connection"</strong> to verify the connection</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Edit text and colors in the preview above</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>Click <strong className="text-slate-900">"Add to Page"</strong> to add the flowchart</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-slate-400 mt-0.5">•</span>
                      <span>All shapes will appear on your Adobe Express page</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
