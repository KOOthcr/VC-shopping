"use client"

import type React from "react"

import Image from "next/image"
import { Package, Truck, MapPin, CheckCircle, XCircle } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { Order } from "@/lib/store"
import { useStore } from "@/lib/store"

interface OrderDetailDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "결제완료", variant: "default" },
  processing: { label: "상품준비중", variant: "secondary" },
  shipped: { label: "배송중", variant: "secondary" },
  delivered: { label: "배송완료", variant: "outline" },
  cancelled: { label: "취소됨", variant: "destructive" },
}

const paymentMethodMap: Record<string, string> = {
  card: "신용/체크카드",
  bank: "무통장입금",
  kakao: "카카오페이",
  naver: "네이버페이",
}

export function OrderDetailDialog({ order, open, onOpenChange }: OrderDetailDialogProps) {
  const updateOrderStatus = useStore((state) => state.updateOrderStatus)

  if (!order) return null

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

  const handleStatusChange = (status: Order["status"]) => {
    updateOrderStatus(order.id, status)
  }

  const getStatusIcon = (status: string, currentStatus: string) => {
    const statusOrder = ["pending", "processing", "shipped", "delivered"]
    const currentIndex = statusOrder.indexOf(currentStatus)
    const statusIndex = statusOrder.indexOf(status)

    if (currentStatus === "cancelled") {
      return <XCircle className="h-5 w-5 text-destructive" />
    }

    if (statusIndex <= currentIndex) {
      return <CheckCircle className="h-5 w-5 text-green-600" />
    }

    const icons: Record<string, React.ReactNode> = {
      pending: <CheckCircle className="h-5 w-5 text-muted-foreground" />,
      processing: <Package className="h-5 w-5 text-muted-foreground" />,
      shipped: <Truck className="h-5 w-5 text-muted-foreground" />,
      delivered: <MapPin className="h-5 w-5 text-muted-foreground" />,
    }

    return icons[status]
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between pr-8">
            <span>주문 상세</span>
            <Badge variant={statusMap[order.status].variant}>{statusMap[order.status].label}</Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">주문번호</p>
              <p className="font-medium">{order.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">주문일시</p>
              <p className="font-medium">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <p className="text-muted-foreground">결제수단</p>
              <p className="font-medium">{paymentMethodMap[order.paymentMethod] || order.paymentMethod}</p>
            </div>
            <div>
              <p className="text-muted-foreground">결제금액</p>
              <p className="font-bold text-lg">{formatPrice(order.total)}</p>
            </div>
          </div>

          <Separator />

          {/* Order Progress */}
          {order.status !== "cancelled" && (
            <>
              <div>
                <h3 className="font-medium mb-4">주문 상태</h3>
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center flex-1">
                    {getStatusIcon("pending", order.status)}
                    <span className="text-xs mt-2">결제완료</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border" />
                  <div className="flex flex-col items-center flex-1">
                    {getStatusIcon("processing", order.status)}
                    <span className="text-xs mt-2">상품준비중</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border" />
                  <div className="flex flex-col items-center flex-1">
                    {getStatusIcon("shipped", order.status)}
                    <span className="text-xs mt-2">배송중</span>
                  </div>
                  <div className="flex-1 h-0.5 bg-border" />
                  <div className="flex flex-col items-center flex-1">
                    {getStatusIcon("delivered", order.status)}
                    <span className="text-xs mt-2">배송완료</span>
                  </div>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Status Update */}
          <div>
            <h3 className="font-medium mb-3">상태 변경</h3>
            <Select value={order.status} onValueChange={(value) => handleStatusChange(value as Order["status"])}>
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">결제완료</SelectItem>
                <SelectItem value="processing">상품준비중</SelectItem>
                <SelectItem value="shipped">배송중</SelectItem>
                <SelectItem value="delivered">배송완료</SelectItem>
                <SelectItem value="cancelled">주문취소</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Shipping Address */}
          <div>
            <h3 className="font-medium mb-3">배송지 정보</h3>
            <div className="bg-muted/50 rounded-lg p-4 text-sm">
              <p className="font-medium">
                {order.shippingAddress.name} | {order.shippingAddress.phone}
              </p>
              <p className="text-muted-foreground mt-1">
                [{order.shippingAddress.zipCode}] {order.shippingAddress.address}
              </p>
              {order.shippingAddress.detailAddress && (
                <p className="text-muted-foreground">{order.shippingAddress.detailAddress}</p>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-medium mb-3">주문 상품</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex gap-4 p-3 border rounded-lg">
                  <div className="relative w-16 h-20 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                    <Image
                      src={item.product.image || "/placeholder.svg"}
                      alt={item.product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-sm line-clamp-1">{item.product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {item.selectedColor} {item.selectedSize && `/ ${item.selectedSize}`}
                    </p>
                    <div className="flex justify-between items-center mt-2">
                      <span className="text-sm text-muted-foreground">수량: {item.quantity}</span>
                      <span className="font-medium">{formatPrice(item.product.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">상품 금액</span>
                <span>
                  {formatPrice(order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0))}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">배송비</span>
                <span>
                  {order.total > 50000
                    ? "무료"
                    : formatPrice(
                        order.total - order.items.reduce((acc, item) => acc + item.product.price * item.quantity, 0),
                      )}
                </span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-base">
                <span>총 결제금액</span>
                <span>{formatPrice(order.total)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end">
            <Button variant="outline" className="bg-transparent" onClick={() => onOpenChange(false)}>
              닫기
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
