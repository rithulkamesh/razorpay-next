"use client";

import PaymentForm from "@/components/payment-form";

export default function Home() {
  return (
    <div>
      <PaymentForm
        amount={300}
        user={{
          name: "John Doe",
          email: "john@doe.com",
          phone: "9999999999",
        }}
      />
    </div>
  );
}
