"use client"

import { useState, useMemo } from "react"
import { ChevronDown, SlidersHorizontal, Flame } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ProductCard } from "@/components/shop/product-card"
import { CategoryFilter } from "@/components/shop/category-filter"
import { useStore } from "@/lib/store"

const categories = ["세일🔥", "액세서리", "상의", "하의", "니트웨어", "데님"]

export default function HomePage() {
  const products = useStore((state) => state.products)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("추천제품")

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (selectedCategory) {
      const categoryMap: Record<string, string> = {
        "세일🔥": "세일",
        액세서리: "액세서리",
        상의: "상의",
        하의: "하의",
        니트웨어: "니트웨어",
        데님: "데님",
      }
      const mappedCategory = categoryMap[selectedCategory] || selectedCategory
      result = result.filter((p) => p.category === mappedCategory)
    }

    if (sortBy === "가격 낮은순") {
      result.sort((a, b) => a.price - b.price)
    } else if (sortBy === "가격 높은순") {
      result.sort((a, b) => b.price - a.price)
    }

    return result
  }, [products, selectedCategory, sortBy])

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Filter Controls */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="outline" size="sm" className="gap-2 bg-transparent">
          <SlidersHorizontal className="h-4 w-4" />
          정렬
          <ChevronDown className="h-4 w-4" />
        </Button>

        <h2 className="text-2xl font-bold">ALL</h2>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Flame className="h-4 w-4 text-orange-500" />
              {sortBy}
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setSortBy("추천제품")}>추천제품</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("가격 낮은순")}>가격 낮은순</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("가격 높은순")}>가격 높은순</DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("최신순")}>최신순</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Category Filter */}
      <div className="mb-8">
        <CategoryFilter
          categories={categories}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
        />
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-16">
          <p className="text-muted-foreground">해당 카테고리에 상품이 없습니다.</p>
        </div>
      )}
    </div>
  )
}
