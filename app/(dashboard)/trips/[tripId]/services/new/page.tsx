import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { AddServiceWizard } from "@/components/builder/add-service-wizard"

export default async function NewServicePage({
  params,
}: {
  params: { tripId: string }
}) {
  const session = await auth()
  const user = session!.user as any

  const trip = await prisma.trip.findFirst({
    where: { id: params.tripId, agencyId: user.agencyId, deletedAt: null },
    select: { id: true, name: true },
  })
  if (!trip) notFound()

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <Link
        href={`/trips/${trip.id}`}
        className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-slate-900 transition-colors mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        {trip.name}
      </Link>

      <AddServiceWizard tripId={trip.id} />
    </div>
  )
}
