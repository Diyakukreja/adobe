import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import addOnUISdk from "https://new.express.adobe.com/static/add-on-sdk/sdk.js";

const BACKEND_URL = "http://localhost:3000";

// Canvas Component (if you want to use this separately)
const CanvasApp = ({ addOnUISdk, sandboxProxy }) => {
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
            const response = await fetch(`${BACKEND_URL}/api/canvas/publish`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(documentData)
            });

            if (!response.ok) {
                throw new Error("Failed to publish Canvas");
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
            showStatus("Error: " + error.message, "error");
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

            const response = await fetch(`${BACKEND_URL}/api/milestones/create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    canvasId: currentCanvasId,
                    name,
                    reason: reason || "No reason provided"
                })
            });

            if (!response.ok) {
                throw new Error("Failed to create milestone");
            }

            const result = await response.json();
            showStatus(`✓ Milestone "${name}" created successfully!`, "success");
            console.log("Milestone created:", result);

        } catch (error) {
            console.error("Error creating milestone:", error);
            showStatus("Error: " + error.message, "error");
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
        <div style={{ padding: "20px" }}>
            <h2>Canvas Publishing</h2>
            
            <button
                id="publishCanvas"
                onClick={handlePublish}
                disabled={isPublishing}
                style={{
                    padding: "10px 20px",
                    marginBottom: "20px",
                    cursor: isPublishing ? "not-allowed" : "pointer"
                }}
            >
                {isPublishing ? "Publishing..." : "Publish as Canvas"}
            </button>

            {canvasUrl && (
                <div id="canvasLinkContainer" style={{ marginBottom: "20px" }}>
                    <input
                        ref={canvasLinkRef}
                        id="canvasLink"
                        type="text"
                        value={canvasUrl}
                        readOnly
                        style={{ width: "300px", padding: "5px", marginRight: "10px" }}
                    />
                    <button onClick={handleCopyLink}>Copy Link</button>
                </div>
            )}

            <button
                id="createMilestone"
                onClick={handleCreateMilestone}
                disabled={!currentCanvasId || isCreatingMilestone}
                style={{
                    padding: "10px 20px",
                    marginBottom: "20px",
                    cursor: (!currentCanvasId || isCreatingMilestone) ? "not-allowed" : "pointer"
                }}
            >
                Create Milestone
            </button>

            {status.visible && (
                <div
                    id="status"
                    className={`status-box status-${status.type}`}
                    style={{ display: "block", padding: "10px", marginTop: "20px" }}
                >
                    <div id="statusMessage">{status.message}</div>
                </div>
            )}

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
                            <button
                                id="cancelMilestone"
                                onClick={() => setShowMilestoneModal(false)}
                            >
                                Cancel
                            </button>
                            <button
                                id="saveMilestone"
                                onClick={handleSaveMilestone}
                            >
                                Save
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// Main initialization
addOnUISdk.ready.then(async () => {
    console.log("addOnUISdk is ready for use.");

    // Get the UI runtime.
    const { runtime } = addOnUISdk.instance;

    // Get the proxy object, which is required
    // to call the APIs defined in the Document Sandbox runtime
    // i.e., in the `code.js` file of this add-on.
    const sandboxProxy = await runtime.apiProxy("documentSandbox");

    const root = createRoot(document.getElementById("root"));
    root.render(<App addOnUISdk={addOnUISdk} sandboxProxy={sandboxProxy} />);
});
