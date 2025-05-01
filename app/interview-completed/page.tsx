"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";

export default function InterviewCompleted() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [answers, setAnswers] = useState<string[]>([]);
  const [questions, setQuestions] = useState<string[]>([]);

  useEffect(() => {
    // 🎉 Fire confetti on page load
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });
    const savedAnswers = localStorage.getItem("finalAnswers");
    const savedQuestions = localStorage.getItem("finalQuestions");
    if (savedAnswers && savedQuestions) {
      setAnswers(JSON.parse(savedAnswers));
      setQuestions(JSON.parse(savedQuestions));
    }

    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    const timeout = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
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
      <div className="w-full max-w-2xl mt-6 space-y-4">
        {questions.map((q, idx) => (
          <div key={idx} className="p-4 bg-gray-800 rounded shadow">
            <p className="font-bold text-yellow-400">Q{idx + 1}: {q}</p>
            <p className="mt-2 text-white">📝 {answers[idx] || "No answer provided."}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
