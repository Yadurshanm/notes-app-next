'use client'

import { Spinner } from '@nextui-org/react'

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spinner size="lg" />
      <p className="text-gray-500">{message}</p>
    </div>
  )
}