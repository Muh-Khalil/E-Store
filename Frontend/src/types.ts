export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string[];
  category: string;
  subCategory: string;
  sizes: string[];
  date: number;
  bestSeller: boolean;
}

export interface CartItems {
  [itemId: string]: {
    [size: string]: number;
  };
}

export interface CartItem {
  _id: string;
  size: string;
  quantity: number;
}

export interface Address {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zipcode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
  shippingMethod?: string;
}

export interface OrderItem {
  _id: string;
  name: string;
  price: number;
  image: string[];
  quantity: number;
  size: string;
  status?: string;
  orderId?: string;
  orderAmount?: number;
  address?: Address;
  payment?: boolean;
  paymentMethod?: string;
  date?: number;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  address: Address;
  amount: number;
  status: string;
  payment: boolean;
  paymentMethod: string;
  date: number;
}

export interface User {
  name: string;
  email: string;
  phone?: string;
  addresses: Address[];
}

export interface Discount {
  code: string;
  discount: number;
}

export interface Reward {
  points: number;
  referralCredits: number;
  nextRewardAt?: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
}

export interface SupportTicket {
  _id: string;
  subject: string;
  category: string;
  message: string;
  status: string;
}

export interface ShopContextType {
  currency: string;
  products: Product[];
  delivery_fee: number;
  search: string;
  setSearch: (value: string) => void;
  showSearch: boolean;
  setShowSearch: (value: boolean) => void;
  cartItems: CartItems;
  setCartItems: (items: CartItems) => void;
  addToCart: (itemId: string, size: string) => void;
  getCartCount: () => number;
  getCartAmount: () => number;
  updateQuantity: (itemId: string, size: string, quantity: number) => void;
  navigate: (path: string) => void;
  backendUrl: string;
  token: string;
  setToken: (token: string) => void;
  wishlist: string[];
  setWishlist: (items: string[]) => void;
  clearWishlist: () => void;
  getWishlist: (token?: string) => void;
  addToWishlist: (productId: string) => void;
  removeFromWishlist: (productId: string) => void;
  discount: Discount | null;
  setDiscount: (discount: Discount | null) => void;
  applyPromotion: (code: string) => Promise<boolean>;
  clearDiscount: () => void;
  getDiscountAmount: () => number;
}

export interface PaymentMethod {
  id: string;
  name: string;
  enabled: boolean;
}

export interface PaymentConfig {
  methods: PaymentMethod[];
}

export interface Assets {
  logo: string;
  hero_img: string;
  cart_icon: string;
  dropdown_icon: string;
  exchange_icon: string;
  profile_icon: string;
  quality_icon: string;
  search_icon: string;
  star_dull_icon: string;
  star_icon: string;
  bin_icon: string;
  support_img: string;
  menu_icon: string;
  about_img: string;
  contact_img: string;
  razorpay_logo: string;
  stripe_logo: string;
  cross_icon: string;
}
