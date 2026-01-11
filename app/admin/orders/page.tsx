"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Eye, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { OrderDetailDialog } from "@/components/admin/order-detail-dialog"
import { useStore, type Order } from "@/lib/store"

const statusMap: Record<string, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  pending: { label: "결제완료", variant: "default" },
  processing: { label: "상품준비중", variant: "secondary" },
  shipped: { label: "배송중", variant: "secondary" },
  delivered: { label: "배송완료", variant: "outline" },
  cancelled: { label: "취소됨", variant: "destructive" },
}

export default function AdminOrdersPage() {
  const orders = useStore((state) => state.orders)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const formatPrice = (price: number) => `₩${price.toLocaleString()}`
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
  }

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shippingAddress.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">주문 조회</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="주문번호 또는 주문자명 검색"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="상태 필터" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">전체 상태</SelectItem>
            <SelectItem value="pending">결제완료</SelectItem>
            <SelectItem value="processing">상품준비중</SelectItem>
            <SelectItem value="shipped">배송중</SelectItem>
            <SelectItem value="delivered">배송완료</SelectItem>
            <SelectItem value="cancelled">취소됨</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Orders Table */}
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>주문번호</TableHead>
              <TableHead>주문일시</TableHead>
              <TableHead>주문자</TableHead>
              <TableHead>상품</TableHead>
              <TableHead className="text-right">결제금액</TableHead>
              <TableHead className="text-center">상태</TableHead>
              <TableHead className="w-[80px]">상세</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  {orders.length === 0 ? "아직 주문이 없습니다." : "검색 결과가 없습니다."}
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>
                    <p className="font-medium text-sm">{order.id}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{order.shippingAddress.name}</p>
                      <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {order.items.slice(0, 2).map((item, index) => (
                          <div
                            key={index}
                            className="relative w-8 h-10 rounded overflow-hidden border-2 border-background bg-muted"
                          >
                            <Image
                              src={item.product.image || "/placeholder.svg"}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {order.items.length > 1 ? `외 ${order.items.length - 1}건` : "1건"}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatPrice(order.total)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant={statusMap[order.status].variant}>{statusMap[order.status].label}</Badge>
                  </TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleViewOrder(order)}>
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Order Statistics */}
      {orders.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-muted-foreground">전체 주문</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{orders.filter((o) => o.status === "pending").length}</p>
            <p className="text-sm text-muted-foreground">결제완료</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{orders.filter((o) => o.status === "processing").length}</p>
            <p className="text-sm text-muted-foreground">준비중</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{orders.filter((o) => o.status === "shipped").length}</p>
            <p className="text-sm text-muted-foreground">배송중</p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">{orders.filter((o) => o.status === "delivered").length}</p>
            <p className="text-sm text-muted-foreground">배송완료</p>
          </div>
        </div>
      )}

      {/* Order Detail Dialog */}
      <OrderDetailDialog order={selectedOrder} open={dialogOpen} onOpenChange={setDialogOpen} />
    </div>
  )
}
