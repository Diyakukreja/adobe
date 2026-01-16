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
    <div style={{ 
      padding: "20px",
      fontFamily: "Adobe Clean, -apple-system, sans-serif",
      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      minHeight: "100vh",
    }}>
      <div style={{
        background: "white",
        borderRadius: "16px",
        padding: "24px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
      }}>
        <h2 style={{ 
          marginBottom: "20px", 
          fontSize: "24px",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold"
        }}>
          🎬 YouTube → Flowchart
        </h2>

        <input
          style={{
            width: "100%",
            padding: "12px 16px",
            marginBottom: "12px",
            border: "2px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "14px",
            outline: "none",
          }}
          placeholder="Paste YouTube URL here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleGenerate()}
          onFocus={(e) => e.target.style.borderColor = "#667eea"}
          onBlur={(e) => e.target.style.borderColor = "#e2e8f0"}
        />

        <button
          onClick={handleGenerate}
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            background: loading 
              ? "#cbd5e0" 
              : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: loading ? "not-allowed" : "pointer",
            fontSize: "16px",
            fontWeight: "bold",
            boxShadow: loading ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)",
          }}
        >
          {loading ? "🔄 Generating..." : "✨ Generate Flowchart"}
        </button>

        {/* TEST BUTTON */}
        <button
          onClick={handleTestConnection}
          style={{
            width: "100%",
            padding: "10px",
            marginTop: "8px",
            background: "#ed8936",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "600",
          }}
        >
          🧪 Test Connection
        </button>

        {error && (
          <div style={{
            marginTop: "16px",
            padding: "12px 16px",
            backgroundColor: "#fed7d7",
            color: "#c53030",
            borderRadius: "8px",
            fontSize: "14px",
          }}>
            ⚠️ {error}
          </div>
        )}

        {data && (
          <div style={{ marginTop: "20px" }}>
            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "12px",
              gap: "8px",
              flexWrap: "wrap"
            }}>
              <p style={{ 
                fontSize: "13px", 
                color: "#718096",
                margin: 0
              }}>
                ✅ {data.metadata.node_count} nodes • Click to edit
              </p>
              
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleDownloadJSON}
                  style={{
                    padding: "8px 16px",
                    background: "#48bb78",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontSize: "14px",
                    fontWeight: "600",
                  }}
                >
                  💾 JSON
                </button>
                
                <button
                  onClick={handleAddToPage}
                  disabled={adding}
                  style={{
                    padding: "10px 20px",
                    background: adding 
                      ? "#cbd5e0"
                      : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    cursor: adding ? "not-allowed" : "pointer",
                    fontSize: "15px",
                    fontWeight: "700",
                    boxShadow: adding ? "none" : "0 4px 12px rgba(245, 87, 108, 0.4)",
                  }}
                >
                  {adding ? "⏳ Adding..." : "➕ Add to Page"}
                </button>
              </div>
            </div>
            
            <Flowchart nodes={data.nodes} onEdit={handleEdit} />

            <div style={{
              marginTop: "16px",
              padding: "14px",
              background: "#e6fffa",
              borderRadius: "10px",
              fontSize: "13px",
              color: "#234e52",
              borderLeft: "4px solid #38b2ac"
            }}>
              <strong>💡 How to use:</strong>
              <ul style={{ margin: "8px 0 0 0", paddingLeft: "20px", lineHeight: "1.8" }}>
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
