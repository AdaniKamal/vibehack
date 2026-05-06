import React, { useState, useEffect } from "react";
import MachineModal from "./components/MachineModal";
import StatCard from "./components/StatCard";
import MachineCard from "./components/MachineCard";
import { PLATFORMS, DIFFICULTIES, STATUSES } from "./constants";

const [theme, setTheme] = React.useState(() =>
  localStorage.getItem("vibehack_theme") || "dark"
);
const T = THEMES[theme]; // shorthand

const defaultMachines = [
  { id: 1, name: "Lame", platform: "HackTheBox", difficulty: "Easy", os: "Linux", status: "Pwned", userFlag: true, rootFlag: true, notes: "First HTB box. SMB exploit via vsftpd.", date: "2025-01-10", tags: ["SMB", "Metasploit"] },
  { id: 2, name: "Blue", platform: "HackTheBox", difficulty: "Easy", os: "Windows", status: "In Progress", userFlag: false, rootFlag: false, notes: "EternalBlue MS17-010 – need to try manual.", date: "2025-01-12", tags: ["EternalBlue", "SMB"] },
];

const inputStyle = {
  width: "100%",
  background: "#161b22",
  border: "1px solid #30363d",
  borderRadius: "5px",
  color: "#e6edf3",
  padding: "8px 10px",
  fontSize: "13px",
  fontFamily: "monospace",
  boxSizing: "border-box",
  outline: "none",
};

