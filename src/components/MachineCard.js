import React from "react";
import TagBadge from "./TagBadge";
import { STATUS_COLOR, DIFF_COLOR, btnSmall } from "../constants";

export default function MachineCard({ machine: m, onEdit, onDelete, T }) {
  const [hovered, setHovered] = React.useState(false);

  return React.createElement("div", {
    style: {
      background: T.surface2,
      border: `1px solid ${hovered ? "#00ff9d44" : T.border}`,
      borderLeft: `3px solid ${STATUS_COLOR[m.status]}`,
      borderRadius: "8px",
      padding: "14px 18px",
      display: "flex",
      gap: "16px",
      alignItems: "flex-start",
      transition: "border-color 0.2s",
    },
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  },

    // OS Icon
    React.createElement("div", {
      style: { fontSize: "22px", marginTop: "2px", flexShrink: 0 }
    }, m.os === "Windows" ? "🪟" : m.os === "Linux" ? "🐧" : "💻"),

    // Main info
    React.createElement("div", { style: { flex: 1, minWidth: 0 } },

      // Name row
      React.createElement("div", {
        style: { display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "6px" }
      },
        React.createElement("span", { style: { fontWeight: "700", fontSize: "15px", color: T.text } }, m.name),
        React.createElement("span", {
          style: {
            background: DIFF_COLOR[m.difficulty] + "22",
            color: DIFF_COLOR[m.difficulty],
            border: `1px solid ${DIFF_COLOR[m.difficulty]}44`,
            borderRadius: "3px", fontSize: "10px", padding: "1px 7px", letterSpacing: "1px"
          }
        }, m.difficulty),
        React.createElement("span", {
          style: { color: STATUS_COLOR[m.status], fontSize: "10px", letterSpacing: "1px" }
        }, `● ${m.status.toUpperCase()}`),
        React.createElement("span", { style: { color: T.textFaint, fontSize: "10px" } }, m.platform),
        React.createElement("span", { style: { color: T.textFaint, fontSize: "10px" } }, m.date)
      ),

      // Flags
      React.createElement("div", { style: { display: "flex", gap: "10px", marginBottom: "8px", flexWrap: "wrap" } },
        React.createElement("span", { style: { fontSize: "11px", color: m.userFlag ? "#00ff9d" : T.textFaint } },
          `${m.userFlag ? "✓" : "○"} user.txt`
        ),
        React.createElement("span", { style: { fontSize: "11px", color: m.rootFlag ? "#ff6b35" : T.textFaint } },
          `${m.rootFlag ? "✓" : "○"} root.txt`
        )
      ),

      // Notes
      m.notes && React.createElement("div", {
        style: {
          color: T.textDim, fontSize: "12px", marginBottom: "8px",
          fontStyle: "italic", borderLeft: `2px solid ${T.border}`, paddingLeft: "10px"
        }
      }, m.notes.length > 120 ? m.notes.slice(0, 120) + "..." : m.notes),

      // Tags
      React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "5px" } },
        m.tags.map(t => React.createElement(TagBadge, { key: t, tag: t }))
      )
    ),

    // Actions
    React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 } },
      React.createElement("button", { onClick: onEdit, style: btnSmall }, "Edit"),
      React.createElement("button", {
        onClick: onDelete,
        style: {
          background: "transparent", border: "1px solid #ff4f4f44", color: "#ff4f4f",
          borderRadius: "4px", padding: "5px 10px", fontSize: "11px", cursor: "pointer", fontFamily: "monospace"
        }
      }, "Del")
    )
  );
}
