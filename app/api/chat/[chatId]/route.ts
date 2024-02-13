import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

export async function POST(
  request: Request,
  { params }: { params: { chatId: string } }
) {
  try {

    const { userId } = auth();
    const { messages } = await request.json();


    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!configuration.apiKey) {
      return new NextResponse("OpenAI API Key not configured.", { status: 500 });
    }

    if (!messages) {
      return new NextResponse("Messages are required", { status: 400 });
    }
    const systemMessage = {
      role: "system",
      content: "you are a financial specialist that  helps clients with their investment decisions. YOU ONLY NEED TO ANSWER QUESTIONS THAT ARE related to financial aspect. If the user asks something else, please just reply you're only capable of answering financial  related question",
    }

    const messageArray = []
    messageArray.push(systemMessage, messages)
    console.log(messageArray)
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: messageArray,
      max_tokens: 80
    });
    messageArray.length = 0;
    const formatMessage = response.data.choices[0].message
    return NextResponse.json(formatMessage);

  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}