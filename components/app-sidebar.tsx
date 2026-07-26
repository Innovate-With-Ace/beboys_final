"use client"

import * as React from "react"

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
  CarrotIcon,
  BarChart3Icon,
  SettingsIcon,
} from "lucide-react"

const data = {
  user: {
    name: "Beboy",
    email: "beboy@example.com",
    avatar: "/avatars/beboy.jpg",
  },
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
      title: "Ingredients",
      url: "/admin/ingredients",
      icon: <CarrotIcon />,
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
    {
      title: "Settings",
      url: "/admin/settings",
      icon: <SettingsIcon />,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}