import { useState } from "react";
import "./App.css";

import StockContext from "./contexts/stockContext";
import StockForm from "./stockForm";
import StockList from "./stockList";

export default function App() {
  const [stocks, setStocks] = useState([]);

  function addStock({ symbol, quantity, purchasePrice }) {
    const cleaned = {
    symbol: symbol.trim().toUpperCase(),
    quantity: Number(quantity),
    purchasePrice: Number(purchasePrice),
    validated: true,
    };


    setStocks((prev) => [cleaned, ...prev]);
  }

  const contextValue = { stocks, addStock };

  return (
    <StockContext.Provider value={contextValue}>
      <div className="page">
        <div className="container">
          <header className="header">
            <h1>Finance Dashboard</h1>
          </header>

          <section className="card">
            <StockForm />
          </section>

          <section className="card">
            <h2>Stock List</h2>
            <StockList />
          </section>
        </div>
      </div>
    </StockContext.Provider>
  );
}
