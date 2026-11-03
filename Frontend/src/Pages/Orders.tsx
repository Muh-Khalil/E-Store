import { useEffect, useState } from 'react'
import Title from '../Components/Title'
import axios from 'axios'
import { toast } from 'react-toastify'
import type { OrderItem } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useAppSelector } from '../store/hooks'
import { selectToken, selectCurrency } from '../store/selectors'
import { backendUrl } from '../config'

const Orders = () => {
  const token = useAppSelector(selectToken)
  const currency = useAppSelector(selectCurrency)
  const [orderData, setOrderData] = useState<OrderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({})

  const loadOrderData = async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders', {}, { headers: { token } })
      if (response.data.success) {
        let allOderItem: OrderItem[] = []
        response.data.orders.map((order: import('../types').Order) => {
          order.items.map((item) => {
            item['status'] = order.status
            item['orderId'] = order._id
            item['orderAmount'] = order.amount
            item['address'] = order.address
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            allOderItem.push(item)
          })
        })
        setOrderData(allOderItem.reverse())
      }
    }
    catch (err) {

    }
    finally {
      setLoading(false)
    }
  }

  const downloadInvoice = (item: OrderItem) => {
    const invoice = [
      'E-Store Invoice',
      `Order: ${item.orderId}`,
      `Date: ${new Date(item.date!).toDateString()}`,
      `Product: ${item.name}`,
      `Quantity: ${item.quantity}`,
      `Size: ${item.size}`,
      `Amount: ${currency}${item.orderAmount}`,
      `Status: ${item.status}`
    ].join('\n')
    const blob = new Blob([invoice], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `invoice-${item.orderId}.txt`
    link.click()
    URL.revokeObjectURL(url)
  }

  const requestReturn = async (item: OrderItem, category = 'Return') => {
    try {
      const response = await axios.post(`${backendUrl}/api/customer/support`, {
        subject: `${category} request for ${item.name}`,
        category,
        orderId: item.orderId,
        message: `Please process a ${category.toLowerCase()} request for ${item.name}, size ${item.size}.`
      }, { headers: { token } })
      if (response.data.success) toast.success(response.data.message)
      else toast.error(response.data.message)
    }
    catch (err) {
      toast.error((err as { response?: { data?: { message?: string } } }).response?.data?.message || (err as Error).message)
    }
  }

  useEffect(() => {
    loadOrderData()
  }, [token])

  return (
    <div className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'>
          <Title text1={'MY'} text2={'ORDERS'} />
        </div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>
          Track your recent purchases, payment method, quantities, and current fulfillment status.
        </p>
      </div>

      {loading ? <LoadingSpinner /> : (
      <div className='flex flex-col gap-4'>
        {
          orderData.length === 0 ? (
            <div className='rounded-3xl border border-dashed border-orange-200 bg-white p-10 text-center text-gray-500'>
              No orders found.
            </div>
          ) : orderData.map((item, index) => (
            <div key={index} className='rounded-3xl border border-gray-100 bg-white p-4 shadow-sm'>
              <div className='flex flex-col gap-5 md:flex-row md:items-center md:justify-between'>
                <div className='flex items-start gap-5 text-sm'>
                  <img src={imgErrors[item._id + item.size] ? '/placeholder.png' : item.image[0]} onError={() => setImgErrors(prev => ({ ...prev, [item._id + item.size]: true }))} alt="" className='h-24 w-20 rounded-2xl object-cover' />
                  <div>
                    <p className='font-semibold text-gray-900 sm:text-base'>{item.name}</p>
                    <div className='mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-600'>
                      <p className='font-semibold text-[#E8420A]'>{currency}{item.price}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>Size: {item.size}</p>
                    </div>
                    <p className='mt-2 text-sm text-gray-500'>Date: <span>{new Date(item.date!).toDateString()}</span></p>
                    <p className='mt-1 text-sm text-gray-500'>Payment: <span>{String(item.payment)}</span></p>
                  </div>
                </div>
                <div className='flex flex-col gap-3 md:w-1/2'>
                  <div className='flex items-center gap-2'>
                    <p className='h-2.5 w-2.5 rounded-full bg-green-500'></p>
                    <p className='text-sm font-semibold text-gray-700 md:text-base'>{item.status}</p>
                  </div>
                  <div className='flex flex-wrap gap-2'>
                    <button onClick={loadOrderData} className='rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold transition hover:border-[#E8420A] hover:text-[#E8420A]'>Track Order</button>
                    <button onClick={() => downloadInvoice(item)} className='rounded-full border border-gray-200 px-5 py-2 text-sm font-semibold transition hover:border-[#E8420A] hover:text-[#E8420A]'>Invoice</button>
                    <button onClick={() => requestReturn(item, 'Return')} className='rounded-full border border-red-100 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'>Return</button>
                    <button onClick={() => requestReturn(item, 'Refund')} className='rounded-full border border-red-100 px-5 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50'>Refund</button>
                  </div>
                </div>
              </div>
            </div>
          ))
        }
      </div>
      )}
    </div>
  )
}

export default Orders
