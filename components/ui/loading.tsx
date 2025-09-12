import { cn } from "@/lib/utils"

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizes = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12'
  }

  return (
    <div
      className={cn(
        "animate-spin rounded-full border-2 border-gray-light border-t-primary",
        sizes[size],
        className
      )}
    />
  )
}

interface LoadingProps {
  children?: React.ReactNode
}

export function Loading({ children }: LoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] space-y-4">
      <LoadingSpinner size="lg" />
      {children && (
        <p className="text-gray-600 text-sm">{children}</p>
      )}
    </div>
  )
}