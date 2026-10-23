import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { bg: "rgb(var(--bg) / <alpha-value>)", card: "rgb(var(--card) / <alpha-value>)", fg: "rgb(var(--fg) / <alpha-value>)", muted: "rgb(var(--muted) / <alpha-value>)", accent: "rgb(var(--accent) / <alpha-value>)", line: "rgb(var(--line) / <alpha-value>)" },
    fontFamily: { display: ["var(--font-display)"], mono: ["var(--font-mono)"] },
  } },
} satisfies Config;
