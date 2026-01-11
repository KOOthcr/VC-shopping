"use client"

import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export default function CartPage() {
  const router = useRouter()
  const cart = useStore((state) => state.cart)
  const removeFromCart = useStore((state) => state.removeFromCart)
  const updateCartQuantity = useStore((state) => state.updateCartQuantity)

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50000 ? 0 : 3000
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">장바구니가 비어있습니다</h1>
        <p className="text-muted-foreground mb-6">마음에 드는 상품을 담아보세요!</p>
        <Link href="/">
          <Button>쇼핑 계속하기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-8">장바구니</h1>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`}
              className="flex gap-4 p-4 border rounded-lg"
            >
              <div className="relative w-24 h-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 flex flex-col">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium text-sm uppercase line-clamp-2">{item.product.name}</h3>
                    <div className="text-sm text-muted-foreground mt-1">
                      {item.selectedColor && <span>{item.selectedColor}</span>}
                      {item.selectedColor && item.selectedSize && <span> / </span>}
                      {item.selectedSize && <span>{item.selectedSize}</span>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => removeFromCart(item.product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateCartQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 bg-transparent"
                      onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border rounded-lg p-6 sticky top-24">
            <h2 className="font-bold text-lg mb-4">주문 요약</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 금액</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span>{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
              </div>
              {shipping > 0 && <p className="text-xs text-muted-foreground">₩50,000 이상 구매시 무료배송</p>}
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>총 결제금액</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
            <Button className="w-full mt-6" size="lg" onClick={() => router.push("/checkout")}>
              주문하기
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full mt-3 bg-transparent">
                쇼핑 계속하기
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
