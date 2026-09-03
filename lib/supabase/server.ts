import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient(){const store=await cookies();return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!,process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,{cookies:{getAll(){return store.getAll()},setAll(cookiesToSet){try{cookiesToSet.forEach(({name,value,options})=>store.set(name,value,options))}catch{}}}})}
export async function requireUser(){const supabase=await createClient();const {data:{user},error}=await supabase.auth.getUser();if(error||!user)throw new Error('Authentication required');return {supabase,user};}
