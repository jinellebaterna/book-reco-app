import { supabase } from "@/lib/supabase";
  import { auth } from "@clerk/nextjs/server";
  import { NextRequest } from "next/server";                                                                                                                                      
   
  export async function POST(req: NextRequest) {                                                                                                                                  
    const { userId } = await auth();                    
                                                                                                                                                                                  
    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });                                                                                                           
    }                                                   

    const { title, author, description } = await req.json();                                                                                                                      
   
    const { error } = await supabase.from("saved_books").insert({                                                                                                                 
      user_id: userId,                                  
      title,
      author,
      description,
    });

    if (error) {                                                                                                                                                                  
      return Response.json({ error: error.message }, { status: 500 });
    }                                                                                                                                                                             
                                                        
    return Response.json({ success: true });
  }
