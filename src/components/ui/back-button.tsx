'use client'

import * as React from "react"
import { Button } from "./button"
import type { VariantProps } from "class-variance-authority"
import { buttonVariants } from "./button"

interface BackButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  children: React.ReactNode
}

const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  ({ children, ...props }, ref) => {
    const handleBack = () => {
      window.history.back()
    }

    return (
      <Button onClick={handleBack} ref={ref} {...props}>
        {children}
      </Button>
    )
  }
)

BackButton.displayName = "BackButton"

export { BackButton }