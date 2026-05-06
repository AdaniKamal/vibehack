import { useState, useEffect } from "react";

const PLATFORMS = ["HackTheBox", "TryHackMe", "Vulnhub", "OffSec PG", "PwnTillDawn", "Other"];
const DIFFICULTIES = ["Easy", "Medium", "Hard", "Insane"];
const STATUSES = ["Not Started", "In Progress", "Pwned", "Stuck"];
const OS_TYPES = ["Linux", "Windows", "FreeBSD", "Other"];

const STATUS_COLOR = {
  "Not Started": "#4a5568",
  "In Progress": "#d4a017",
  "Pwned": "#00ff9d",
  "Stuck": "#ff4f4f",
};

const DIFF_COLOR = {
  Easy: "#00ff9d",
  Medium: "#d4a017",
  Hard: "#ff6b35",
  Insane: "#ff4f4f",
};

const defaultMachines = [
  { id: 1, name: "Lame", platform: "HackTheBox", difficulty: "Easy", os: "Linux", status: "Pwned", userFlag: true, rootFlag: true, notes: "First HTB box. SMB exploit via vsftpd.", date: "2025-01-10", tags: ["SMB", "Metasploit"] },
  { id: 2, name: "Blue", platform: "HackTheBox", difficulty: "Easy", os: "Windows", status: "In Progress", userFlag: false, rootFlag: false, notes: "EternalBlue MS17-010 – need to try manual.", date: "2025-01-12", tags: ["EternalBlue", "SMB"] },
];

function TagBadge({ tag }) {
  return (
    <span style={{
      background: "rgba(0,255,157,0.1)",
      border: "1px solid rgba(0,255,157,0.3)",
      color: "#00ff9d",
      borderRadius: "3px",
      padding: "1px 6px",
      fontSize: "10px",
      fontFamily: "monospace",
      letterSpacing: "0.5px",
    }}>{tag}</span>
  );
}

