import { memo, useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchInventory, upsertInventory, removeInventory } from '../store/inventorySlice'
import { selectInventory, selectInventoryLoading } from '../store/selectors'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import axios from 'axios'
import type { InventoryForm } from '../types'

const defaultForm: InventoryForm = {
  productId: '',
  quantity: '',
  lowStockThreshold: '5',
  location: 'Main warehouse',
  lastMovement: 'Stock adjusted',
}

const Inventory = () => {
  const dispatch = useAppDispatch()
  const records = useAppSelector(selectInventory)
  const loading = useAppSelector(selectInventoryLoading)
  const [products, setProducts] = useState<Array<{ _id: string; name: string }>>([])
  const [form, setForm] = useState<InventoryForm>(defaultForm)
  const [saving, setSaving] = useState(false)
  const [removingId, setRemovingId] = useState('')

  const fetchProducts = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/product/list`)
      if (response.data.success) setProducts(response.data.products)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const saveInventory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.productId) {
      toast.error('Select a product')
      return
    }
    setSaving(true)
    const result = await dispatch(upsertInventory(form))
    if (upsertInventory.fulfilled.match(result)) {
      toast.success(result.payload?.message || 'Inventory saved')
      setForm(defaultForm)
    } else if (upsertInventory.rejected.match(result)) {
      toast.error(result.error?.message || 'Failed to save inventory')
    }
    setSaving(false)
  }

  const removeInventoryHandler = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    setRemovingId(id)
    const result = await dispatch(removeInventory(id))
    if (removeInventory.fulfilled.match(result)) {
      toast.success('Inventory record removed')
    } else if (removeInventory.rejected.match(result)) {
      toast.error(result.error?.message || 'Failed to remove inventory')
    }
    setRemovingId('')
  }

  useEffect(() => {
    dispatch(fetchInventory())
    fetchProducts()
  }, [dispatch])

  const lowStockCount = useMemo(
    () => records.filter((item) => Number(item.quantity) <= Number(item.lowStockThreshold)).length,
    [records]
  )

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Stock</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Inventory</h1>
          <p className='mt-1 text-sm text-gray-500'>Track quantities, low-stock products, and warehouse movement notes.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {lowStockCount} low stock
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[360px_1fr]'>
        <form onSubmit={saveInventory} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>Update Stock</h2>
          <div className='mt-4 grid gap-3'>
            <select value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
              <option value=''>Select product</option>
              {products.map((product) => <option key={product._id} value={product._id}>{product.name}</option>)}
            </select>
            <input type='number' min='0' value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} placeholder='Quantity' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <input type='number' min='0' value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} placeholder='Low stock threshold' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder='Location' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <textarea value={form.lastMovement} onChange={(e) => setForm({ ...form, lastMovement: e.target.value })} placeholder='Movement note' className='min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
          </div>
          <button disabled={saving} className='mt-4 rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>
            {saving ? 'Saving...' : 'Save Inventory'}
          </button>
        </form>

        <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
          <div className='hidden grid-cols-[minmax(220px,1fr)_110px_120px_150px_130px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-gray-500 md:grid'>
            <p>Product</p>
            <p>Quantity</p>
            <p>Status</p>
            <p>Location</p>
            <p>Action</p>
          </div>
          {loading ? (
            <div className='animate-pulse space-y-4 p-5'>
              {[1,2,3].map(i => <div key={i} className='h-16 rounded-2xl bg-gray-200' />)}
            </div>
          ) : records.length === 0 ? (
            <div className='p-10 text-center text-sm text-gray-500'>No inventory records yet.</div>
          ) : (
            <div className='divide-y divide-gray-100'>
              {records.map((record) => {
                const isLow = Number(record.quantity) <= Number(record.lowStockThreshold)
                return (
                  <div key={record._id} className='grid gap-3 px-5 py-4 text-sm transition hover:bg-gray-50/70 md:grid-cols-[minmax(220px,1fr)_110px_120px_150px_130px] md:items-center'>
                    <div>
                      <p className='font-bold text-gray-900'>{record.productName}</p>
                      <p className='mt-1 text-xs text-gray-500'>{record.lastMovement || 'No movement note'}</p>
                    </div>
                    <p className='font-black text-gray-900'>{record.quantity}</p>
                    <p><span className={`rounded-full px-3 py-1 text-xs font-bold ${isLow ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-700'}`}>{isLow ? 'Low stock' : 'In stock'}</span></p>
                    <p className='text-gray-600'>{record.location || 'Main warehouse'}</p>
                    <button onClick={() => removeInventoryHandler(record._id)} disabled={removingId === record._id} className='w-fit rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 disabled:opacity-60'>
                      {removingId === record._id ? 'Removing' : 'Remove'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default memo(Inventory)
