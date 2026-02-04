import { useState } from "react";
import "./stockForm.css";

export default function StockForm() {
  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    // Not required to work yet — prevents page refresh.
    // Later: pass data up to App via props callback (e.g., onAddStock).
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
