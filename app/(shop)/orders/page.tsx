"use client"

import Image from "next/image"
import Link from "next/link"
import { Package, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "결제완료", variant: "default" },
  processing: { label: "상품준비중", variant: "secondary" },
  shipped: { label: "배송중", variant: "secondary" },
  delivered: { label: "배송완료", variant: "outline" },
  cancelled: { label: "취소됨", variant: "destructive" },
}

export default function OrdersPage() {
  const orders = useStore((state) => state.orders)

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (orders.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h1 className="text-2xl font-bold mb-2">주문 내역이 없습니다</h1>
        <p className="text-muted-foreground mb-6">첫 주문을 시작해보세요!</p>
        <Link href="/">
          <Button>쇼핑 시작하기</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-8">내 주문목록</h1>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border rounded-lg overflow-hidden">
            {/* Order Header */}
            <div className="bg-muted/50 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">{formatDate(order.createdAt)}</span>
                <span className="text-sm text-muted-foreground">{order.id}</span>
              </div>
              <Badge variant={statusMap[order.status].variant}>{statusMap[order.status].label}</Badge>
            </div>

            {/* Order Items */}
            <div className="p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Product Images */}
                <div className="flex -space-x-4">
                  {order.items.slice(0, 3).map((item, index) => (
                    <div
                      key={index}
                      className="relative w-16 h-20 rounded-md overflow-hidden border-2 border-background bg-muted"
                    >
                      <Image
                        src={item.product.image || "/placeholder.svg"}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-16 h-20 rounded-md border-2 border-background bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">+{order.items.length - 3}</span>
                    </div>
                  )}
                </div>

                {/* Order Info */}
                <div className="flex-1">
                  <h3 className="font-medium text-sm line-clamp-1">
                    {order.items[0].product.name}
                    {order.items.length > 1 && ` 외 ${order.items.length - 1}건`}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    총 {order.items.reduce((acc, item) => acc + item.quantity, 0)}개 상품
                  </p>
                </div>

                {/* Price and Action */}
                <div className="flex items-center gap-4">
                  <span className="font-bold">{formatPrice(order.total)}</span>
                  <Link href={`/order-complete?orderId=${order.id}`}>
                    <Button variant="ghost" size="icon">
                      <ChevronRight className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
