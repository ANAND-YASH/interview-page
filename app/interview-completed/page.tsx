"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function InterviewCompleted() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // 🎉 Fire confetti on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearInterval(interval);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-green-900 text-white text-center">
      <div className="bg-green-800 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold">🎉 Thank You! 🎉</h2>
        <p className="mt-4">Your interview is successfully completed.</p>
        <p className="mt-2">We appreciate your time and effort!</p>
        <p className="mt-4 text-sm">
          Redirecting in <span className="font-bold">{countdown}</span> seconds...
        </p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-4 py-2 bg-white text-green-900 font-semibold rounded-lg shadow-md hover:bg-gray-200 transition"
        >
          Go to Home Now
        </button>
      </div>
    </div>
  );
}
