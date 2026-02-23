import React, { useMemo, useState } from "react";

function toNumber(v) {
  if (v === "" || v === null || v === undefined) return 0;
  const cleaned = String(v).replace(/[$,\s]/g, "");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function money(n) {
  return n.toLocaleString(undefined, { style: "currency", currency: "USD" });
}

function pct(n) {
  if (!Number.isFinite(n)) return "—";
  return (n * 100).toFixed(2) + "%";
}

export default function ProfitMarginCalculator() {
  const [saleTotal, setSaleTotal] = useState("31191");
  const [orderCost, setOrderCost] = useState("19912");
  const [freightCost, setFreightCost] = useState("1427");
  const [includeFreight, setIncludeFreight] = useState(true);
  const [warnFreightPct, setWarnFreightPct] = useState("8"); // percent

  const v = useMemo(() => {
    const sale = toNumber(saleTotal);
    const cost = toNumber(orderCost);
    const freight = toNumber(freightCost);
    const warn = Math.max(0, toNumber(warnFreightPct)) / 100;

    const costAfterFreight = cost + (includeFreight ? freight : 0);
    const grossProfit = sale - costAfterFreight;
    const margin = sale > 0 ? grossProfit / sale : NaN;
    const freightPct = sale > 0 ? freight / sale : NaN;

    return {
      sale,
      cost,
      freight,
      warn,
      costAfterFreight,
      grossProfit,
      margin,
      freightPct,
    };
  }, [saleTotal, orderCost, freightCost, includeFreight, warnFreightPct]);

  const isNegative = Number.isFinite(v.margin) && v.margin < 0;
  const freightHigh = Number.isFinite(v.freightPct) && v.freightPct >= v.warn;

  const pillTone = isNegative ? "bad" : v.margin >= 0.3 ? "good" : "neutral";

  const copySummary = async () => {
    const text =
      `Sale: ${money(v.sale)} | ` +
      `Cost${includeFreight ? "+Freight" : ""}: ${money(v.costAfterFreight)} | ` +
      `Profit: ${money(v.grossProfit)} | ` +
      `Margin: ${pct(v.margin)}`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Copied summary ✅");
    } catch {
      alert("Could not copy (clipboard blocked).");
    }
  };

  const clear = () => {
    setSaleTotal("");
    setOrderCost("");
    setFreightCost("");
  };

  return (
    <section className="card">
      <div className="cardHeader">
        <div>
          <h1 className="h1">Profit Margin Calculator</h1>
          <p className="sub">
            Paste values with <span className="mono">$</span> or commas — it parses automatically.
          </p>
        </div>

        <div className={`pill ${pillTone}`}>
          <div className="pillLabel">Margin</div>
          <div className="pillValue">{pct(v.margin)}</div>
        </div>
      </div>

      <div className="grid">
        <Field label="Sale Total" value={saleTotal} onChange={setSaleTotal} placeholder="e.g. 31191" />
        <Field label="Order Cost" value={orderCost} onChange={setOrderCost} placeholder="e.g. 19912" />
        <Field label="Freight Cost" value={freightCost} onChange={setFreightCost} placeholder="e.g. 1427" />

        <div className="panel">
          <div className="panelTitle">Settings</div>

          <label className="toggleRow">
            <input
              type="checkbox"
              checked={includeFreight}
              onChange={(e) => setIncludeFreight(e.target.checked)}
            />
            <span>Include freight in margin</span>
          </label>

          <div className="inline">
            <div className="inlineLabel">Warn if freight ≥</div>
            <input
              className="miniInput"
              value={warnFreightPct}
              onChange={(e) => setWarnFreightPct(e.target.value)}
              inputMode="decimal"
              aria-label="Freight warning percent"
            />
            <div className="inlineLabel">% of sale</div>
          </div>
        </div>
      </div>

      <div className="stats">
        <Stat label="Cost after freight" value={money(v.costAfterFreight)} />
        <Stat label="Gross profit" value={money(v.grossProfit)} tone={isNegative ? "bad" : "good"} />
        <Stat label="Freight % of sale" value={pct(v.freightPct)} tone={freightHigh ? "warn" : "neutral"} />
      </div>

      {(isNegative || freightHigh) && (
        <div className="alerts">
          {isNegative && (
            <div className="alert bad">
              <strong>Negative margin:</strong> this order loses money at these inputs.
            </div>
          )}
          {freightHigh && (
            <div className="alert warn">
              <strong>Freight is high:</strong> {pct(v.freightPct)} of sale (threshold {pct(v.warn)}).
            </div>
          )}
        </div>
      )}

      <div className="actions">
        <button className="btn primary" onClick={copySummary}>Copy summary</button>
        <button className="btn" onClick={clear}>Clear</button>
      </div>

      <div className="divider" />

      <details className="details">
        <summary>Show formulas (matches your Excel)</summary>
        <div className="detailsBody">
          <div className="formula">
            <span className="mono">Cost after freight</span> = <span className="mono">Order Cost + Freight Cost</span>
          </div>
          <div className="formula">
            <span className="mono">Gross profit</span> = <span className="mono">Sale Total − Cost after freight</span>
          </div>
          <div className="formula">
            <span className="mono">Profit margin</span> = <span className="mono">Gross profit ÷ Sale Total</span>
          </div>
        </div>
      </details>
    </section>
  );
}

function Field({ label, value, onChange, placeholder }) {
  return (
    <label className="field">
      <span className="fieldLabel">{label}</span>
      <input
        className="input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode="decimal"
      />
    </label>
  );
}

function Stat({ label, value, tone = "neutral" }) {
  return (
    <div className={`stat ${tone}`}>
      <div className="statLabel">{label}</div>
      <div className="statValue">{value}</div>
    </div>
  );
}
