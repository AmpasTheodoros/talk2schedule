import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import OpenAIApi from "openai"

const openai = new OpenAIApi({
    apiKey: "lm-studio",
    baseURL: "http://localhost:5000/v1", 
});

const EXAMPLES = [
  {
    user: "I want to go to the dentist on March 8th, 2023 from 9am to 10:30am",
    assistant: "Dentist,datetime(2023,3,8,9,0,0),datetime(2023,3,8,10,30,0)"
  },
  {
    user: "Today is January 1st, 2024. I will meditate for 15 minutes the next two days in the morning.",
    assistant: "Meditate.datetime(2022,1,2,8,0,0).datetime(2022,1,2,8,15,0)|Meditate.datetime(2022,1,3,8,0,0).datetime(2022,1,3,8,15,0)"
  },
  {
    user: "Today is March 6th, 2024. I want to workout on Tuesday from 2pm to 4pm. I also want to workout on Thursday from noon to 2pm.",
    assistant: "Workout.datetime(2023,3,7,14,0,0).datetime(2023,3,7,16,0,0)|Workout.datetime(2023,3,9,12,0,0).datetime(2023,3,9,14,0,0)"
  },
];

export async function POST(
  req: Request
) {
  try {
      const { userId } = auth();
      const body = await req.json();
      const { messages } = body;

      if (!userId) {
          return new NextResponse("Unauthorized", { status: 500 });
      }

      if (!openai.apiKey) {
          return new NextResponse("OpenAI API Key not configured", { status: 500 });
      }

      if (!messages) {
          return new NextResponse("Messages are required", { status: 500 });
      }

      const response  = await openai.chat.completions.create({
          messages,
          model: "gpt-3.5-turbo",
      });

      return NextResponse.json(response.choices[0].message);
  } catch (err) {
      console.error(err);
      return new NextResponse("Internal Server Error", { status: 500 });
  }
}
