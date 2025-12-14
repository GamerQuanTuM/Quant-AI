import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatOpenAI } from "@langchain/openai";

// const model = new ChatGoogleGenerativeAI({
//     model: "gemini-2.5-flash",
//     temperature: 0.5,
//     maxRetries: 2,
//     apiKey: process.env.GOOGLE_API_KEY,
//     streaming: true,
// });

const model = new ChatOpenAI({
    model: "meta-llama/llama-3.2-3b-instruct:free",
    streaming:true,
    maxRetries:2,
    temperature:0.5,
    configuration: {
        apiKey: process.env.OPENROUTER_API_KEY,
        baseURL: "https://openrouter.ai/api/v1",
        
    }

})

export default model
