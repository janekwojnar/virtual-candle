# 🔗 Wirtualna Świeczka — Next.js + Stripe (BLIK) + Prisma

MVP: wpisujesz intencję, wybierasz liczbę dni (1 dzień = 1 zł), płacisz BLIK w Stripe Payment Element. Po płatności świeczka „pałi się” przez wybraną liczbę dni i jest widoczna na „Murze świec”.

## 0) Wymagania
- Node 18+
- Konto Stripe (włącz BLIK w Dashboardzie)
- (Dev) klucze testowe Stripe
- (Prod) klucze live Stripe, webhook

## 1) Instalacja
```bash
npm i
npm run db:migrate
npm run dev
```

Wejdź na `http://localhost:3000`.

## 2) Env
Skopiuj `.env.example` do `.env` i uzupełnij.
- `NEXT_PUBLIC_STRIPE_PK` — publishable key
- `STRIPE_SECRET` — secret key
- `STRIPE_WEBHOOK_SECRET` — z endpointu webhooka (patrz niżej)
- `DATABASE_URL` — SQLite (dev) lub Postgres (prod)
- `ADMIN_PASSWORD` — hasło do /admin

## 3) Stripe (BLIK)
- W Dashboardzie Stripe (Settings → Payment methods) **włącz BLIK**. (Waluta: PLN.)  
- W testach BLIK przyjmuje dowolny 6-cyfrowy kod.  
- Payment Element pokaże BLIK automatycznie, jeśli waluta to `pln` i metoda jest włączona.

## 4) Webhook (konieczny!)
Utwórz endpoint `https://twoja-domena.com/api/stripe-webhook` w Stripe → Developers → Webhooks.
Skopiuj „Signing secret” do `STRIPE_WEBHOOK_SECRET`.

## 5) Produkcja
- Zmień bazę na Postgres (np. Neon): ustaw `DATABASE_URL=postgresql://...`
- `npm run db:deploy`
- Deploy np. Vercel. Ustaw ENV jak wyżej.

## 6) Admin
`/admin?pass=HASLO` — ukrywanie/pokazywanie świec (moderacja).

## 7) Uwaga dot. BLIK
Stripe obsługuje BLIK w PLN; Payment Element pokazuje lokalne metody po włączeniu w Dashboardzie. Zob. docs.
