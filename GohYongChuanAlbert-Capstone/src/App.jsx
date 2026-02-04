import "./App.css";
import StockForm from "./stockForm.jsx";

export default function App() {
  return (
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
          <p className="muted">No stocks added yet.</p>
        </section>
      </div>
    </div>
  );
}

