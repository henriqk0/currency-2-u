"use client"

import { Button } from "@/components/ui/button"
import { useLogout } from "@/hooks/useLogout";
import { LogOut } from "lucide-react";

function LogoutButton() {
  const logout = useLogout()

  return (
    <Button onClick={logout}>
      <LogOut />Logout</Button>
  )
}

export { LogoutButton }