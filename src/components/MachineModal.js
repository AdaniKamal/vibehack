import React from "react";
import { PLATFORMS, DIFFICULTIES, OS_TYPES, STATUSES, labelStyle, btnPrimary, btnSecondary, btnSmall } from "../constants";

export default function MachineModal({ machine, onClose, onSave, T }) {
  const [form, setForm] = React.useState(machine || {
    name: "", platform: "HackTheBox", difficulty: "Easy", os: "Linux",
    status: "Not Started", userFlag: false, rootFlag: false,
    notes: "", date: new Date().toISOString().split("T")[0], tags: [],
  });
  const [tagInput, setTagInput] = React.useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };
  const removeTag = (t) => set("tags", form.tags.filter(x => x !== t));

  const inputStyle = {
    width: "100%",
    background: T.surface,
    border: `1px solid ${T.borderInput}`,
    borderRadius: "5px",
    color: T.text,
    padding: "8px 10px",
    fontSize: "13px",
    fontFamily: "monospace",
    boxSizing: "border-box",
    outline: "none",
  };

  const themedLabel = { ...labelStyle, color: T.textDim };

  return React.createElement("div", {
    style: {
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    },
    onClick: onClose,
  },
    React.createElement("div", {
      style: {
        background: T.modalBg,
        border: "1px solid #00ff9d44",
        borderRadius: "10px",
        padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto",
      },
      onClick: e => e.stopPropagation(),
    },

      // Header
      React.createElement("div", {
        style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }
      },
        React.createElement("span", {
          style: { color: "#00ff9d", fontFamily: "monospace", fontSize: "13px", letterSpacing: "2px" }
        }, machine ? "// EDIT MACHINE" : "// ADD MACHINE"),
        React.createElement("button", {
          onClick: onClose,
          style: { background: "none", border: "none", color: T.textDim, cursor: "pointer", fontSize: "18px" }
        }, "✕")
      ),

      // Machine Name
      React.createElement("div", { style: { marginBottom: "14px" } },
        React.createElement("label", { style: themedLabel }, "Machine Name"),
        React.createElement("input", {
          type: "text", value: form.name,
          onChange: e => set("name", e.target.value),
          style: inputStyle, placeholder: "Machine Name"
        })
      ),

      // Grid selects
      React.createElement("div", {
        style: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }
      },
        [
          ["Platform", "platform", PLATFORMS],
          ["Difficulty", "difficulty", DIFFICULTIES],
          ["OS", "os", OS_TYPES],
          ["Status", "status", STATUSES],
        ].map(([label, key, opts]) =>
          React.createElement("div", { key },
            React.createElement("label", { style: themedLabel }, label),
            React.createElement("select", {
              value: form[key],
              onChange: e => set(key, e.target.value),
              style: inputStyle
            }, opts.map(o => React.createElement("option", { key: o }, o)))
          )
        )
      ),

      // Date
      React.createElement("div", { style: { marginBottom: "14px" } },
        React.createElement("label", { style: themedLabel }, "Date Attempted"),
        React.createElement("input", {
          type: "date", value: form.date,
          onChange: e => set("date", e.target.value),
          style: inputStyle
        })
      ),

      // Flags
      React.createElement("div", { style: { display: "flex", gap: "20px", marginBottom: "14px" } },
        [["User Flag", "userFlag"], ["Root Flag", "rootFlag"]].map(([label, key]) =>
          React.createElement("label", {
            key,
            style: {
              display: "flex", alignItems: "center", gap: "8px", cursor: "pointer",
              color: form[key] ? "#00ff9d" : T.textDim, fontFamily: "monospace", fontSize: "12px"
            }
          },
            React.createElement("input", {
              type: "checkbox", checked: form[key],
              onChange: e => set(key, e.target.checked),
              style: { accentColor: "#00ff9d", width: "14px", height: "14px" }
            }),
            `${label} ${form[key] ? "✓" : "○"}`
          )
        )
      ),

      // Tags
      React.createElement("div", { style: { marginBottom: "14px" } },
        React.createElement("label", { style: themedLabel }, "Tags"),
        React.createElement("div", { style: { display: "flex", gap: "8px", marginBottom: "8px" } },
          React.createElement("input", {
            value: tagInput,
            onChange: e => setTagInput(e.target.value),
            onKeyDown: e => e.key === "Enter" && addTag(),
            placeholder: "e.g. SMB, FTP, PrivEsc",
            style: { ...inputStyle, flex: 1 }
          }),
          React.createElement("button", { onClick: addTag, style: btnSmall }, "Add")
        ),
        React.createElement("div", { style: { display: "flex", flexWrap: "wrap", gap: "6px" } },
          form.tags.map(t =>
            React.createElement("span", {
              key: t, onClick: () => removeTag(t),
              style: {
                background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)",
                color: "#00ff9d", borderRadius: "3px", padding: "2px 8px",
                fontSize: "11px", fontFamily: "monospace", cursor: "pointer"
              }
            }, `${t} ✕`)
          )
        )
      ),

      // Notes
      React.createElement("div", { style: { marginBottom: "20px" } },
        React.createElement("label", { style: themedLabel }, "Notes / Write-up"),
        React.createElement("textarea", {
          value: form.notes,
          onChange: e => set("notes", e.target.value),
          rows: 4,
          style: { ...inputStyle, resize: "vertical" },
          placeholder: "What did you find? What worked? What didn't?"
        })
      ),

      // Buttons
      React.createElement("div", { style: { display: "flex", gap: "10px", justifyContent: "flex-end" } },
        React.createElement("button", {
          onClick: onClose,
          style: { ...btnSecondary, color: T.textDim, border: `1px solid ${T.border}` }
        }, "Cancel"),
        React.createElement("button", { onClick: () => onSave(form), style: btnPrimary },
          machine ? "Save Changes" : "Add Machine"
        )
      )
    )
  );
}
