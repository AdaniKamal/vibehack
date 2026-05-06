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

export const THEMES = {
  dark: {
    bg: "#0a0d12",
    surface: "#161b22",
    surface2: "rgba(255,255,255,0.02)",
    border: "#21262d",
    borderInput: "#30363d",
    text: "#e6edf3",
    textDim: "#888",
    textFaint: "#555",
    textFaintest: "#333",
    modalBg: "#0d1117",
  },
  light: {
    bg: "#f0f4f8",
    surface: "#ffffff",
    surface2: "rgba(0,0,0,0.02)",
    border: "#d0d7de",
    borderInput: "#b0bec5",
    text: "#0d1117",
    textDim: "#555",
    textFaint: "#888",
    textFaintest: "#bbb",
    modalBg: "#ffffff",
  },
};

export const btnPrimary = {
  background: "#00ff9d", color: "#000", border: "none", borderRadius: "5px",
  padding: "9px 20px", fontFamily: "monospace", fontWeight: "700",
  fontSize: "12px", cursor: "pointer", letterSpacing: "1px",
};

export const btnSmall = {
  background: "rgba(0,255,157,0.1)", color: "#00ff9d",
  border: "1px solid rgba(0,255,157,0.3)", borderRadius: "4px",
  padding: "5px 10px", fontSize: "11px", cursor: "pointer", fontFamily: "monospace",
};
