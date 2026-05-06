import React from "react";

export default function StatCard({ label, value, accent }) {
  return React.createElement("div", {
    style: {
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent}33`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: "6px",
      padding: "14px 18px",
      minWidth: "110px",
    }
  },
    React.createElement("div", {
      style: { color: accent, fontSize: "24px", fontWeight: "700", fontFamily: "monospace" }
    }, value),
    React.createElement("div", {
      style: { color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }
    }, label)
  );
}
