import { prisma } from "@/lib/prisma";
import { differenceInDays, differenceInHours, differenceInMinutes } from "date-fns";
import Link from "next/link";

export const revalidate = 30;

export default async function CandlePage({ params }: { params: { id: string } }) {
  const candle = await prisma.candle.findUnique({ where: { id: params.id } });
  if (!candle) return <div className="card">Nie znaleziono świeczki.</div>;

  const active = candle.status === "paid" && candle.endsAt && candle.endsAt > new Date();
  const remaining = candle.endsAt ? Math.max(0, Math.ceil((candle.endsAt.getTime() - Date.now())/1000)) : 0;

  function humanize(seconds:number) {
    const min = Math.floor(seconds/60);
    const hrs = Math.floor(min/60);
    const days = Math.floor(hrs/24);
    if (days>0) return `${days} d`;
    if (hrs>0) return `${hrs} h`;
    return `${min} min`;
  }

  return (
    <div className="card" style={{ display:"grid", gap:12 }}>
      <div style={{ textAlign:"center" }}>
        <div className="candle">
          {active && <div className="flame" />}
        </div>
      </div>
      <h2>Intencja</h2>
      <p style={{ whiteSpace:"pre-wrap" }}>{candle.message}</p>
      <p className="small">Autor: {candle.nickname || "Anonim"}</p>
      <p className={active ? "success" : "warning"}>
        {active ? `Pali się jeszcze: ${humanize(remaining)}` : "Świeczka wygasła (lub oczekuje na płatność)."}
      </p>
      <Link href="/wall">← Wróć na mur świec</Link>
    </div>
  );
}
