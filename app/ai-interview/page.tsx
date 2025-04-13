"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const roleBasedQuestions: Record<string, string[]> = {
  "Software Developer": [
    "What are the SOLID principles in software development?",
    "Explain the difference between synchronous and asynchronous programming.",
    "How do you optimize code performance?",
  ],
  "Web Developer": [
    "What is the difference between Flexbox and Grid in CSS?",
    "How do you ensure website accessibility?",
    "What are the best practices for improving website performance?",
  ],
  "Data Scientist/Analyst": [
    "Explain the difference between supervised and unsupervised learning.",
    "What are the key metrics to evaluate a machine learning model?",
    "How do you handle missing data in a dataset?",
  ],
};

const AIInterview = () => {
  const router = useRouter();
  const [interviewer, setInterviewer] = useState<{ name: string; role: string } | null>(null);
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [examEnded, setExamEnded] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem("interviewerData");
    if (data) {
      const parsedData = JSON.parse(data);
      setInterviewer(parsedData);
      setQuestions(roleBasedQuestions[parsedData.role] || ["Tell me about yourself."]);
    }
  }, []);

  useEffect(() => {
    if (timeLeft === 0) {
      handleNextQuestion();
    }
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        endInterview();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const endInterview = () => {
    setExamEnded(true);
    alert("You switched the tab! Your interview has ended.");
  };

  const evaluateAnswer = async () => {
    if (!answer.trim()) {
      alert("Please enter an answer.");
      return;
    }

    setLoading(true);
    setFeedback(null);

    try {
      const response = await axios.post("/api/evaluate", {
        question: questions[currentQuestionIndex],
        answer,
      });

      setFeedback(response.data.feedback);
    } catch (error) {
      console.error("Evaluation error:", error);
      setFeedback("Error evaluating your answer. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setAnswer("");
      setFeedback(null);
      setTimeLeft(60);
    } else {
      router.push("/interview-completed"); 
    }
  };

  if (examEnded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-500 text-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold">Interview Over 🚫</h2>
          <p className="mt-4">You switched tabs or tried to leave the page.</p>
          <p className="mt-2">Your interview is now terminated.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96 text-center">
        {interviewer ? (
          <>
            <h2 className="text-2xl font-bold text-green-400">AI Interview for {interviewer.role}</h2>
            <p className="text-yellow-400 mt-2">
              Hello, <strong>{interviewer.name}</strong>! Answer the questions below:
            </p>

            <div className="mt-6">
              <p className="text-lg font-semibold">{questions[currentQuestionIndex]}</p>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your answer here..."
                className="w-full p-2 mt-3 border border-yellow-500 rounded bg-gray-700 text-white"
                rows={3}
              ></textarea>
            </div>

            <div className="mt-4 text-red-400 font-semibold">
              Time Left: {timeLeft} seconds
            </div>

            {feedback && (
              <div className="mt-4 p-3 bg-blue-500 rounded text-white">
                <p className="font-bold">AI Feedback:</p>
                <p>{feedback}</p>
              </div>
            )}

            <button
              onClick={evaluateAnswer}
              disabled={loading}
              className="mt-4 w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            >
              {loading ? "Evaluating..." : "Evaluate Answer"}
            </button>

            <button
              onClick={handleNextQuestion}
              className="mt-2 w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Interview"}
            </button>
          </>
        ) : (
          <p>Loading interviewer details...</p>
        )}
      </div>
    </div>
  );
};

export default AIInterview;
