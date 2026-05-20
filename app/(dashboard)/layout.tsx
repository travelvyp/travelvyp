import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/shared/sidebar"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session) redirect("/login")

  const user = session.user as any

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        agencyName={user.agencyName}
        userName={user.name ?? user.email}
      />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}
