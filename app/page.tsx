"use client";

import { useChat } from "ai/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md p-12 m-12 mx-auto ">
      {messages
        .filter((m) => m.role !== "user")
        .map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            {m.content}
          </div>
        ))}

      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="say whatever. it will be ignored."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
