"use client";

import { useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import MicrophoneComponent from "@/components/MicrophoneComponent";
import { cn } from "@/lib/utils";
import { Shield } from "lucide-react";

const ConversationPage = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleVoiceInput = async (transcript: string) => {
    const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = { role: "user", content: transcript };
    const newMessages = [...messages, userMessage];
    setIsLoading(true);

    try {
      const response = await axios.post('/api/conversation', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);
    } catch (error: any) {
      toast.error("Something went wrong.");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };

  return (
    <div className="px-4 lg:px-8">
      <div className="space-y-4 mt-4">
        {isLoading && (
          <div className="p-8 rounded-lg w-full flex items-center justify-center bg-muted">
            <Shield />
          </div>
        )}
        <div className="flex flex-col-reverse gap-y-4">
          {messages.map((message, index) => (
            <div 
              key={index} 
              className={cn(
                "p-8 w-full flex items-start gap-x-8 rounded-lg",
                message.role === "user" ? "bg-white border border-black/10" : "bg-muted",
              )}
            >
              {message.role === "user" ? <Shield /> : <Shield />}
              <p className="text-sm">
                {message.content}
              </p>
            </div>
          ))}
        </div>
        <MicrophoneComponent onTranscript={handleVoiceInput} />
      </div>
    </div>
  );
}

export default ConversationPage;
