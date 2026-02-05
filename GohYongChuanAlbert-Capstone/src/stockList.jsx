import { useContext, useEffect, useMemo, useRef, useState } from "react";
import StockContext from "./contexts/stockContext";
import "./stockList.css";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

// GLOBAL_QUOTE latest price
function fetchLatestPrice(symbol) {
  const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${encodeURIComponent(
    symbol
  )}&apikey=${API_KEY}`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      // Surface the real reason instead of returning null silently
      if (data?.Note) return { price: null, error: data.Note };
      if (data?.Information) return { price: null, error: data.Information };
      if (data?.["Error Message"]) return { price: null, error: data["Error Message"] };

      const quote = data?.["Global Quote"];
      const priceStr = quote?.["05. price"];
      const priceNum = priceStr ? Number(priceStr) : NaN;

      if (!Number.isFinite(priceNum)) {
        return { price: null, error: "Global Quote missing price field." };
      }

      return { price: priceNum, error: null };
    })
    .catch(() => ({ price: null, error: "Network/API error fetching latest price." }));
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}


export default function StockList() {
  const { stocks } = useContext(StockContext);

  const [latestBySymbol, setLatestBySymbol] = useState({});
  const [errorBySymbol, setErrorBySymbol] = useState({});

  // Remember which symbols we already attempted to fetch (prevents repeats)
  const fetchedRef = useRef(new Set());

  const symbolsToFetch = useMemo(() => {
    return stocks
      .filter((s) => s.validated === true) // only validated
      .map((s) => (s.symbol || "").trim().toUpperCase())
      .filter(Boolean)
      .filter((sym, idx, arr) => arr.indexOf(sym) === idx); // unique
  }, [stocks]);

  useEffect(() => {
  let cancelled = false;

  async function runQueue() {
    if (!API_KEY) return;

    for (const symbol of symbolsToFetch) {
      if (cancelled) return;

      // Skip if we already fetched or already have an error
      if (latestBySymbol[symbol] !== undefined || errorBySymbol[symbol]) continue;

      const { price, error } = await fetchLatestPrice(symbol);

      if (cancelled) return;

      if (error) {
        setErrorBySymbol((prev) => ({ ...prev, [symbol]: error }));
      } else {
        setLatestBySymbol((prev) => ({ ...prev, [symbol]: price }));
      }

      // ✅ Alpha Vantage throttle: ~1 request/sec
      await sleep(1100);
    }
  }

  runQueue();

  return () => {
    cancelled = true;
  };
// IMPORTANT: include latestBySymbol/errorBySymbol so we don't refetch the same symbol endlessly
}, [symbolsToFetch, latestBySymbol, errorBySymbol]);


  if (!stocks.length) return <p className="muted">No stocks added yet.</p>;

  return (
    <div className="stock-list">
      <div className="stock-row stock-row--head">
        <div>Symbol</div>
        <div className="right">Qty</div>
        <div className="right">Buy ($)</div>
        <div className="right">Last ($)</div>
        <div className="right">P/L ($)</div>
      </div>

      {stocks.map((s, idx) => {
        const symbol = (s.symbol || "").trim().toUpperCase();
        const latest = latestBySymbol[symbol];
        const err = errorBySymbol[symbol];

        const qty = Number(s.quantity) || 0;
        const buy = Number(s.purchasePrice) || 0;

        const pnl = typeof latest === "number" ? (latest - buy) * qty : null;
        const pnlClass =
          pnl === null ? "pnl" : pnl >= 0 ? "pnl pnl--pos" : "pnl pnl--neg";

        return (
          <div className="stock-row" key={`${symbol}-${idx}`}>
            <div className="mono">{symbol || "—"}</div>
            <div className="right">{qty}</div>
            <div className="right">{buy ? buy.toFixed(2) : "0.00"}</div>

            <div className="right">
              {err ? (
                <span className="muted">{err}</span>
              ) : typeof latest === "number" ? (
                latest.toFixed(2)
              ) : (
                <span className="muted">Loading...</span>
              )}
            </div>

            <div className={`right ${pnl >= 0 ? "pnl--pos" : "pnl--neg"}`}>
              {pnl === null ? "—" : pnl.toFixed(2)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
