import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { GoogleGenerativeAI } from "https://esm.sh/@google/generative-ai@0.1.0"

console.log("Hello from Generate with Gemini!")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders })
  }

  try {
    // Get API key from environment variable
    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY")
    if (!GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is not set")
    }

    // Parse request body
    const { prompt } = await req.json()
    if (!prompt) {
      throw new Error("No prompt provided")
    }

    console.log("Processing prompt:", prompt)

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // Generate content
    console.log("Generating content...")
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log("Generated response:", text)

    // Return the response with CORS headers
    return new Response(
      JSON.stringify({ response: text }),
      { 
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 200,
      },
    )

  } catch (error) {
    console.error("Error:", error.message)
    
    // Return error response with CORS headers
    return new Response(
      JSON.stringify({
        error: error.message,
        details: error.stack,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 500,
      },
    )
  }
})