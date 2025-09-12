import { cn } from "@/lib/utils"
import { ReactNode, forwardRef } from "react"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  asChild = false,
  ...props 
}, ref) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none"
  
  const variants = {
    primary: "bg-primary hover:bg-primary-600 text-dark",
    secondary: "bg-white border border-gray-light hover:bg-gray-50 text-dark",
    outline: "border border-gray-light hover:bg-gray-50 text-dark",
    ghost: "hover:bg-gray-50 text-dark"
  }
  
  const sizes = {
    sm: "h-8 px-3 text-sm",
    md: "h-10 px-4 text-sm",
    lg: "h-12 px-6 text-base"
  }
  
  const classes = cn(baseClasses, variants[variant], sizes[size], className)
  
  if (asChild) {
    return <span className={classes}>{children}</span>
  }
  
  return (
    <button
      ref={ref}
      className={classes}
      {...props}
    >
      {children}
    </button>
  )
})

Button.displayName = "Button"