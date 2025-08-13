"use client";
import { useState } from "react";

export default function HomePage() {
  const [nickname, setNickname] = useState("");
  const [message, setMessage] = useState("");
  const [days, setDays] = useState(7);
  const price = Math.max(1, Math.min(365, Math.floor(days))) * 1; // PLN
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createOrder() {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname, message, days })
      });
      if (!res.ok) throw new Error("Błąd serwera");
      const data = await res.json();
      // Redirect to the hosted checkout page we built (Payment Element)
      const url = new URL("/checkout", location.origin);
      url.searchParams.set("clientSecret", data.clientSecret);
      url.searchParams.set("candleId", data.candleId);
      location.href = url.toString();
    } catch (e:any) {
      setError(e.message || "Coś poszło nie tak.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h2>Zapal świeczkę</h2>
      <p className="small">Cena: 1 dzień = 1 zł. Kwota naliczana automatycznie (PLN).</p>

      <div style={{ display: "grid", gap: 12 }}>
        <div>
          <label>Nick (opcjonalnie)</label>
          <input value={nickname} onChange={e=>setNickname(e.target.value)} placeholder="np. Janek"/>
        </div>
        <div>
          <label>Intencja</label>
          <textarea rows={4} value={message} onChange={e=>setMessage(e.target.value)} placeholder="Twoja intencja..." />
          <p className="small">Unikaj danych wrażliwych. Treści mogą być widoczne publicznie.</p>
        </div>
        <div>
          <label>Ile dni ma się palić?</label>
          <input type="number" min={1} max={365} value={days} onChange={e=>setDays(parseInt(e.target.value || "1",10))}/>
        </div>
        <div className="row">
          <div className="badge">Do zapłaty: <b>{price}</b> zł</div>
          <button className="cta" disabled={loading || !message.trim()} onClick={createOrder}>
            {loading ? "Tworzę zamówienie..." : "Przejdź do płatności (BLIK)"}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>
    </div>
  );
}
