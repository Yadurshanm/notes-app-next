'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  prefix?: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'borderless'
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  prefix,
  size = 'md',
  variant = 'default',
  ...props
}, ref) => {
  const baseStyles = 'w-full rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors duration-200'
  
  const variants = {
    default: 'border border-gray-200 dark:border-gray-700 focus:border-blue-500 dark:focus:border-blue-400',
    borderless: 'border-0',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-5 py-2.5 text-lg',
  }

  return (
    <div className="relative flex items-center">
      {prefix && (
        <div className="absolute left-3 flex items-center pointer-events-none text-gray-400">
          {prefix}
        </div>
      )}
      <input
        ref={ref}
        className={twMerge(
          baseStyles,
          variants[variant],
          sizes[size],
          prefix && 'pl-10',
          className
        )}
        {...props}
      />
    </div>
  )
})