import React, { useState } from "react";

export default function Flowchart({ nodes, onEdit }) {
  const [selectedNode, setSelectedNode] = useState(null);
  const nodeHeight = 80;
  const nodeSpacing = 40;
  const totalHeight = nodes.length * (nodeHeight + nodeSpacing) + 50;

  const colorPresets = [
    "#667eea", "#f093fb", "#48bb78", "#ed8936",
    "#3182ce", "#e53e3e", "#38b2ac", "#d69e2e",
  ];

  return (
    <div style={{ 
      overflowY: "auto", 
      maxHeight: "500px",
      marginTop: "16px",
      background: "linear-gradient(to bottom, #f7fafc, #edf2f7)",
      borderRadius: "12px",
      padding: "20px",
      boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
    }}>
      <svg 
        width="100%" 
        height={totalHeight}
        style={{ minHeight: "200px" }}
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="10"
            markerHeight="10"
            refX="5"
            refY="5"
            orient="auto"
          >
            <polygon points="0 0, 10 5, 0 10" fill="#cbd5e0" />
          </marker>
          <filter id="shadow">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.3"/>
          </filter>
        </defs>

        {nodes.map((node, index) => {
          const yPos = index * (nodeHeight + nodeSpacing) + 25;
          const isStartEnd = node.type === "start" || node.type === "end";
          const nodeColor = node.color || (isStartEnd ? "#667eea" : "#f093fb");
          
          return (
            <g key={node.id}>
              {/* Arrow line */}
              {index < nodes.length - 1 && (
                <line
                  x1="200"
                  y1={yPos + nodeHeight}
                  x2="200"
                  y2={yPos + nodeHeight + nodeSpacing}
                  stroke="#cbd5e0"
                  strokeWidth="4"
                  markerEnd="url(#arrowhead)"
                />
              )}
              
              {/* Box */}
              <rect
                x="20"
                y={yPos}
                width="360"
                height={nodeHeight}
                rx={isStartEnd ? 40 : 12}
                fill={nodeColor}
                stroke={nodeColor}
                strokeWidth={3}
                filter="url(#shadow)"
                style={{ cursor: "pointer" }}
                onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
              />
              
              {/* Text */}
              <foreignObject 
                x="30" 
                y={yPos + 10} 
                width="340" 
                height={nodeHeight - 20}
              >
                <textarea
                  style={{
                    width: "100%",
                    height: "100%",
                    border: "none",
                    outline: "none",
                    fontSize: "14px",
                    background: "transparent",
                    color: "white",
                    padding: "10px",
                    fontWeight: isStartEnd ? "bold" : "500",
                    resize: "none",
                    textAlign: "center",
                  }}
                  value={node.text}
                  onChange={(e) => onEdit(node.id, { text: e.target.value })}
                  readOnly={isStartEnd}
                />
              </foreignObject>

              {/* Color picker */}
              {selectedNode === node.id && !isStartEnd && (
                <foreignObject 
                  x="390" 
                  y={yPos} 
                  width="180" 
                  height={nodeHeight}
                >
                  <div style={{
                    background: "white",
                    borderRadius: "8px",
                    padding: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "grid",
                    gridTemplateColumns: "repeat(4, 1fr)",
                    gap: "6px"
                  }}>
                    {colorPresets.map(color => (
                      <button
                        key={color}
                        onClick={() => onEdit(node.id, { color })}
                        style={{
                          width: "32px",
                          height: "32px",
                          borderRadius: "6px",
                          background: color,
                          border: node.color === color ? "3px solid #000" : "2px solid #e2e8f0",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      <div style={{
        marginTop: "12px",
        padding: "10px",
        background: "#edf2f7",
        borderRadius: "8px",
        fontSize: "12px",
        color: "#4a5568"
      }}>
        💡 Click boxes to change colors • Edit text directly
      </div>
    </div>
  );
}
