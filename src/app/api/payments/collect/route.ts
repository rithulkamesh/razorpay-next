import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const { amount, user_email } = await req.json();

  if (!amount || amount < 1 || !user_email) {
    return Response.json(
      { ok: false, message: "Invalid amount" },
      { status: 400 },
    );
  }

  var instance = new Razorpay({
    key_id: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY as string,
    key_secret: process.env.RAZORPAY_SECRET as string,
  });

  const payment_capture = 1;
  const currency = "INR";
  const options = {
    amount: (amount * 100).toString(),
    currency,
    receipt: nanoid(),
    payment_capture,
    notes: {
      user_email: user_email,
    },
  };

  const order = await instance.orders.create(options);

  if (!order)
    return NextResponse.json({ ok: false, message: "Error creating order" });

  return NextResponse.json({ ok: true, message: "Order created", order });
}
