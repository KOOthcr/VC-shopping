"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Product } from "@/lib/store"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `₩${price.toLocaleString()}`
  }

  return (
    <Link href={`/product/${product.id}`} className="group block">
      <div className="relative aspect-[3/4] overflow-hidden bg-muted mb-3">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-background"
          onClick={(e) => {
            e.preventDefault()
            // 위시리스트 기능
          }}
        >
          <Heart className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-1">
        <h3 className="text-xs font-medium uppercase leading-tight line-clamp-2">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
        {product.colors && product.colors.length > 1 && (
          <p className="text-xs text-muted-foreground">+ {product.colors.length} 색깔</p>
        )}
      </div>
    </Link>
  )
}
