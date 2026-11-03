import { memo, useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchOrders, updateOrderStatus } from '../store/orderSlice'
import { selectOrders, selectOrdersLoading } from '../store/selectors'
import { currency } from '../App'
import { toast } from 'react-toastify'
import { assets } from '../assets/assets'
import Pagination from '../components/Pagination'

const Orders = () => {
  const dispatch = useAppDispatch()
  const orders = useAppSelector(selectOrders)
  const loading = useAppSelector(selectOrdersLoading)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    dispatch(fetchOrders({ page, limit: 10 })).then((res) => {
      if (fetchOrders.fulfilled.match(res)) {
        setTotalPages(res.payload.total || 1)
      }
    })
  }, [dispatch, page])

  const statusHandler = async (event: React.ChangeEvent<HTMLSelectElement>, orderId: string) => {
    const result = await dispatch(updateOrderStatus({ orderId, status: event.target.value }))
    if (updateOrderStatus.rejected.match(result)) {
      toast.error(result.error?.message || 'Failed to update status')
    }
  }

  const handlePageChange = (p: number) => setPage(p)

  return (
    <div>
      <div className='mb-6'>
        <p className='text-xs font-bold uppercase tracking-[0.22em] text-[#E8420A]'>Sales</p>
        <h1 className='mt-2 text-2xl font-black text-gray-900'>Orders</h1>
        <p className='mt-1 text-sm text-gray-500'>Manage incoming orders, update status, and track fulfillment.</p>
      </div>
      {loading ? (
        <div className='animate-pulse space-y-4'>
          {[1,2,3].map(i => <div key={i} className='h-32 rounded-3xl bg-gray-200' />)}
        </div>
      ) : (
      <div>
        {orders.map((order) => (
          <div key={order._id} className='grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gary-700'>
            <img className='w-12' src={assets.parcel_icon} alt='' />
            <div>
              <div>
                {order.items.map((item, index) => {
                  const separator = index === order.items.length - 1 ? '' : ','
                  return (
                    <p key={index} className='py-0.5'>
                      {item.name} x {item.quantity} <span>{item.size}</span>{separator}
                    </p>
                  )
                })}
              </div>

              <p className='mt-3 mb-2 font-medium'>{order.address.firstName + ' ' + order.address.lastName}</p>
              <div>
                <p>{order.address.street + ','}</p>
                <p>
                  {order.address.city +
                    ',' +
                    order.address.state +
                    ',' +
                    order.address.country +
                    ',' +
                    order.address.zipcode}
                </p>
              </div>
              <p>{order.address.phone}</p>
            </div>
            <div>
              <p className='text-sm sm:text-[15px]'>Items: {order.items.length}</p>
              <p className='t-3'>Method: {order.paymentMethod}</p>
              <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className='text-sm sm:text-[15px]'>{currency} {order.amount}</p>
            <select onChange={(event) => statusHandler(event, order._id)} value={order.status} className='p-2 font-semibold'>
              <option value='Order Placed'>Order Placed</option>
              <option value='Packing'>Packing</option>
              <option value='Shipped'>Shipped</option>
              <option value='Out for delivery'>Out for delivery</option>
              <option value='Delivered'>Delivered</option>
            </select>
          </div>
        ))}
      </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  )
}

export default memo(Orders)
