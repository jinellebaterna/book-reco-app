import { groqClient } from "@/lib/groq";
  import { NextRequest } from "next/server";                                                                                 
                                                        
  export async function POST(req: NextRequest) {                                                                             
    const { genres, mood, lovedBooks, avoid } = await req.json();
                                                                                                                             
    const prompt = `You are a book recommendation expert. Based on the following preferences, recommend exactly 15 books.
                                                                                                                             
  Preferences:                                                                                                               
  - Genres: ${genres.length > 0 ? genres.join(", ") : "No preference"}
  - Current mood: ${mood || "No preference"}                                                                                 
  - Books they have loved: ${lovedBooks || "Not specified"}
  - Things to avoid: ${avoid || "Nothing specified"}                                                                         
                                                                                                                             
  Respond with ONLY a valid JSON array. No extra text, no markdown, no code blocks. Just the raw JSON array like this:       
  [                                                                                                                          
    {                                                                                                                        
      "title": "Book Title",                            
      "author": "Author Name",
      "description": "A 2-3 sentence explanation of why this book matches their preferences."
    }                                                                                                                        
  ]`;
                                                                                                                             
    try {                                               
      const completion = await groqClient.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,                                                                                                    
      });
                                                                                                                             
      const text = completion.choices[0]?.message?.content || "";
      const cleaned = text.replace(/```json|```/g, "").trim();
      const books = JSON.parse(cleaned);                                                                                     
   
      return Response.json({ books });                                                                                       
    } catch (err) {                                     
      console.error(err);
      return Response.json({ error: "Failed to generate recommendations" }, { status: 500 });
    }                                                                                                                        
  }
            