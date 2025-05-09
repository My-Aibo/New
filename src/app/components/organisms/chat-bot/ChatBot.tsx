// ChatBot.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import React from "react";
import { resolveMintParam } from "./partials/utils/tokenRegistry";
import { defaultSystemPrompt, defaultTools } from "./partials/utils/providers";

type Message = {
  role: "user" | "assistant";
  content: string | React.ReactNode;
};

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  const onSubmit = async (data: any) => {
    const userMsg = data.message.trim();
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setLoading(true);

    try {
      const res = await axios.post(
        "https://api.together.ai/v1/chat/completions",
        {
          model: "meta-llama/Llama-3.3-70B-Instruct-Turbo-Free",
          messages: [
            { role: "system", content: defaultSystemPrompt },
            { role: "user", content: userMsg },
          ],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOGETHER_AI_API_KEY}`,
          },
        }
      );

      let raw = res.data.choices[0].message.content;
      raw = raw.replace(/<think>[\s\S]*?<\/think>/g, "").trim();
      const clean = raw.replace(/```(?:json)?/g, "").trim();

      let parsed: any = null;
      try {
        parsed = JSON.parse(clean);
      } catch {}

      if (parsed?.tool && defaultTools[parsed.tool]) {
        const cfg = defaultTools[parsed.tool];
        let params = parsed.params;
        console.log("Parsed params:", params);

        // Support fallback resolution for mint/tokenAddress
        if (
          (parsed.tool === "getTokenProfile" ||
            parsed.tool === "getTokenOrders" ||
            parsed.tool === "topTokenHolders") &&
          !params.mint &&
          !params.tokenAddress &&
          params.symbol
        ) {
          const resolved = await resolveMintParam({
            symbol: params.symbol,
            pairAddress: params.pairAddress,
          });
          console.log("Resolved mint:", resolved);
          if (!resolved) {
            setMessages((prev) => [
              ...prev,
              {
                role: "assistant",
                content: `❌ Could not resolve address for input.`,
              },
            ]);
            return;
          }

          if (parsed.tool === "getTokenProfile") {
            params.pairAddress = resolved.address;
          } else if (parsed.tool === "getTokenOrders") {
            params.tokenAddress = resolved;
            params.chainId = "solana"; // optionally set default chain
          }
          params.mintAddress = resolved.address;
        }

        const result = await cfg.execute(params);
        const view = cfg.render!(result);
        setMessages((prev) => [...prev, { role: "assistant", content: view }]);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "❌ Error contacting model." },
      ]);
    } finally {
      setLoading(false);
      reset();
    }
  };

  return (
    <div className="p-4 bg-black text-white h-screen flex flex-col">
      <div className="flex-1 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`text-sm p-2 rounded ${
              msg.role === "user"
                ? "bg-blue-600 text-white ml-auto"
                : "bg-gray-800 text-white mr-auto"
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="text-gray-400 animate-pulse">Thinking...</div>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex gap-2 min-w-[500px]"
      >
        <textarea
          {...register("message")}
          className="flex-1 bg-gray-900 p-2 rounded"
          placeholder="Ask Neur… e.g. “top traders today”"
          rows={1}
        />
        <button
          className="bg-blue-600 p-2 rounded text-white"
          disabled={loading}
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default ChatBot;
