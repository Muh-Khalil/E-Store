import { useEffect } from 'react'
import Title from '../Components/Title'
import CartTotal from '../Components/CartTotal'
import { assets } from '../assets/assets'
import { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import type { Address } from '../types'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectProducts, selectCartItems, selectToken, selectDiscount } from '../store/selectors'
import { setCartItems, clearDiscount } from '../store/cartSlice'
import { backendUrl, delivery_fee } from '../config'

const PlaceOrder = () => {
  const [method, setMethod] = useState('cod')
  const navigate = useNavigate()
  const token = useAppSelector(selectToken)
  const cartItems = useAppSelector(selectCartItems)
  const products = useAppSelector(selectProducts)
  const discount = useAppSelector(selectDiscount)
  const dispatch = useAppDispatch()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [shippingMethod, setShippingMethod] = useState('Standard')
  const [formData, setFormData] = useState<Address>({
    firstName: '', lastName: '', email: '', street: '', city: '', state: '', zipcode: '', country: '', phone: ''
  })

  const loadProfile = async () => {
    if (!token) return
    try {
      const response = await axios.get(`${backendUrl}/api/customer/profile`, { headers: { token } })
      if (response.data.success) {
        const savedAddresses = response.data.user.addresses || []
        setAddresses(savedAddresses)
        const defaultAddress = savedAddresses.find((item: Address) => item.isDefault) || savedAddresses[0]
        if (defaultAddress) setFormData(defaultAddress)
      }
    }
    catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [token])

  const onChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const name = event.target.name;
    const value = event.target.value
    setFormData(data => ({ ...data, [name]: value }))
  }

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      const itemInfo = products.find(product => product._id === items)
      if (!itemInfo) continue;
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          totalAmount += itemInfo.price * cartItems[items][item];
        }
      }
    }
    return totalAmount;
  }

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const requiredFields: [string, string][] = [
      ['firstName', 'First name'],
      ['lastName', 'Last name'],
      ['street', 'Street'],
      ['city', 'City'],
      ['state', 'State'],
      ['zipcode', 'Zipcode'],
      ['phone', 'Phone'],
      ['email', 'Email']
    ]
    let hasError = false
    for (const [field, label] of requiredFields) {
      if (!String(formData[field as keyof Address] || '').trim()) {
        toast.error(`${label} is required`)
        hasError = true
      }
    }
    if (hasError) return

    try {
      let orderItems: import('../types').OrderItem[] = []
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            const productInfo = products.find(product => product._id === items)
            if (productInfo) {
              const itemInfo = structuredClone(productInfo) as unknown as import('../types').OrderItem
              itemInfo.size = item
              itemInfo.quantity = cartItems[items][item]
              orderItems.push(itemInfo)
            }
          }
        }
      }

      let orderData = {
        address: { ...formData, shippingMethod },
        items: orderItems,
        amount: Math.max(0, getCartAmount() + delivery_fee - Number(discount?.discount || 0))
      }
      switch (method) {

        case 'cod':
          const response = await axios.post(
            backendUrl + '/api/order/place',
            orderData,
            { headers: { token } }
          )
          if (response.data.success) {
            dispatch(setCartItems({}))
            dispatch(clearDiscount())
            navigate('/orders')
          }
          else {
            toast.error(response.data.message)
          }
          break;

        case 'stripe':
          const res = await axios.post(backendUrl + '/api/order/stripe', orderData, { headers: { token } })
          if (res.data.success) {
            const { session_url } = res.data
            window.location.replace(session_url)
          }
          else {
            toast.error(res.data.message)
          }
          break;

        case 'payoneer':
          const resp = await axios.post(backendUrl + '/api/order/payoneer', orderData, { headers: { token } })
          if (resp.data.success) {
            const { session_url } = resp.data
            window.location.replace(session_url)
          }
          else {
            toast.error(resp.data.message)
          }
          break;

        default:
          break;
      }
    }
    catch (err) {
      console.log(err)
      toast.error((err as Error).message)
    }
  }

  const inputClass = 'rounded-full border border-gray-200 px-5 py-3 outline-none focus:border-[#E8420A]'

  return (
    <form onSubmit={onSubmitHandler} className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'>
          <Title text1={'CHECKOUT'} text2={'DETAILS'} />
        </div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>
          Add your delivery information, confirm your totals, and choose a payment method.
        </p>
      </div>

      <div className='grid gap-8 lg:grid-cols-[1fr_400px]'>
        <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8'>
          <div className='mb-5 text-xl'>
            <Title text1={'DELIVERY'} text2={'INFORMATION'} />
          </div>
          {addresses.length > 0 && (
            <div className='mb-5 grid gap-3'>
              <p className='text-sm font-bold text-gray-800'>Saved Addresses</p>
              <div className='grid gap-2'>
                {addresses.map((item) => (
                  <button key={item.id} type='button' onClick={() => setFormData(item)} className={`rounded-2xl border px-4 py-3 text-left text-sm ${formData.id === item.id ? 'border-[#E8420A] bg-[#FFF3EE]' : 'border-gray-100 bg-gray-50'}`}>
                    <b>{item.firstName} {item.lastName}</b> · {item.street}, {item.city}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className='grid gap-4 sm:grid-cols-2'>
            <input required onChange={onChangeHandler} name='firstName' value={formData.firstName} type="text" className={inputClass} placeholder='First name' />
            <input required onChange={onChangeHandler} name='lastName' value={formData.lastName} type="text" className={inputClass} placeholder='Last name' />
          </div>
          <div className='mt-4 grid gap-4'>
            <input required onChange={onChangeHandler} name='email' value={formData.email} type="email" className={inputClass} placeholder='Email address' />
            <input required onChange={onChangeHandler} name='street' value={formData.street} type="text" className={inputClass} placeholder='Street' />
          </div>
          <div className='mt-4 grid gap-4 sm:grid-cols-2'>
            <input required onChange={onChangeHandler} name='city' value={formData.city} type="text" className={inputClass} placeholder='City' />
            <input required onChange={onChangeHandler} name='state' value={formData.state} type="text" className={inputClass} placeholder='State' />
            <input required onChange={onChangeHandler} name='zipcode' value={formData.zipcode} type="number" className={inputClass} placeholder='Zipcode' />
            <input required onChange={onChangeHandler} name='country' value={formData.country} type="text" className={inputClass} placeholder='Country' />
          </div>
          <input required onChange={onChangeHandler} name='phone' value={formData.phone} type="number" className={`${inputClass} mt-4 w-full`} placeholder='Phone' />

          <div className='mt-6'>
            <p className='mb-3 text-sm font-bold text-gray-800'>Shipping Method</p>
            <div className='grid gap-3 sm:grid-cols-3'>
              {['Standard', 'Express', 'Pickup'].map((item) => (
                <button key={item} type='button' onClick={() => setShippingMethod(item)} className={`rounded-2xl border px-4 py-3 text-sm font-bold ${shippingMethod === item ? 'border-[#E8420A] bg-[#FFF3EE] text-[#E8420A]' : 'border-gray-100 text-gray-700'}`}>{item}</button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <CartTotal />

          <div className='mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
            <div className='text-xl'>
              <Title text1={'PAYMENT'} text2={'METHOD'} />
            </div>
            <div className='mt-4 flex flex-col gap-3'>
              <div onClick={() => setMethod('stripe')} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${method === 'stripe' ? 'border-[#E8420A] bg-[#FFF3EE]' : 'border-gray-100'}`}>
                <p className={`h-3.5 min-w-3.5 rounded-full border ${method === 'stripe' ? 'bg-[#E8420A]' : ''}`}></p>
                <img src={assets.stripe_logo} alt="" className='h-5 mx-4' />
              </div>
              <div onClick={() => setMethod('payoneer')} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${method === 'payoneer' ? 'border-[#E8420A] bg-[#FFF3EE]' : 'border-gray-100'}`}>
                <p className={`h-3.5 min-w-3.5 rounded-full border ${method === 'payoneer' ? 'bg-[#E8420A]' : ''}`}></p>
                <p className='font-semibold text-gray-700'>Payoneer</p>
              </div>
              <div onClick={() => setMethod('cod')} className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${method === 'cod' ? 'border-[#E8420A] bg-[#FFF3EE]' : 'border-gray-100'}`}>
                <p className={`h-3.5 min-w-3.5 rounded-full border ${method === 'cod' ? 'bg-[#E8420A]' : ''}`}></p>
                <p className='font-semibold text-gray-700'>CASH ON DELIVERY</p>
              </div>
            </div>

            <button type='submit' className='mt-6 w-full rounded-full bg-[#E8420A] px-8 py-4 text-sm font-extrabold text-white shadow-lg shadow-orange-100 transition hover:bg-[#FF6B35]'>PLACE ORDER</button>
          </div>
        </div>
      </div>
    </form>
  )
}

export default PlaceOrder
