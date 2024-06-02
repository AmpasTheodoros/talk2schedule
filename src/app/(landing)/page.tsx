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

  return (
    <div className="px-4 lg:px-8">
        <MicrophoneComponent />
    </div>
  );
}

export default ConversationPage;
