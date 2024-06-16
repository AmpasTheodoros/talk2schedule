"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "./constants";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

const ConversationComponent = () => {
  const router = useRouter();
  const [messages, setMessages] = useState<OpenAI.Chat.CreateChatCompletionRequestMessage[]>([]);
  const [summaries, setSummaries] = useState<string[]>([]);
  const [icsFileUrl, setIcsFileUrl] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: ""
    }
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const currentDateTime = new Date().toISOString();
      const userMessage: OpenAI.Chat.CreateChatCompletionRequestMessage = { role: "user", content: `Current date and time: ${currentDateTime}. Can you give me a quick summary of the task and the dates of this using bullet points? ${values.prompt}` };
      const newMessages = [...messages, userMessage];
      
      const response = await axios.post('/api/conversation', { messages: newMessages });
      setMessages((current) => [...current, userMessage, response.data]);

      const newSummary = `- ${values.prompt}`;
      setSummaries((current) => [...current, newSummary]);

      // Generate .ics file content
      const event = {
        title: "Generated Event",
        start: new Date(),
        end: new Date(new Date().getTime() + 60 * 60 * 1000),
        description: summaries.concat(newSummary).join("\n"),
      };

      const icsContent = generateIcs(event);
      const blob = new Blob([icsContent], { type: "text/calendar" });
      const url = URL.createObjectURL(blob);
      setIcsFileUrl(url);

      form.reset();
    } catch (error: any) {
      console.error(error);
      if (error?.response?.status === 403) {
        toast.error("Something went good.");
      } else {
        toast.error("Something went wrong.");
      }
    } finally {
      router.refresh();
    }
  };

  const generateIcs = (event: { title: string; start: Date; end: Date; description: string }) => {
    return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//hacksw/handcal//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${uuidv4()}
DTSTAMP:${toIsoString(new Date())}
DTSTART:${toIsoString(event.start)}
DTEND:${toIsoString(event.end)}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;
  };

  const toIsoString = (date: Date) => {
    const pad = (num: number) => (num < 10 ? "0" + num : num);
    return date.getUTCFullYear() +
      pad(date.getUTCMonth() + 1) +
      pad(date.getUTCDate()) +
      "T" +
      pad(date.getUTCHours()) +
      pad(date.getUTCMinutes()) +
      pad(date.getUTCSeconds()) +
      "Z";
  };

  return (
    <div>
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)} 
          className="
            rounded-lg 
            border 
            w-full 
            p-4 
            px-3 
            md:px-6 
            focus-within:shadow-sm
            grid
            grid-cols-12
            gap-2
          "
        >
          <FormField
            name="prompt"
            render={({ field }) => (
              <FormItem className="col-span-12 lg:col-span-10">
                <FormControl className="m-0 p-0">
                  <Input
                    className="border-0 outline-none focus-visible:ring-0 focus-visible:ring-transparent"
                    disabled={isLoading} 
                    placeholder="How do I calculate the radius of a circle?" 
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className="col-span-12 lg:col-span-2 w-full" type="submit" disabled={isLoading} size="icon">
            Generate
          </Button>
        </form>
      </Form>
      {summaries.length > 0 && (
        <div className="mt-4">
          <h2>Summary</h2>
          <ul>
            {summaries.map((summary, index) => (
              <li key={index}>{summary}</li>
            ))}
          </ul>
          {icsFileUrl && (
            <a href={icsFileUrl} download="event.ics">
              Download .ics file
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ConversationComponent;
