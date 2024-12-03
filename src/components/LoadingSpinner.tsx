'use client'

import { Spin } from 'antd'

export function LoadingSpinner({ message = 'Loading...' }: { message?: string }) {
  return (
    <div className="flex flex-col items-center gap-4">
      <Spin size="large" />
      <p className="text-gray-500">{message}</p>
    </div>
  )
}