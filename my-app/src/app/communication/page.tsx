"use client";
import { useState } from "react";

export default function Communication() {
  // step1: user input box
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState([]);

  function handleSubmit() {
    if (userInput.trim() !== "") {
      setMessages([...messages, userInput]); // add new message
      setUserInput("");
    }
  }

  return (
    // user input and what they type we need to show it on the window as color if i type myself it should be blue if someone else black white text

    <section className="flex">
      <div className="absolute flex bottom-0 left-0 w-full p-4 bg-gray-500">
        <input
          type="text"
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Enter your Message"
          value={userInput}
          className="w-full p-3 rounded outline-none border-none text-black text-xl"
        />
        <button
          className="font-bold text-xl mr-4 cursor-pointer hover:scale-110 transition hover:bg-red-600 transition-all p-4 rounded-lg"
          onClick={handleSubmit}
        >
          Sumbit
        </button>
      </div>
      <div className="flex flex-col items-end w-full p-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className="bg-blue-500 text-white p-3 rounded-xl max-w-xs mb-2"
          >
            {msg}
          </div>
        ))}
      </div>
    </section>
  );
}
