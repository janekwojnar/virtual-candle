import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { clampDays } from "@/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const { nickname, message, days } = await req.json();
    const safeDays = clampDays(Number(days));
    const amountPLN = safeDays * 100; // PLN -> grosz

    if (typeof message !== "string" || message.trim().length < 2) {
      return NextResponse.json({ error: "Brak treści intencji." }, { status: 400 });
    }

    const candle = await prisma.candle.create({
      data: { nickname: nickname?.toString().slice(0,60) || null, message: message.toString().slice(0, 2000), days: safeDays }
    });

    const order = await prisma.order.create({
      data: { candleId: candle.id, amountPLN, provider: "stripe" }
    });

    // Create PaymentIntent - BLIK requires PLN; Payment Element will show BLIK if enabled in Dashboard
    const intent = await stripe.paymentIntents.create({
      amount: amountPLN,
      currency: "pln",
      automatic_payment_methods: { enabled: true },
      metadata: { candleId: candle.id, orderId: order.id }
    });

    await prisma.order.update({
      where: { id: order.id },
      data: { providerId: intent.id }
    });

    return NextResponse.json({ clientSecret: intent.client_secret, candleId: candle.id });
  } catch (e:any) {
    console.error(e);
    return NextResponse.json({ error: "Nie udało się utworzyć zamówienia." }, { status: 500 });
  }
}
