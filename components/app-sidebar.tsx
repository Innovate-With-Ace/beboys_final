"use client"

import * as React from "react"
import { useUser } from "@clerk/nextjs"

import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  GalleryVerticalEndIcon,
  LayoutDashboardIcon,
  ClipboardListIcon,
  BoxesIcon,
  UsersIcon,
  SoupIcon,
  BarChart3Icon,
} from "lucide-react"

const data = {
  teams: [
    {
      name: "Beboy's Kagawad's Best Eatery",
      logo: <GalleryVerticalEndIcon />,
      plan: "Main Branch",
    },
  ],
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: <LayoutDashboardIcon />,
      isActive: true,
    },
    {
      title: "Orders",
      url: "/admin/orders",
      icon: <ClipboardListIcon />,
    },
    {
      title: "Inventory",
      url: "/admin/inventory",
      icon: <BoxesIcon />,
    },
    {
      title: "Dishes",
      url: "/admin/dishes",
      icon: <SoupIcon />,
    },
    {
      title: "Staff",
      url: "/admin/staff",
      icon: <UsersIcon />,
    },
    {
      title: "Reports",
      url: "/admin/reports",
      icon: <BarChart3Icon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useUser()

  const navUser = {
    name: user?.fullName || user?.username || "Account",
    email: user?.primaryEmailAddress?.emailAddress || "",
    avatar: user?.imageUrl || "",
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={navUser} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}