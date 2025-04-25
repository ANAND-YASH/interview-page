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

const exampleAnswers: Record<string, string[]> = {
  "Software Developer": [
    "SOLID stands for Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, and Dependency Inversion Principles. These principles help in writing clean, maintainable code.",
    "Synchronous programming blocks execution until a task completes. Asynchronous allows code to continue executing while waiting for tasks (like API calls) to finish.",
    "Code performance can be optimized through caching, reducing loops, using efficient algorithms, avoiding memory leaks, and lazy loading where applicable.",
  ],
  "Web Developer": [
    "Flexbox is one-dimensional (row/column), while Grid is two-dimensional (rows and columns). Use Flexbox for layout in one direction and Grid for complex layouts.",
    "By using semantic HTML, ARIA roles, color contrast, keyboard navigation, and screen-reader support.",
    "Minify CSS/JS, use lazy loading for images, optimize assets, reduce HTTP requests, and implement caching and CDN.",
  ],
  "Data Scientist/Analyst": [
    "Supervised learning uses labeled data, while unsupervised learning finds hidden patterns in unlabeled data.",
    "Accuracy, precision, recall, F1 score, ROC-AUC, and confusion matrix are commonly used metrics.",
    "You can handle missing data by removing rows, imputing values (mean/median/mode), or using advanced techniques like KNN imputation.",
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
  const [timeLeft, setTimeLeft] = useState(180); // Timer set for total questions
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
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setExamEnded(true);
          alert("Time is up! Your interview has been ended.");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

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
    } else {
      router.push("/interview-completed");
    }
  };

  if (examEnded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-red-500 text-center">
        <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-96">
          <h2 className="text-2xl font-bold">Interview Over 🚫</h2>
          <p className="mt-4">You switched tabs or your time ran out.</p>
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
              Total Time Left: {timeLeft} seconds
            </div>

            {feedback && (
              <div className="mt-4 p-3 bg-blue-500 rounded text-white">
                <p className="font-bold">AI Feedback:</p>
                <p>{feedback}</p>
                <div className="mt-3 text-yellow-200 text-sm">
                  <p className="font-bold">Exact Answer:</p>
                  <p>
                    {exampleAnswers[interviewer.role]?.[currentQuestionIndex] ||
                      "No sample answer available."}
                  </p>
                </div>
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
