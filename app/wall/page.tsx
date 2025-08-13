import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const revalidate = 30;

export default async function WallPage() {
  const candles = await prisma.candle.findMany({
    where: {
      status: "paid",
      endsAt: { gt: new Date() }
    },
    orderBy: { createdAt: "desc" },
    take: 200
  });

  return (
    <div className="card">
      <h2>Mur świec</h2>
      <div className="grid">
        {candles.map(c => (
          <Link key={c.id} href={"/candle/" + c.id} className="card" style={{ textDecoration: "none" }}>
            <div style={{ textAlign: "center", marginBottom: 8 }}>
              <div className="candle"><div className="flame" /></div>
            </div>
            <div className="small" style={{ minHeight: 40 }}>{c.message.length > 80 ? c.message.slice(0, 77) + "..." : c.message}</div>
            <div className="small">Autor: {c.nickname || "Anonim"}</div>
          </Link>
        ))}
      </div>
      {candles.length === 0 && <p className="small">Brak aktywnych świec – bądź pierwszy/a.</p>}
    </div>
  );
}
