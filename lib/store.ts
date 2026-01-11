// 전역 상태 관리를 위한 스토어
import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  image: string
  images?: string[]
  category: string
  colors?: string[]
  sizes?: string[]
  description?: string
  stock: number
}

export interface CartItem {
  product: Product
  quantity: number
  selectedColor?: string
  selectedSize?: string
}

export interface Order {
  id: string
  items: CartItem[]
  total: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  createdAt: string
  shippingAddress: {
    name: string
    phone: string
    address: string
    detailAddress: string
    zipCode: string
  }
  paymentMethod: string
}

interface StoreState {
  cart: CartItem[]
  orders: Order[]
  products: Product[]
  addToCart: (item: CartItem) => void
  removeFromCart: (productId: string) => void
  updateCartQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  addOrder: (order: Order) => void
  updateOrderStatus: (orderId: string, status: Order["status"]) => void
  addProduct: (product: Product) => void
  updateProduct: (product: Product) => void
  deleteProduct: (productId: string) => void
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "DOUBLE POCKET FAUX SUEDE TOTE BAG",
    price: 89900,
    image: "/brown-suede-tote-bag-with-double-pockets.jpg",
    category: "액세서리",
    colors: ["브라운", "블랙"],
    stock: 50,
  },
  {
    id: "2",
    name: "FAUX SUEDE SHOULDER BAG",
    price: 79900,
    image: "/olive-green-suede-shoulder-bag.jpg",
    category: "액세서리",
    colors: ["올리브", "베이지"],
    stock: 30,
  },
  {
    id: "3",
    name: "RECTANGULAR FAUX SUEDE TOTE BAG",
    price: 79900,
    image: "/khaki-suede-rectangular-tote-bag.jpg",
    category: "액세서리",
    colors: ["카키", "블랙"],
    stock: 45,
  },
  {
    id: "4",
    name: "TWO WAY DENIM FUNNEL NECK BELTED PLEATED OVERSIZED JACKET",
    price: 79900,
    image: "/olive-green-oversized-denim-jacket-with-belt.jpg",
    category: "상의",
    colors: ["올리브", "블루"],
    sizes: ["S", "M", "L", "XL"],
    stock: 25,
  },
  {
    id: "5",
    name: "WOOL-LOOK FUNNEL NECK LONG SLEEVE OVERSIZED JACKET",
    price: 99900,
    image: "/black-wool-oversized-jacket.jpg",
    category: "상의",
    colors: ["블랙", "그레이", "베이지", "네이비"],
    sizes: ["S", "M", "L", "XL"],
    stock: 40,
  },
  {
    id: "6",
    name: "RIBBED KNIT CROP TOP",
    price: 39900,
    image: "/white-ribbed-knit-crop-top.jpg",
    category: "상의",
    colors: ["화이트", "블랙", "베이지"],
    sizes: ["S", "M", "L"],
    stock: 60,
  },
  {
    id: "7",
    name: "HIGH WAIST WIDE LEG JEANS",
    price: 69900,
    image: "/blue-high-waist-wide-leg-jeans.jpg",
    category: "하의",
    colors: ["라이트블루", "다크블루"],
    sizes: ["XS", "S", "M", "L", "XL"],
    stock: 35,
  },
  {
    id: "8",
    name: "PLEATED MINI SKIRT",
    price: 49900,
    image: "/black-pleated-mini-skirt.jpg",
    category: "하의",
    colors: ["블랙", "그레이", "네이비"],
    sizes: ["XS", "S", "M", "L"],
    stock: 55,
  },
]

export const useStore = create<StoreState>()(
  persist(
    (set) => ({
      cart: [],
      orders: [],
      products: initialProducts,
      addToCart: (item) =>
        set((state) => {
          const existingItem = state.cart.find(
            (i) =>
              i.product.id === item.product.id &&
              i.selectedColor === item.selectedColor &&
              i.selectedSize === item.selectedSize,
          )
          if (existingItem) {
            return {
              cart: state.cart.map((i) =>
                i.product.id === item.product.id &&
                i.selectedColor === item.selectedColor &&
                i.selectedSize === item.selectedSize
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i,
              ),
            }
          }
          return { cart: [...state.cart, item] }
        }),
      removeFromCart: (productId) =>
        set((state) => ({
          cart: state.cart.filter((i) => i.product.id !== productId),
        })),
      updateCartQuantity: (productId, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) => (i.product.id === productId ? { ...i, quantity } : i)),
        })),
      clearCart: () => set({ cart: [] }),
      addOrder: (order) => set((state) => ({ orders: [order, ...state.orders] })),
      updateOrderStatus: (orderId, status) =>
        set((state) => ({
          orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
        })),
      addProduct: (product) => set((state) => ({ products: [...state.products, product] })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((p) => (p.id === product.id ? product : p)),
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
    }),
    {
      name: "shop-storage",
    },
  ),
)
