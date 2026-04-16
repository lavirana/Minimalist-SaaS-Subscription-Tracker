// src/types/index.ts

export interface User {
    id:         number
    name:       string
    email:      string
    created_at: string
}

export interface Category {
    id:    number
    name:  string
    color: string
    icon:  string | null
}

export type BillingCycle = 'weekly' | 'monthly' | 'yearly'
export type SubStatus    = 'active' | 'paused' | 'cancelled'
export type Currency     = 'INR' | 'USD' | 'EUR' | 'GBP'

export interface Subscription {
    id:                  number
    user_id:             number
    category_id:         number | null
    category:            Category | null
    name:                string
    description:         string | null
    price:               number
    currency:            Currency
    billing_cycle:       BillingCycle
    renewal_date:        string   // "2026-05-15"
    start_date:          string
    status:              SubStatus
    website:             string | null
    logo:                string | null
    color:               string | null
    notes:               string | null
    reminder:            boolean
    reminder_days:       number
    days_until_renewal:  number
    monthly_equivalent:  number
    is_overdue:          boolean
    created_at:          string
    updated_at:          string
}

export interface SubscriptionFormData {
    name:          string
    description:   string
    price:         number
    currency:      Currency
    billing_cycle: BillingCycle
    renewal_date:  string
    start_date:    string
    status:        SubStatus
    category_id:   number | null
    website:       string
    color:         string
    notes:         string
    reminder:      boolean
    reminder_days: number
}

export interface DashboardStats {
    monthly_total:  number
    yearly_total:   number
    active_count:   number
    upcoming:       Subscription[]
    overdue:        Subscription[]
    by_category:    CategoryStat[]
    most_expensive: Subscription | null
}

export interface CategoryStat {
    category: string
    color:    string
    total:    number
    count:    number
}

export interface AuthResponse {
    user:  User
    token: string
}

export interface ApiError {
    message: string
    errors?: Record<string, string[]>
}