export default function App() {
  const [machines, setMachines] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vibehack_machines") || JSON.stringify(defaultMachines)); }
    catch { return defaultMachines; }
  });
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [filterPlatform, setFilterPlatform] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterDiff, setFilterDiff] = useState("All");
  const [sort, setSort] = useState("date");

  useEffect(() => {
    localStorage.setItem("vibehack_machines", JSON.stringify(machines));
  }, [machines]);

  const saveMachine = (form) => {
    if (form.id) {
      setMachines(ms => ms.map(m => m.id === form.id ? form : m));
    } else {
      setMachines(ms => [...ms, { ...form, id: Date.now() }]);
    }
    setModal(null);
  };

  const deleteMachine = (id) => {
    if (window.confirm("Delete this machine?")) setMachines(ms => ms.filter(m => m.id !== id));
  };

  const filtered = machines
    .filter(m => {
      if (search && !m.name.toLowerCase().includes(search.toLowerCase()) &&
        !m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()))) return false;
      if (filterPlatform !== "All" && m.platform !== filterPlatform) return false;
      if (filterStatus !== "All" && m.status !== filterStatus) return false;
      if (filterDiff !== "All" && m.difficulty !== filterDiff) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === "date") return new Date(b.date) - new Date(a.date);
      if (sort === "name") return a.name.localeCompare(b.name);
      if (sort === "diff") return DIFFICULTIES.indexOf(a.difficulty) - DIFFICULTIES.indexOf(b.difficulty);
      return 0;
    });

  const pwned = machines.filter(m => m.status === "Pwned").length;
  const inProg = machines.filter(m => m.status === "In Progress").length;
  const userFlags = machines.filter(m => m.userFlag).length;
  const rootFlags = machines.filter(m => m.rootFlag).length;
  const streak = (() => {
    const dates = [...new Set(machines.filter(m => m.status === "Pwned").map(m => m.date))].sort().reverse();
    if (!dates.length) return 0;
    let s = 1;
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / 86400000;
      if (diff <= 1) s++; else break;
    }
    return s;
  })();

  const btnPrimary = {
    background: "#00ff9d", color: "#000", border: "none", borderRadius: "5px",
    padding: "11px 22px", fontFamily: "monospace", fontWeight: "700",
    fontSize: "12px", cursor: "pointer", letterSpacing: "2px",
    boxShadow: "0 0 20px rgba(0,255,157,0.3)",
  };

  return (
    React.createElement("div", {
      style: {
        minHeight: "100vh",
        background: "#0a0d12",
        fontFamily: "'Courier New', monospace",
        color: "#e6edf3",
      }
    },
      // Scanline overlay
      React.createElement("div", {
        style: {
          position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,157,0.015) 2px, rgba(0,255,157,0.015) 4px)",
        }
      }),

      React.createElement("div", {
        style: { position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }
      },

        // Header
        React.createElement("div", { style: { marginBottom: "32px" } },
          React.createElement("div", {
            style: { display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }
          },
            React.createElement("div", null,
              React.createElement("div", { style: { color: "#00ff9d", fontSize: "11px", letterSpacing: "4px", marginBottom: "4px" } }, "// OSCP PREP TRACKER"),
              React.createElement("h1", { style: { margin: 0, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "900", color: "#fff", letterSpacing: "-1px" } },
                "Vibe",
                React.createElement("span", { style: { color: "#00ff9d" } }, "Hack")
              ),
              React.createElement("div", { style: { color: "#555", fontSize: "11px", marginTop: "4px", letterSpacing: "2px" } },
                `${machines.length} MACHINES · ${pwned} PWNED · EXAM READY: ${Math.round((pwned / Math.max(machines.length, 1)) * 100)}%`
              )
            ),
            React.createElement("button", { onClick: () => setModal("add"), style: btnPrimary }, "+ ADD MACHINE")
            React.createElement("button", {
              onClick: () => {
                const next = theme === "dark" ? "light" : "dark";
                setTheme(next);
                localStorage.setItem("vibehack_theme", next);
              },
              style: {
                background: "transparent",
                border: `1px solid ${T.border}`,
                color: T.textDim,
                borderRadius: "5px",
                padding: "9px 14px",
                fontFamily: "monospace",
                fontSize: "13px",
                cursor: "pointer",
              }
            }, theme === "dark" ? "☀️ Light" : "🌙 Dark")
                        
          ),

          // Progress bar
          React.createElement("div", { style: { marginTop: "20px", background: "#161b22", borderRadius: "4px", height: "4px", overflow: "hidden" } },
            React.createElement("div", {
              style: {
                width: `${(pwned / Math.max(machines.length, 1)) * 100}%`,
                height: "100%", background: "linear-gradient(90deg, #00ff9d, #00ccff)",
                transition: "width 0.5s ease", borderRadius: "4px",
              }
            })
          )
        ),

        // Stats
        React.createElement("div", { style: { display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" } },
          React.createElement(StatCard, { label: "Pwned", value: pwned, accent: "#00ff9d" }),
          React.createElement(StatCard, { label: "In Progress", value: inProg, accent: "#d4a017" }),
          React.createElement(StatCard, { label: "User Flags", value: userFlags, accent: "#00ccff" }),
          React.createElement(StatCard, { label: "Root Flags", value: rootFlags, accent: "#ff6b35" }),
          React.createElement(StatCard, { label: "Day Streak", value: `${streak}🔥`, accent: "#ff4f4f" }),
          React.createElement(StatCard, { label: "Total", value: machines.length, accent: "#888" })
        ),

        // Filters
        React.createElement("div", {
          style: {
            background: "rgba(255,255,255,0.02)", border: "1px solid #21262d",
            borderRadius: "8px", padding: "14px 16px", marginBottom: "20px",
            display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center",
          }
        },
          React.createElement("input", {
            value: search,
            onChange: e => setSearch(e.target.value),
            placeholder: "🔍 Search machine or tag...",
            style: { ...inputStyle, width: "200px", flex: "1 1 160px" }
          }),
          [
            ["All Platforms", PLATFORMS, setFilterPlatform, filterPlatform],
            ["All Status", STATUSES, setFilterStatus, filterStatus],
            ["All Diff", DIFFICULTIES, setFilterDiff, filterDiff],
          ].map(([placeholder, opts, setter, val]) =>
            React.createElement("select", {
              key: placeholder, value: val,
              onChange: e => setter(e.target.value),
              style: { ...inputStyle, width: "auto", flex: "0 1 auto" }
            },
              React.createElement("option", { value: "All" }, placeholder),
              opts.map(o => React.createElement("option", { key: o }, o))
            )
          ),
          React.createElement("select", {
            value: sort, onChange: e => setSort(e.target.value),
            style: { ...inputStyle, width: "auto" }
          },
            React.createElement("option", { value: "date" }, "Sort: Date"),
            React.createElement("option", { value: "name" }, "Sort: Name"),
            React.createElement("option", { value: "diff" }, "Sort: Difficulty")
          )
        ),

        // Machine count
        React.createElement("div", { style: { color: "#555", fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" } },
          `SHOWING ${filtered.length} OF ${machines.length} MACHINES`
        ),

        // Machine list
        React.createElement("div", { style: { display: "flex", flexDirection: "column", gap: "10px" } },
          filtered.length === 0 && React.createElement("div", {
            style: { textAlign: "center", color: "#444", padding: "60px 20px", border: "1px dashed #21262d", borderRadius: "8px" }
          },
            React.createElement("div", { style: { fontSize: "32px", marginBottom: "10px" } }, "🖥️"),
            React.createElement("div", { style: { fontSize: "13px" } }, "No machines found. Add your first target.")
          ),
          filtered.map(m =>
            React.createElement(MachineCard, {
              key: m.id,
              machine: m,
              onEdit: () => setModal(m),
              onDelete: () => deleteMachine(m.id),
            })
          )
        ),

        // Footer
        React.createElement("div", {
          style: { textAlign: "center", color: "#333", fontSize: "10px", letterSpacing: "2px", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #21262d" }
        }, `VIBEHACK TRACKER · OSCP PREP · ADANI · ${new Date().getFullYear()}`)
      ),

      // Modal
      modal && React.createElement(MachineModal, {
        machine: modal === "add" ? null : modal,
        onClose: () => setModal(null),
        onSave: saveMachine,
      })
    )
  );
}
