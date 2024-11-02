import { FloatingDock } from "./ui/floating-dock";
import { Home, Store, Backpack, UserPen } from "lucide-react";

const items = [
  {
    title: "Home",
    href: "/home",
    icon: <Home />,
  },
  {
    title: "Store",
    href: "/store",
    icon: <Store />,
  },
  {
    title: "Inventory",
    href: "/inventory",
    icon: <Backpack />,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: <UserPen />,
  },
];

export function NavBar() {
  return (
    <FloatingDock
      items={items}
      desktopClassName="fixed z-10 bottom-5 left-1/2 transform -translate-x-1/2" 
      mobileClassName="fixed z-10 bottom-5 right-5"  
    />
  );
}