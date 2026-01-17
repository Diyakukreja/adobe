// import addOnSandboxSdk from "add-on-sdk-document-sandbox";
// import { editor } from "express-document-sdk";

// const { runtime } = addOnSandboxSdk.instance;

// function start() {
//     const sandboxApi = {
//         createRectangle: () => {
//             const rectangle = editor.createRectangle();
//             rectangle.width = 240;
//             rectangle.height = 180;
//             rectangle.translation = { x: 10, y: 10 };
            
//             const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };
//             const rectangleFill = editor.makeColorFill(color);
//             rectangle.fill = rectangleFill;
            
//             const insertionParent = editor.context.insertionParent;
//             insertionParent.children.append(rectangle);
//         },

//         addFlowchartToPage: (nodes) => {
//             console.log("[SANDBOX] Creating flowchart with", nodes.length, "nodes");
            
//             try {
//                 const insertionParent = editor.context.insertionParent;
                
//                 const hexToRgb = (hex) => {
//                     const r = parseInt(hex.slice(1, 3), 16) / 255;
//                     const g = parseInt(hex.slice(3, 5), 16) / 255;
//                     const b = parseInt(hex.slice(5, 7), 16) / 255;
//                     return { red: r, green: g, blue: b, alpha: 1 };
//                 };
                
//                 const startX = 100;
//                 const startY = 100;
//                 const boxWidth = 400;
//                 const boxHeight = 100;
//                 const spacing = 60;
                
//                 for (let i = 0; i < nodes.length; i++) {
//                     const node = nodes[i];
//                     const yPos = startY + (i * (boxHeight + spacing));
//                     const isStartEnd = node.type === "start" || node.type === "end";
//                     const nodeColor = node.color || (isStartEnd ? "#667eea" : "#f093fb");
                    
//                     const rect = editor.createRectangle();
//                     rect.width = boxWidth;
//                     rect.height = boxHeight;
                    
//                     const color = hexToRgb(nodeColor);
//                     rect.fill = editor.makeColorFill(color);
                    
//                     // ✅ CORRECT WAY: Set individual corner radii
//                     const cornerRadius = isStartEnd ? 50 : 12;
//                     rect.topLeftRadius = cornerRadius;
//                     rect.topRightRadius = cornerRadius;
//                     rect.bottomLeftRadius = cornerRadius;
//                     rect.bottomRightRadius = cornerRadius;
                    
//                     insertionParent.children.append(rect);
//                     rect.translation = { x: startX, y: yPos };
                    
//                     console.log(`[SANDBOX] ✅ Created node ${i + 1}: "${node.text}"`);
//                 }
                
//                 console.log("[SANDBOX] ✅ All rectangles created successfully!");
//                 return { success: true };
                
//             } catch (error) {
//                 console.error("[SANDBOX] ❌ Error:", error);
//                 return { success: false, error: error.toString() };
//             }
//         }
//     };

//     runtime.exposeApi(sandboxApi);
// }

// start();



// import addOnSandboxSdk from "add-on-sdk-document-sandbox";
// import { editor } from "express-document-sdk";

// const { runtime } = addOnSandboxSdk.instance;

// function start() {
//     const sandboxApi = {
//         createRectangle: () => {
//             const rectangle = editor.createRectangle();
//             rectangle.width = 240;
//             rectangle.height = 180;
//             rectangle.translation = { x: 10, y: 10 };
            
//             const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };
//             const rectangleFill = editor.makeColorFill(color);
//             rectangle.fill = rectangleFill;
            
//             const insertionParent = editor.context.insertionParent;
//             insertionParent.children.append(rectangle);
//         },

//         addFlowchartToPage: (nodes) => {
//             console.log("[SANDBOX] Creating flowchart with", nodes.length, "nodes");
            
//             try {
//                 const insertionParent = editor.context.insertionParent;
                
//                 // Convert hex color to RGB
//                 const hexToRgb = (hex) => {
//                     const r = parseInt(hex.slice(1, 3), 16) / 255;
//                     const g = parseInt(hex.slice(3, 5), 16) / 255;
//                     const b = parseInt(hex.slice(5, 7), 16) / 255;
//                     return { red: r, green: g, blue: b, alpha: 1 };
//                 };
                
