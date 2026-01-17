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

            const documentData = await sandboxProxy.extractDocument();
            
            if (!documentData) {
                throw new Error("Failed to extract document content");
            }

            showStatus("Publishing to Canvas...", "info");

            let response;
            try {
                response = await fetch(`${BACKEND_URL}/api/canvas/publish`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(documentData)
                });
            } catch (fetchError) {
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
            <div className="relative p-6 min-h-screen bg-classic">
                {onBack && (
                    <div className="absolute top-6 left-6 z-50 glass px-4 py-2.5 animate-fade-in-up">
                        <Button 
                            size="m" 
                            onClick={onBack}
                            className="bg-transparent border-none text-slate-700 font-medium hover:text-slate-900 transition-colors"
                        >
                            ← Back
                        </Button>
                    </div>
                )}
            
                <div className="card max-w-2xl mx-auto mt-20 animate-fade-in-up">
                    <div className="mb-8 pb-6 border-b border-slate-200">
                        <h1 className="text-2xl font-semibold text-slate-900 mb-2">
                            Canvas Publishing
                        </h1>
                        <p className="text-sm text-slate-600">Transform your document into an interactive Canvas with tracking and insights</p>
                    </div>
                    
                    <div className="mb-6">
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            className={`w-full btn-primary ${isPublishing ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                            {isPublishing ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                    Publishing...
                                </span>
                            ) : (
                                "Publish as Canvas"
                            )}
                        </button>
                    </div>

                    {canvasUrl && (
                        <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 flex gap-3 items-center animate-fade-in-up">
                            <input
                                ref={canvasLinkRef}
                                id="canvasLink"
                                type="text"
                                value={canvasUrl}
                                readOnly
                                className="flex-1 min-w-0 px-4 py-2.5 border border-slate-300 rounded-lg text-sm font-mono bg-white text-slate-900 overflow-hidden text-ellipsis whitespace-nowrap focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20 focus:outline-none transition-all"
                            />
                            <button 
                                onClick={handleCopyLink}
                                className="px-4 py-2.5 bg-slate-700 text-white rounded-lg font-medium text-sm whitespace-nowrap flex-shrink-0 hover:bg-slate-600 transition-colors duration-200 shadow-sm hover:shadow-md active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-offset-2"
                            >
                                Copy Link
                            </button>
                        </div>
                    )}

                    {status.visible && (
                        <div
                            id="status"
                            className={`p-4 rounded-lg text-sm border-l-4 animate-fade-in-up ${
                                status.type === "success" 
                                    ? "bg-green-50 text-green-800 border-green-500" 
                                    : status.type === "error" 
                                    ? "bg-red-50 text-red-800 border-red-500"
                                    : "bg-blue-50 text-blue-800 border-blue-500"
                            }`}
                        >
                            <div className="flex items-center gap-2">
                                {status.type === "success" ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                ) : status.type === "error" ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                )}
                                <div id="statusMessage">{status.message}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </Theme>
    );
};

export default CanvasPublish;
