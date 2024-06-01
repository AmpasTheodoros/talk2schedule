import { NextApiRequest, NextApiResponse } from 'next';
import { Configuration, OpenAIApi } from 'openai';
import { ICalCalendar, ICalEventDateTime } from 'ical-generator';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const EXAMPLES = [
  {
    user: "I want to go to the dentist on March 8th, 2023 from 9am to 10:30am",
    assistant: "Dentist,datetime(2023,3,8,9,0,0),datetime(2023,3,8,10,30,0)"
  },
  {
    user: "Today is January 1st, 2022. I will meditate for 15 minutes the next two days in the morning.",
    assistant: "Meditate.datetime(2022,1,2,8,0,0).datetime(2022,1,2,8,15,0)|Meditate.datetime(2022,1,3,8,0,0).datetime(2022,1,3,8,15,0)"
  },
  {
    user: "Today is March 6th, 2023. I want to workout on Tuesday from 2pm to 4pm. I also want to workout on Thursday from noon to 2pm.",
    assistant: "Workout.datetime(2023,3,7,14,0,0).datetime(2023,3,7,16,0,0)|Workout.datetime(2023,3,9,12,0,0).datetime(2023,3,9,14,0,0)"
  },
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests are allowed' });
  }

  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ success: false, message: 'No text provided' });
  }

  const context = EXAMPLES.flatMap(({ user, assistant }) => [
    { role: 'user', content: user },
    { role: 'assistant', content: assistant },
  ]);

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [...context, { role: 'user', content: text }],
      temperature: 0,
      max_tokens: 200,
    });

    const responseText = response.data.choices[0].message?.content || '';
    const calendar = new ICalCalendar();

    responseText.split('|').forEach(line => {
      const [summary, start, end] = line.split('.');
      const event = calendar.createEvent({
        summary,
        start: eval(start) as ICalEventDateTime,
        end: eval(end) as ICalEventDateTime,
      });
    });

    const calendarPath = path.join(process.cwd(), 'public', 'test.ics');
    fs.writeFileSync(calendarPath, calendar.toString());

    return res.status(200).json({ success: true, message: 'Calendar created successfully', file_path: '/test.ics' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
