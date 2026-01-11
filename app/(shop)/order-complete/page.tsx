"use client"

import { use } from "react"
import Link from "next/link"
import { CheckCircle, Package, Truck, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useStore } from "@/lib/store"

export default function OrderCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId: string }>
}) {
  const { orderId } = use(searchParams)
  const orders = useStore((state) => state.orders)
  const order = orders.find((o) => o.id === orderId)

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">주문 정보를 찾을 수 없습니다</h1>
        <Link href="/">
          <Button>홈으로 돌아가기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
        </div>

        <h1 className="text-2xl font-bold mb-2">주문이 완료되었습니다!</h1>
        <p className="text-muted-foreground mb-8">주문해 주셔서 감사합니다.</p>

        {/* Order Info Card */}
        <div className="border rounded-lg p-6 text-left mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className="text-sm text-muted-foreground">주문번호</p>
              <p className="font-bold">{order.id}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">주문일시</p>
              <p className="text-sm">{formatDate(order.createdAt)}</p>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Order Progress */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center">
                <CheckCircle className="h-5 w-5" />
              </div>
              <span className="text-xs mt-2">주문완료</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">상품준비중</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <Truck className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">배송중</span>
            </div>
            <div className="flex-1 h-0.5 bg-border mx-2" />
            <div className="flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
                <MapPin className="h-5 w-5 text-muted-foreground" />
              </div>
              <span className="text-xs mt-2 text-muted-foreground">배송완료</span>
            </div>
          </div>

          <Separator className="my-4" />

          {/* Shipping Address */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">배송지 정보</h3>
            <p className="text-sm text-muted-foreground">
              {order.shippingAddress.name} | {order.shippingAddress.phone}
            </p>
            <p className="text-sm text-muted-foreground">
              [{order.shippingAddress.zipCode}] {order.shippingAddress.address} {order.shippingAddress.detailAddress}
            </p>
          </div>

          <Separator className="my-4" />

          {/* Order Items */}
          <div className="mb-4">
            <h3 className="font-medium mb-2">주문 상품</h3>
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between text-sm py-2">
                <span className="text-muted-foreground">
                  {item.product.name} x {item.quantity}
                </span>
                <span>{formatPrice(item.product.price * item.quantity)}</span>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          {/* Total */}
          <div className="flex justify-between font-bold">
            <span>총 결제금액</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/orders">
            <Button variant="outline" className="w-full sm:w-auto bg-transparent">
              주문 내역 보기
            </Button>
          </Link>
          <Link href="/">
            <Button className="w-full sm:w-auto">쇼핑 계속하기</Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
