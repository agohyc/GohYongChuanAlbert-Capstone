import { useState, useEffect } from "react";
import "./stockForm.css";

export default function StockForm() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  // updated event handler
  function handleSubmit(e) {
  e.preventDefault();

  if (!symbol) return;
  
  validateSymbol(symbol).then((isValid) => {
    if (!isValid) {
      alert("Invalid stock symbol ❌");
      return;
    }

    alert("Valid symbol ✅");

    // later:
    // send to parent or add to state
  });
}

  // Import API key
  const API_KEY = import.meta.env.VITE_ALPHA_VANTAGE_KEY;

  // Validation function
  function validateSymbol(symbol) {
  const url = `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${symbol}&apikey=${API_KEY}`;

  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data.bestMatches) return false;

      return data.bestMatches.some(
        (match) => match["1. symbol"] === symbol.toUpperCase()
      );
    })
    .catch(() => false);
}


  return (
    <form className="stock-form" onSubmit={handleSubmit}>
      <label className="sr-only" htmlFor="symbol">
        Stock Symbol
      </label>
      <input
        id="symbol"
        className="input"
        type="text"
        placeholder="Stock Symbol"
        value={symbol}
        onChange={(e) => setSymbol(e.target.value)}
        autoComplete="off"
      />

      <label className="sr-only" htmlFor="quantity">
        Quantity
      </label>
      <input
        id="quantity"
        className="input"
        type="number"
        inputMode="numeric"
        min="0"
        step="1"
        placeholder="Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
      />

      <label className="sr-only" htmlFor="price">
        Purchase Price
      </label>
      <input
        id="price"
        className="input"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder="Purchase Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <button className="btn" type="submit">
        Add Stock
      </button>
    </form>
  );
}
