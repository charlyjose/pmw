import Link from "next/link"
import { PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"

import { Button } from "@/registry/new-york/ui/button"

interface HeaderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  > {
  title: string
  description?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  size?: "default" | "sm"
}

export function Header({
  title,
  description,
  buttonText,
  buttonLink,
  size = "default",
  className,
  ...props
}: HeaderProps) {
  return (
      <div className={cn("grid gap-2", className)} {...props}>
        <h1
          className={cn(
            "text-3xl font-bold tracking-tight",
            size === "default" && "md:text-4xl"
          )}
        >
          {title}
        </h1>
        {description ? (
          <p
            className={cn(
              "text-muted-foreground",
              size === "default" && "text-lg"
            )}
          >
            {description}
          </p>
        ) : null}
        {buttonText ? (
          <p
            className={cn(
              "text-muted-foreground",
              size === "default" && "text-lg"
            )}
          >
            {buttonText}
            <br />
            {buttonLink}
          </p>
        ) : null}
      </div>
  )
}
