"use client";
import { useEffect, useState } from "react";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PK!);

function CheckoutForm({ candleId }: { candleId: string }) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true); setError(null);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: { return_url: `${location.origin}/candle/${candleId}` }
    });
    if (error) setError(error.message || "Błąd płatności");
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="card" style={{ display:"grid", gap:12 }}>
      <h2>Płatność</h2>
      <PaymentElement />
      <button className="cta" disabled={!stripe || loading} type="submit">
        {loading ? "Przetwarzanie..." : "Zapłać"}
      </button>
      {error && <p className="error">{error}</p>}
      <p className="small">Po opłaceniu zostaniesz przekierowany na stronę świeczki.</p>
    </form>
  );
}

export default function CheckoutPage({ searchParams }: any) {
  const { clientSecret, candleId } = searchParams;
  const options = { clientSecret } as any;
  return (
    <Elements stripe={stripePromise!} options={options}>
      <CheckoutForm candleId={candleId} />
    </Elements>
  );
}
