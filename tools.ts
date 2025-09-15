import { z } from "zod";
import { tool } from "ai";
import { simpleGit } from "simple-git";
import { writeFile } from "fs/promises";

const fileChange = z.object({
    rootDir: z.string().min(1).describe("The root directory"),
});

const commitGeneration = z.object({
    rootDir: z.string().min(1).describe("The root directory to analyze for commit message"),
});

const markdownGeneration = z.object({
    filePath: z.string().min(1).describe("The path where the markdown file should be created"),
    content: z.string().min(1).describe("The content to write to the markdown file"),
    title: z.string().optional().describe("Optional title for the markdown file"),
});

type FileChange = z.infer<typeof fileChange>;
type CommitGeneration = z.infer<typeof commitGeneration>;
type MarkdownGeneration = z.infer<typeof markdownGeneration>;

const excludeFiles = ["dist", "bun.lock"]

// Function to get git diffs for files in a directory
async function getFileChangesInDirectory({rootDir}: FileChange){
    const git = simpleGit(rootDir);
    const summary = await git.diffSummary();
    const diffs: { file: string; diff: string }[] = [];

    for (const file of summary.files) {
        if (excludeFiles.includes(file.file)) continue;
        const diff = await git.diff(["--",file.file]);
        diffs.push({ file: file.file, diff });
    }
    return diffs;
}

export const getFileChangesInDirectoryTool = tool({
    description: "Gets the code changes made in given directory",
    inputSchema: fileChange,
    execute: getFileChangesInDirectory
});

// Function to generate commit message based on git changes
async function generateCommitMessage({rootDir}: CommitGeneration) {
    const git = simpleGit(rootDir);
    const summary = await git.diffSummary();
    
    if (summary.files.length === 0) {
        return { message: "No changes detected to generate commit message for" };
    }

    const changes = {
        insertions: summary.insertions,
        deletions: summary.deletions,
        filesChanged: summary.files.length,
        files: summary.files.map(file => ({
            file: file.file,
            insertions: 'insertions' in file ? file.insertions : 0,
            deletions: 'deletions' in file ? file.deletions : 0,
            binary: file.binary
        }))
    };

    // Analyze file types and changes to suggest commit type
    const hasNewFiles = summary.files.some(file => 
        ('insertions' in file ? file.insertions : 0) > 0 && 
        ('deletions' in file ? file.deletions : 0) === 0
    );
    const hasDeletedFiles = summary.files.some(file => 
        ('deletions' in file ? file.deletions : 0) > 0 && 
        ('insertions' in file ? file.insertions : 0) === 0
    );
    const hasConfigChanges = summary.files.some(file => 
        file.file.includes('config') || 
        file.file.includes('.json') || 
        file.file.includes('.yaml') || 
        file.file.includes('.yml')
    );
    const hasDocChanges = summary.files.some(file => 
        file.file.includes('README') || 
        file.file.includes('.md') || 
        file.file.includes('doc')
    );

    return {
        changes,
        suggestions: {
            hasNewFiles,
            hasDeletedFiles,
            hasConfigChanges,
            hasDocChanges
        }
    };
}

export const generateCommitMessageTool = tool({
    description: "Analyzes git changes and generates conventional commit message suggestions",
    inputSchema: commitGeneration,
    execute: generateCommitMessage
});

// Function to generate markdown file
async function generateMarkdownFile({filePath, content, title}: MarkdownGeneration) {
    try {
        let markdownContent = content;
        
        // Add title if provided
        if (title) {
            markdownContent = `# ${title}\n\n${content}`;
        }
        
        await writeFile(filePath, markdownContent, 'utf-8');
        
        return {
            success: true,
            filePath,
            message: `Markdown file created successfully at ${filePath}`,
            contentLength: markdownContent.length
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error occurred',
            filePath
        };
    }
}

export const generateMarkdownFileTool = tool({
    description: "Creates a markdown file with specified content at the given path",
    inputSchema: markdownGeneration,
    execute: generateMarkdownFile
});