import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// 👇 架构师的强力诊断探针
console.log("【架构师诊断】当前读取到的 Supabase URL:", supabaseUrl);

if (!supabaseUrl || !supabaseAnonKey) {
    // 如果找不到环境变量，直接抛出红色的致命报错，绝不默默装死！
    throw new Error("❌ 致命错误：找不到 Supabase 环境变量！请检查项目根目录的 .env.local 文件，并务必重启 pnpm dev！")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)