import axios from "axios";
import React, { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface UserData {
  name: string;
  email: string;
  phone: string;
}

interface PaymentFormProps {
  amount: number;
  user: UserData;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, user }) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const makePayment = async (amount: number) => {
    try {
      setLoading(true);
      const { order } = (
        await axios.post("/api/payments/collect", {
          amount: amount,
          user_email: user.email,
        })
      ).data;
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_API_KEY,
        name: user.email,
        currency: order.currency,
        amount: parseInt(order.amount),
        order_id: order.id,
        description: "Next.js Razorpay Example",
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone,
        },
        handler: async (response: any) => {
          const res = await axios.post("/api/payments/verify", {
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          });

          if (res?.data?.message === "success") {
            toast({
              title: "Payment successful",
              description: "Your payment was successful",
            });

            setLoading(false);
          } else handleError();
        },
      };

      // @ts-ignore
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

      paymentObject.on("payment.failed", () => handleError());
    } catch (error) {
      handleError();
    }

    function handleError() {
      setLoading(false);
      toast({
        title: "Payment failed",
        description: "Your payment was not successful",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-8">
      <button
        className={`bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors duration-200`}
        disabled={amount == 0}
        onClick={() => makePayment(amount)}
      >
        {loading ? "Processing..." : "Pay Now"}
      </button>
    </div>
  );
};

export default PaymentForm;