//                 // Function to truncate text if too long
//                 const truncateText = (text, maxLength) => {
//                     if (text.length <= maxLength) return text;
//                     return text.substring(0, maxLength - 3) + "...";
//                 };
                
//                 // Layout settings
//                 const startX = 50;
//                 const startY = 50;
//                 const boxWidth = 300;
//                 const boxHeight = 80;
//                 const spacing = 40;
                
//                 const createdNodes = [];
                
//                 // Create rectangles with text
//                 for (let i = 0; i < nodes.length; i++) {
//                     const node = nodes[i];
//                     const yPos = startY + (i * (boxHeight + spacing));
//                     const isStartEnd = node.type === "start" || node.type === "end";
//                     const nodeColor = node.color || (isStartEnd ? "#667eea" : "#f093fb");
                    
//                     // Create rectangle
//                     // Create rectangle
//                     const rect = editor.createRectangle();
//                     rect.width = boxWidth;
//                     rect.height = boxHeight;

//                     const color = hexToRgb(nodeColor);
//                     rect.fill = editor.makeColorFill(color);

//                     // Set corner radii
//                     const cornerRadius = isStartEnd ? 40 : 10;
//                     rect.topLeftRadius = cornerRadius;
//                     rect.topRightRadius = cornerRadius;
//                     rect.bottomLeftRadius = cornerRadius;
//                     rect.bottomRightRadius = cornerRadius;

//                     insertionParent.children.append(rect);
//                     rect.translation = { x: startX, y: yPos };

//                     // UPDATED: Better text truncation and sizing
//                     const maxChars = 30; // Limit characters to fit in box
//                     const textContent = truncateText(node.text || "Untitled", maxChars);
//                     const text = editor.createText(textContent);

//                     // Very small font
//                     text.fontSize = 8;
//                     text.fill = editor.makeColorFill({ red: 1, green: 1, blue: 1, alpha: 1 });

//                     insertionParent.children.append(text);

//                     // IMPORTANT: Check if text is too wide and scale down if needed
//                     let finalFontSize = 10;
//                     const maxTextWidth = boxWidth - 20; // Leave 10px padding on each side

//                     // If text is wider than box, reduce font size
//                     if (text.width > maxTextWidth) {
//                         finalFontSize = Math.floor((maxTextWidth / text.width) * 10);
//                         if (finalFontSize < 6) finalFontSize = 6; // Minimum readable size
//                         text.fontSize = finalFontSize;
//                     }

//                     // Center text in rectangle
//                     const textWidth = text.width || 70;
//                     const textHeight = text.height || 14;
//                     const textX = startX + (boxWidth - textWidth) / 2;
//                     const textY = yPos + (boxHeight - textHeight) / 2;

//                     text.translation = { x: textX, y: textY };

//                     createdNodes.push({ rect, text, yPos, centerX: startX + boxWidth / 2 });

//                     console.log(`[SANDBOX] ✅ Created node ${i + 1}: "${textContent}"`);

//                 }
                
//                 // Create arrows between nodes (using paths instead of lines)
//                 for (let i = 0; i < createdNodes.length - 1; i++) {
//                     const currentNode = createdNodes[i];
//                     const nextNode = createdNodes[i + 1];
                    
//                     const arrowStartY = currentNode.yPos + boxHeight;
//                     const arrowEndY = nextNode.yPos;
//                     const arrowX = currentNode.centerX;
//                     const arrowLength = arrowEndY - arrowStartY;
                    
//                     // Create vertical line for arrow
//                     const arrow = editor.createRectangle();
//                     arrow.width = 3;
//                     arrow.height = arrowLength;
//                     arrow.fill = editor.makeColorFill({ red: 0.4, green: 0.4, blue: 0.4, alpha: 1 });
                    
//                     insertionParent.children.append(arrow);
//                     arrow.translation = { x: arrowX - 1.5, y: arrowStartY };
                    
//                     console.log(`[SANDBOX] ✅ Created arrow ${i + 1}`);
//                 }
                
//                 console.log("[SANDBOX] ✅ Flowchart complete!");
//                 return { success: true, message: `Created ${nodes.length} nodes with ${nodes.length - 1} arrows` };
                
//             } catch (error) {
//                 console.error("[SANDBOX] ❌ Error:", error);
//                 console.error("[SANDBOX] Stack:", error.stack);
//                 return { success: false, error: error.toString() };
//             }
//         }
//     };

