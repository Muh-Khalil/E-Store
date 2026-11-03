import Title from '../Components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div className='border-t pt-10'>
      <div className='rounded-3xl bg-[#FFF8F5] px-6 py-8 text-center sm:px-10'>
        <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#E8420A]'>Need help?</p>
        <div className='mt-3 text-3xl font-black'>
          <Title text1={'CONTACT'} text2={'US'} />
        </div>
        <p className='mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-600'>
          Questions about orders, sizing, returns, or delivery? Reach out and we will help you shop with confidence.
        </p>
      </div>

      <div className='my-12 grid gap-10 md:grid-cols-[0.95fr_1fr] md:items-center'>
        <img src={assets.contact_img} alt="" className='h-full w-full rounded-3xl object-cover shadow-xl shadow-orange-50' />
        <div className='grid gap-5'>
          <div className='rounded-3xl border border-gray-100 bg-white p-7 shadow-sm'>
            <p className='text-xl font-extrabold text-[#1A1A1A]'>Our Store</p>
            <p className='mt-4 text-sm leading-7 text-gray-500'>Sheikh Malton Town <br /> Mardan, KPK, Pakistan</p>
          </div>
          <div className='rounded-3xl border border-gray-100 bg-white p-7 shadow-sm'>
            <p className='text-xl font-extrabold text-[#1A1A1A]'>Support</p>
            <p className='mt-4 text-sm leading-7 text-gray-500'>Tel: +92 344 9478761 <br /> Email: muhammadkhalil.web@gmail.com</p>
          </div>
          <div className='rounded-3xl border border-orange-100 bg-[#FFF8F5] p-7'>
            <p className='text-xl font-extrabold text-[#1A1A1A]'>Careers at E-Store</p>
            <p className='mt-3 text-sm leading-7 text-gray-600'>Learn more about our teams and job openings.</p>
            <button className='mt-5 rounded-full border border-[#1A1A1A] px-8 py-3 text-sm font-semibold transition hover:bg-[#1A1A1A] hover:text-white'>Explore Jobs</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact
