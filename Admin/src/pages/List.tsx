import { memo, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchProducts, removeProduct } from '../store/productSlice'
import { selectProducts, selectProductsLoading } from '../store/selectors'
import { toast } from 'react-toastify'
import { currency } from '../App'
import { useNavigate } from 'react-router-dom'
import Pagination from '../components/Pagination'

const TrashIcon = () => (
  <svg viewBox='0 0 24 24' fill='none' className='h-4 w-4' aria-hidden='true'>
    <path d='M4 7h16' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <path d='M10 11v6M14 11v6' stroke='currentColor' strokeWidth='2' strokeLinecap='round' />
    <path d='M6 7l1 13h10l1-13' stroke='currentColor' strokeWidth='2' strokeLinejoin='round' />
    <path d='M9 7V4h6v3' stroke='currentColor' strokeWidth='2' strokeLinejoin='round' />
  </svg>
)

const List = () => {
  const dispatch = useAppDispatch()
  const list = useAppSelector(selectProducts)
  const loading = useAppSelector(selectProductsLoading)
  const [removingId, setRemovingId] = useState('')
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 10 })).then((res) => {
      if (fetchProducts.fulfilled.match(res)) {
        setTotalPages(res.payload.total || 1)
      }
    })
  }, [dispatch, page])

  const removeProductHandler = async (id: string) => {
    if (removingId) return
    if (!window.confirm('Are you sure you want to delete this item? This action cannot be undone.')) return
    setRemovingId(id)
    const result = await dispatch(removeProduct(id))
    if (removeProduct.fulfilled.match(result)) {
      toast.success('Product removed')
    } else if (removeProduct.rejected.match(result)) {
      toast.error(result.error?.message || 'Failed to remove product')
    }
    setRemovingId('')
  }

  const handlePageChange = (p: number) => setPage(p)

  return (
    <section>
      <div className='mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between'>
        <div>
          <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Catalog</p>
          <h1 className='mt-2 text-2xl font-black text-gray-900'>All Products</h1>
          <p className='mt-1 text-sm text-gray-500'>Review products and remove items from the storefront.</p>
        </div>
        <div className='rounded-full bg-white px-4 py-2 text-sm font-semibold text-gray-700 shadow-sm ring-1 ring-gray-100'>
          {list.length} products
        </div>
      </div>

      <div className='overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm'>
        <div className='hidden grid-cols-[minmax(260px,1fr)_140px_150px_110px_180px] items-center gap-4 border-b border-gray-100 bg-gray-50 px-5 py-4 text-xs font-extrabold uppercase tracking-wide text-gray-500 md:grid'>
          <p>Product</p>
          <p>Category</p>
          <p>Sizes</p>
          <p>Price</p>
          <p className='text-center'>Action</p>
        </div>

        {loading ? (
          <div className='animate-pulse space-y-4 p-5'>
            {[1,2,3].map(i => <div key={i} className='h-16 rounded-2xl bg-gray-200' />)}
          </div>
        ) : list.length === 0 ? (
          <div className='p-10 text-center text-sm text-gray-500'>No products found.</div>
        ) : (
          <div className='divide-y divide-gray-100'>
            {list.map((item) => (
              <div key={item._id} className='grid gap-4 px-5 py-4 text-sm transition hover:bg-gray-50/70 md:grid-cols-[minmax(260px,1fr)_140px_150px_110px_180px] md:items-center'>
                <div className='flex items-center gap-4'>
                  <img src={item.image?.[0]} alt={item.name} className='h-20 w-16 shrink-0 rounded-2xl bg-[#FFF8F5] object-contain p-1 ring-1 ring-gray-100 md:h-16 md:w-14' />
                  <div className='min-w-0'>
                    <p className='font-semibold text-gray-900'>{item.name}</p>
                    <p className='mt-1 text-xs text-gray-500'>{item.subCategory || 'No type'} - {currency}{item.price}</p>
                  </div>
                </div>

                <p>
                  <span className='rounded-full bg-[#FFF3EE] px-3 py-1 text-xs font-bold text-[#E8420A]'>{item.category}</span>
                </p>
                <p className='flex flex-wrap gap-1'>
                  {(item.sizes || []).slice(0, 4).map((size) => (
                    <span key={size} className='rounded-full bg-gray-100 px-2.5 py-1 text-xs font-semibold text-gray-600'>{size}</span>
                  ))}
                </p>
                <p className='font-bold text-gray-800'>{currency}{item.price}</p>

                <div className='flex flex-wrap gap-2 md:justify-center'>
                  <button
                    type='button'
                    onClick={() => navigate(`/edit/${item._id}`)}
                    className='inline-flex items-center justify-center rounded-full border border-orange-100 bg-[#FFF3EE] px-4 py-2 text-xs font-bold text-[#E8420A] transition hover:bg-orange-100'
                  >
                    Edit
                  </button>
                  <button
                    type='button'
                    onClick={() => removeProductHandler(item._id)}
                    disabled={removingId === item._id}
                    title='Remove product'
                    className='inline-flex items-center justify-center gap-2 rounded-full border border-red-100 bg-white px-4 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60'
                  >
                    <TrashIcon />
                    <span>{removingId === item._id ? 'Removing' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </section>
  )
}

export default memo(List)
