import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToaster } from "../components/ui/Toaster";
import { paymentService } from "../services/paymentService";

const PaymentSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { addToast } = useToaster();
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState(
    "Verifying your payment and confirming the room...",
  );

  useEffect(() => {
    const txRef =
      searchParams.get("tx_ref") ||
      searchParams.get("trx_ref") ||
      searchParams.get("reference");

    const finalizeBooking = async () => {
      if (!txRef) {
        setStatus("error");
        setMessage(
          "We could not find the Chapa transaction reference in the return URL.",
        );
        return;
      }

      try {
        await paymentService.verifyChapaPayment(txRef);
        addToast("Payment verified. Your reservation is confirmed.", "success");
        setStatus("success");
        setMessage("Your payment was verified and the reservation has been saved.");
        setTimeout(() => navigate("/reservations", { replace: true }), 1500);
      } catch (error) {
        setStatus("error");
        setMessage(
          error.response?.data?.message ||
            "Payment verification failed, so the reservation was not completed.",
        );
      }
    };

    finalizeBooking();
  }, [addToast, navigate, searchParams]);

  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4 py-16">
      <div className="panel-muted max-w-lg rounded-luxury-lg px-8 py-10 text-center shadow-panel">
        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-gold-700">
          Chapa Payment
        </p>
        <h1 className="heading-md mt-4 text-elysium-ink">
          {status === "verifying" && "Confirming your reservation"}
          {status === "success" && "Reservation confirmed"}
          {status === "error" && "Reservation not confirmed"}
        </h1>
        <p className="mt-4 text-dark-600">{message}</p>

        {status === "verifying" && (
          <div className="mt-8 flex justify-center">
            <svg
              className="h-8 w-8 animate-spin text-gold-700"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          </div>
        )}

        {status !== "verifying" && (
          <div className="mt-8 flex justify-center gap-4">
            <Link to="/reservations" className="btn-primary">
              View reservations
            </Link>
            <Link to="/rooms" className="btn-secondary">
              Browse rooms
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
