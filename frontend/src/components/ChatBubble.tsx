import React from "react";
import { ShieldCheck, CheckCheck } from "lucide-react";
import { Message } from "@/types";
import ReactMarkdown from "react-markdown";

interface ChatBubbleProps {
  message: Message;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message }) => {
  const isUser = message.sender === "user";

  // USER MESSAGE
  if (isUser) {
    return (
      <div
        id={`chat-msg-${message.id}`}
        className="flex flex-col items-end mb-4"
      >
        <div className="max-w-md md:max-w-xl bg-teal-600 dark:bg-teal-500 text-white dark:text-slate-950 px-5 py-3.5 rounded-2xl rounded-tr-md shadow-lg shadow-teal-900/10 text-sm md:text-base leading-relaxed break-words">
          <div className="prose prose-sm prose-invert max-w-none prose-p:my-1">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-500 mr-1">
          <span>{message.timestamp}</span>
          <CheckCheck className="w-3.5 h-3.5 text-cyan-500" />
        </div>
      </div>
    );
  }

  // AI MESSAGE
  return (
    <div
      id={`chat-msg-${message.id}`}
      className="flex items-start gap-3 mb-4"
    >
      <div className="w-11 h-11 rounded-2xl bg-teal-50 dark:bg-teal-950/40 border border-teal-200 dark:border-teal-800/60 flex items-center justify-center text-teal-700 dark:text-teal-300 shrink-0">
        <ShieldCheck className="w-6 h-6 text-teal-600 dark:text-teal-400" />
      </div>

      <div className="flex flex-col items-start max-w-md md:max-w-2xl">
        <div className="bg-white/90 dark:bg-[#0b1730] border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 px-5 py-4 rounded-2xl rounded-tl-md shadow-lg text-sm md:text-base leading-relaxed">
          {message.isTyping ? (
            <div className="flex items-center gap-1.5 py-1 px-1">
              <span
                className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce"
                style={{ animationDelay: "0ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce"
                style={{ animationDelay: "150ms" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-teal-600 dark:bg-teal-400 animate-bounce"
                style={{ animationDelay: "300ms" }}
              />
            </div>
          ) : (
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-strong:text-teal-700 dark:prose-strong:text-teal-300">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 dark:text-slate-500 ml-1">
          <span>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};