import { memo, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchCampaigns, createCampaign, updateCampaign, removeCampaign } from '../store/growthSlice'
import { selectCampaigns, selectGrowthLoading } from '../store/selectors'
import { currency } from '../App'
import { toast } from 'react-toastify'
import type { MarketingForm } from '../types'

const defaultForm: MarketingForm = {
  name: '',
  channel: 'Email',
  audience: 'All customers',
  budget: '',
  status: 'Draft',
  scheduledAt: '',
  message: '',
}

const Marketing = () => {
  const dispatch = useAppDispatch()
  const campaigns = useAppSelector(selectCampaigns)
  const loading = useAppSelector(selectGrowthLoading)
  const [form, setForm] = useState<MarketingForm>(defaultForm)
  const [editingId, setEditingId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchCampaigns())
  }, [dispatch])

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId('')
  }

  const saveCampaign = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim()) {
      toast.error('Campaign name is required')
      return
    }
    setSaving(true)
    const payload = { ...form, budget: Number(form.budget) }
    const result = editingId
      ? await dispatch(updateCampaign({ id: editingId, ...payload }))
      : await dispatch(createCampaign(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Campaign saved')
      resetForm()
    } else {
      toast.error('Failed to save campaign')
    }
    setSaving(false)
  }

  const editCampaign = (campaign: typeof campaigns[0]) => {
    setEditingId(campaign._id)
    setForm({
      name: campaign.name || '',
      channel: campaign.channel || 'Email',
      audience: campaign.audience || 'All customers',
      budget: String(campaign.budget || ''),
      status: campaign.status || 'Draft',
      scheduledAt: campaign.scheduledAt || '',
      message: campaign.message || '',
    })
  }

  const toggleCampaign = async (campaign: typeof campaigns[0]) => {
    const newStatus = campaign.status === 'Running' ? 'Paused' : 'Running'
    await dispatch(updateCampaign({ id: campaign._id, ...campaign, status: newStatus }))
  }

  const deleteCampaign = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    const result = await dispatch(removeCampaign(id))
    if (removeCampaign.fulfilled.match(result)) {
      toast.success('Campaign deleted')
    }
  }

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Growth</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Marketing</h1>
          <p className='mt-1 text-sm text-gray-500'>Plan email, SMS, loyalty, referral, and recovery campaigns.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {campaigns.length} campaigns
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[380px_1fr]'>
        <form onSubmit={saveCampaign} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>{editingId ? 'Edit Campaign' : 'Create Campaign'}</h2>
          <div className='mt-4 grid gap-3'>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder='Campaign name' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <select value={form.channel} onChange={(e) => setForm({ ...form, channel: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
              <option>Email</option>
              <option>SMS</option>
              <option>Abandoned Cart</option>
              <option>Loyalty</option>
              <option>Referral</option>
            </select>
            <input value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })} placeholder='Audience' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <div className='grid grid-cols-2 gap-3'>
              <input type='number' min='0' value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} placeholder='Budget' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
              <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
                <option>Draft</option>
                <option>Scheduled</option>
                <option>Running</option>
                <option>Paused</option>
                <option>Completed</option>
              </select>
            </div>
            <input type='date' value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder='Campaign message' className='min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <button disabled={saving} className='rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>{saving ? 'Saving...' : 'Save Campaign'}</button>
            {editingId && <button type='button' onClick={resetForm} className='rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700'>Cancel</button>}
          </div>
        </form>

        <div className='grid gap-3'>
          {loading ? (
            <div className='animate-pulse space-y-4 p-5'>
              {[1,2,3].map(i => <div key={i} className='h-28 rounded-3xl bg-gray-200' />)}
            </div>
          ) : campaigns.length === 0 ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>No campaigns yet.</div>
          ) : campaigns.map((campaign) => (
            <div key={campaign._id} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div>
                  <div className='flex flex-wrap items-center gap-2'>
                    <p className='font-black text-gray-900'>{campaign.name}</p>
                    <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{campaign.channel}</span>
                    <span className='rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-600'>{campaign.status}</span>
                  </div>
                  <p className='mt-2 text-sm font-semibold text-gray-700'>{campaign.audience} &middot; {currency}{campaign.budget || 0}</p>
                  <p className='mt-2 text-sm leading-6 text-gray-600'>{campaign.message || 'No campaign message'}</p>
                  <p className='mt-2 text-xs text-gray-500'>Scheduled: {campaign.scheduledAt || 'Not scheduled'}</p>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <button onClick={() => editCampaign(campaign)} className='rounded-full border border-orange-100 bg-[#FFF3EE] px-4 py-2 text-xs font-bold text-[#E8420A]'>Edit</button>
                  <button onClick={() => toggleCampaign(campaign)} className='rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700'>{campaign.status === 'Running' ? 'Pause' : 'Run'}</button>
                  <button onClick={() => deleteCampaign(campaign._id)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50'>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(Marketing)
