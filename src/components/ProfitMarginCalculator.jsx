import React, { useMemo, useState } from "react";

function toNumber(v) {
  if (!v) return 0;
  const n = Number(String(v).replace(/[$,\s]/g, ""));
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
  const [saleTotal, setSaleTotal] = useState("3798");
  const [orderCost, setOrderCost] = useState("2530");
  const [freightCost, setFreightCost] = useState("50");

  const v = useMemo(() => {
    const sale = toNumber(saleTotal);
    const cost = toNumber(orderCost);
    const freight = toNumber(freightCost);

    const costAfterFreight = cost + freight;
    const grossProfit = sale - costAfterFreight;
    const margin = sale > 0 ? grossProfit / sale : NaN;

    return { sale, costAfterFreight, grossProfit, margin };
  }, [saleTotal, orderCost, freightCost]);

  return (
    <div className="card">
      <h1>Profit Margin Calculator</h1>

      <input value={saleTotal} onChange={e=>setSaleTotal(e.target.value)} placeholder="Sale Total" />
      <input value={orderCost} onChange={e=>setOrderCost(e.target.value)} placeholder="Order Cost" />
      <input value={freightCost} onChange={e=>setFreightCost(e.target.value)} placeholder="Freight Cost" />

      <div className="results">
        <div>Cost after freight: {money(v.costAfterFreight)}</div>
        <div>Gross profit: {money(v.grossProfit)}</div>
        <div>Profit margin: {pct(v.margin)}</div>
      </div>
    </div>
  );
}
