export type Customer = {
  id: number
  customer: string
  customerId: string
  email: string
  country: string
  countryCode: string
  countryFlag?: string
  order: number
  totalSpent: number
  avatar: string
  status?: string
  contact?: string
}

export type ReferralsType = {
  id: number
  user: string
  email: string
  avatar: string
  referredId: number
  status: string
  value: string
  earning: string
}

export type ReviewType = {
  id: number
  product: string
  companyName: string
  productImage: string
  reviewer: string
  email: string
  avatar: string
  date: string
  status: string
  review: number
  head: string
  para: string
}

export type ProductType = {
  id: number
  productName: string
  category: string
  stock: boolean
  sku: number
  price: string
  qty: number
  status: string
  image: string
  productBrand: string
}

export type OrderType = {
  id: number
  order: string
  customer: string
  email: string
  avatar: string
  payment: number
  status: string
  spent: number
  method: string
  date: string
  time: string
  methodNumber: number
}

export type CareerType = {
  id: number
  jobTitle: string
  location: string
  salary: string
  category: string
  jobType: string
  status: string
  createdAt?: string
}

export type EntryType = {
  id: number
  firstName: string
  lastName: string
  email: string
  phone: string
  resume: string
  appliedBefore: boolean
  sponsorship: boolean
  isOver18: boolean
  referral: string
  jobTitle: string
  category: string
}

export type ContactType = {
  id: number
  title: string
  firstName: string
  surname: string
  role: string
  company: string
  industry: string
  street: string
  city: string
  country: string
  email: string
  telephone: string
  mobile: string
  purpose: string
  subject: string
  message: string
}

export type FaqType = {
  id: number
  title: string
  description: string
}

export type ECommerceType = {
  products: ProductType[]
  orderData: OrderType[]
  customerData: Customer[]
  reviews: ReviewType[]
  referrals: ReferralsType[]
  careers: CareerType[]
  entries: EntryType[]
  contacts: ContactType[]
  faqs: FaqType[]
}
