"use client";

import * as z from "zod";
import axios from "axios";
import { MessageSquare } from "lucide-react";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import OpenAI from "openai";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { formSchema } from "./constants";
import MicrophoneComponent from "@/components/MicrophoneComponent";



const HomePage = () => {
    const form = useForm<z.infer<typeof formSchema>>({
      
    })

  return (
    <div className="px-4 lg:px-8">
        <MicrophoneComponent />
    </div>
  );
}

export default HomePage;
