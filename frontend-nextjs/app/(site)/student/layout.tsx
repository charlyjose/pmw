const PAGE_TYPE = "STUDENT";
const UNAUTHORISED_REDIRECTION_LINK = "/signin?callbackUrl=/protected/server";

import Link from "next/link";

import { siteConfig } from "@/config/site";
import { Icons } from "@/components/icons";

import { SidebarNav } from "./components/sidebar-nav";
import { UserNav } from "./components/user-nav";
import { Separator } from "@/registry/new-york/ui/separator";

const sidebarNavItems = [
  {
    title: "Home",
    href: "/student",
  },
  {
    title: "Placement Application",
    href: "/student/placement/applications",
  },
  {
    title: "Monthly Reports",
    href: "/student/placement/reports",
  },
  {
    title: "New Monthly Report",
    href: "/student/placement/reports/new",
  },
  {
    title: "Jobs",
    href: "/student/jobs",
  },
  {
    title: "Appointments",
    href: "/student/appointments",
  },
  // {
  //   title: "Tasks",
  //   href: "/student/tasks",
  // },
];

interface SettingsLayoutProps {
  children: React.ReactNode;
}

import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function SettingsLayout({
  children,
}: SettingsLayoutProps) {
  const session = await getServerSession(authOptions);
  // console.log("SESSION: ", session);
  // console.log("SESSION_ROLE: ", session?.user?.role);

  // SESSION CHECK
  // User not Logged In
  if (!session) {
    redirect(UNAUTHORISED_REDIRECTION_LINK);
  }
  // Unauthorised routes
  if (session?.user?.role != PAGE_TYPE) {
    redirect(UNAUTHORISED_REDIRECTION_LINK);
  }

  return (
    <>
      <div className="hidden space-y-6 p-10 pb-16 md:block">
        {/* <div className="border-b"> */}
        {/* <div className="border-b-4 border-lime-400"> */}
        <div>
          <div className="flex h-16 items-center">
            <div className="space-y-0.5">
              <h2 className="text-xl font-bold tracking-tight">
                <Link
                  href="/"
                  className="flex items-center text-sm font-bold tracking-tight pb-4"
                >
                  <Icons.logo className="mr-2 h-6 w-6" aria-hidden="true" />
                  <span className="text-black">{siteConfig.name}</span>
                </Link>
                <span className="px-1 bg-lime-300 mr-2"></span>
                Student Dashboard
              </h2>
              <p className="text-muted-foreground">
                Manage your placement here
              </p>
            </div>

            <div className="ml-auto flex items-center space-x-4">
              <span className="text-bold  font-light text-sm">Hi, <span className="font-extrabold text-black">{session.user.firstName}</span></span>
              <UserNav user={session.user} />
            </div>
          </div>
        </div>
        <Separator className="border-b border-lime-400 bg-lime-200">
          <Separator className="border-b-4 border-double border-lime-500 bg-lime-200 blur-md" />
        </Separator>

        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-1/5">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex w-full flex-col overflow-hidden">{children}</div>
        </div>
      </div>
    </>
  );
}
