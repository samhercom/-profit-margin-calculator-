import React from "react";
import ProfitMarginCalculator from "./components/ProfitMarginCalculator.jsx";

export default function App() {
  return (
    <div className="appShell">
      <header className="topBar">
        <div className="brand">
          <div className="brandDot" aria-hidden />
          <div className="brandText">
            <div className="brandTitle">Profit Margin</div>
            <div className="brandSub">Premium dark-mode quick check</div>
          </div>
        </div>
        <span className="pillLink">GitHub Pages</span>
      </header>

      <main className="content">
        <ProfitMarginCalculator />
        <footer className="footer">
          <span className="muted">
            Live calc • Instant margin + freight guardrails
          </span>
        </footer>
      </main>
    </div>
  );
}
