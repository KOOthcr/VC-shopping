"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useStore } from "@/lib/store"
import { useToast } from "@/hooks/use-toast"

const categories = ["액세서리", "상의", "하의", "니트웨어", "데님", "원피스", "아우터"]

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const addProduct = useStore((state) => state.addProduct)

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    description: "",
    stock: "",
    image: "",
  })
  const [colors, setColors] = useState<string[]>([])
  const [sizes, setSizes] = useState<string[]>([])
  const [newColor, setNewColor] = useState("")
  const [newSize, setNewSize] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddColor = () => {
    if (newColor && !colors.includes(newColor)) {
      setColors([...colors, newColor])
      setNewColor("")
    }
  }

  const handleRemoveColor = (color: string) => {
    setColors(colors.filter((c) => c !== color))
  }

  const handleAddSize = () => {
    if (newSize && !sizes.includes(newSize)) {
      setSizes([...sizes, newSize])
      setNewSize("")
    }
  }

  const handleRemoveSize = (size: string) => {
    setSizes(sizes.filter((s) => s !== size))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const product = {
      id: `PROD-${Date.now()}`,
      name: formData.name,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      category: formData.category,
      description: formData.description,
      stock: Number(formData.stock),
      image: formData.image || "/diverse-fashion-display.png",
      colors: colors.length > 0 ? colors : undefined,
      sizes: sizes.length > 0 ? sizes : undefined,
    }

    addProduct(product)

    toast({
      title: "상품이 등록되었습니다",
      description: `${product.name}이(가) 성공적으로 등록되었습니다.`,
    })

    router.push("/admin/products")
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Button variant="ghost" size="sm" className="mb-4 -ml-2" onClick={() => router.back()}>
        <ChevronLeft className="h-4 w-4 mr-1" />
        뒤로가기
      </Button>

      <h1 className="text-2xl font-bold mb-8">상품 등록</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">상품명 *</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-1.5"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="price">판매가 *</Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                required
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="originalPrice">정가 (선택)</Label>
              <Input
                id="originalPrice"
                name="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={handleInputChange}
                className="mt-1.5"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">카테고리 *</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue placeholder="카테고리 선택" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="stock">재고 *</Label>
              <Input
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                required
                className="mt-1.5"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image">이미지 URL</Label>
            <Input
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              placeholder="https://example.com/image.jpg"
              className="mt-1.5"
            />
          </div>

          <div>
            <Label htmlFor="description">상품 설명</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              className="mt-1.5"
            />
          </div>
        </div>

        {/* Colors */}
        <div>
          <Label>색상 옵션</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={newColor}
              onChange={(e) => setNewColor(e.target.value)}
              placeholder="색상 입력"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddColor()
                }
              }}
            />
            <Button type="button" variant="outline" className="bg-transparent" onClick={handleAddColor}>
              추가
            </Button>
          </div>
          {colors.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {colors.map((color) => (
                <Badge key={color} variant="secondary" className="gap-1">
                  {color}
                  <button type="button" onClick={() => handleRemoveColor(color)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Sizes */}
        <div>
          <Label>사이즈 옵션</Label>
          <div className="flex gap-2 mt-1.5">
            <Input
              value={newSize}
              onChange={(e) => setNewSize(e.target.value)}
              placeholder="사이즈 입력"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleAddSize()
                }
              }}
            />
            <Button type="button" variant="outline" className="bg-transparent" onClick={handleAddSize}>
              추가
            </Button>
          </div>
          {sizes.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {sizes.map((size) => (
                <Badge key={size} variant="secondary" className="gap-1">
                  {size}
                  <button type="button" onClick={() => handleRemoveSize(size)}>
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex gap-3 pt-4">
          <Button type="button" variant="outline" className="flex-1 bg-transparent" onClick={() => router.back()}>
            취소
          </Button>
          <Button type="submit" className="flex-1">
            상품 등록
          </Button>
        </div>
      </form>
    </div>
  )
}