//     runtime.exposeApi(sandboxApi);
// }

// start();

import addOnSandboxSdk from "add-on-sdk-document-sandbox";
import { editor } from "express-document-sdk";

const { runtime } = addOnSandboxSdk.instance;

function start() {
    const sandboxApi = {
        createRectangle: () => {
            const rectangle = editor.createRectangle();
            rectangle.width = 240;
            rectangle.height = 180;
            rectangle.translation = { x: 10, y: 10 };
            
            const color = { red: 0.32, green: 0.34, blue: 0.89, alpha: 1 };
            const rectangleFill = editor.makeColorFill(color);
            rectangle.fill = rectangleFill;
            
            const insertionParent = editor.context.insertionParent;
            insertionParent.children.append(rectangle);
        },

        addFlowchartToPage: (nodes) => {
            console.log("[SANDBOX] Creating flowchart with", nodes.length, "nodes");
            
            try {
                const insertionParent = editor.context.insertionParent;
                
                const hexToRgb = (hex) => {
                    const r = parseInt(hex.slice(1, 3), 16) / 255;
                    const g = parseInt(hex.slice(3, 5), 16) / 255;
                    const b = parseInt(hex.slice(5, 7), 16) / 255;
                    return { red: r, green: g, blue: b, alpha: 1 };
                };
                
                const truncateText = (text, maxLength) => {
                    if (text.length <= maxLength) return text;
                    return text.substring(0, maxLength - 3) + "...";
                };
                
                // Layout settings
                const startX = 50;
                const startY = 50;
                const boxWidth = 300;
                const boxHeight = 80;
                const spacing = 40;
                
                // ⭐ FONT SIZE IN POINTS (change this value)
                const FONT_SIZE = 14;
                
                const createdNodes = [];
                
                for (let i = 0; i < nodes.length; i++) {
                    const node = nodes[i];
                    const yPos = startY + (i * (boxHeight + spacing));
                    const isStartEnd = node.type === "start" || node.type === "end";
                    const nodeColor = node.color || (isStartEnd ? "#667eea" : "#f093fb");
                    
                    // Create rectangle
                    const rect = editor.createRectangle();
                    rect.width = boxWidth;
                    rect.height = boxHeight;

                    const color = hexToRgb(nodeColor);
                    rect.fill = editor.makeColorFill(color);

                    const cornerRadius = isStartEnd ? 40 : 10;
                    rect.topLeftRadius = cornerRadius;
                    rect.topRightRadius = cornerRadius;
                    rect.bottomLeftRadius = cornerRadius;
                    rect.bottomRightRadius = cornerRadius;

                    insertionParent.children.append(rect);
                    rect.translation = { x: startX, y: yPos };

                    // Create text
                    const maxChars = 35;
                    const textContent = truncateText(node.text || "Untitled", maxChars);
                    const text = editor.createText(textContent);

                    // ✅ CORRECT WAY: Apply font size using applyCharacterStyles
                    text.fullContent.applyCharacterStyles(
                        {
                            fontSize: FONT_SIZE,
                            color: { red: 1, green: 1, blue: 1, alpha: 1 }
                        },
                        { start: 0, length: textContent.length }
                    );

                    insertionParent.children.append(text);

                    // Use fallback values if width/height are undefined or NaN
                    const textWidth = (typeof text.width === 'number' && !isNaN(text.width)) ? text.width : 100;
                    const textHeight = (typeof text.height === 'number' && !isNaN(text.height)) ? text.height : FONT_SIZE + 4;
                    
                    const textX = startX + (boxWidth - textWidth) / 2;
                    const textY = yPos + (boxHeight - textHeight) / 2;

                    text.translation = { x: textX, y: textY };

                    createdNodes.push({ rect, text, yPos, centerX: startX + boxWidth / 2 });

                    console.log(`[SANDBOX] ✅ Created node ${i + 1}: "${textContent}" (${FONT_SIZE}pt)`);
                }
                
                // Create arrows
                for (let i = 0; i < createdNodes.length - 1; i++) {
                    const currentNode = createdNodes[i];
                    const nextNode = createdNodes[i + 1];
                    
                    const arrowStartY = currentNode.yPos + boxHeight;
                    const arrowEndY = nextNode.yPos;
                    const arrowX = currentNode.centerX;
                    const arrowLength = arrowEndY - arrowStartY;
                    
                    const arrow = editor.createRectangle();
                    arrow.width = 3;
                    arrow.height = arrowLength;
                    arrow.fill = editor.makeColorFill({ red: 0.4, green: 0.4, blue: 0.4, alpha: 1 });
                    
                    insertionParent.children.append(arrow);
                    arrow.translation = { x: arrowX - 1.5, y: arrowStartY };
                    
                    console.log(`[SANDBOX] ✅ Created arrow ${i + 1}`);
                }
                
                console.log("[SANDBOX] ✅ Flowchart complete!");
                return { success: true, message: `Created ${nodes.length} nodes with ${nodes.length - 1} arrows` };
                
            } catch (error) {
                console.error("[SANDBOX] ❌ Error:", error);
                console.error("[SANDBOX] Stack:", error.stack);
                return { success: false, error: error.toString() };
            }
        },

        captureSnapshot: () => {
            try {
                console.log("[SANDBOX] Capturing snapshot...");
                const document = editor.documentRoot;
                
                if (!document || !document.pages) {
                    console.warn("[SANDBOX] No document or pages found");
                    return {
                        documentSnapshot: {
                            pages: []
                        }
                    };
                }
                
                const pages = [];
                
                // Iterate through all pages
                try {
                    for (const page of document.pages) {
                        if (!page) continue;
                        
                        const pageData = {
                            id: page.id || `page_${pages.length}`,
                            name: (page.name && typeof page.name === 'string') ? page.name : "Page",
                            artboards: []
                        };
                        
                        // Iterate through artboards in the page
                        if (page.artboards) {
                            try {
                                for (const artboard of page.artboards) {
                                    if (!artboard) continue;
                                    
                                    const artboardData = {
                                        id: artboard.id || `artboard_${pageData.artboards.length}`,
                                        name: (artboard.name && typeof artboard.name === 'string') ? artboard.name : "Artboard",
                                        children: []
                                    };
                                    
                                    // Capture all children
                                    if (artboard.children) {
                                        try {
                                            for (const child of artboard.children) {
                                                if (!child) continue;
                                                
                                                try {
                                                    // Determine type - check for text first
                                                    let childType = "Unknown";
                                                    if (child.constructor && child.constructor.name) {
                                                        childType = child.constructor.name;
                                                    }
                                                    
                                                    // Check if it's a text element
                                                    const hasText = child.text !== undefined || 
                                                                   (child.fullContent && typeof child.fullContent.getText === 'function') ||
                                                                   child.plainText !== undefined;
                                                    
                                                    if (hasText && !childType.includes("Text")) {
                                                        childType = "Text";
                                                    }
                                                    
                                                    const childData = {
                                                        id: child.id || `child_${artboardData.children.length}`,
                                                        type: childType,
                                                        translation: { x: 0, y: 0 },
                                                        width: 0,
                                                        height: 0
                                                    };
                                                    
                                                    // Safely get translation
                                                    if (child.translation) {
                                                        try {
                                                            childData.translation = {
                                                                x: (typeof child.translation.x === 'number') ? child.translation.x : 0,
                                                                y: (typeof child.translation.y === 'number') ? child.translation.y : 0
                                                            };
                                                        } catch (e) {
                                                            console.warn("Could not capture translation:", e);
                                                        }
                                                    }
                                                    
                                                    // Safely get dimensions
                                                    if (typeof child.width === 'number') childData.width = child.width;
                                                    if (typeof child.height === 'number') childData.height = child.height;
                                                    
                                                    // Capture text content if it's a text element
                                                    // Check multiple ways to detect text
                                                    let textContent = null;
                                                    try {
                                                        if (child.text !== undefined && child.text !== null) {
                                                            textContent = child.text;
                                                        } else if (child.fullContent && typeof child.fullContent.getText === 'function') {
                                                            textContent = child.fullContent.getText();
                                                        } else if (child.plainText) {
                                                            textContent = child.plainText;
                                                        }
                                                        
                                                        if (textContent !== null && textContent !== undefined) {
                                                            childData.text = String(textContent);
                                                            // If we found text, make sure type is Text
                                                            if (childData.type === "Unknown" || !childData.type.includes("Text")) {
                                                                childData.type = "Text";
                                                            }
                                                        }
                                                    } catch (e) {
                                                        console.warn("Could not capture text:", e);
                                                    }
                                                    
                                                    // Capture fill if it exists
                                                    if (child.fill) {
                                                        try {
                                                            const fillColor = child.fill.color;
                                                            if (fillColor) {
                                                                childData.fill = {
                                                                    red: (typeof fillColor.red === 'number') ? fillColor.red : 0,
                                                                    green: (typeof fillColor.green === 'number') ? fillColor.green : 0,
                                                                    blue: (typeof fillColor.blue === 'number') ? fillColor.blue : 0,
                                                                    alpha: (typeof fillColor.alpha === 'number') ? fillColor.alpha : 1
                                                                };
                                                            }
                                                        } catch (e) {
                                                            console.warn("Could not capture fill:", e);
                                                        }
                                                    }
                                                    
                                                    artboardData.children.push(childData);
                                                } catch (e) {
                                                    console.warn("Error capturing child:", e);
                                                }
                                            }
                                        } catch (e) {
                                            console.warn("Error iterating children:", e);
                                        }
                                    }
                                    
                                    pageData.artboards.push(artboardData);
                                }
                            } catch (e) {
                                console.warn("Error iterating artboards:", e);
                            }
                        }
                        
                        pages.push(pageData);
                    }
                } catch (e) {
                    console.warn("Error iterating pages:", e);
                }
                
                const snapshot = {
                    documentSnapshot: {
                        pages: pages
                    }
                };
                
                console.log("[SANDBOX] ✅ Snapshot captured with", pages.length, "pages");
                return snapshot;
            } catch (error) {
                console.error("[SANDBOX] ❌ Error capturing snapshot:", error);
                // Return empty snapshot instead of throwing to prevent app crash
                return {
                    documentSnapshot: {
                        pages: []
                    }
                };
            }
        },

        restoreFromSnapshot: async (snapshot) => {
            try {
                console.log("[SANDBOX] 🔄 Restoring from snapshot...");
                console.log("[SANDBOX] Snapshot received:", snapshot);
                
                // Handle both snapshot and snapshot.documentSnapshot formats
                let snapshotData = snapshot;
                if (snapshot && snapshot.documentSnapshot) {
                    snapshotData = snapshot.documentSnapshot;
                    console.log("[SANDBOX] Using documentSnapshot format");
                }
                
                if (!snapshotData || !snapshotData.pages) {
                    throw new Error("Invalid snapshot: missing pages");
                }
                
                if (!snapshotData.pages || snapshotData.pages.length === 0) {
                    throw new Error("Invalid snapshot: no pages in snapshot");
                }
                
                const document = editor.documentRoot;
                if (!document) {
                    throw new Error("Document root not available");
                }
                
                console.log("[SANDBOX] Document root found");
                
                // Use insertion parent as the target for restoration
                const insertionParent = editor.context.insertionParent;
                if (!insertionParent) {
                    throw new Error("Insertion parent not available");
                }
                
                console.log("[SANDBOX] Insertion parent:", insertionParent);
                console.log("[SANDBOX] Insertion parent children:", insertionParent.children);
                console.log("[SANDBOX] typeof children.append:", typeof insertionParent.children?.append);
                
                if (!insertionParent.children) {
                    throw new Error("Insertion parent has no children property");
                }
                
                if (typeof insertionParent.children.append !== 'function') {
                    console.error("[SANDBOX] children.append is not a function!");
                    console.error("[SANDBOX] children type:", typeof insertionParent.children);
                    console.error("[SANDBOX] children methods:", Object.keys(insertionParent.children || {}));
                    throw new Error(`children.append is not a function. Available methods: ${Object.keys(insertionParent.children || {}).join(', ')}`);
                }
                
                console.log("[SANDBOX] ✅ Using insertion parent for restoration");
                
                // Get the first page and artboard from snapshot
                const pageData = snapshotData.pages[0];
                if (!pageData || !pageData.artboards || pageData.artboards.length === 0) {
                    throw new Error("No artboards in snapshot");
                }
                
                const artboardData = pageData.artboards[0];
                if (!artboardData || !artboardData.children) {
                    console.warn("[SANDBOX] No children to restore in snapshot");
                    return { success: true, message: "No children to restore" };
                }
                
                console.log(`[SANDBOX] Restoring ${artboardData.children.length} children`);
                
                // Clear existing children from insertion parent
                if (insertionParent.children && insertionParent.children.length > 0) {
                    console.log(`[SANDBOX] Clearing ${insertionParent.children.length} existing children`);
                    const childrenToRemove = [];
                    try {
                        // Collect children to remove
                        for (let i = 0; i < insertionParent.children.length; i++) {
                            childrenToRemove.push(insertionParent.children[i]);
                        }
                        // Remove them
                        for (const child of childrenToRemove) {
                            try {
                                if (child && typeof child.removeFromParent === 'function') {
                                    child.removeFromParent();
                                }
                            } catch (e) {
                                console.warn("[SANDBOX] Could not remove child:", e);
                            }
                        }
                    } catch (e) {
                        console.warn("[SANDBOX] Error clearing children:", e);
                    }
                }
                
                // Restore children
                let restoredCount = 0;
                for (const childData of artboardData.children) {
                    try {
                        let child = null;
                        
                        // Check if it's a text element (by type or by having text property)
                        const isTextElement = childData.type === "Text" || 
                                            childData.type === "TextFrame" || 
                                            (childData.type && childData.type.includes("Text")) ||
                                            (childData.text !== undefined && childData.text !== null && childData.text !== "");
                        
                        console.log(`[SANDBOX] Restoring child: type="${childData.type}", isText=${isTextElement}, hasText=${!!childData.text}`);
                        
                        if (isTextElement) {
                            // Restore as text
                            const textContent = childData.text || "Restored Text";
                            console.log(`[SANDBOX] Creating text element: "${textContent.substring(0, 50)}${textContent.length > 50 ? '...' : ''}"`);
                            child = editor.createText(textContent);
                            
                            if (child) {
                                // Restore text dimensions if available
                                try {
                                    if (typeof childData.width === 'number' && childData.width > 0) {
                                        child.width = childData.width;
                                    }
                                    if (typeof childData.height === 'number' && childData.height > 0) {
                                        child.height = childData.height;
                                    }
                                } catch (e) {
                                    console.warn("[SANDBOX] Could not restore text dimensions:", e);
                                }
                            }
                        } else if (childData.type === "Rectangle") {
                            // Restore as rectangle only if type is explicitly Rectangle
                            console.log(`[SANDBOX] Creating rectangle: ${childData.width}x${childData.height}`);
                            child = editor.createRectangle();
                            if (child) {
                                if (typeof childData.width === 'number' && childData.width > 0) {
                                    child.width = childData.width;
                                } else {
                                    child.width = 100;
                                }
                                
                                if (typeof childData.height === 'number' && childData.height > 0) {
                                    child.height = childData.height;
                                } else {
                                    child.height = 100;
                                }
                                
                                // Only set fill if it exists in the snapshot
                                if (childData.fill) {
                                    try {
                                        const fill = editor.makeColorFill({
                                            red: childData.fill.red || 0,
                                            green: childData.fill.green || 0,
                                            blue: childData.fill.blue || 0,
                                            alpha: childData.fill.alpha !== undefined ? childData.fill.alpha : 1
                                        });
                                        child.fill = fill;
                                    } catch (e) {
                                        console.warn("[SANDBOX] Could not restore fill:", e);
                                    }
                                }
                                // If no fill data, don't set a fill (let it use default or be transparent)
                            }
                        } else {
                            // Unknown type - try to restore as text if it has text, otherwise skip
                            if (childData.text) {
                                console.log(`[SANDBOX] Unknown type "${childData.type}" but has text, restoring as text`);
                                child = editor.createText(childData.text);
                            } else {
                                console.warn(`[SANDBOX] Unknown type "${childData.type}" without text, skipping`);
                                continue; // Skip unknown types without text
                            }
                        }
                        
                        if (child) {
                            // Set translation
                            if (childData.translation) {
                                try {
                                    child.translation = {
                                        x: childData.translation.x || 0,
                                        y: childData.translation.y || 0
                                    };
                                } catch (e) {
                                    console.warn("[SANDBOX] Could not set translation:", e);
                                }
                            }
                            
                            // Append to insertion parent
                            try {
                                if (insertionParent.children && typeof insertionParent.children.append === 'function') {
                                    insertionParent.children.append(child);
                                    restoredCount++;
                                    console.log(`[SANDBOX] ✅ Restored ${childData.type} (${restoredCount}/${artboardData.children.length})`);
                                } else {
                                    console.error("[SANDBOX] ❌ Cannot append - children.append is not a function");
                                    console.error("[SANDBOX] insertionParent.children:", insertionParent.children);
                                    console.error("[SANDBOX] typeof append:", typeof insertionParent.children?.append);
                                }
                            } catch (appendError) {
                                console.error(`[SANDBOX] ❌ Error appending child:`, appendError);
                                console.error("[SANDBOX] Error message:", appendError.message);
                                console.error("[SANDBOX] Error stack:", appendError.stack);
                                throw new Error(`Failed to append child: ${appendError.message || appendError.toString()}`);
                            }
                        }
                    } catch (e) {
                        console.error(`[SANDBOX] ❌ Could not restore child ${childData.id}:`, e);
                        console.error("[SANDBOX] Error details:", e.message, e.stack);
                        // Continue with next child instead of failing completely
                    }
                }
                
                console.log(`[SANDBOX] ✅ Snapshot restored successfully (${restoredCount} children)`);
                return { success: true, restoredCount };
            } catch (error) {
                console.error("[SANDBOX] ❌ Error restoring snapshot:", error);
                console.error("[SANDBOX] Error message:", error.message);
                console.error("[SANDBOX] Error stack:", error.stack);
                throw error;
            }
        },

        extractDocument: async () => {
            try {
                console.log("[SANDBOX] Extracting document for Canvas...");
                
                const document = editor.documentRoot;
                const title = document.name || "Untitled Document";
                
                // Extract content and structure from document
                const sections = [];
                let fullContent = "";
                
                // Iterate through pages and artboards to extract content
                if (document.pages) {
                    for (const page of document.pages) {
                        if (!page || !page.artboards) continue;
                        
                        for (const artboard of page.artboards) {
                            if (!artboard || !artboard.children) continue;
                            
                            // Extract text from children
                            for (const child of artboard.children) {
                                try {
                                    if (child && child.text) {
                                        const text = child.text;
                                        
                                        // Split text into paragraphs (preserve paragraph structure)
                                        // Split by double newlines, single newlines, or keep as single paragraph
                                        const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim().length > 0);
                                        
                                        if (paragraphs.length === 0) {
                                            // If no paragraphs found, try splitting by single newlines
                                            const singleLineParas = text.split(/\n/).filter(p => p.trim().length > 0);
                                            if (singleLineParas.length > 0) {
                                                paragraphs.push(...singleLineParas);
                                            } else {
                                                // If still no paragraphs, use the whole text
                                                paragraphs.push(text);
                                            }
                                        }
                                        
                                        // Create a section for each paragraph to preserve structure
                                        paragraphs.forEach((para, index) => {
                                            const paraText = para.trim();
                                            if (paraText.length > 0) {
                                                fullContent += paraText + "\n\n";
                                                
                                                // Generate a title from first few words
                                                const words = paraText.split(/\s+/);
                                                const titleText = words.slice(0, 5).join(" ") + (words.length > 5 ? "..." : "");
                                                
                                                sections.push({
                                                    id: child.id ? `${child.id}_para_${index}` : `section_${sections.length}`,
                                                    title: titleText || `Paragraph ${index + 1}`,
                                                    content: paraText // Preserve original paragraph with newlines
                                                });
                                            }
                                        });
                                    }
                                } catch (e) {
                                    console.warn("Error extracting text from child:", e);
                                }
                            }
                        }
                    }
                }
                
                // If no sections found, create a default one
                if (sections.length === 0) {
                    sections.push({
                        id: "section_1",
                        title: "Document Content",
                        content: fullContent || "No content found in document"
                    });
                }
                
                const structure = {
                    sections: sections
                };
                
                const result = {
                    title: title,
                    content: fullContent || "No content extracted",
                    structure: structure
                };
                
                console.log("[SANDBOX] ✅ Document extracted:", result);
                return result;
            } catch (error) {
                console.error("[SANDBOX] ❌ Error extracting document:", error);
                // Return a default structure instead of throwing
                return {
                    title: "Untitled Document",
                    content: "Failed to extract document content",
                    structure: {
                        sections: [{
                            id: "section_1",
                            title: "Error",
                            content: "Failed to extract document content"
                        }]
                    }
                };
            }
        }
    };

    runtime.exposeApi(sandboxApi);
}

start();

