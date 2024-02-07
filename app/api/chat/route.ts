import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

// Handle the POST request (but for local testing you can change it to GET)
export async function POST(req: Request) {
  const { messages } = await req.json();

  // Define the messages. You can use role: "system", but it's not required.
  // You can simplify it and even chain responses in this table if you know all the messages in advance.
  const messages1 = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: "What is the typical weather in London?",
    },
  ];

  // Ask OpenAI for a streaming chat completion given the prompt
  const response1 = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: false, // first call is not streamed
    messages: messages1,
  });

  const result1 = response1.choices[0]; // we take the response from the first call

  const messages2 = [
    {
      role: "system",
      content: "You are a helpful assistant.",
    },
    {
      role: "user",
      content: `Given the prompt "What is the typical weather in London?" the response is: ${result1} now tell me if it's a good weather or not for a person with sun allery?`,
    },
  ];

  // last call let's stream it
  const response2 = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    stream: true, // <--- This is the important part
    messages: messages2,
  });

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response2);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}
