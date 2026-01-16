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
        }
    };

    runtime.exposeApi(sandboxApi);
}

start();

