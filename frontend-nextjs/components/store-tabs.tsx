"use client"

import { usePathname, useRouter } from "next/navigation"

import { cn } from "@/lib/utils"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface StoreTabsProps extends React.ComponentPropsWithoutRef<typeof Tabs> {
  storeId: number
}

export function StoreTabs({ className, storeId, ...props }: StoreTabsProps) {
  const router = useRouter()
  const pathname = usePathname()

  const tabs = [
    {
      title: "Preview",
      href: `/dashboard/applications/${storeId}`,
    },
    {
      title: "Status",
      href: `/dashboard/applications/${storeId}/status`,
    },
    // {
    //   title: "Orders",
    //   href: `/dashboard/applications/${storeId}/orders`,
    // },
    // {
    //   title: "Payments",
    //   href: `/dashboard/applications/${storeId}/payments`,
    // },
    // {
    //   title: "Analytics",
    //   href: `/dashboard/applications/${storeId}/analytics`,
    // },
  ]

  return (
    <Tabs
      {...props}
      className={cn("w-full overflow-x-auto overflow-y-hidden", className)}
      onValueChange={(value) => router.push(value)}
    >
      <TabsList>
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.title}
            value={tab.href}
            className={cn(
              pathname === tab.href && "bg-background text-foreground shadow-sm"
            )}
            onClick={() => router.push(tab.href)}
          >
            {tab.title}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
