'use client'
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { kidneyQuestions } from "@/questions/kidney";
import { liverQuestions } from "@/questions/liver";
import { stomachQuestions } from "@/questions/stomach";
import { heartQuestions } from "@/questions/heart";

const QUESTION_MAP: Record<string, { question: string; options: string[] }[]> = {
  kidney: kidneyQuestions,
  liver: liverQuestions,
  stomach: stomachQuestions,
  heart: heartQuestions,
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const part = params.part as string;
  const questions = QUESTION_MAP[part];
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ summary: string; advice: string } | null>(null);

  // 分析结果API调用
  useEffect(() => {
    // 仅当问题加载完成、问卷结束、结果未生成且不在加载中时触发
    if (questions && finished && !result && !loading) {
      setLoading(true);
      // 构造prompt
      const prompt = `请根据以下${part === 'kidney' ? '肾脏' : part === 'liver' ? '肝脏' : part === 'stomach' ? '胃部' : part === 'heart' ? '心脏' : part}健康自测问卷的用户答案，分析其健康状况，并给出医学建议。\n\n` +
        questions.map((q, i) => `${i + 1}. ${q.question}\n用户选择：${answers[i]}`).join("\n") +
        "\n请严格按照如下格式输出，且不要超过字数限制：\n【分析结果】（80字以内）：xxx\n【医学建议】（150字以内）：yyy\n要求：请用一名有多年临床经验的医生和患者面对面沟通的口语化表达方式，亲切、自然、贴心地给出分析和建议，称呼尽量都是使用你我他。不要用AI或书面语风格，不要使用敬词，要像医生和患者聊天那样，表达关心和鼓励。例如'别太担心，这种情况很常见，建议你……'。";
      // 调用openrouter.ai的GPT-4.1 API
      fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "sk-xxx"}`,
        },
        body: JSON.stringify({
          model: "gpt-4-turbo",
          messages: [
            { role: "system", content: "你是一位专业的医学健康顾问。" },
            { role: "user", content: prompt },
          ],
          max_tokens: 512,
        }),
      })
        .then(res => res.json())
        .then(data => {
          // 解析结构化结果
          const content = data.choices?.[0]?.message?.content || "AI分析失败，请稍后重试。";
          let summary = "";
          let advice = "";
          // 优化正则，兼容换行和不同格式
          const summaryMatch = content.match(/【分析结果】[（(】]*[\d]*[）)]*：?([\s\S]*?)(?=\n+【医学建议】|【医学建议】|$)/);
          const adviceMatch = content.match(/【医学建议】[（(】]*[\d]*[）)]*：?([\s\S]*)/);
          if (summaryMatch && summaryMatch[1].trim()) summary = summaryMatch[1].trim().slice(0, 80);
          if (adviceMatch && adviceMatch[1].trim()) advice = adviceMatch[1].trim().slice(0, 150);
          // fallback: 若解析失败则直接显示原始内容
          if (!summary && !advice) {
            summary = content.slice(0, 50);
            advice = content.slice(0, 150);
          }
          setResult({ summary, advice });
        })
        .catch(() => setResult({ summary: "AI分析失败，请检查网络或API Key。", advice: "" }))
        .finally(() => setLoading(false));
    }
  }, [finished, result, loading, part, questions, answers]);

  const handleSelect = (opt: string) => {
    const newAnswers = [...answers, opt];
    setAnswers(newAnswers);
    if (current < questions.length - 1) {
      setCurrent(current + 1);
    } else {
      setFinished(true);
    }
  };

  const handlePrev = () => {
    // 访问 questions 之前进行检查
    if (questions && current > 0) {
      setCurrent(current - 1);
      setAnswers(answers.slice(0, -1));
    }
  };

  // 将条件渲染放在 Hooks 之后
  if (!questions) {
    return <div className="text-center mt-20 text-lg text-red-500">未找到该部位的题库</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-blue-50 to-pink-50 flex flex-col items-center py-8 font-sans">
      <main className="flex-1 flex flex-col items-center justify-center px-4 w-full min-h-[700px] h-[700px]">
        <div className="relative w-full max-w-md h-[700px] bg-orange-100 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6">
          {/* 左上角返回图标 */}
          {current > 0 && !finished && (
            <button
              onClick={handlePrev}
              aria-label="返回上一个问题"
              className="absolute top-4 left-4 text-blue-500 hover:bg-blue-100 rounded-full p-2 transition focus:outline-none focus:ring-2 focus:ring-blue-300 z-10"
            >
              <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            </button>
          )}
          <h1 className="text-2xl font-extrabold text-pink-600 mb-2 text-center">{part === 'kidney' ? '肾脏' : part === 'liver' ? '肝脏' : part === 'stomach' ? '胃部' : part === 'heart' ? '心脏' : part}健康自测</h1>
          <div className="text-center text-gray-500 mb-2">{finished ? (!result ? "AI正在分析中..." : "分析结果与建议") : `第 ${current + 1} / ${questions.length} 题`}</div>
          {!finished ? (
            <div className="bg-blue-50 rounded-xl p-6 shadow-sm flex flex-col gap-4 items-center relative w-full h-[460px] max-h-[460px] overflow-auto">
              <div className="font-bold mb-4 text-lg w-full text-center">{questions[current].question}</div>
              <div className="flex flex-col gap-4 w-full">
                {questions[current]?.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(opt)}
                    className="bg-gradient-to-tr from-pink-400 to-blue-400 text-white rounded-lg py-3 px-4 font-semibold hover:scale-105 active:scale-95 transition-transform w-full"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-6 items-center">
              <div className="bg-pink-50 rounded-xl p-6 shadow flex flex-col gap-4 items-center w-full">
                {loading && <div className="text-blue-500 font-bold text-lg animate-pulse">🤖 AI正在分析中，请稍候...</div>}
                {result && (
                  <>
                    <div className="w-full bg-blue-100 border-l-4 border-blue-500 rounded-xl shadow p-4 mb-2">
                      <div className="font-bold text-blue-700 text-lg mb-1">分析结果</div>
                      <div className="text-blue-900 text-base font-semibold">{result.summary}</div>
                    </div>
                    <div className="w-full bg-pink-100 border-l-4 border-pink-500 rounded-xl shadow p-4">
                      <div className="font-bold text-pink-700 text-lg mb-1">医学建议</div>
                      <div className="text-pink-900 text-base font-medium">{result.advice}</div>
                    </div>
                  </>
                )}
              </div>
              <button
                onClick={() => router.push("/")}
                className="bg-gradient-to-tr from-blue-400 to-pink-400 text-white rounded-lg py-3 px-6 font-bold hover:scale-105 active:scale-95 transition-transform"
              >
                重新选择部位
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 