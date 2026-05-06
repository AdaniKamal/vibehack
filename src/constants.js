export const PLATFORMS = ["HackTheBox", "TryHackMe", "Vulnhub", "OffSec PG", "PwnTillDawn", "Other"];
export const DIFFICULTIES = ["Easy", "Medium", "Hard", "Insane"];
export const STATUSES = ["Not Started", "In Progress", "Pwned", "Stuck"];
export const OS_TYPES = ["Linux", "Windows", "FreeBSD", "Other"];

export const STATUS_COLOR = {
  "Not Started": "#4a5568",
  "In Progress": "#d4a017",
  "Pwned": "#00ff9d",
  "Stuck": "#ff4f4f",
};

export const DIFF_COLOR = {
  Easy: "#00ff9d",
  Medium: "#d4a017",
  Hard: "#ff6b35",
  Insane: "#ff4f4f",
};

export const inputStyle = {
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

export const labelStyle = {
  display: "block",
  color: "#888",
  fontSize: "10px",
  letterSpacing: "1.5px",
  textTransform: "uppercase",
  marginBottom: "5px",
  fontFamily: "monospace",
};

export const btnPrimary = {
  background: "#00ff9d", color: "#000", border: "none", borderRadius: "5px",
  padding: "9px 20px", fontFamily: "monospace", fontWeight: "700",
  fontSize: "12px", cursor: "pointer", letterSpacing: "1px",
};

export const btnSecondary = {
  background: "transparent", color: "#888", border: "1px solid #30363d",
  borderRadius: "5px", padding: "9px 16px", fontFamily: "monospace",
  fontSize: "12px", cursor: "pointer",
};

export const btnSmall = {
  background: "rgba(0,255,157,0.1)", color: "#00ff9d",
  border: "1px solid rgba(0,255,157,0.3)", borderRadius: "4px",
  padding: "5px 10px", fontSize: "11px", cursor: "pointer", fontFamily: "monospace",
};
