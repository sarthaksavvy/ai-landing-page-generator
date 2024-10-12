import fs from "fs";
import OpenAI from "openai";
import tools from "./tools";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function getOpenAIResponse(messages) {
  return await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `You are an expert in next.js and react with over 10 years of experience. Use the prompt given by user to create new files in the app directory. You can use the tools provided to you to create new files in the app directory.
          Rules:
          1. Use tailwindcss for styling and do not use any external libraries.
          2. Design the page in a way that it is responsive and mobile friendly.
          3. Design content should be centered and text color should be white if creating dark mode and black if creating light mode.
          4. If required then use images from unsplash with valid url.
          5. Create the page called {filename}/page.js inside app directory
          6. finally return the url as http://localhost:3000/{useremail} in json format without any natural language.
          7. If the prompt is not about creating landing page then return "{error: 'invalid prompt'}" in json format without any natural language.
          8. At the end please verify the code you have generated for any html or javascript or any other syntax error.
          `,
      },
      ...messages,
    ],
    tools: tools,
  });
}

export const getToolResult = (tool_call) => {
  const args = JSON.parse(tool_call.function.arguments);
  const filename = args.filename;
  const content = args.content;
  //javascript create file along with directory if not exist
  // check if directory exists
  if (!fs.existsSync(`app/${filename}`)) {
    fs.mkdirSync(`app/${filename}`, { recursive: true });
  }

  fs.writeFileSync(`app/${filename}/page.js`, content);

  return `File ${filename} created successfully`;
};
