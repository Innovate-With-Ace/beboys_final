import { auth } from "@clerk/nextjs/server"
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const { userId, orgId, orgRole } = await auth()

  console.log('DASHBOARD userId:', userId)
  console.log('DASHBOARD orgId:', orgId)
  console.log('DASHBOARD orgRole:', orgRole)

  if (orgRole === 'org:admin') redirect('/admin')
  if (orgRole === 'org:staff') redirect('/pos')

  redirect('/no-access')
}