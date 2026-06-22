import { redirect } from 'next/navigation'
import { getRole } from '@/lib/auth'

// Root: send logged-in users to /home, everyone else to /login
export default async function Root() {
  const role = await getRole()
  if (role) redirect('/home')
  redirect('/login')
}
