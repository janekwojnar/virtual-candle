import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { clampDays, nowPlusDays } from "@/lib/utils";

export const runtime = "nodejs"; // required for raw body access

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  if (!sig) return new Response("Missing signature", { status: 400 });
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err:any) {
    console.error("Webhook signature verification failed.", err.message);
    return new Response("Bad signature", { status: 400 });
  }

  try {
    if (event.type === "payment_intent.succeeded") {
      const pi = event.data.object as any;
      const orderId = pi.metadata?.orderId;
      if (orderId) {
        const order = await prisma.order.update({
          where: { id: orderId },
          data: { status: "paid" }
        });
        const candle = await prisma.candle.update({
          where: { id: order.candleId },
          data: {
            status: "paid",
            startsAt: new Date(),
            endsAt: nowPlusDays(clampDays((await prisma.candle.findUnique({where:{id: order.candleId}}))!.days))
          }
        });
      }
    }
  } catch (e:any) {
    console.error("Webhook handling error:", e);
    return new Response("Webhook error", { status: 500 });
  }

  return new Response("ok", { status: 200 });
}

// Stripe requires the raw request body to validate the webhook signature.
// Next.js App Router gives us the raw body via req.text() when runtime=nodejs.
