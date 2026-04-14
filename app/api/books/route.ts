import { supabase } from "@/lib/supabase";
  import { auth } from "@clerk/nextjs/server";                                                                                                                                    
   
  export async function GET() {                                                                                                                                                   
    const { userId } = await auth();                    

    if (!userId) {                                                                                                                                                                
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }                                                                                                                                                                             
                                                        
    const { data, error } = await supabase
      .from("saved_books")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });                                                                                                                                 
   
    if (error) {                                                                                                                                                                  
      return Response.json({ error: error.message }, { status: 500 });
    }

    return Response.json({ books: data });                                                                                                                                        
  }