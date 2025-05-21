'use client'

import { ButtonHTMLAttributes, ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'default' | 'primary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  isIconOnly?: boolean
}

export function Button({
  children,
  className,
  variant = 'default',
  size = 'md',
  isIconOnly,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-95'
  
  const variants = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700',
    primary: 'bg-blue-500 text-white hover:bg-blue-600 dark:hover:bg-blue-400',
    danger: 'bg-red-500 text-white hover:bg-red-600 dark:hover:bg-red-400',
  }

  const sizes = {
    sm: isIconOnly ? 'p-1.5' : 'px-3 py-1.5 text-sm',
    md: isIconOnly ? 'p-2' : 'px-4 py-2',
    lg: isIconOnly ? 'p-2.5' : 'px-5 py-2.5 text-lg',
  }

  return (
    <button
      className={twMerge(
        baseStyles,
        variants[variant],
        sizes[size],
        isIconOnly && 'aspect-square',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}