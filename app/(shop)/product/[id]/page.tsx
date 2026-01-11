"use client"

import { use, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ChevronLeft, Heart, Minus, Plus, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { toast } = useToast()
  const products = useStore((state) => state.products)
  const addToCart = useStore((state) => state.addToCart)

  const product = products.find((p) => p.id === id)

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || "")
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || "")
  const [quantity, setQuantity] = useState(1)

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">상품을 찾을 수 없습니다</h1>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`

  const handleAddToCart = () => {
    addToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    })
    toast({
      title: "장바구니에 추가되었습니다",
      description: `${product.name}이(가) 장바구니에 추가되었습니다.`,
    })
  }

  const handleBuyNow = () => {
    addToCart({
      product,
      quantity,
      selectedColor,
      selectedSize,
    })
    router.push("/checkout")
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Back Button */}
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        뒤로가기
      </Button>

      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Image */}
        <div className="relative aspect-[3/4] overflow-hidden bg-muted rounded-lg">
          <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" priority />
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <Button variant="secondary" size="icon" className="rounded-full">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold uppercase mb-2">{product.name}</h1>
          <p className="text-2xl font-bold mb-6">{formatPrice(product.price)}</p>

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">
                색상: <span className="text-muted-foreground">{selectedColor}</span>
              </h3>
              <RadioGroup value={selectedColor} onValueChange={setSelectedColor} className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <div key={color}>
                    <RadioGroupItem value={color} id={`color-${color}`} className="peer sr-only" />
                    <Label
                      htmlFor={`color-${color}`}
                      className="flex items-center justify-center px-4 py-2 border rounded-full cursor-pointer text-sm peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground transition-colors"
                    >
                      {color}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Size Selection */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3">
                사이즈: <span className="text-muted-foreground">{selectedSize}</span>
              </h3>
              <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <div key={size}>
                    <RadioGroupItem value={size} id={`size-${size}`} className="peer sr-only" />
                    <Label
                      htmlFor={`size-${size}`}
                      className="flex items-center justify-center w-12 h-12 border rounded-full cursor-pointer text-sm peer-data-[state=checked]:border-foreground peer-data-[state=checked]:bg-foreground peer-data-[state=checked]:text-background hover:border-foreground transition-colors"
                    >
                      {size}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">수량</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                disabled={quantity >= product.stock}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Stock Info */}
          <p className="text-sm text-muted-foreground mb-6">재고: {product.stock}개</p>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3 mt-auto">
            <Button size="lg" className="w-full" onClick={handleBuyNow}>
              바로 구매
            </Button>
            <Button size="lg" variant="outline" className="w-full bg-transparent" onClick={handleAddToCart}>
              장바구니 담기
            </Button>
          </div>

          {/* Product Description */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="font-medium mb-3">상품 설명</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description || "트렌디하고 스타일리시한 아이템입니다. 다양한 스타일링에 활용할 수 있습니다."}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
