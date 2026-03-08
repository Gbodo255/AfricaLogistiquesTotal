import type React from "react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { Header } from "@/components/dashboard/header"

export default function ModeratorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex flex-1">
        <Sidebar role="moderator" />
        <div className="flex-1 lg:pl-64 flex flex-col">
          <Header title="Espace Modérateur" role="moderator" />
          <main className="flex-1 p-4 lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}
