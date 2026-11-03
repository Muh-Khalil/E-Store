import { useAppSelector } from '../store/hooks'
import { selectCartSubtotal, selectCartTotal, selectDeliveryFee, selectCurrency, selectDiscount } from '../store/selectors'
import Title from './Title'

const CartTotal = () => {
  const subtotal = useAppSelector(selectCartSubtotal)
  const total = useAppSelector(selectCartTotal)
  const delivery_fee = useAppSelector(selectDeliveryFee)
  const currency = useAppSelector(selectCurrency)
  const discount = useAppSelector(selectDiscount)
  const discountAmount = discount?.discount || 0

  return (
    <div className='rounded-3xl border border-orange-100 bg-white p-6 text-sm shadow-lg shadow-orange-50'>
      <div className='text-xl'>
        <Title text1={'CART'} text2={'TOTALS'} />
      </div>

      <div className='mt-4 flex justify-between text-gray-600'>
        <p>Subtotal</p>
        <p className='font-medium text-gray-900'>{currency}{subtotal.toFixed(2)}</p>
      </div>
      <hr className='my-4 border-gray-100' />
      {discount && (
        <>
          <div className='flex justify-between text-green-700'>
            <p>Discount ({discount.code})</p>
            <p className='font-medium'>-{currency}{discountAmount.toFixed(2)}</p>
          </div>
          <hr className='my-4 border-gray-100' />
        </>
      )}
      <div className='flex justify-between text-gray-600'>
        <p>Shipping Fee</p>
        <p className='font-medium text-gray-900'>{currency}{delivery_fee.toFixed(2)}</p>
      </div>
      <hr className='my-4 border-gray-100' />
      <div className='flex justify-between text-base'>
        <b>Total</b>
        <b className='text-[#E8420A]'>{currency} {total.toFixed(2)}</b>
      </div>
    </div>
  )
}

export default CartTotal
