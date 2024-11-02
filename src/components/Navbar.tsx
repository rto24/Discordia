import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton
} from "@/components/ui/sidebar"

import { Home, Store, Backpack, UserPen } from "lucide-react";

const items = [
  {
    title: "Home",
    url: "http://localhost:3000/home",
    icon: Home
  },
  {
    title: "Store",
    url: "http://localhost:3000/store",
    icon: Store
  },
  {
    title: "Inventory",
    url: "http://localhost:3000/inventory",
    icon: Backpack
  },
  {
    title: "Profile",
    url: "http://localhost:3000/profile",
    icon: UserPen
  },
];

export function Navbar() {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
          <SidebarGroupContent>
            <SidebarMenu>
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
            </SidebarMenu>
          </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}
