import Link from "next/link"
import { PlusCircle, XCircle } from "lucide-react"

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
  iconVariant?: string | null
  buttonVariant?: string | null
  size?: "default" | "sm"
}

const iconVariants = {
  "add": PlusCircle,
  "cancel": XCircle,
}

export function ShellHeader({
  title,
  description,
  buttonText,
  buttonLink,
  iconVariant,
  buttonVariant,
  size = "default",
  className,
  ...props
}: HeaderProps) {
  return (
    <>
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>

        {buttonText ? (
          <div className="ml-auto mr-4">
              {buttonLink ? (
            <Button asChild variant={buttonVariant? (buttonVariant): "default"} >
                <Link href={buttonLink}>
                    {iconVariant=="add"? (
                      <PlusCircle className="mr-2 h-4 w-4" />
                    ): null}
                    {iconVariant=="cancel"? (
                      <XCircle className="mr-2 h-4 w-4" />
                    ): null}
                    {buttonText}
                  </Link>
                  </Button>
              ) : null}
          </div>
        ) : null}
      </div>
    </>
  )
}
