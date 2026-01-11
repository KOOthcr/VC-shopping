"use client"

import Link from "next/link"
import { Menu, Store } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AdminSidebar } from "./admin-sidebar"

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-50 bg-background border-b lg:hidden">
      <div className="flex items-center justify-between px-4 py-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AdminSidebar />
          </SheetContent>
        </Sheet>

        <Link href="/admin" className="font-bold">
          CIDER Admin
        </Link>

        <Link href="/">
          <Button variant="ghost" size="icon">
            <Store className="h-5 w-5" />
          </Button>
        </Link>
      </div>
    </header>
  )
}
