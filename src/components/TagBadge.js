import React from "react";

export default function TagBadge({ tag }) {
  return React.createElement("span", {
    style: {
      background: "rgba(0,255,157,0.1)",
      border: "1px solid rgba(0,255,157,0.3)",
      color: "#00ff9d",
      borderRadius: "3px",
      padding: "1px 6px",
      fontSize: "10px",
      fontFamily: "monospace",
      letterSpacing: "0.5px",
    }
  }, tag);
}
