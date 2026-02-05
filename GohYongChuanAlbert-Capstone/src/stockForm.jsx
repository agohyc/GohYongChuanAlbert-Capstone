import { useContext, useState } from "react";
import "./stockForm.css";
import StockContext from "./contexts/stockContext";

const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

/**
 * -----------------------------
 * MOCK DATA (offline validation)
 * -----------------------------
 * Add more tickers here as you like.
 * Key MUST be the uppercase symbol the user will enter.
 */
const mockData = {
  NVDA: {
    bestMatches: [
      {
        "1. symbol": "NVDA",
        "2. name": "NVIDIA Corp",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000",
      },
    ],
  },

  ADBE: {
    bestMatches: [
      {
        "1. symbol": "ADBE",
        "2. name": "Adobe Inc",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000",
      },
    ],
  },

  MSFT: {
    bestMatches: [
      {
        "1. symbol": "MSFT",
        "2. name": "Microsoft Corporation",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000",
      },
    ],
  },

  AAPL: {
    bestMatches: [
      {
        "1. symbol": "AAPL",
        "2. name": "Apple Inc",
        "3. type": "Equity",
        "4. region": "United States",
        "5. marketOpen": "09:30",
        "6. marketClose": "16:00",
        "7. timezone": "UTC-04",
        "8. currency": "USD",
        "9. matchScore": "1.0000",
      },
    ],
  },
};

  // Example: add another one by pasting the SYMBOL_SEARCH response
  // AAPL: { bestMatches: [ ... ] },


/**
 * ---------------------------------------
 * MOCK VALIDATION: no API call, no rate limit
 * ---------------------------------------
 */
function validateSymbolMock(symbol) {
  const data = mockData[symbol.toUpperCase()];

  if (!data || !Array.isArray(data.bestMatches)) {
    return Promise.resolve({
      ok: false,
      reason: `Symbol not found in mockData: ${symbol.toUpperCase()}`,
    });
  }

  const exact = data.bestMatches.some(
    (m) => m["1. symbol"] === symbol.toUpperCase()
  );

  return Promise.resolve(
    exact
      ? { ok: true }
      : { ok: false, reason: `Invalid symbol: ${symbol.toUpperCase()}` }
  );
}

/**
 * ----------------------------------------------------------
 * ORIGINAL API VALIDATION (keep for later — comment/uncomment)
 * ----------------------------------------------------------
 */

// function validateSymbol(symbol) {
//   const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(
//     symbol
//   )}&apikey=${API_KEY}`;

//   return fetch(url)
//     .then((res) => res.json())
//     .then((data) => {
//       // Alpha Vantage sometimes responds with these instead of bestMatches
//       if (data?.Note) return { ok: false, reason: data.Note };
//       if (data?.Information) return { ok: false, reason: data.Information };
//       if (data?.["Error Message"]) return { ok: false, reason: data["Error Message"] };

//       const matches = data?.bestMatches;
//       if (!Array.isArray(matches)) return { ok: false, reason: "No matches returned." };

//       const exact = matches.some((m) => m["1. symbol"] === symbol.toUpperCase());
//       return exact
//         ? { ok: true }
//         : { ok: false, reason: `Invalid symbol: ${symbol.toUpperCase()}` };
//     })
//     .catch(() => ({ ok: false, reason: "Network/API error while validating symbol." }));
// }

export default function StockForm() {
  const { addStock } = useContext(StockContext);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });

  function handleSubmit(e) {
    e.preventDefault();

    const sym = symbol.trim().toUpperCase();
    if (!sym) return setStatus({ state: "error", message: "Please enter a stock symbol." });
    if (!quantity || Number(quantity) <= 0)
      return setStatus({ state: "error", message: "Please enter a valid quantity." });
    if (!price || Number(price) <= 0)
      return setStatus({ state: "error", message: "Please enter a valid purchase price." });

    setStatus({ state: "validating", message: "Validating symbol..." });

    /**
     * ------------------------------------------------------
     * ✅ CURRENTLY USING MOCK VALIDATION (no API calls)
     * ------------------------------------------------------
     * To switch back to API validation later:
     * 1) Comment out the line below (validateSymbolMock...)
     * 2) Uncomment the validateSymbol() function above
     * 3) Replace validateSymbolMock(sym) with validateSymbol(sym)
     */
    validateSymbolMock(sym).then((result) => {
      if (!result.ok) {
        setStatus({ state: "error", message: result.reason });
        return;
      }

      addStock({ symbol: sym, quantity, purchasePrice: price });
      setStatus({ state: "ok", message: `Added: ${sym}` });

      setSymbol("");
      setQuantity("");
      setPrice("");
    });

    /**
     * ------------------------------------------------------
     * 🔁 API VALIDATION VERSION (keep for later)
     * ------------------------------------------------------
     * Uncomment after you restore validateSymbol() above:
     */
    // if (!API_KEY) {
    //   setStatus({
    //     state: "error",
    //     message: "Missing API key. Ensure .env has VITE_ALPHA_VANTAGE_KEY and restart Vite.",
    //   });
    //   return;
    // }
    //
    // validateSymbol(sym).then((result) => {
    //   if (!result.ok) {
    //     setStatus({ state: "error", message: result.reason });
    //     return;
    //   }
    //
    //   addStock({ symbol: sym, quantity, purchasePrice: price });
    //   setStatus({ state: "ok", message: `Added: ${sym}` });
    //
    //   setSymbol("");
    //   setQuantity("");
    //   setPrice("");
    // });
  }

  const isBusy = status.state === "validating";

  return (
    <form className="stock-form" onSubmit={handleSubmit}>
      <input
        className="input"
        type="text"
        placeholder="Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        autoComplete="off"
      />

      <input
        className="input"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <input
        className="input"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder="Purchase Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button className="btn" type="submit" disabled={isBusy}>
        {isBusy ? "Checking..." : "Add Stock"}
      </button>

      {status.state !== "idle" && (
        <div
          className={
            status.state === "error"
              ? "form-status form-status--error"
              : status.state === "ok"
              ? "form-status form-status--ok"
              : "form-status"
          }
        >
          {status.message}
        </div>
      )}
    </form>
  );
}