function StatCard({ label, value, accent }) {
  return (
    <div style={{
      background: "rgba(255,255,255,0.03)",
      border: `1px solid ${accent}33`,
      borderLeft: `3px solid ${accent}`,
      borderRadius: "6px",
      padding: "14px 18px",
      minWidth: "110px",
    }}>
      <div style={{ color: accent, fontSize: "24px", fontWeight: "700", fontFamily: "monospace" }}>{value}</div>
      <div style={{ color: "#888", fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{label}</div>
    </div>
  );
}

function MachineModal({ machine, onClose, onSave }) {
  const [form, setForm] = useState(machine || {
    name: "", platform: "HackTheBox", difficulty: "Easy", os: "Linux",
    status: "Not Started", userFlag: false, rootFlag: false,
    notes: "", date: new Date().toISOString().split("T")[0], tags: [],
  });
  const [tagInput, setTagInput] = useState("");

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) set("tags", [...form.tags, t]);
    setTagInput("");
  };

  const removeTag = (t) => set("tags", form.tags.filter(x => x !== t));

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center", padding: "20px",
    }} onClick={onClose}>
      <div style={{
        background: "#0d1117", border: "1px solid #00ff9d44", borderRadius: "10px",
        padding: "28px", width: "100%", maxWidth: "520px", maxHeight: "90vh", overflowY: "auto",
      }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <span style={{ color: "#00ff9d", fontFamily: "monospace", fontSize: "13px", letterSpacing: "2px" }}>
            {machine ? "// EDIT MACHINE" : "// ADD MACHINE"}
          </span>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#666", cursor: "pointer", fontSize: "18px" }}>✕</button>
        </div>

        {[
          ["Machine Name", "name", "text"],
        ].map(([label, key, type]) => (
          <div key={key} style={{ marginBottom: "14px" }}>
            <label style={labelStyle}>{label}</label>
            <input
              type={type} value={form[key]}
              onChange={e => set(key, e.target.value)}
              style={inputStyle}
              placeholder={label}
            />
          </div>
        ))}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
          {[
            ["Platform", "platform", PLATFORMS],
            ["Difficulty", "difficulty", DIFFICULTIES],
            ["OS", "os", OS_TYPES],
            ["Status", "status", STATUSES],
          ].map(([label, key, opts]) => (
            <div key={key}>
              <label style={labelStyle}>{label}</label>
              <select value={form[key]} onChange={e => set(key, e.target.value)} style={inputStyle}>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Date Attempted</label>
          <input type="date" value={form.date} onChange={e => set("date", e.target.value)} style={inputStyle} />
        </div>

        <div style={{ display: "flex", gap: "20px", marginBottom: "14px" }}>
          {[["User Flag", "userFlag"], ["Root Flag", "rootFlag"]].map(([label, key]) => (
            <label key={key} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", color: form[key] ? "#00ff9d" : "#666", fontFamily: "monospace", fontSize: "12px" }}>
              <input type="checkbox" checked={form[key]} onChange={e => set(key, e.target.checked)}
                style={{ accentColor: "#00ff9d", width: "14px", height: "14px" }} />
              {label} {form[key] ? "✓" : "○"}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={labelStyle}>Tags</label>
          <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
            <input value={tagInput} onChange={e => setTagInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && addTag()}
              placeholder="e.g. SMB, FTP, PrivEsc" style={{ ...inputStyle, flex: 1 }} />
            <button onClick={addTag} style={btnSmall}>Add</button>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {form.tags.map(t => (
              <span key={t} onClick={() => removeTag(t)} style={{
                ...{ background: "rgba(0,255,157,0.1)", border: "1px solid rgba(0,255,157,0.3)", color: "#00ff9d", borderRadius: "3px", padding: "2px 8px", fontSize: "11px", fontFamily: "monospace", cursor: "pointer" }
              }}>{t} ✕</span>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: "20px" }}>
          <label style={labelStyle}>Notes / Write-up</label>
          <textarea value={form.notes} onChange={e => set("notes", e.target.value)}
            rows={4} style={{ ...inputStyle, resize: "vertical" }}
            placeholder="What did you find? What worked? What didn't?" />
        </div>

        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
          <button onClick={() => onSave(form)} style={btnPrimary}>
            {machine ? "Save Changes" : "Add Machine"}
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle = { display: "block", color: "#888", fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", marginBottom: "5px", fontFamily: "monospace" };
const inputStyle = { width: "100%", background: "#161b22", border: "1px solid #30363d", borderRadius: "5px", color: "#e6edf3", padding: "8px 10px", fontSize: "13px", fontFamily: "monospace", boxSizing: "border-box", outline: "none" };
const btnPrimary = { background: "#00ff9d", color: "#000", border: "none", borderRadius: "5px", padding: "9px 20px", fontFamily: "monospace", fontWeight: "700", fontSize: "12px", cursor: "pointer", letterSpacing: "1px" };
const btnSecondary = { background: "transparent", color: "#888", border: "1px solid #30363d", borderRadius: "5px", padding: "9px 16px", fontFamily: "monospace", fontSize: "12px", cursor: "pointer" };
const btnSmall = { background: "#00ff9d22", color: "#00ff9d", border: "1px solid #00ff9d44", borderRadius: "4px", padding: "8px 12px", fontFamily: "monospace", fontSize: "12px", cursor: "pointer" };

export default function VibeHackTracker() {
  const [machines, setMachines] = useState(() => {
    try { return JSON.parse(localStorage.getItem("vibehack_machines") || JSON.stringify(defaultMachines)); }
    catch { return defaultMachines; }
  });
  const [modal, setModal] = useState(null); // null | "add" | machine obj
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
    if (confirm("Delete this machine?")) setMachines(ms => ms.filter(m => m.id !== id));
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
    let s = 1, today = new Date();
    for (let i = 0; i < dates.length - 1; i++) {
      const diff = (new Date(dates[i]) - new Date(dates[i + 1])) / 86400000;
      if (diff <= 1) s++; else break;
    }
    return s;
  })();

  return (
    <div style={{
      minHeight: "100vh", background: "#0a0d12",
      fontFamily: "'Courier New', monospace",
      color: "#e6edf3",
    }}>
      {/* Scanline overlay */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0,
        backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,157,0.015) 2px, rgba(0,255,157,0.015) 4px)",
      }} />

      <div style={{ position: "relative", zIndex: 1, maxWidth: "1100px", margin: "0 auto", padding: "30px 20px" }}>

        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <div style={{ color: "#00ff9d", fontSize: "11px", letterSpacing: "4px", marginBottom: "4px" }}>// OSCP PREP TRACKER</div>
              <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "900", color: "#fff", letterSpacing: "-1px" }}>
                Vibe<span style={{ color: "#00ff9d" }}>Hack</span>
              </h1>
              <div style={{ color: "#555", fontSize: "11px", marginTop: "4px", letterSpacing: "2px" }}>
                {machines.length} MACHINES · {pwned} PWNED · EXAM READY: {Math.round((pwned / Math.max(machines.length, 1)) * 100)}%
              </div>
            </div>
            <button onClick={() => setModal("add")} style={{
              ...btnPrimary, padding: "11px 22px", fontSize: "12px", letterSpacing: "2px",
              boxShadow: "0 0 20px rgba(0,255,157,0.3)",
            }}>+ ADD MACHINE</button>
          </div>

          {/* Progress bar */}
          <div style={{ marginTop: "20px", background: "#161b22", borderRadius: "4px", height: "4px", overflow: "hidden" }}>
            <div style={{
              width: `${(pwned / Math.max(machines.length, 1)) * 100}%`,
              height: "100%", background: "linear-gradient(90deg, #00ff9d, #00ccff)",
              transition: "width 0.5s ease", borderRadius: "4px",
            }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "28px" }}>
          <StatCard label="Pwned" value={pwned} accent="#00ff9d" />
          <StatCard label="In Progress" value={inProg} accent="#d4a017" />
          <StatCard label="User Flags" value={userFlags} accent="#00ccff" />
          <StatCard label="Root Flags" value={rootFlags} accent="#ff6b35" />
          <StatCard label="Day Streak" value={`${streak}🔥`} accent="#ff4f4f" />
          <StatCard label="Total" value={machines.length} accent="#888" />
        </div>

        {/* Filters */}
        <div style={{
          background: "rgba(255,255,255,0.02)", border: "1px solid #21262d",
          borderRadius: "8px", padding: "14px 16px", marginBottom: "20px",
          display: "flex", gap: "10px", flexWrap: "wrap", alignItems: "center",
        }}>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Search machine or tag..." style={{ ...inputStyle, width: "200px", flex: "1 1 160px" }} />
          {[
            ["All Platforms", "All", PLATFORMS, setFilterPlatform, filterPlatform],
            ["All Status", "All", STATUSES, setFilterStatus, filterStatus],
            ["All Diff", "All", DIFFICULTIES, setFilterDiff, filterDiff],
          ].map(([placeholder, allVal, opts, setter, val]) => (
            <select key={placeholder} value={val} onChange={e => setter(e.target.value)} style={{ ...inputStyle, width: "auto", flex: "0 1 auto" }}>
              <option value="All">{placeholder}</option>
              {opts.map(o => <option key={o}>{o}</option>)}
            </select>
          ))}
          <select value={sort} onChange={e => setSort(e.target.value)} style={{ ...inputStyle, width: "auto" }}>
            <option value="date">Sort: Date</option>
            <option value="name">Sort: Name</option>
            <option value="diff">Sort: Difficulty</option>
          </select>
        </div>

        {/* Machine count */}
        <div style={{ color: "#555", fontSize: "11px", letterSpacing: "1px", marginBottom: "12px" }}>
          SHOWING {filtered.length} OF {machines.length} MACHINES
        </div>

        {/* Machine list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", color: "#444", padding: "60px 20px", border: "1px dashed #21262d", borderRadius: "8px" }}>
              <div style={{ fontSize: "32px", marginBottom: "10px" }}>🖥️</div>
              <div style={{ fontSize: "13px" }}>No machines found. Add your first target.</div>
            </div>
          )}
          {filtered.map(m => (
            <div key={m.id} style={{
              background: "rgba(255,255,255,0.02)", border: "1px solid #21262d",
              borderLeft: `3px solid ${STATUS_COLOR[m.status]}`,
              borderRadius: "8px", padding: "14px 18px",
              display: "flex", gap: "16px", alignItems: "flex-start",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "#00ff9d44"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#21262d"}
            >
              {/* OS Icon */}
              <div style={{ fontSize: "22px", marginTop: "2px", flexShrink: 0 }}>
                {m.os === "Windows" ? "🪟" : m.os === "Linux" ? "🐧" : "💻"}
              </div>

              {/* Main info */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <span style={{ fontWeight: "700", fontSize: "15px", color: "#fff" }}>{m.name}</span>
                  <span style={{ background: DIFF_COLOR[m.difficulty] + "22", color: DIFF_COLOR[m.difficulty], border: `1px solid ${DIFF_COLOR[m.difficulty]}44`, borderRadius: "3px", fontSize: "10px", padding: "1px 7px", letterSpacing: "1px" }}>{m.difficulty}</span>
                  <span style={{ color: STATUS_COLOR[m.status], fontSize: "10px", letterSpacing: "1px" }}>● {m.status.toUpperCase()}</span>
                  <span style={{ color: "#555", fontSize: "10px" }}>{m.platform}</span>
                  <span style={{ color: "#555", fontSize: "10px" }}>{m.date}</span>
                </div>

                <div style={{ display: "flex", gap: "10px", marginBottom: "8px", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "11px", color: m.userFlag ? "#00ff9d" : "#444" }}>
                    {m.userFlag ? "✓" : "○"} user.txt
                  </span>
                  <span style={{ fontSize: "11px", color: m.rootFlag ? "#ff6b35" : "#444" }}>
                    {m.rootFlag ? "✓" : "○"} root.txt
                  </span>
                </div>

                {m.notes && (
                  <div style={{ color: "#888", fontSize: "12px", marginBottom: "8px", fontStyle: "italic", borderLeft: "2px solid #21262d", paddingLeft: "10px" }}>
                    {m.notes.length > 120 ? m.notes.slice(0, 120) + "..." : m.notes}
                  </div>
                )}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {m.tags.map(t => <TagBadge key={t} tag={t} />)}
                </div>
              </div>

              {/* Actions */}
              <div style={{ display: "flex", flexDirection: "column", gap: "6px", flexShrink: 0 }}>
                <button onClick={() => setModal(m)} style={{ ...btnSmall, fontSize: "11px", padding: "5px 10px" }}>Edit</button>
                <button onClick={() => deleteMachine(m.id)} style={{ background: "transparent", border: "1px solid #ff4f4f44", color: "#ff4f4f", borderRadius: "4px", padding: "5px 10px", fontSize: "11px", cursor: "pointer", fontFamily: "monospace" }}>Del</button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", color: "#333", fontSize: "10px", letterSpacing: "2px", marginTop: "40px", paddingTop: "20px", borderTop: "1px solid #21262d" }}>
          VIBEHACK TRACKER · OSCP PREP · ADANI · {new Date().getFullYear()}
        </div>
      </div>

      {/* Modal */}
      {modal && (
        <MachineModal
          machine={modal === "add" ? null : modal}
          onClose={() => setModal(null)}
          onSave={saveMachine}
        />
      )}
    </div>
  );
}
