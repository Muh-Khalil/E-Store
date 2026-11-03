import { useEffect } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectToken } from '../store/selectors'
import { setCartItems } from '../store/cartSlice'
import { backendUrl } from '../config'

const Verify = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const token = useAppSelector(selectToken)
  const dispatch = useAppDispatch()

  const success = searchParams.get('success')
  const orderId = searchParams.get('orderId')

  const verifyPayment = async () => {
    try {
      if (!token || !orderId) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/verifystripe', { success, orderId }, { headers: { token } })
      if (response.data.success) {
        dispatch(setCartItems({}))
        navigate('/orders')
      }
      else {
        navigate('/cart')
      }
    }
    catch (err) {
      console.log(err)
      toast.error((err as Error).message)
      navigate('/cart')
    }
  }

  useEffect(() => {
    verifyPayment()
  }, [token])

  return (
    <div className='border-t py-20 text-center'>
      <p className='text-2xl font-black text-gray-900'>Verifying payment...</p>
      <p className='mt-2 text-sm text-gray-500'>Please wait while we confirm your simulated payment.</p>
    </div>
  )
}

export default Verify
