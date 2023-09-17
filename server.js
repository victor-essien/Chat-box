import express from "express";
import OpenAI from "openai";
import fetch from "node-fetch";
import bodyParser from "body-parser";
import { config } from "dotenv";
import path from "path";




const app = express();

// Serve static files from the 'public' directory
app.use(express.static(path.join(process.cwd(), "public")));


app.use(express.json());
config();
app.use(bodyParser.json());
const PORT = process.env.PORT || 3030;
const API_KEY = process.env.API_KEY;

global.messages = [
  {
    role: "system",
    content:
      "You are a helpful, empathetic, and friendly customer support specialist. You are here to help customers with their orders. You sometimes make small talk.",
  },
  {
    role: "system",
    content:
      "Additionally, you never ask the customer to upload or provide any photos as our website has no means of doing so at this time. Also, do not mention that you are a bot.",
  },
];
app.post("/api/openai", async (req, res) => {
  const { message } = req.body;

  // store user message in global message state
  const userMessage = { role: "user", content: message };

  // add to global messages list
  global.messages.push(userMessage);

  const resp = await fetch("https://api.openai.com/v1/chat/completions", {
    // model: "gpt-3.5-turbo",
    //   messages: [
    //     { "role": "user", content: requestData}
    //   ]
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: global.messages,
      // the maximum number of tokens/words the bot should return
      // in response to a given prompt
      max_tokens: 150,
    }),
  });

  if (!resp.ok) {
    // if the request was not successful, parse the error
    const error = await resp.json();

    // log the error for debugging purposes
    console.error("OpenAI API Error:", error);

    // return an error response to the client
    return res.json({ status: "error", data: null });
  }
  // parse the response from OpenAI as json
  const data = await resp.json();
  // get the bot's answer from the OpenAI API response
  const botAnswer = data?.choices?.[0]?.message?.content;

  // create the bot message object
  const botMessage = { role: "assistant", content: botAnswer };

  // store bot message in global message state
  global.messages.push(botMessage);

  return res.json({ status: "success", data: botAnswer });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
