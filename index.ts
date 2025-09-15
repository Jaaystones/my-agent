import { stepCountIs, streamText } from "ai";
import { google } from "@ai-sdk/google";
import { SYSTEM_PROMPT } from "./prompts";
import { 
  getFileChangesInDirectoryTool, 
  generateCommitMessageTool, 
  generateMarkdownFileTool 
} from "./tools";

//Helper function
const streamAgentOutput = async (textStream: AsyncIterable<string>) => {
    for await (const chunk of textStream) {
        process.stdout.write(chunk);
    }
};


const codeReviewAgent = async (prompt: string, maxSteps: number = 10) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      getFileChangesInDirectoryTool: getFileChangesInDirectoryTool,
      
    },
    stopWhen: stepCountIs(maxSteps),
  });

  await streamAgentOutput(result.textStream);
};

const codeCommitAgent = async (prompt: string, maxSteps: number=10) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
      generateCommitMessageTool: generateCommitMessageTool,
    },
    stopWhen: stepCountIs(maxSteps),
  });

  await streamAgentOutput(result.textStream);
};


const codeMarkdownAgent = async (prompt: string, maxSteps: number=10) => {
  const result = streamText({
    model: google("models/gemini-2.5-flash"),
    prompt,
    system: SYSTEM_PROMPT,
    tools: {
       generateMarkdownFileTool :  generateMarkdownFileTool,
    },
    stopWhen: stepCountIs(maxSteps),
  });

  await streamAgentOutput(result.textStream);
};

// Specify which directory the code review agent should review changes in your prompt

await codeReviewAgent(
  "Review the code changes in '../my-agent' directory, make your reviews and suggestions file by file",
  
);
await codeCommitAgent(
  "Generate a conventional commit message for the changes in '../my-agent' directory"
);

await codeMarkdownAgent(
  "Generate a markdown file documenting the new features at '../my-agent' directory It should include an overview, installation instructions, usage examples, and configuration options from the root directory."
);
