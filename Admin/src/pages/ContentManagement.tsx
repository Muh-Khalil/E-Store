import { memo, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchContent, createContent, updateContent, removeContent } from '../store/growthSlice'
import { selectContentItems, selectGrowthLoading } from '../store/selectors'
import { toast } from 'react-toastify'
import type { ContentForm } from '../types'

const defaultForm: ContentForm = {
  title: '',
  type: 'Homepage Banner',
  slug: '',
  image: '',
  body: '',
  published: false,
}

const slugify = (value: string): string =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')

const ContentManagement = () => {
  const dispatch = useAppDispatch()
  const items = useAppSelector(selectContentItems)
  const loading = useAppSelector(selectGrowthLoading)
  const [form, setForm] = useState<ContentForm>(defaultForm)
  const [editingId, setEditingId] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    dispatch(fetchContent())
  }, [dispatch])

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId('')
  }

  const saveContent = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.title.trim()) {
      toast.error('Title is required')
      return
    }
    setSaving(true)
    const payload = { ...form, slug: form.slug || slugify(form.title) }
    const result = editingId
      ? await dispatch(updateContent({ id: editingId, ...payload }))
      : await dispatch(createContent(payload))
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Content saved')
      resetForm()
    } else {
      toast.error('Failed to save content')
    }
    setSaving(false)
  }

  const editContent = (item: typeof items[0]) => {
    setEditingId(item._id)
    setForm({
      title: item.title || '',
      type: item.type || 'Homepage Banner',
      slug: item.slug || '',
      image: item.image || '',
      body: item.body || '',
      published: item.published === true,
    })
  }

  const togglePublish = async (item: typeof items[0]) => {
    await dispatch(updateContent({ id: item._id, ...item, published: !item.published }))
  }

  const deleteContent = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    const result = await dispatch(removeContent(id))
    if (removeContent.fulfilled.match(result)) {
      toast.success('Content deleted')
    }
  }

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Website</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Content Management</h1>
          <p className='mt-1 text-sm text-gray-500'>Manage homepage banners, landing pages, posts, FAQs, and policies.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {items.filter((item) => item.published).length} published
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[380px_1fr]'>
        <form onSubmit={saveContent} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>{editingId ? 'Edit Content' : 'Create Content'}</h2>
          <div className='mt-4 grid gap-3'>
            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: form.slug || slugify(e.target.value) })} placeholder='Title' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]'>
              <option>Homepage Banner</option>
              <option>Landing Page</option>
              <option>Blog Post</option>
              <option>FAQ Page</option>
              <option>Terms & Policy</option>
            </select>
            <input value={form.slug} onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })} placeholder='Slug' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder='Image URL' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <textarea value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} placeholder='Content body' className='min-h-32 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <label className='flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700'>
              <input type='checkbox' checked={form.published} onChange={(e) => setForm({ ...form, published: e.target.checked })} />
              Published
            </label>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <button disabled={saving} className='rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>{saving ? 'Saving...' : 'Save Content'}</button>
            {editingId && <button type='button' onClick={resetForm} className='rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700'>Cancel</button>}
          </div>
        </form>

        <div className='grid gap-3'>
          {loading ? (
            <div className='animate-pulse space-y-4 p-5'>
              {[1,2,3].map(i => <div key={i} className='h-28 rounded-3xl bg-gray-200' />)}
            </div>
          ) : items.length === 0 ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>No content entries yet.</div>
          ) : items.map((item) => (
            <div key={item._id} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div className='flex gap-4'>
                  <div className='h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#FFF3EE]'>
                    {item.image ? <img src={item.image} alt={item.title} className='h-full w-full object-cover' /> : <div className='grid h-full place-items-center text-xl font-black text-[#E8420A]'>C</div>}
                  </div>
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='font-black text-gray-900'>{item.title}</p>
                      <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{item.type}</span>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${item.published ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{item.published ? 'Published' : 'Draft'}</span>
                    </div>
                    <p className='mt-1 text-xs font-semibold text-gray-500'>/{item.slug}</p>
                    <p className='mt-2 line-clamp-2 text-sm leading-6 text-gray-600'>{item.body || 'No content body'}</p>
                  </div>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <button onClick={() => editContent(item)} className='rounded-full border border-orange-100 bg-[#FFF3EE] px-4 py-2 text-xs font-bold text-[#E8420A]'>Edit</button>
                  <button onClick={() => togglePublish(item)} className='rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700'>{item.published ? 'Unpublish' : 'Publish'}</button>
                  <button onClick={() => deleteContent(item._id)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50'>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(ContentManagement)
