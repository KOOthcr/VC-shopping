"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Package, ShoppingCart, Plus, Store } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { href: "/admin", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/products", label: "상품 관리", icon: Package },
  { href: "/admin/products/new", label: "상품 등록", icon: Plus },
  { href: "/admin/orders", label: "주문 조회", icon: ShoppingCart },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-muted/30 border-r min-h-screen p-4 hidden lg:block">
      <Link href="/admin" className="flex items-center gap-2 mb-8 px-2">
        <Store className="h-6 w-6" />
        <span className="font-bold text-lg">CIDER Admin</span>
      </Link>

      <nav className="space-y-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </Link>
          )
        })}
      </nav>

      <div className="absolute bottom-4 left-4 right-4">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Store className="h-4 w-4" />
          쇼핑몰로 이동
        </Link>
      </div>
    </aside>
  )
}
