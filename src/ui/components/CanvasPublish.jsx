import "@spectrum-web-components/theme/express/scale-medium.js";
import "@spectrum-web-components/theme/express/theme-light.js";
import { Theme } from "@swc-react/theme";
import { Button } from "@swc-react/button";
import React, { useState, useRef } from "react";

const BACKEND_URL = "http://localhost:3000";

const CanvasPublish = ({ addOnUISdk, sandboxProxy, onBack }) => {
    const [currentCanvasId, setCurrentCanvasId] = useState(null);
    const [canvasUrl, setCanvasUrl] = useState("");
    const [status, setStatus] = useState({ message: "", type: "info", visible: false });
    const [isPublishing, setIsPublishing] = useState(false);
    const canvasLinkRef = useRef(null);

    const showStatus = (message, type = "info") => {
        setStatus({ message, type, visible: true });
        
        if (type !== "success") {
            setTimeout(() => {
                setStatus(prev => ({ ...prev, visible: false }));
            }, 3000);
        }
    };

    const handlePublish = async () => {
        try {
            showStatus("Extracting document content...", "info");
            setIsPublishing(true);

            // Get document content from sandbox
            const documentData = await sandboxProxy.extractDocument();
            
            if (!documentData) {
                throw new Error("Failed to extract document content");
            }

            showStatus("Publishing to Canvas...", "info");

            // Send to backend
            let response;
            try {
                response = await fetch(`${BACKEND_URL}/api/canvas/publish`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(documentData)
                });
            } catch (fetchError) {
                // Handle connection errors
                if (fetchError.message.includes("Failed to fetch") || fetchError.message.includes("ERR_CONNECTION_REFUSED")) {
                    throw new Error("Backend server is not running. Please start the backend server on port 3000. Run 'cd backend && npm start' in a terminal.");
                }
                throw fetchError;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || `Failed to publish Canvas (${response.status})`);
            }

            const result = await response.json();
            setCurrentCanvasId(result.canvasId);
            setCanvasUrl(result.url);
            
            showStatus("Canvas published successfully! Opening viewer...", "success");

            // Auto-open Canvas viewer
            setTimeout(() => {
                try {
                    window.open(result.url, '_blank');
                } catch (e) {
                    console.log("Auto-open blocked, use link above");
                }
            }, 500);

        } catch (error) {
            console.error("Error publishing Canvas:", error);
            const errorMessage = error.message || "An unexpected error occurred";
            showStatus(`Error: ${errorMessage}`, "error");
        } finally {
            setIsPublishing(false);
        }
    };

    const handleCopyLink = () => {
        if (canvasLinkRef.current) {
            canvasLinkRef.current.select();
            document.execCommand("copy");
            showStatus("Link copied to clipboard!", "success");
        }
    };

    return (
        <Theme system="express" scale="medium" color="light">
            <div className="relative p-5 min-h-screen bg-classic">
                {onBack && (
                    <div className="absolute top-5 left-5 z-50 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-classic-lg border border-slate-200">
                        <Button 
                            size="m" 
                            onClick={onBack}
                            className="bg-transparent border-none text-slate-700 font-semibold hover:text-slate-900"
                        >
                            ← Back
                        </Button>
                    </div>
                )}
            
                <div className="card max-w-2xl mx-auto mt-16">
                    <h2 className="text-3xl font-bold text-slate-800 mb-5 tracking-tight">
                        Canvas Publishing
                    </h2>
                    
                    <p className="text-slate-600 text-sm mb-6 leading-relaxed">
                        Transform your document into an interactive Canvas with tracking and insights
                    </p>
                    
                    <div className="mb-5">
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className={`w-full py-3.5 px-4 rounded-lg font-semibold text-white shadow-classic-lg transition-all duration-200 ${
                                isPublishing 
                                    ? "bg-slate-400 cursor-not-allowed" 
                                    : "bg-slate-800 hover:bg-slate-700 active:scale-98"
                            }`}
                        >
                            {isPublishing ? "⏳ Publishing..." : "✨ Publish as Canvas"}
                        </button>
                    </div>

                    {canvasUrl && (
                        <div className="mb-5 bg-slate-50 p-3 rounded-lg border-2 border-slate-200 flex gap-3 items-center">
                            <input
                                ref={canvasLinkRef}
                                id="canvasLink"
                                type="text"
                                value={canvasUrl}
                                readOnly
                                className="flex-1 min-w-0 px-3 py-2.5 border-2 border-slate-300 rounded-lg text-sm font-mono bg-white text-slate-800 overflow-hidden text-ellipsis whitespace-nowrap focus:border-slate-600 focus:outline-none transition-colors"
                            />
                            <button 
                                onClick={handleCopyLink}
                                className="px-4 py-2.5 bg-slate-700 text-white rounded-lg font-semibold text-sm whitespace-nowrap flex-shrink-0 hover:bg-slate-600 transition-colors shadow-md active:scale-95"
                            >
                                📋 Copy
                            </button>
                        </div>
                    )}

                    {status.visible && (
                        <div
                            id="status"
                            className={`mt-5 p-4 rounded-lg text-sm border-2 ${
                                status.type === "success" 
                                    ? "bg-green-50 text-green-800 border-green-200" 
                                    : status.type === "error" 
                                    ? "bg-red-50 text-red-800 border-red-200"
                                    : "bg-blue-50 text-blue-800 border-blue-200"
                            }`}
                        >
                            <div id="statusMessage">{status.message}</div>
                        </div>
                    )}
                </div>
            </div>
        </Theme>
    );
};

export default CanvasPublish;
