import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function hide(id: string) {
  "use server";
  await prisma.candle.update({ where: { id }, data: { status: "hidden" } });
  redirect("/admin");
}

async function unhide(id: string) {
  "use server";
  await prisma.candle.update({ where: { id }, data: { status: "paid" } });
  redirect("/admin");
}

export default async function AdminPage({ searchParams }: any) {
  const pass = searchParams?.pass;
  if (pass !== process.env.ADMIN_PASSWORD) {
    return <div className="card"><p>Podaj haslo w URL: <code>?pass=HASLO</code></p></div>;
  }
  const candles = await prisma.candle.findMany({ orderBy: { createdAt: "desc" }, take: 200 });
  return (
    <div className="card">
      <h2>Admin</h2>
      <p className="small">Szybka moderacja. Kliknij, zeby ukryc/pokazac.</p>
      <ul>
        {candles.map(c => (
          <li key={c.id} style={{ marginBottom: 8 }}>
            <form action={c.status === "hidden" ? unhide : hide}>
              <input type="hidden" name="id" value={c.id} />
              <button className="badge" type="submit">{c.status === "hidden" ? "Pokaz" : "Ukryj"}</button>{" "}
              <Link href={`/candle/${c.id}`}>{c.nickname || "Anonim"}</Link>{" "}
              <span className="small">[{c.status}] {new Date(c.createdAt).toLocaleString()}</span>
              <div className="small" style={{maxWidth: '100%'}}>{c.message.slice(0,200)}</div>
            </li>
        ))}
      </ul>
    </div>
  );
}
