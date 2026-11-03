import Title from '../Components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../Components/NewsletterBox'

const About = () => {
  return (
    <div className='border-t pt-10'>
      <div className='rounded-3xl bg-[#FFF8F5] px-6 py-8 text-center sm:px-10'>
        <p className='text-sm font-semibold uppercase tracking-[0.22em] text-[#E8420A]'>Our story</p>
        <div className='mt-3 text-3xl font-black'>
          <Title text1={'ABOUT'} text2={'US'} />
        </div>
        <p className='mx-auto mt-2 max-w-2xl text-sm leading-7 text-gray-600'>
          We bring together trend-aware fashion, dependable quality, and a shopping experience that feels clear from first click to delivery.
        </p>
      </div>

      <div className='my-12 grid gap-10 md:grid-cols-[0.9fr_1fr] md:items-center'>
        <img src={assets.about_img} alt="" className='h-full w-full rounded-3xl object-cover shadow-xl shadow-orange-50' />
        <div className='rounded-3xl border border-gray-100 bg-white p-7 shadow-sm sm:p-9'>
          <p className='text-sm leading-7 text-gray-600'>
            At E-Store, we are passionate about bringing you the best in fashion and lifestyle. Our mission is to provide high-quality, trendy, and affordable products that suit every style and occasion.
          </p>
          <p className='mt-5 text-sm leading-7 text-gray-600'>
            Whether you are looking for the latest fashion trends or timeless essentials, our store is built to make your shopping journey effortless, secure, and enjoyable.
          </p>
          <h3 className='mt-7 text-xl font-extrabold text-[#1A1A1A]'>Our Mission</h3>
          <p className='mt-3 text-sm leading-7 text-gray-600'>
            To make confident everyday style accessible through curated products, simple checkout, fast delivery, and helpful support.
          </p>
        </div>
      </div>

      <div className='text-xl'>
        <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='mb-20 mt-5 grid gap-5 md:grid-cols-3'>
        {([
          ['Quality Assurance', 'Every item is carefully selected for durability, fit, style, and customer satisfaction.'],
          ['Convenience', 'Browse, order, and receive your favorite products from the comfort of your home.'],
          ['Customer Service', 'Our support is ready to help with inquiries, orders, and shopping concerns.'],
        ] as [string, string][]).map(([title, text]) => (
          <div key={title} className='rounded-3xl border border-orange-100 bg-[#FFF8F5] p-7'>
            <b className='text-[#1A1A1A]'>{title}</b>
            <p className='mt-4 text-sm leading-7 text-gray-600'>{text}</p>
          </div>
        ))}
      </div>

      <NewsletterBox />
    </div>
  )
}

export default About
