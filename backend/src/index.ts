
import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { getSystemPrompt, BASE_PROMPT, SIMPLE_SYSTEM_PROMPT } from "./prompts.js";
import type { TextBlock } from "@anthropic-ai/sdk/resources";
import { basePrompt as nodebasePrompt } from "./default/node.js";
import { basePrompt as reactbasePrompt } from "./default/react.js";
import { connectDatabase } from "./config/database.js";
import projectRoutes from "./routes/projects.js";

dotenv.config();

// Function to combine React and Node templates for fullstack projects
function combineTemplates(reactTemplate: string, nodeTemplate: string): string {
    // Extract the React template content
    const reactContent = reactTemplate.replace('<boltArtifact id="project-import" title="Project Files">', '')
                                    .replace('</boltArtifact>', '');
    
    // Extract the Node template content  
    const nodeContent = nodeTemplate.replace('<boltArtifact id="project-import" title="Project Files">', '')
                                  .replace('</boltArtifact>', '');
    
    // Combine both templates with proper structure for fullstack
    return `<boltArtifact id="project-import" title="Project Files">
${reactContent}
${nodeContent}

<boltAction type="file" filePath="README.md"># Fullstack Application

This is a fullstack application with React frontend and Node.js backend.

## Project Structure

\`\`\`
├── frontend/          # React + TypeScript + Vite
├── backend/           # Node.js + Express
└── README.md
\`\`\`

## Getting Started

### Backend Setup
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`

### Frontend Setup  
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

## Features

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Node.js + Express + CORS
- **Communication**: API integration between frontend and backend
- **Hot Reload**: Both frontend and backend support hot reloading

## Development

The frontend and backend can be developed independently and integrated via API calls.
</boltAction>

</boltArtifact>`;
}




const app = express();

// CORS configuration for Vercel, ngrok, and local development
const allowedOrigins = [
    'https://sitesmith-three.vercel.app',  // Your Vercel domain
    'https://ludie-ectypal-deloras.ngrok-free.dev',   // Your ngrok URL
    'http://localhost:8080',              // Local development
    'http://localhost:5173'               // Alternative local port
];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));

// Initialize AI clients
const anthropic = new Anthropic({
  timeout: 600000, // 10 minutes timeout
  maxRetries: 3
});
const openai = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY,
  baseURL: 'https://integrate.api.nvidia.com/v1',
  timeout: 600000, // 10 minutes timeout (increased from 60 seconds)
  maxRetries: 3, // Increased retry attempts
});

// AI Provider: 'nvidia' (default, free) or 'claude' (premium)
const AI_PROVIDER = process.env.AI_PROVIDER || 'nvidia';

// Connect to MongoDB
connectDatabase();

// Increase body parser limits for large conversation histories and projects
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/projects', projectRoutes);

// Simple template endpoint
app.post("/template", async (req, res) => {
    const prompt = req.body.prompt;
    const provider = req.body.provider || AI_PROVIDER;
    
    try {
        console.log(`🎯 Template request for "${prompt}" using ${provider}`);
        
        // Step 1: Ask AI to classify the project type
        let projectType: string;
        
        const classificationPrompt = `Analyze this request and classify it as exactly one word:

- 'react' - Frontend-only apps (todo lists, dashboards, calculators, portfolios, landing pages, etc.)
- 'node' - Backend-only apps (APIs, servers, CLI tools, etc.) 
- 'fullstack' - Apps that explicitly need both frontend AND backend (user authentication, databases, real-time chat, etc.)

For simple apps like "todo", "calculator", "dashboard" - choose 'react'.
Only choose 'fullstack' if the user explicitly mentions needing backend/API/database.

Return exactly one word: react, node, or fullstack.`;

        if (provider === "claude") {
            const response = await anthropic.messages.create({
                messages: [{ role: "user", content: prompt }],
                model: "claude-sonnet-4-5",
                max_tokens: 200,
                system: classificationPrompt,
            });
            projectType = (response.content[0] as TextBlock).text.trim().toLowerCase();
        } else {
            const response = await openai.chat.completions.create({
                model: "qwen/qwen3-coder-480b-a35b-instruct",
                messages: [
                    {
                        role: "system",
                        content: classificationPrompt,
                    },
                    { role: "user", content: prompt },
                ],
                temperature: 0.1,
                max_tokens: 200,
            });
            projectType = (response.choices[0]?.message?.content || "react").trim().toLowerCase();
        }
        
        // Simple fallback for common frontend-only apps
        const frontendKeywords = ['todo', 'calculator', 'dashboard', 'portfolio', 'landing', 'homepage', 'website', 'ui', 'component'];
        const lowerPrompt = prompt.toLowerCase();
        if (frontendKeywords.some(keyword => lowerPrompt.includes(keyword)) && !lowerPrompt.includes('api') && !lowerPrompt.includes('backend') && !lowerPrompt.includes('database')) {
            projectType = 'react';
            console.log(`🔧 Override: Simple "${prompt}" app -> React`);
        }
        
        console.log(`🎯 Final project type: ${projectType}`);
        
        // Step 2: Generate appropriate templates based on project type
        let uiPrompts: string[] = [];
        
        if (projectType === "react") {
            // Load React template
            uiPrompts = [reactbasePrompt];
        } else if (projectType === "node") {
            // Load Node template
            uiPrompts = [nodebasePrompt];
        } else if (projectType === "fullstack") {
            // Generate two folders: frontend and backend
            // Load React base prompt inside frontend folder
            const frontendPrompt = reactbasePrompt.replace(
                /filePath="([^"]+)"/g,
                'filePath="frontend/$1"'
            );
            
            // Load Node base prompt inside backend folder  
            const backendPrompt = nodebasePrompt.replace(
                /filePath="([^"]+)"/g,
                'filePath="backend/$1"'
            );
            
            // Combine both prompts
            const combinedPrompt = frontendPrompt.replace(
                '</boltArtifact>',
                ''
            ) + backendPrompt.replace(
                '<boltArtifact id="project-import" title="Project Files">',
                ''
            );
            
            uiPrompts = [combinedPrompt];
        } else {
            // Default to React
            console.log(`⚠️ Unknown project type "${projectType}", defaulting to React`);
            uiPrompts = [reactbasePrompt];
        }
        
        console.log(`✅ Template generated for ${projectType}`);
        
        res.json({
            prompts: [],
            uiprompts: uiPrompts,
        });
        
    } catch (error) {
        console.error('❌ Template endpoint error:', error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error processing template request", error: errorMessage });
    }
});


// Chat and code modification endpoint
app.post("/chat", async (req, res) => {
    let messages = req.body.messages;
    const provider = req.body.provider || AI_PROVIDER;
    let useStreaming = req.body.stream || false;
    
    // Enable streaming if explicitly requested or if Accept header indicates streaming preference
    const isStreamingRequest = req.body.stream || 
                               req.body.realTimeStream || 
                               req.headers.accept === 'text/plain' ||
                               req.url.includes('stream');
    
    // Force streaming for NVIDIA by default (can be overridden by setting stream: false)
    if (provider === "nvidia" && req.body.stream !== false) {
        useStreaming = true;
    }
    
    console.log("[CHAT ENDPOINT CALLED]");
    console.log("Provider:", provider);
    console.log("Messages count:", messages.length);
    console.log("Streaming requested:", isStreamingRequest);
    console.log("Use streaming:", useStreaming);

    // --- Inject react/node/fullstack base prompt for NVIDIA ---
    if (provider === "nvidia") {
        // Try to infer project type from the latest user message or existing conversation
        let projectType = "react"; // default
        const conversationText = messages.map((m: any) => m.content).join(" ").toLowerCase();
        
        // Enhanced project type detection
        if (conversationText.includes("fullstack") || 
            (conversationText.includes("backend") && conversationText.includes("frontend")) ||
            (conversationText.includes("api") && conversationText.includes("react")) ||
            (conversationText.includes("server") && conversationText.includes("client"))) {
            projectType = "fullstack";
        } else if (conversationText.includes("node") || conversationText.includes("backend") || 
                   conversationText.includes("api") || conversationText.includes("server")) {
            projectType = "node";
        }
        
        // Import base prompts
        const { basePrompt: reactbasePrompt } = await import("./default/react.js");
        const { basePrompt: nodebasePrompt } = await import("./default/node.js");
        
        let basePrompt;
        if (projectType === "fullstack") {
            // Combine React and Node templates for fullstack projects
            basePrompt = combineTemplates(reactbasePrompt, nodebasePrompt);
        } else if (projectType === "node") {
            basePrompt = nodebasePrompt;
        } else {
            basePrompt = reactbasePrompt;
        }
        // Prepend as a system message
        messages = [
            { role: "system", content: basePrompt },
            ...messages
        ];
        console.log(`[CHAT] Injected ${projectType} base prompt as system message.`);
    }
    try {
        if (provider === "claude") {
            if (isStreamingRequest) {
                // Claude streaming support
                res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                res.setHeader('Transfer-Encoding', 'chunked');
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                res.setHeader('Cache-Control', 'no-cache');
                res.setHeader('Connection', 'keep-alive');

                try {
                    const stream = await anthropic.messages.create({
                        messages,
                        model: "claude-sonnet-4-5",
                        max_tokens: 16384,
                        system: getSystemPrompt(),
                        stream: true
                    });

                    let hasResponded = false;
                    for await (const chunk of stream) {
                        if (res.destroyed) {
                            console.log('❌ Client disconnected during Claude streaming');
                            break;
                        }

                        if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
                            try {
                                res.write(chunk.delta.text);
                                hasResponded = true;
                            } catch (writeError) {
                                console.error('❌ Error writing Claude chunk:', writeError);
                                break;
                            }
                        }
                    }

                    if (!res.destroyed) {
                        res.end();
                    }
                    console.log('✅ Claude streaming completed');

                } catch (claudeError) {
                    console.error('Claude streaming error:', claudeError);
                    if (!res.destroyed) {
                        res.status(500).json({ 
                            error: 'Claude streaming failed', 
                            message: claudeError instanceof Error ? claudeError.message : 'Unknown Claude streaming error'
                        });
                    }
                }
            } else {
                // Non-streaming Claude response
                const response = await anthropic.messages.create({
                    messages,
                    model: "claude-sonnet-4-5",
                    max_tokens: 16384, // Increased from 8000 to 16384 tokens for larger projects
                    system: getSystemPrompt(),
                });
                const responseText = (response.content[0] as TextBlock)?.text;
                res.json({ response: responseText });
            }
        } else {
            const systemPrompt = getSystemPrompt();
            const formattedMessages = [
                { role: "system" as const, content: systemPrompt },
                ...messages.map((msg: any) => ({
                    role: msg.role as "user" | "assistant",
                    content: msg.content,
                })),
            ];
            try {
                if (isStreamingRequest) {
                    // Real-time streaming response with proper error handling
                    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
                    res.setHeader('Transfer-Encoding', 'chunked');
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
                    res.setHeader('Cache-Control', 'no-cache');
                    res.setHeader('Connection', 'keep-alive');

                    let hasResponded = false;
                    let lastChunkTime = Date.now();
                    
                    // Heartbeat mechanism to prevent connection drops
                    const heartbeatInterval = setInterval(() => {
                        const now = Date.now();
                        if (now - lastChunkTime > 30000 && !res.destroyed) { // 30 seconds
                            try {
                                res.write('\n'); // Send newline as heartbeat
                                lastChunkTime = now;
                            } catch (heartbeatError) {
                                console.error('Heartbeat error:', heartbeatError);
                                clearInterval(heartbeatInterval);
                            }
                        }
                    }, 10000); // Check every 10 seconds

                    try {
                        const completion = await openai.chat.completions.create({
                            model: "qwen/qwen3-coder-480b-a35b-instruct",
                            messages: formattedMessages,
                            temperature: 0.7,
                            top_p: 0.8,
                            max_tokens: 64000, // Increased to 64K for larger projects with multiple components
                            stream: true
                        });

                        let totalChunks = 0;
                        let totalChars = 0;
                        
                        for await (const chunk of completion) {
                            if (res.destroyed) {
                                console.log('❌ Client disconnected, stopping stream');
                                console.log(`  - Streamed ${totalChunks} chunks, ${totalChars} characters before disconnect`);
                                break;
                            }
                            
                            const delta = chunk.choices[0]?.delta;
                            if (delta?.content) {
                                try {
                                    res.write(delta.content);
                                    hasResponded = true;
                                    lastChunkTime = Date.now();
                                    totalChunks++;
                                    totalChars += delta.content.length;
                                } catch (writeError) {
                                    console.error('❌ Error writing chunk:', writeError);
                                    break;
                                }
                            }
                            
                            // Check for finish_reason
                            if (chunk.choices[0]?.finish_reason) {
                                console.log('🏁 Stream finished with reason:', chunk.choices[0].finish_reason);
                                if (chunk.choices[0].finish_reason === 'length') {
                                    console.log('⚠️ WARNING: Response was truncated due to max_tokens limit!');
                                }
                            }
                        }
                        
                        console.log('✅ Streaming completed');
                        console.log(`  - Total chunks: ${totalChunks}`);
                        console.log(`  - Total characters: ${totalChars}`);
                        
                        clearInterval(heartbeatInterval);
                        
                        if (!res.destroyed) {
                            res.end();
                        }
                    } catch (streamError) {
                        clearInterval(heartbeatInterval);
                        console.error('Streaming error:', streamError);
                        if (!hasResponded && !res.destroyed) {
                            res.status(500).json({ 
                                error: 'Streaming failed', 
                                message: streamError instanceof Error ? streamError.message : 'Unknown streaming error'
                            });
                        }
                    }
                } else if (useStreaming) {
                    // Collect full response before sending (current behavior)
                    const completion = await openai.chat.completions.create({
                        model: "qwen/qwen3-coder-480b-a35b-instruct",
                        messages: formattedMessages,
                        temperature: 0.7,
                        top_p: 0.8,
                        max_tokens: 64000, // Increased to 64K for larger projects
                        stream: true
                    });
                    let fullResponse = "";
                    for await (const chunk of completion) {
                        const delta = chunk.choices[0]?.delta;
                        if (delta?.content) {
                            fullResponse += delta.content;
                        }
                    }
                    res.json({ response: fullResponse });
                } else {
                    const response = await openai.chat.completions.create({
                        model: "qwen/qwen3-coder-480b-a35b-instruct",
                        messages: formattedMessages,
                        temperature: 0.7,
                        top_p: 0.8,
                        max_tokens: 64000 // Increased to 64K for larger projects
                    });
                    const responseContent = response.choices[0]?.message?.content || "";
                    res.json({ response: responseContent });
                }
            } catch (nvidiaError) {
                if (
                    nvidiaError instanceof Error &&
                    (nvidiaError.message.includes("timeout") ||
                        nvidiaError.message.includes("timed out"))
                ) {
                    res.status(504).json({
                        message:
                            "Request timeout - NVIDIA API is taking too long to respond. Try again or switch to Claude.",
                        error: "Timeout",
                        suggestion: "Switch to Claude provider for more reliable responses",
                    });
                } else {
                    res.status(500).json({
                        message: "NVIDIA API error",
                        error: nvidiaError instanceof Error ? nvidiaError.message : "Unknown error",
                        suggestion: "Try switching to Claude provider",
                    });
                }
                return;
            }
        }
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ message: "Error processing chat request", error: errorMessage });
    }
});

// app.post("/chat",async (req,res)=>{
//     const messages=req.body.messages;
//     console.log('Chat request received with', messages.length, 'messages');
    
//     try {
//         const response = await anthropic.messages.create({
//             messages: messages,
//             model: "claude-sonnet-4-5",
//             max_tokens: 12000,
//             system: getSystemPrompt()
//         });
        
//         console.log('Chat response received');
//         res.json({
//             response: (response.content[0] as TextBlock)?.text
//         });
//     } catch (error) {
//         console.error('Error in chat endpoint:', error);
//         const errorMessage = error instanceof Error ? error.message : 'Unknown error';
//         res.status(500).json({ message: "Error processing chat request", error: errorMessage });
//     }
// });

// Error feedback endpoint - sends compilation errors to AI for fixing
app.post("/error", async (req, res) => {
    const { 
        errorMessage, 
        errorFile, 
        errorLine, 
        errorColumn, 
        projectContext, 
        projectFiles, 
        provider: requestProvider 
    } = req.body;
    
    const provider = requestProvider || AI_PROVIDER;
    
    try {
        console.log(`🚨 Error feedback request using ${provider}`);
        console.log(`📁 Error in file: ${errorFile}`);
        console.log(`🔍 Error message: ${errorMessage}`);
        console.log(`📍 Location: line ${errorLine}, column ${errorColumn}`);
        
        // Create comprehensive error context prompt
        const errorPrompt = `You are an expert developer helping fix a compilation error. Here's the context:

## Project Context
${projectContext}

## Error Details
- **File**: ${errorFile}
- **Line**: ${errorLine}${errorColumn ? `, Column: ${errorColumn}` : ''}
- **Error Message**: ${errorMessage}

## Project Files (Current State)
${projectFiles?.map((file: any) => `
### ${file.path}
\`\`\`${file.path.endsWith('.ts') || file.path.endsWith('.tsx') ? 'typescript' : file.path.endsWith('.js') || file.path.endsWith('.jsx') ? 'javascript' : ''}
${file.content}
\`\`\`
`).join('') || 'No files provided'}

## Your Task
1. **Analyze the error** and identify the root cause
2. **Fix the problematic file** with the correct implementation
3. **Provide complete fixed code** for the affected file(s)
4. **Explain the fix** briefly

Please provide the corrected code using the same boltArtifact format that was used to create the project originally. Focus on fixing the specific error while maintaining the project's overall structure and functionality.

Return ONLY the fixed code in the proper boltArtifact format, no explanation needed.`;

        let fixResponse: string;
        
        if (provider === "claude") {
            const response = await anthropic.messages.create({
                messages: [{ role: "user", content: errorPrompt }],
                model: "claude-sonnet-4-5",
                max_tokens: 16384,
                system: getSystemPrompt(),
            });
            fixResponse = (response.content[0] as TextBlock).text;
        } else {
            const systemPrompt = getSystemPrompt();
            const formattedMessages = [
                { role: "system" as const, content: systemPrompt },
                { role: "user" as const, content: errorPrompt }
            ];
            
            const response = await openai.chat.completions.create({
                model: "qwen/qwen3-coder-480b-a35b-instruct",
                messages: formattedMessages,
                temperature: 0.3, // Lower temperature for more precise fixes
                top_p: 0.8,
                max_tokens: 32000
            });
            fixResponse = response.choices[0]?.message?.content || "";
        }
        
        console.log('✅ Error fix response generated');
        console.log('🔧 Fix response preview:', fixResponse.substring(0, 200) + '...');
        
        res.json({ 
            response: fixResponse,
            fixApplied: true,
            originalError: {
                file: errorFile,
                line: errorLine,
                column: errorColumn,
                message: errorMessage
            }
        });
        
    } catch (error) {
        console.error('❌ Error feedback endpoint error:', error);
        const errorMessage = error instanceof Error ? error.message : "Unknown error";
        res.status(500).json({ 
            message: "Error processing error feedback request", 
            error: errorMessage,
            fixApplied: false
        });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Backend server running on port ${PORT}`);
    console.log(`📍 Server URL: http://localhost:${PORT}`);
    console.log(`🔗 CORS enabled for all origins`);
    console.log(`🤖 AI Provider: ${AI_PROVIDER}`);
});

// async function main(){
//     anthropic.messages.stream({
//     messages: [{
//         role: 'user', content: "For all designs I ask you to make, have them be beautiful, not cookie cutter. Make webpages that are fully featured and worthy for production.\n\nBy default, this template supports JSX syntax with Tailwind CSS classes, React hooks, and Lucide React for icons. Do not install other packages for UI themes, icons, etc unless absolutely necessary or I request them.\n\nUse icons from lucide-react for logos.\n"
//         },{
//             role:'user',content:""
//         },{
//             role:'user',content:"create todo"
//         }],
//     model: 'claude-opus-4-1-20250805',
//     max_tokens: 1024,
//     system:getSystemPrompt()
// }).on('text', (text) => {
//     console.log(text);
// });
// }
// main()


