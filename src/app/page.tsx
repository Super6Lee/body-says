'use client'
import React from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";


const BODY_PARTS = [
  { key: "kidney", label: "肾脏", image: "/images/kidney.svg" },
  { key: "liver", label: "肝脏", image: "/images/liver.svg" },
  { key: "stomach", label: "胃部", image: "/images/stomach.svg" },
  { key: "heart", label: "心脏", emoji: "🫀" },
];

export default function Home() {
  const router = useRouter();
  const handleSelect = (part: { key: string; label: string; image?: string; emoji?: string }) => {
    console.log(`Selected: ${part.label}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 via-blue-50 to-pink-50 flex flex-col font-sans">

      {/* 主内容区 */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 ">
        <div className="w-full max-w-md mt-10 mb-8 bg-orange-100 rounded-2xl shadow-lg p-8 flex flex-col items-center gap-6 ">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-blue-600 flex items-center gap-2 mb-2"><span>🩺</span>身体有话对你说 <span>💬</span></h1>
          <p className="text-base sm:text-lg text-gray-600 font-medium text-center mb-4">用AI解读身体信号，获取个性化健康建议</p>
          <div className="w-full flex flex-col items-center gap-4">
            <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center gap-1">请选择你的身体部位 <span>👇</span></h2>
            <div className="grid grid-cols-2 gap-4 w-full">
              {BODY_PARTS.map((part) => (
                <Link
                  key={part.key}
                  href={`/quiz/${part.key}`}
                  className="flex flex-col items-center justify-center bg-gradient-to-tr from-pink-400 to-blue-400 text-white text-lg font-bold rounded-xl shadow-md py-6 hover:scale-105 active:scale-95 transition-transform focus:outline-none focus:ring-4 focus:ring-pink-200 gap-2"
                >
                  {part.image ? (
                    <span className="w-10 h-10 flex items-center justify-center">
                      <Image src={part.image} alt={part.label} width={40} height={40} />
                    </span>
                  ) : (
                    <span className="text-3xl">{part.emoji}</span>
                  )}
                  <span>{part.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
      {/* 页脚 */}
      <footer className="w-full py-4 text-center text-xs text-gray-400 bg-white border-t mt-4">
        <span>数据仅存储在本地，保护您的隐私 · Powered by Next.js & GPT-4.1</span>
      </footer>
    </div>
  );
}
