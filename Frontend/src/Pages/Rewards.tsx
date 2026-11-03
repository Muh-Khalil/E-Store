import axios from 'axios'
import { useEffect, useState } from 'react'
import Title from '../Components/Title'
import type { Reward } from '../types'
import LoadingSpinner from '../Components/LoadingSpinner'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../store/hooks'
import { selectToken, selectCurrency } from '../store/selectors'
import { backendUrl } from '../config'

const Rewards = () => {
  const token = useAppSelector(selectToken)
  const currency = useAppSelector(selectCurrency)
  const navigate = useNavigate()
  const [rewards, setRewards] = useState<Reward>({ points: 0, referralCredits: 0, nextRewardAt: 500 })
  const [loading, setLoading] = useState(true)

  const loadRewards = async () => {
    try {
      if (!token) return navigate('/login')
      const response = await axios.get(`${backendUrl}/api/customer/rewards`, { headers: { token } })
      if (response.data.success) setRewards(response.data.rewards)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadRewards() }, [token])

  const progress = Math.min(100, (Number(rewards.points || 0) / Number(rewards.nextRewardAt || 500)) * 100)

  return (
    <div className='border-t pt-10'>
      <div className='mb-8 rounded-3xl bg-[#FFF8F5] px-6 py-8 sm:px-10'>
        <div className='text-2xl'><Title text1={'MY'} text2={'REWARDS'} /></div>
        <p className='mt-2 max-w-2xl text-sm leading-7 text-gray-600'>View your loyalty points, referral credits, and reward progress.</p>
      </div>

      {loading ? <LoadingSpinner /> : (<>
      <div className='grid gap-5 md:grid-cols-3'>
        <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm font-bold text-gray-500'>Points Balance</p>
          <p className='mt-2 text-4xl font-black text-gray-900'>{rewards.points}</p>
        </div>
        <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm font-bold text-gray-500'>Referral Credits</p>
          <p className='mt-2 text-4xl font-black text-gray-900'>{currency}{rewards.referralCredits}</p>
        </div>
        <div className='rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
          <p className='text-sm font-bold text-gray-500'>Next Reward</p>
          <p className='mt-2 text-4xl font-black text-gray-900'>{rewards.nextRewardAt}</p>
        </div>
      </div>

      <div className='mt-6 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm'>
        <div className='flex justify-between text-sm font-bold text-gray-700'>
          <span>Reward progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className='mt-3 h-3 overflow-hidden rounded-full bg-gray-100'>
          <div className='h-full rounded-full bg-[#E8420A]' style={{ width: `${progress}%` }}></div>
        </div>
      </div>
      </>)}
    </div>
  )
}

export default Rewards
