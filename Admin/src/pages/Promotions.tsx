import { memo, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchPromotions, createPromotion, updatePromotion, removePromotion } from '../store/growthSlice'
import { selectPromotions, selectGrowthLoading } from '../store/selectors'
import { currency } from '../App'
import { toast } from 'react-toastify'
import type { PromotionForm } from '../types'

const defaultForm: PromotionForm = {
  code: '',
  title: '',
  type: 'Percentage',
  value: '',
  minOrderAmount: '',
  startsAt: '',
  endsAt: '',
  description: '',
  active: true,
}

const Promotions = () => {
  const dispatch = useAppDispatch()
  const promotions = useAppSelector(selectPromotions)
  const loading = useAppSelector(selectGrowthLoading)
  const [form, setForm] = useState<PromotionForm>(defaultForm)
  const [editingId, setEditingId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchPromotions())
  }, [dispatch])

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId('')
  }

  const savePromotion = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.code.trim() || !form.title.trim()) {
      toast.error('Code and title are required')
      return
    }
    setSaving(true)
    const payload = { ...form, value: Number(form.value), minOrderAmount: Number(form.minOrderAmount) }
    const result = editingId
      ? await dispatch(updatePromotion({ id: editingId, ...payload }))
      : await dispatch(createPromotion(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Promotion saved')
      resetForm()
    } else {
      toast.error('Failed to save promotion')
    }
    setSaving(false)
  }

  const editPromotion = (promotion: typeof promotions[0]) => {
    setEditingId(promotion._id)
    setForm({
      code: promotion.code || '',
      title: promotion.title || '',
      type: promotion.type || 'Percentage',
      value: String(promotion.value || ''),
      minOrderAmount: String(promotion.minOrderAmount || ''),
      startsAt: promotion.startsAt || '',
      endsAt: promotion.endsAt || '',
      description: promotion.description || '',
      active: promotion.active !== false,
    })
  }

  const togglePromotion = async (promotion: typeof promotions[0]) => {
    await dispatch(updatePromotion({ id: promotion._id, ...promotion, active: !promotion.active }))
  }

  const deletePromotion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    const result = await dispatch(removePromotion(id))
    if (removePromotion.fulfilled.match(result)) {
      toast.success('Promotion deleted')
    }
  }

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Sales</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Promotions & Discounts</h1>
          <p className='mt-1 text-sm text-gray-500'>Create discount codes, fixed offers, and scheduled campaigns.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {promotions.filter((item) => item.active).length} active
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[380px_1fr]'>
        <form onSubmit={savePromotion} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>{editingId ? 'Edit Promotion' : 'Create Promotion'}</h2>
          <div className='mt-4 grid gap-3'>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder='Code, e.g. SUMMER20' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder='Promotion title' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
              <option>Percentage</option>
              <option>Fixed Amount</option>
              <option>Free Shipping</option>
              <option>Buy One Get One</option>
            </select>
            <div className='grid grid-cols-2 gap-3'>
              <input type='number' min='0' value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder='Value' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
              <input type='number' min='0' value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} placeholder='Min order' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            </div>
            <div className='grid grid-cols-2 gap-3'>
              <input type='date' value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
              <input type='date' value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            </div>
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder='Offer notes' className='min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <label className='flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700'>
              <input type='checkbox' checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active promotion
            </label>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <button disabled={saving} className='rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>{saving ? 'Saving...' : 'Save Promotion'}</button>
            {editingId && <button type='button' onClick={resetForm} className='rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700'>Cancel</button>}
          </div>
        </form>

        <div className='grid gap-3'>
          {loading ? (
            <div className='animate-pulse space-y-4 p-5'>
              {[1,2,3].map(i => <div key={i} className='h-28 rounded-3xl bg-gray-200' />)}
            </div>
          ) : promotions.length === 0 ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>No promotions created yet.</div>
          ) : promotions.map((promotion) => (
            <div key={promotion._id} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-black text-gray-900'>{promotion.title}</p>
                    <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{promotion.code}</span>
                    <span className={`rounded-full px-3 py-1 text-xs font-bold ${promotion.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{promotion.active ? 'Active' : 'Paused'}</span>
                  </div>
                  <p className='mt-2 text-sm font-semibold text-gray-700'>{promotion.type} - {promotion.type === 'Percentage' ? `${promotion.value}%` : `${currency}${promotion.value}`}</p>
                  <p className='mt-2 text-sm leading-6 text-gray-600'>{promotion.description || 'No description'}</p>
                  <p className='mt-2 text-xs text-gray-500'>Min order {currency}{promotion.minOrderAmount || 0} &middot; {promotion.startsAt || 'Any time'} to {promotion.endsAt || 'No end date'}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <button onClick={() => editPromotion(promotion)} className='rounded-full border border-orange-100 bg-[#FFF3EE] px-4 py-2 text-xs font-bold text-[#E8420A]'>Edit</button>
                  <button onClick={() => togglePromotion(promotion)} className='rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700'>{promotion.active ? 'Pause' : 'Activate'}</button>
                  <button onClick={() => deletePromotion(promotion._id)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50'>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(Promotions)
