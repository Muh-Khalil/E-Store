import { useEffect, useState } from 'react'
import axios from "axios"
import { toast } from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { selectToken } from '../store/selectors'
import { setToken } from '../store/authSlice'
import { backendUrl } from '../config'

const Login = () => {
  const [currentState, setCurrentState] = useState('Login')
  const token = useAppSelector(selectToken)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const onSubmitHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
        if (response.data.success) {
          dispatch(setToken(response.data.token))
          localStorage.setItem('token', response.data.token)
        }
        else {
          toast.error(response.data.message)
        }
      }
      else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password })
        if (response.data.success) {
          dispatch(setToken(response.data.token))
          localStorage.setItem('token', response.data.token)
        }
        else {
          toast.error(response.data.message)
        }
      }
    }
    catch (err) {
      console.log(err)
      toast.error((err as Error).message)
    }
  }

  useEffect(() => {
    if (token) {
      navigate('/')
    }
  }, [token])

  return (
    <div className='border-t pt-10'>
      <div className='mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-orange-100 bg-white shadow-xl shadow-orange-50 md:grid-cols-[0.9fr_1fr]'>
        <div className='bg-[#FFF8F5] p-8 sm:p-10'>
          <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#E8420A]'>Welcome</p>
          <h1 className='mt-4 text-4xl font-black text-[#1A1A1A]'>{currentState}</h1>
          <p className='mt-4 text-sm leading-7 text-gray-600'>
            Sign in to manage your cart, view orders, and checkout faster with your saved shopping session.
          </p>
        </div>

        <form onSubmit={onSubmitHandler} className='flex flex-col gap-4 p-8 text-gray-800 sm:p-10'>
          {currentState === 'Login' ? '' : <input onChange={(e) => setName(e.target.value)} value={name} type="text" className='rounded-full border border-gray-200 px-5 py-3 outline-none focus:border-[#E8420A]' placeholder='Name' required />}
          <input onChange={(e) => setEmail(e.target.value)} type="email" value={email} className='rounded-full border border-gray-200 px-5 py-3 outline-none focus:border-[#E8420A]' placeholder='Email' required />
          <input onChange={(e) => setPassword(e.target.value)} value={password} type="password" className='rounded-full border border-gray-200 px-5 py-3 outline-none focus:border-[#E8420A]' placeholder='Password' required />

          <div className='flex flex-wrap justify-between gap-3 text-sm text-gray-500'>
            <p className='cursor-pointer hover:text-[#E8420A]'>Forgot your password?</p>
            {
              currentState === 'Login' ? <p className='cursor-pointer font-semibold text-[#E8420A]' onClick={() => setCurrentState('Sign Up')} >Create account</p> : <p className='cursor-pointer font-semibold text-[#E8420A]' onClick={() => setCurrentState('Login')} >Login Here</p>
            }
          </div>
          <button className='mt-3 rounded-full bg-[#E8420A] px-8 py-3 text-sm font-extrabold text-white shadow-lg shadow-orange-100 transition hover:bg-[#FF6B35]'>{currentState === 'Login' ? 'Sign In' : 'Sign Up'}</button>
        </form>
      </div>
    </div>
  )
}

export default Login
