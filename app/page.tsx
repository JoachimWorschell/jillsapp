import { redirect } from 'next/navigation'
import { getRole } from '@/lib/auth'

// Root: send logged-in users to /home, everyone else to /login
export default function Root() {
  const role = getRole()
  if (role) redirect('/home')
  redirect('/login')
}
