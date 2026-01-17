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
    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [milestoneName, setMilestoneName] = useState("");
    const [milestoneReason, setMilestoneReason] = useState("");
    const [isPublishing, setIsPublishing] = useState(false);
    const [isCreatingMilestone, setIsCreatingMilestone] = useState(false);
    const canvasLinkRef = useRef(null);
    const milestoneNameRef = useRef(null);

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

    const handleCreateMilestone = () => {
        if (!currentCanvasId) {
            showStatus("Please publish as Canvas first", "error");
            return;
        }
        
        setShowMilestoneModal(true);
        setMilestoneName("");
        setMilestoneReason("");
        setTimeout(() => {
            if (milestoneNameRef.current) {
                milestoneNameRef.current.focus();
            }
        }, 100);
    };

    const handleSaveMilestone = async () => {
        const name = milestoneName.trim();
        const reason = milestoneReason.trim();
        
        if (!name) {
            showStatus("Please enter a milestone name", "error");
            return;
        }
        
        try {
            showStatus("Creating milestone...", "info");
            setIsCreatingMilestone(true);
            setShowMilestoneModal(false);

            let response;
            try {
                response = await fetch(`${BACKEND_URL}/api/milestones/create`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        canvasId: currentCanvasId,
                        name,
                        reason: reason || "No reason provided"
                    })
                });
            } catch (fetchError) {
                if (fetchError.message.includes("Failed to fetch") || fetchError.message.includes("ERR_CONNECTION_REFUSED")) {
                    throw new Error("Backend server is not running. Please start the backend server on port 3000.");
                }
                throw fetchError;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to create milestone");
            }

            const result = await response.json();
            showStatus(`✓ Milestone "${name}" created successfully!`, "success");
            console.log("Milestone created:", result);

        } catch (error) {
            console.error("Error creating milestone:", error);
            const errorMessage = error.message || "An unexpected error occurred";
            showStatus(`Error: ${errorMessage}`, "error");
        } finally {
            setIsCreatingMilestone(false);
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
            <div style={{ 
                position: "relative", 
                padding: "20px",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                minHeight: "100vh"
            }}>
                {onBack && (
                    <div
                        style={{
                            position: "absolute",
                            top: "20px",
                            left: "20px",
                            zIndex: 1000,
                            background: "rgba(255, 255, 255, 0.95)",
                            padding: "8px 16px",
                            borderRadius: "12px",
                            boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                        }}
                    >
                        <Button 
                            size="m" 
                            onClick={onBack}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: "#667eea",
                                fontWeight: "600"
                            }}
                        >
                            ← Back
                        </Button>
                    </div>
                )}
            
                <div style={{
                    background: "white",
                    borderRadius: "16px",
                    padding: "32px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
                    maxWidth: "700px",
                    margin: "60px auto 0",
                    boxSizing: "border-box"
                }}>
                    <h2 style={{ 
                        marginBottom: "20px", 
                        fontSize: "24px",
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        fontWeight: "bold"
                    }}>
                        🚀 Canvas Publishing
                    </h2>
                    
                    <p style={{
                        color: "#718096",
                        fontSize: "14px",
                        marginBottom: "24px",
                        lineHeight: "1.6"
                    }}>
                        Transform your document into an interactive Canvas with tracking and insights
                    </p>
                    
                    <div style={{ marginBottom: "20px" }}>
                        <button
                            onClick={handlePublish}
                            disabled={isPublishing}
                            style={{
                                width: "100%",
                                padding: "14px",
                                background: isPublishing 
                                    ? "#cbd5e0" 
                                    : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: isPublishing ? "not-allowed" : "pointer",
                                fontSize: "16px",
                                fontWeight: "bold",
                                boxShadow: isPublishing ? "none" : "0 4px 12px rgba(102, 126, 234, 0.4)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            {isPublishing ? "⏳ Publishing..." : "✨ Publish as Canvas"}
                        </button>
                    </div>

                    {canvasUrl && (
                        <div id="canvasLinkContainer" style={{ 
                            marginBottom: "20px",
                            background: "#f7fafc",
                            padding: "12px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            display: "flex",
                            gap: "10px",
                            alignItems: "center",
                            width: "100%",
                            boxSizing: "border-box",
                            overflow: "hidden"
                        }}>
                            <input
                                ref={canvasLinkRef}
                                id="canvasLink"
                                type="text"
                                value={canvasUrl}
                                readOnly
                                style={{ 
                                    flex: 1,
                                    minWidth: 0,
                                    padding: "10px 12px",
                                    border: "1px solid #e2e8f0",
                                    borderRadius: "6px",
                                    fontSize: "13px",
                                    fontFamily: "'Monaco', 'Menlo', monospace",
                                    background: "white",
                                    color: "#2d3748",
                                    boxSizing: "border-box",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap"
                                }}
                            />
                            <button 
                                onClick={handleCopyLink}
                                style={{
                                    padding: "10px 16px",
                                    background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "6px",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    whiteSpace: "nowrap",
                                    flexShrink: 0
                                }}
                            >
                                📋 Copy
                            </button>
                        </div>
                    )}

                    <div style={{ marginBottom: "20px" }}>
                        <button
                            onClick={handleCreateMilestone}
                            disabled={!currentCanvasId || isCreatingMilestone}
                            style={{
                                width: "100%",
                                padding: "12px",
                                background: (!currentCanvasId || isCreatingMilestone)
                                    ? "#cbd5e0"
                                    : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                                color: "white",
                                border: "none",
                                borderRadius: "8px",
                                cursor: (!currentCanvasId || isCreatingMilestone) ? "not-allowed" : "pointer",
                                fontSize: "15px",
                                fontWeight: "600",
                                boxShadow: (!currentCanvasId || isCreatingMilestone) ? "none" : "0 4px 12px rgba(245, 87, 108, 0.4)",
                                transition: "all 0.2s ease"
                            }}
                        >
                            Create Milestone
                        </button>
                    </div>

                    {status.visible && (
                        <div
                            id="status"
                            style={{ 
                                display: "block", 
                                padding: "12px 16px", 
                                marginTop: "20px",
                                borderRadius: "8px",
                                fontSize: "14px",
                                backgroundColor: status.type === "success" ? "#d4edda" : status.type === "error" ? "#f8d7da" : "#d1ecf1",
                                color: status.type === "success" ? "#155724" : status.type === "error" ? "#721c24" : "#0c5460",
                                border: `1px solid ${status.type === "success" ? "#c3e6cb" : status.type === "error" ? "#f5c6cb" : "#bee5eb"}`
                            }}
                        >
                            <div id="statusMessage">{status.message}</div>
                        </div>
                    )}
                </div>

                {showMilestoneModal && (
                    <div
                        id="milestoneModal"
                        style={{
                            display: "flex",
                            position: "fixed",
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: "rgba(0,0,0,0.5)",
                            justifyContent: "center",
                            alignItems: "center",
                            zIndex: 1000
                        }}
                        onClick={(e) => {
                            if (e.target.id === "milestoneModal") {
                                setShowMilestoneModal(false);
                            }
                        }}
                    >
                        <div
                            style={{
                                backgroundColor: "white",
                                padding: "20px",
                                borderRadius: "8px",
                                minWidth: "400px"
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3>Create Milestone</h3>
                            <div style={{ marginBottom: "15px" }}>
                                <label>Milestone Name:</label>
                                <input
                                    ref={milestoneNameRef}
                                    id="milestoneName"
                                    type="text"
                                    value={milestoneName}
                                    onChange={(e) => setMilestoneName(e.target.value)}
                                    style={{ width: "100%", padding: "5px", marginTop: "5px" }}
                                />
                            </div>
                            <div style={{ marginBottom: "15px" }}>
                                <label>Reason (optional):</label>
                                <textarea
                                    id="milestoneReason"
                                    value={milestoneReason}
                                    onChange={(e) => setMilestoneReason(e.target.value)}
                                    style={{ width: "100%", padding: "5px", marginTop: "5px", minHeight: "80px" }}
                                />
                            </div>
                            <div style={{ display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <Button
                                    size="m"
                                    onClick={() => setShowMilestoneModal(false)}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    size="m"
                                    onClick={handleSaveMilestone}
                                >
                                    Save
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Theme>
    );
};

export default CanvasPublish;
