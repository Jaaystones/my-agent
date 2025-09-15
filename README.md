# my-agent

An intelligent code review agent powered by Google's Gemini AI model through the Vercel AI SDK. This TypeScript project automatically analyzes git changes in directories and provides expert-level code review feedback with actionable suggestions.

## Features

- 🤖 **AI-Powered Code Reviews**: Leverages Google's Gemini 2.5 Flash model for intelligent code analysis
- 📁 **Directory-Based Analysis**: Reviews all changed files in a specified directory
- 🔧 **Git Integration**: Automatically detects and analyzes git diffs
- 🛠️ **Tool-Based Architecture**: Uses Vercel AI SDK's tool system for structured operations
- 📝 **Expert Feedback**: Provides detailed reviews covering correctness, clarity, maintainability, and security
- � **Commit Message Generation**: Creates conventional commit messages based on analyzed changes
- 📄 **Markdown File Generation**: Automatically creates well-structured documentation files
- �🚀 **Fast Runtime**: Built with Bun for optimal performance

## Prerequisites

Before getting started, ensure you have the following installed:

### 1. Install Bun

Bun is a fast all-in-one JavaScript runtime that serves as both package manager and runtime for this project.

**On Linux/macOS:**

```bash
curl -fsSL https://bun.sh/install | bash
```

**On Windows:**

```bash
powershell -c "irm bun.sh/install.ps1 | iex"
```

Verify installation:

```bash
bun --version
```

### 2. Get Google AI API Key

1. Visit [Google AI Studio](https://aistudio.google.com/)
2. Create a new API key
3. Set up your environment variable:

```bash
export GOOGLE_API_KEY="your-api-key-here"
```

## Installation

1. **Clone the repository:**

```bash
git clone <your-repo-url>
cd my-agent
```

2. **Install dependencies:**

```bash
bun install
```

The project uses the following key dependencies:

- `ai` - Vercel AI SDK for building AI applications
- `@ai-sdk/google` - Google AI provider for Gemini models
- `simple-git` - Git operations in Node.js
- `zod` - TypeScript-first schema validation

## Usage

### Basic Usage

Run the code review agent:

```bash
bun run index.ts
```

### Customizing the Review Target

By default, the agent reviews changes in the `../my-agent` directory. To review a different directory, modify the prompt in `index.ts`:

```typescript
await codeReviewAgent(
  "Review the code changes in '/path/to/your/project' directory, make your reviews and suggestions file by file"
);
```

### Using New Features

#### Commit Message Generation

Ask the agent to generate commit messages based on your changes:

```typescript
await codeReviewAgent(
  "Generate a conventional commit message for the changes in '../my-agent' directory"
);
```

#### Markdown Documentation Generation

Request documentation creation:

```typescript
await codeReviewAgent(
  "Create a markdown file documenting the new authentication feature at './docs/auth.md'"
);
```

### Example Output

The agent will analyze git diffs and provide structured feedback like:

```
Reviewing file: src/utils/helper.ts
✅ Good use of TypeScript interfaces for type safety
⚠️  Consider extracting this complex logic into smaller, testable functions
🔒 Security: Validate user input before processing
📈 Performance: This loop could be optimized using map() instead of forEach()
```

For commit message generation:

```
Based on the changes analyzed, I suggest this commit message:
feat(tools): add commit message generation and markdown file creation

- Add generateCommitMessageTool for conventional commit suggestions
- Add generateMarkdownFileTool for documentation creation
- Update system prompt to include new capabilities
- Follow existing tool pattern with zod schemas
```

For markdown generation:

```
✅ Created documentation file at ./docs/feature.md
📄 Content: 1,247 characters
📋 Includes: headings, code examples, and usage instructions
```

## Project Structure

```
my-agent/
├── index.ts          # Main application entry point
├── prompts.ts        # System prompts and AI instructions
├── tools.ts          # AI tools and git integration
├── package.json      # Dependencies and scripts
├── tsconfig.json     # TypeScript configuration
├── bun.lock         # Lock file for dependencies
└── README.md        # This file
```

## Configuration

### AI Model Configuration

The project uses Google's Gemini 2.5 Flash model. You can modify the model in `index.ts`:

```typescript
const result = streamText({
  model: google("models/gemini-2.5-flash"), // Change model here
  // ... other options
});
```

### Review Scope Customization

Modify `SYSTEM_PROMPT` in `prompts.ts` to customize the review focus areas:

- Correctness and logic errors
- Code clarity and readability
- Maintainability and structure
- Consistency with conventions
- Performance optimizations
- Security vulnerabilities
- Testing coverage
- Scalability considerations

### File Exclusions

Update the `excludeFiles` array in `tools.ts` to exclude specific files from review:

```typescript
const excludeFiles = ["dist", "bun.lock", "node_modules", "*.min.js"];
```

## Development

### Running in Development Mode

```bash
bun run index.ts
```

### Type Checking

```bash
bun run tsc --noEmit
```

### Adding New Tools

Create new tools in `tools.ts` following the pattern:

```typescript
export const yourNewTool = tool({
  description: "Description of what your tool does",
  inputSchema: z.object({
    param: z.string().describe("Parameter description"),
  }),
  execute: yourToolFunction,
});
```

## API Reference

### Core Functions

- `codeReviewAgent(prompt: string)` - Main function that orchestrates the code review
- `getFileChangesInDirectoryTool` - Tool that retrieves git diffs for analysis
- `generateCommitMessageTool` - Tool that analyzes changes and suggests conventional commit messages
- `generateMarkdownFileTool` - Tool that creates markdown files with specified content

### Tool Schemas

#### getFileChangesInDirectoryTool

```typescript
{
  rootDir: string; // The root directory to analyze
}
```

#### generateCommitMessageTool

```typescript
{
  rootDir: string; // The root directory to analyze for commit message generation
}
```

#### generateMarkdownFileTool

```typescript
{
  filePath: string // The path where the markdown file should be created
  content: string  // The content to write to the markdown file
  title?: string   // Optional title for the markdown file
}
```

### Environment Variables

- `GOOGLE_API_KEY` - Required for accessing Google's Gemini API

## Troubleshooting

### Common Issues

1. **API Key Not Set**

   ```
   Error: API key not configured
   ```

   Solution: Ensure `GOOGLE_API_KEY` environment variable is set

2. **No Git Changes Found**

   ```
   No changes detected in directory
   ```

   Solution: Ensure you have uncommitted changes in the target directory

3. **Permission Errors**
   ```
   Permission denied accessing directory
   ```
   Solution: Check directory permissions and ensure the path is correct

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking: `bun run tsc --noEmit`
5. Test your changes
6. Submit a pull request

## License

This project is private and intended for personal/internal use.

## Acknowledgments

- Built with [Bun](https://bun.com) - Fast all-in-one JavaScript runtime
- Powered by [Vercel AI SDK](https://sdk.vercel.ai/) - The AI toolkit for TypeScript
- Uses [Google Gemini AI](https://ai.google.dev/) - Advanced language model for code analysis
- Git operations via [simple-git](https://github.com/steveukx/git-js) - Git commands in Node.js
