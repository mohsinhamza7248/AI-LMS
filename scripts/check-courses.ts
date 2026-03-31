import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function run() {
  console.log("Fetching courses...")
  const { data: courses } = await supabase.from('courses').select('id, title, tutor_id')
  console.log("Courses:", courses)

  console.log("Fetching tutors...")
  const { data: tutors } = await supabase.from('tutors').select('id, user_id')
  console.log("Tutors:", tutors)

  console.log("Fetching users with role tutor...")
  const { data: users } = await supabase.from('users').select('id, name, email, role')
  console.log("Users:", users)
}

run()
