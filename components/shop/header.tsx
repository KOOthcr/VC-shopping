"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu, Search, Globe, HelpCircle, User, Heart, ShoppingBag, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useStore } from "@/lib/store"

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const cart = useStore((state) => state.cart)
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0)

  return (
    <header className="sticky top-0 z-50 bg-background border-b border-border">
      <div className="flex items-center justify-between px-4 py-3">
        {/* Left Section */}
        <div className="flex items-center gap-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                <Link href="/" className="text-lg font-medium hover:text-muted-foreground transition-colors">
                  쇼핑하기
                </Link>
                <Link href="/?sort=best" className="text-lg font-medium hover:text-muted-foreground transition-colors">
                  베스트셀러
                </Link>
                <Link href="/?sort=new" className="text-lg font-medium hover:text-muted-foreground transition-colors">
                  신상품
                </Link>
                <Link href="/" className="text-lg font-medium hover:text-muted-foreground transition-colors">
                  오늘의 기분은?
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <nav className="hidden lg:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              쇼핑하기
            </Link>
            <Link href="/?sort=best" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              베스트셀러
            </Link>
            <Link href="/?sort=new" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              신상품
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-muted-foreground transition-colors">
              오늘의 기분은?
            </Link>
          </nav>
        </div>

        {/* Center Logo */}
        <Link href="/" className="absolute left-1/2 -translate-x-1/2">
          <h1 className="text-2xl font-bold tracking-widest">CIDER</h1>
        </Link>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
            </Button>
            {isSearchOpen && (
              <>
                {/* Backdrop */}
                <div
                  className="fixed inset-0 bg-black/20 z-40"
                  onClick={() => setIsSearchOpen(false)}
                />
                {/* Search Dropdown */}
                <div className="absolute right-0 top-full mt-2 z-50 bg-background border border-border rounded-lg shadow-lg p-3 w-[280px] sm:w-[320px]">
                  <div className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <Input
                      type="search"
                      placeholder="검색..."
                      className="h-9 flex-1"
                      autoFocus
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') {
                          setIsSearchOpen(false)
                        }
                      }}
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 flex-shrink-0"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            )}
          </div>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Globe className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <HelpCircle className="h-5 w-5" />
          </Button>
          <Link href="/orders">
            <Button variant="ghost" size="icon">
              <User className="h-5 w-5" />
            </Button>
          </Link>
          <Button variant="ghost" size="icon" className="hidden md:flex">
            <Heart className="h-5 w-5" />
          </Button>
          <Link href="/cart" className="relative">
            <Button variant="ghost" size="icon">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-foreground text-background text-xs flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
