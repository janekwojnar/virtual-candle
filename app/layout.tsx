import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Wirtualna świċka",
  description: "Kup świċke̤ i zapal ją w intencji. Płatność BLIK.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pl">
      <body>
        <div className="container">
          <div className="header">
            <Link href="/"><h1>🕯️ Wirtualna świċka</h1></Link>
            <nav className="nav">
              <Link href="/wall">Mur świec</Link>
              <Link href="/admin">Admin</Link>
            </nav>
          </div>
          {children}
          <hr />
          <p className="small">© {new Date().getFullYear()} Wirtualna świċka • Płatności przez Stripe (BLIK) • Waluta: PLN</p>
        </div>
      </body>
    </html>
  );
}
