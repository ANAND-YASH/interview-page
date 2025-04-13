import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Set your OpenAI API key in .env file
});

export async function POST(req: Request) {
  try {
    const { question, answer } = await req.json();

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are an AI interviewer evaluating answers. Provide a brief score (1-10) and constructive feedback." },
        { role: "user", content: `Question: ${question}\nAnswer: ${answer}\nEvaluate:` },
      ],
    });

    const feedback = response.choices[0]?.message?.content || "No feedback generated.";

    return NextResponse.json({ feedback });
  } catch (error) {
    console.error("AI Evaluation Error:", error);
    return NextResponse.json({ feedback: "Error in evaluation. Try again.", status: 500 });
  }
}
