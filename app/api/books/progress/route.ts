 import { supabase } from "@/lib/supabase";                                                                                                                                      
  import { auth } from "@clerk/nextjs/server";                                                                                                                                    
  import { NextRequest } from "next/server";                                                                                                                                      
                                                                                                                                                                                
  export async function PATCH(req: NextRequest) {                                                                                                                                 
    const { userId } = await auth();                                                                                                                                            

    if (!userId) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }                                                                                                                                                                             
   
    const { id, status, current_page, total_pages } = await req.json();                                                                                                           
                                                                                                                                                                                
    const { error } = await supabase                                                                                                                                              
      .from("saved_books")
      .update({ status, current_page, total_pages })                                                                                                                              
      .eq("id", id)                                                                                                                                                             
      .eq("user_id", userId);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }                                                                                                                                                                             
   
    return Response.json({ success: true });                                                                                                                                      
  }                                                                                                                                                                             

