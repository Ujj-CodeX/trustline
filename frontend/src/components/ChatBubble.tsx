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
        <div className="max-w-md md:max-w-xl bg-cyan-700 dark:bg-cyan-800 text-white px-5 py-3 rounded-2xl rounded-tr-xs shadow-xs text-sm md:text-base leading-relaxed break-words">
          <div className="prose prose-sm prose-invert max-w-none prose-p:my-1">
            <ReactMarkdown>{message.text}</ReactMarkdown>
          </div>
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 dark:text-slate-500 mr-1">
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
      <div className="w-12 h-12 rounded-xl bg-cyan-50 dark:bg-cyan-950/60 border border-cyan-100 dark:border-cyan-800/60 flex items-center justify-center text-cyan-700 dark:text-cyan-400 shrink-0">
        <ShieldCheck className="w-7 h-7 text-cyan-600 dark:text-cyan-400" />
      </div>

      <div className="flex flex-col items-start max-w-md md:max-w-2xl">
        <div className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 px-5 py-3.5 rounded-2xl rounded-tl-xs shadow-xs text-sm md:text-base leading-relaxed">
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
            <div className="prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-strong:text-cyan-700 dark:prose-strong:text-cyan-300">
              <ReactMarkdown>{message.text}</ReactMarkdown>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-400 dark:text-slate-500 ml-1">
          <span>{message.timestamp}</span>
        </div>
      </div>
    </div>
  );
};