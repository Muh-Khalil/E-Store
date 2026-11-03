import { memo, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { backendUrl } from '../App'
import { useAppSelector } from '../store/hooks'
import { selectAdminToken } from '../store/selectors'
import type { Category, CategoryForm } from '../types'

const defaultForm: CategoryForm = {
  name: '',
  description: '',
  image: '',
  parent: '',
  active: true,
}

const Categories = () => {
  const token = useAppSelector(selectAdminToken)
  const [categories, setCategories] = useState<Category[]>([])
  const [form, setForm] = useState<CategoryForm>(defaultForm)
  const [editingId, setEditingId] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${backendUrl}/api/admin-store/categories`, { headers: { token } })
      if (response.data.success) setCategories(response.data.categories)
      else toast.error(response.data.message)
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

  const resetForm = () => {
    setForm(defaultForm)
    setEditingId('')
  }

  const saveCategory = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.name.trim()) {
      toast.error('Category name is required')
      return
    }
    try {
      setSaving(true)
      const url = editingId ? `${backendUrl}/api/admin-store/categories/${editingId}` : `${backendUrl}/api/admin-store/categories`
      const method = editingId ? axios.put : axios.post
      const response = await method(url, form, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        resetForm()
        fetchCategories()
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
      setSaving(false)
    }
  }

  const editCategory = (category: Category) => {
    setEditingId(category._id)
    setForm({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
      parent: category.parent || '',
      active: category.active !== false,
    })
  }

  const toggleCategory = async (category: Category) => {
    try {
      const response = await axios.put(`${backendUrl}/api/admin-store/categories/${category._id}`,
        { ...category, active: !category.active },
        { headers: { token } }
      )
      if (response.data.success) fetchCategories()
      else toast.error(response.data.message)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || err.message)
      } else {
        toast.error('An unexpected error occurred')
      }
    }
  }

  const deleteCategory = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    try {
      const response = await axios.delete(`${backendUrl}/api/admin-store/categories/${id}`, { headers: { token } })
      if (response.data.success) {
        toast.success(response.data.message)
        fetchCategories()
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
    if (token) fetchCategories()
  }, [token])

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Catalog</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>Categories</h1>
          <p className='mt-1 text-sm text-gray-500'>Create, edit, and activate storefront category groups.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {categories.length} categories
        </div>
      </div>

      <div className='grid gap-5 lg:grid-cols-[360px_1fr]'>
        <form onSubmit={saveCategory} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
          <h2 className='text-lg font-black text-gray-900'>{editingId ? 'Edit Category' : 'Create Category'}</h2>
          <div className='mt-4 grid gap-3'>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder='Category name' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <input value={form.parent} onChange={(e) => setForm({ ...form, parent: e.target.value })} placeholder='Parent category' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <input value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} placeholder='Image URL' className='rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder='Description' className='min-h-24 rounded-2xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#E8420A]' />
            <label className='flex items-center gap-3 rounded-2xl border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700'>
              <input type='checkbox' checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />
              Active on storefront
            </label>
          </div>
          <div className='mt-4 flex flex-wrap gap-2'>
            <button disabled={saving} className='rounded-full bg-[#E8420A] px-6 py-3 text-sm font-bold text-white disabled:opacity-60'>{saving ? 'Saving...' : 'Save Category'}</button>
            {editingId && <button type='button' onClick={resetForm} className='rounded-full border border-gray-200 px-6 py-3 text-sm font-bold text-gray-700'>Cancel</button>}
          </div>
        </form>

        <div className='grid gap-3'>
          {loading ? (
            <div className='animate-pulse space-y-4 p-5'>
              {[1,2,3].map(i => <div key={i} className='h-20 rounded-3xl bg-gray-200' />)}
            </div>
          ) : categories.length === 0 ? (
            <div className='rounded-3xl border border-gray-200 bg-white p-10 text-center text-sm text-gray-500'>No categories created yet.</div>
          ) : categories.map((category) => (
            <div key={category._id} className='rounded-3xl border border-gray-200 bg-white p-5 shadow-sm'>
              <div className='flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
                <div className='flex gap-4'>
                  <div className='h-16 w-16 shrink-0 overflow-hidden rounded-2xl bg-[#FFF3EE]'>
                    {category.image ? <img src={category.image} alt={category.name} className='h-full w-full object-cover' /> : <div className='grid h-full place-items-center text-xl font-black text-[#E8420A]'>#</div>}
                  </div>
                  <div>
                    <div className='flex flex-wrap items-center gap-2'>
                      <p className='font-black text-gray-900'>{category.name}</p>
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${category.active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{category.active ? 'Active' : 'Hidden'}</span>
                    </div>
                    <p className='mt-1 text-xs font-semibold text-gray-500'>{category.parent || 'Top level'}</p>
                    <p className='mt-2 text-sm leading-6 text-gray-600'>{category.description || 'No description'}</p>
                  </div>
                </div>
                <div className='flex flex-wrap gap-2'>
                  <button onClick={() => editCategory(category)} className='rounded-full border border-orange-100 bg-[#FFF3EE] px-4 py-2 text-xs font-bold text-[#E8420A]'>Edit</button>
                  <button onClick={() => toggleCategory(category)} className='rounded-full border border-gray-200 px-4 py-2 text-xs font-bold text-gray-700'>{category.active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => deleteCategory(category._id)} className='rounded-full border border-red-100 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50'>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default memo(Categories)
