import { memo, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { useAppSelector } from '../store/hooks'
import { selectAdminToken } from '../store/selectors'
import type { AdminModule } from '../types'

const productActions = [
  { label: 'Add new product', to: '/add' },
  { label: 'Edit existing products', to: '/list' },
  { label: 'Delete products', to: '/list' },
  { label: 'Upload product images', to: '/add' },
  { label: 'Set pricing', to: '/list' },
  { label: 'Manage variants', to: '/list' },
  { label: 'Assign categories', to: '/list' },
  { label: 'Track inventory levels', to: '/inventory' },
]

interface SectionConfig {
  eyebrow: string
  title: string
  description: string
  summary: string
  actions: Array<{ label: string; to?: string }>
  ready?: boolean
}

export const adminSections: Record<string, SectionConfig> = {
  products: {
    eyebrow: 'Catalog',
    title: 'Products',
    description: 'Manage the entire product catalog: products, images, pricing, variants, categories, and stock visibility.',
    summary: 'Products = What we sell',
    actions: productActions,
    ready: true,
  },
  customers: {
    eyebrow: 'People',
    title: 'Customers',
    description: 'Manage customer profiles, order history, customer groups, support context, and lifetime value.',
    summary: 'Customers = Who buys from us',
    actions: ['View customer profiles', 'Check order history', 'Manage customer groups', 'Handle support issues', 'Review customer lifetime value'].map(l => ({ label: l })),
    ready: false,
  },
  inventory: {
    eyebrow: 'Stock',
    title: 'Inventory',
    description: 'Monitor and control stock levels across products, warehouses, and stock movement history.',
    summary: 'Inventory = What stock we have',
    actions: ['View current stock', 'Adjust inventory quantities', 'Track low-stock products', 'Manage warehouses/locations', 'Record stock movements'].map(l => ({ label: l })),
    ready: false,
  },
  categories: {
    eyebrow: 'Catalog',
    title: 'Categories',
    description: 'Organize products into clear collections and maintain category presentation.',
    summary: 'Categories = How products are organized',
    actions: ['Create categories', 'Edit category structure', 'Manage category images and descriptions', 'Assign products to categories'].map(l => ({ label: l })),
  },
  promotions: {
    eyebrow: 'Sales',
    title: 'Promotions & Discounts',
    description: 'Create marketing offers and discount campaigns for the storefront.',
    summary: 'Promotions = Why customers buy now',
    actions: ['Discount codes', 'Percentage and fixed discounts', 'Buy-One-Get-One offers', 'Scheduled promotions', 'Free shipping campaigns'].map(l => ({ label: l })),
  },
  content: {
    eyebrow: 'Website',
    title: 'Content Management',
    description: 'Manage homepage content, landing pages, editorial content, and policy pages.',
    summary: 'Content = What the website says',
    actions: ['Homepage banners', 'Landing pages', 'Blog posts', 'FAQ pages', 'Terms and policies'].map(l => ({ label: l })),
  },
  analytics: {
    eyebrow: 'Reports',
    title: 'Analytics & Reports',
    description: 'Monitor store performance through sales, revenue, product, customer, and traffic reports.',
    summary: 'Reports = How we measure performance',
    actions: ['Sales reports', 'Revenue tracking', 'Product performance', 'Customer analytics', 'Conversion rates', 'Traffic reports'].map(l => ({ label: l })),
  },
  marketing: {
    eyebrow: 'Growth',
    title: 'Marketing',
    description: 'Manage campaigns and customer engagement programs.',
    summary: 'Marketing = How we attract customers',
    actions: ['Email campaigns', 'SMS campaigns', 'Abandoned cart recovery', 'Loyalty programs', 'Referral programs'].map(l => ({ label: l })),
  },
  reviews: {
    eyebrow: 'Feedback',
    title: 'Reviews',
    description: 'Moderate customer feedback and maintain public product ratings.',
    summary: 'Reviews = What customers say',
    actions: ['Approve reviews', 'Remove inappropriate reviews', 'Respond to customer feedback', 'Monitor ratings'].map(l => ({ label: l })),
  },
  shipping: {
    eyebrow: 'Delivery',
    title: 'Shipping',
    description: 'Configure delivery options, zones, rates, carriers, and tracking settings.',
    summary: 'Shipping = How orders arrive',
    actions: ['Shipping methods', 'Shipping rates', 'Carrier integrations', 'Delivery zones', 'Tracking settings'].map(l => ({ label: l })),
  },
  payments: {
    eyebrow: 'Checkout',
    title: 'Payments',
    description: 'Manage gateways, payment transactions, refunds, and payment-related settings.',
    summary: 'Payments = How customers pay',
    actions: ['Payment gateways', 'Transaction history', 'Refund management', 'Payment settings'].map(l => ({ label: l })),
  },
  staff: {
    eyebrow: 'Access',
    title: 'Users & Staff',
    description: 'Control employee access, roles, permissions, security, and admin activity.',
    summary: 'Users & Staff = Who can access the admin system',
    actions: ['Create staff accounts', 'Assign roles and permissions', 'Monitor admin activity', 'Manage security settings'].map(l => ({ label: l })),
  },
  settings: {
    eyebrow: 'Store',
    title: 'Settings',
    description: 'Configure store-wide information, localization, notifications, and integrations.',
    summary: 'Settings = How the store is configured',
    actions: ['Store information', 'Tax settings', 'Currency settings', 'Language settings', 'Notification settings', 'Integrations'].map(l => ({ label: l })),
  },
  support: {
    eyebrow: 'Help Desk',
    title: 'Support',
    description: 'Handle customer service operations, tickets, live chat, returns, exchanges, and notes.',
    summary: 'Support = How we help customers',
    actions: ['Customer tickets', 'Live chat', 'Returns and exchanges', 'Internal notes'].map(l => ({ label: l })),
  },
}

interface AdminSectionProps {
  sectionKey: string
}

const AdminSection = ({ sectionKey }: AdminSectionProps) => {
  const token = useAppSelector(selectAdminToken)
  const section = adminSections[sectionKey] || adminSections.products
  const [records, setRecords] = useState<AdminModule[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const fetchRecords = async () => {
    if (section.ready || !token) return
    try {
      const response = await axios.get(`${backendUrl}/api/admin-module/${sectionKey}`, { headers: { token } })
      if (response.data.success) {
        setRecords(response.data.records)
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const createRecord = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    try {
      setLoading(true)
      const response = await axios.post(`${backendUrl}/api/admin-module/${sectionKey}`, {
        title,
        description,
        status: 'Open',
        metadata: { source: 'admin-dashboard' }
      }, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        setTitle('')
        setDescription('')
        fetchRecords()
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    } finally {
      setLoading(false)
    }
  }

  const removeRecord = async (recordId: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    try {
      const response = await axios.delete(`${backendUrl}/api/admin-module/${recordId}`, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchRecords()
      } else {
        toast.error(response.data.message)
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  useEffect(() => {
    setRecords([])
    fetchRecords()
  }, [sectionKey, token])

  return (
    <section>
      <div className='mb-6 rounded-3xl border border-orange-100 bg-[#FFF8F5] p-6 sm:p-8'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>{section.eyebrow}</p>
        <h1 className='mt-2 text-3xl font-black text-gray-900'>{section.title}</h1>
        <p className='mt-3 max-w-3xl text-sm leading-7 text-gray-600'>{section.description}</p>
      </div>

      <div className='grid gap-5 lg:grid-cols-[1fr_340px]'>
        <div className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <div className='mb-5 flex items-center justify-between gap-4'>
            <div>
              <h2 className='text-lg font-black text-gray-900'>Available Features</h2>
              <p className='mt-1 text-sm text-gray-500'>{section.ready ? 'Connected to current admin workflows.' : 'Backed by database records for this module.'}</p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${section.ready ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'}`}>
              {section.ready ? 'Active' : 'Functional'}
            </span>
          </div>

          <div className='grid gap-3 md:grid-cols-2'>
            {section.actions.map((action) => {
              const content = (
                <div className='flex min-h-20 items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 transition hover:border-orange-100 hover:bg-[#FFF8F5]'>
                  <p className='text-sm font-semibold text-gray-800'>{action.label}</p>
                  <span className='text-lg font-black text-[#E8420A]'>+</span>
                </div>
              )
              return action.to ? (
                <Link key={action.label} to={action.to}>{content}</Link>
              ) : (
                <button key={action.label} type='button' onClick={() => setTitle(action.label)} className='text-left'>{content}</button>
              )
            })}
          </div>

          {!section.ready && (
            <div className='mt-6 rounded-3xl border border-gray-100 bg-gray-50 p-5'>
              <h3 className='text-base font-black text-gray-900'>Create {section.title} Record</h3>
              <form onSubmit={createRecord} className='mt-4 grid gap-3'>
                <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder='Record title' className='rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]' />
                <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder='Notes or description' className='min-h-24 rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-[#E8420A]' />
                <button disabled={loading} className='w-fit rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>{loading ? 'Saving...' : 'Save Record'}</button>
              </form>
            </div>
          )}
        </div>

        <aside className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h3 className='text-sm font-black uppercase tracking-[0.18em] text-gray-500'>Simple explanation</h3>
          <p className='mt-4 rounded-2xl bg-[#FFF3EE] p-4 text-sm font-semibold leading-7 text-[#E8420A]'>{section.summary}</p>

          {!section.ready && (
            <div className='mt-5'>
              <h4 className='mb-3 text-sm font-black text-gray-900'>Saved Records</h4>
              <div className='flex max-h-[420px] flex-col gap-3 overflow-y-auto'>
                {records.length === 0 ? (
                  <p className='rounded-2xl border border-dashed border-gray-200 p-4 text-sm text-gray-500'>No records yet.</p>
                ) : records.map((record) => (
                  <div key={record._id} className='rounded-2xl border border-gray-100 p-4'>
                    <div className='flex items-start justify-between gap-3'>
                      <div>
                        <p className='text-sm font-bold text-gray-900'>{record.title}</p>
                        <p className='mt-1 text-xs leading-5 text-gray-500'>{record.description || 'No description'}</p>
                      </div>
                      <button onClick={() => removeRecord(record._id)} className='text-xs font-bold text-red-600'>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  )
}

export default memo(AdminSection)
