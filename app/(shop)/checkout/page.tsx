"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export default function CheckoutPage() {
  const router = useRouter()
  const cart = useStore((state) => state.cart)
  const clearCart = useStore((state) => state.clearCart)
  const addOrder = useStore((state) => state.addOrder)

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    zipCode: "",
    address: "",
    detailAddress: "",
  })
  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0)
  const shipping = subtotal > 50000 ? 0 : 3000
  const total = subtotal + shipping

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)

    // 주문 생성
    const order = {
      id: `ORD-${Date.now()}`,
      items: cart,
      total,
      status: "pending" as const,
      createdAt: new Date().toISOString(),
      shippingAddress: formData,
      paymentMethod,
    }

    // 주문 저장
    addOrder(order)
    clearCart()

    // 주문 완료 페이지로 이동
    router.push(`/order-complete?orderId=${order.id}`)
  }

  if (cart.length === 0) {
    router.push("/cart")
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-8">주문하기</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Shipping & Payment Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Address */}
            <div className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">배송 정보</h2>
              <div className="grid gap-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">받는 분</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="mt-1.5"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">연락처</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="010-0000-0000"
                      required
                      className="mt-1.5"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="zipCode">우편번호</Label>
                  <div className="flex gap-2 mt-1.5">
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      required
                      className="flex-1"
                    />
                    <Button type="button" variant="outline" className="bg-transparent">
                      주소 검색
                    </Button>
                  </div>
                </div>
                <div>
                  <Label htmlFor="address">주소</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="detailAddress">상세주소</Label>
                  <Input
                    id="detailAddress"
                    name="detailAddress"
                    value={formData.detailAddress}
                    onChange={handleInputChange}
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">결제 수단</h2>
              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-foreground transition-colors">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="cursor-pointer flex-1">
                      신용/체크카드
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-foreground transition-colors">
                    <RadioGroupItem value="bank" id="bank" />
                    <Label htmlFor="bank" className="cursor-pointer flex-1">
                      무통장입금
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-foreground transition-colors">
                    <RadioGroupItem value="kakao" id="kakao" />
                    <Label htmlFor="kakao" className="cursor-pointer flex-1">
                      카카오페이
                    </Label>
                  </div>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:border-foreground transition-colors">
                    <RadioGroupItem value="naver" id="naver" />
                    <Label htmlFor="naver" className="cursor-pointer flex-1">
                      네이버페이
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            {/* Order Items */}
            <div className="border rounded-lg p-6">
              <h2 className="font-bold text-lg mb-4">주문 상품</h2>
              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={`${item.product.id}-${item.selectedColor}-${item.selectedSize}`} className="flex gap-4">
                    <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-sm uppercase line-clamp-1">{item.product.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {item.selectedColor} {item.selectedSize && `/ ${item.selectedSize}`}
                      </p>
                      <div className="flex justify-between mt-1">
                        <span className="text-sm text-muted-foreground">수량: {item.quantity}</span>
                        <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border rounded-lg p-6 sticky top-24">
              <h2 className="font-bold text-lg mb-4">결제 금액</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">상품 금액</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">배송비</span>
                  <span>{shipping === 0 ? "무료" : formatPrice(shipping)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-lg">
                  <span>총 결제금액</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>
              <Button type="submit" className="w-full mt-6" size="lg" disabled={isProcessing}>
                {isProcessing ? "처리 중..." : `${formatPrice(total)} 결제하기`}
              </Button>
              <p className="text-xs text-muted-foreground text-center mt-4">
                주문 내용을 확인하였으며, 결제에 동의합니다.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
