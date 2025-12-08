"use client";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthProvider";
import { useProject } from "@/app/components/Projects";
import { sendMessage, fetchMessages, ChatMessage } from "@/utils/chat";

// Local message type
interface Message {
  id: number;
  text: string;
  sender: string;
  timestamp: Date;
  isCurrentUser: boolean;
}

export default function Communication() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUsername, setCurrentUsername] = useState("User");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { token } = useAuth();
  const { projectId } = useProject();

  // Auto-scroll when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch messages when project changes
  useEffect(() => {
    if (projectId) loadMessages();
  }, [projectId]);

  const loadMessages = async () => {
    if (!projectId || !token) return;

    setIsLoading(true);
    setError("");

    try {
      const data = await fetchMessages(projectId, token);

      const transformed: Message[] = (data.messages || []).map(
        (msg: ChatMessage) => ({
          id: msg.id,
          text: msg.message,
          sender: msg.sender_username,
          timestamp: new Date(msg.timestamp),
          isCurrentUser: msg.sender_username === currentUsername,
        })
      );

      setMessages(transformed);
    } catch (err) {
      console.error(err);
      setError("Failed to load messages");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    if (!projectId) {
      alert("Please select a project first!");
      return;
    }

    if (userInput.trim() === "") return;

    setIsLoading(true);

    try {
      await sendMessage(userInput, projectId, currentUsername, token);

      const newMessage: Message = {
        id: Date.now(),
        text: userInput,
        sender: currentUsername,
        timestamp: new Date(),
        isCurrentUser: true,
      };

      setMessages((prev) => [...prev, newMessage]);
      setUserInput("");
    } catch (err: any) {
      alert("Failed to send message!");
    } finally {
      setIsLoading(false);
    }
  };

  // Poll every 5 seconds
  useEffect(() => {
    if (!projectId) return;

    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, [projectId, currentUsername]);

  return (
    <section className="flex flex-col h-full bg-gray-50">
      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 p-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Team Communication
            </h2>
            <p className="text-sm text-gray-600">
              {projectId
                ? `Project Chat - ID: ${projectId}`
                : "Select a project to start chatting"}
            </p>
          </div>

          <input
            type="text"
            value={currentUsername}
            onChange={(e) => setCurrentUsername(e.target.value)}
            placeholder="Your name"
            className="px-3 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {/* No project selected */}
        {!projectId && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">No Project Selected</p>
              <p className="text-sm">Select a project from sidebar</p>
            </div>
          </div>
        )}

        {/* Messages empty */}
        {projectId && messages.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-400">
            <div className="text-center">
              <p className="text-lg">No messages yet</p>
              <p className="text-sm">Start a conversation</p>
            </div>
          </div>
        )}

        {/* Render messages */}
        {projectId &&
          messages.length > 0 &&
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-md rounded-2xl px-4 py-3 shadow-sm ${
                  msg.isCurrentUser
                    ? "bg-blue-500 text-white"
                    : "bg-white text-gray-900 border"
                }`}
              >
                <span className="text-xs opacity-80 font-semibold block mb-1">
                  {msg.sender}
                </span>
                <p className="text-sm break-words">{msg.text}</p>
              </div>
            </div>
          ))}

        <div ref={messagesEndRef} />
      </div>

      {/* INPUT */}
      {projectId && (
        <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-3 rounded-xl border"
            />
            <button
              type="submit"
              disabled={isLoading || !userInput.trim()}
              className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl"
            >
              Send
            </button>
          </form>
        </div>
      )}
    </section>
  );
}
