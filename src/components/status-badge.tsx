'use client'

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }: { status: string }) {
  const variant = {
    DRAFT: 'bg-gray-100 text-gray-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    ACTIVE: 'bg-green-100 text-green-800',
    COMPLETED: 'bg-purple-100 text-purple-800',
    ARCHIVED: 'bg-orange-100 text-orange-800'
  }[status]

  return (
    <Badge className={cn(variant, 'capitalize')}>
      {status.toLowerCase()}
    </Badge>
  )
}