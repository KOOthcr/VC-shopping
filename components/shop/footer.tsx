import Link from "next/link"
import { Apple, Play } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-foreground transition-colors">
              샵사이다에 관하여
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              배송관련
            </Link>
            <Link href="#" className="hover:text-foreground transition-colors">
              반품 및 환불
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Apple className="h-5 w-5" />
              애플 앱스토어
            </Link>
            <Link href="#" className="flex items-center gap-2 text-sm hover:opacity-80 transition-opacity">
              <Play className="h-5 w-5" />
              구글플레이 앱스토어
            </Link>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© 2026 CIDER. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
