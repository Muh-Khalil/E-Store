import { Link } from 'react-router-dom'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <footer className='-mx-4 sm:-mx-6 md:-mx-8 lg:-mx-12 mt-28 bg-[#151523] px-4 sm:px-6 md:px-8 lg:px-12 pt-14 text-white'>
      <div className='grid gap-10 border-b border-white/10 pb-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]'>
        <div>
          <img src={assets.logo} alt='Store logo' className='mb-5 w-36 rounded-xl bg-white p-2' />
          <p className='max-w-sm text-sm leading-7 text-white/60'>
            A modern fashion store for everyday essentials, new-season styles, and pieces that make getting dressed feel simple.
          </p>
          <div className='mt-6 flex gap-3'>
            {['f', 'x', 'in'].map((item) => (
              <a key={item} href='#' className='flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-xs font-bold text-white/70 transition hover:border-[#E8420A] hover:bg-[#E8420A] hover:text-white'>
                {item}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className='mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-white/90'>Shop</h3>
          <ul className='flex flex-col gap-3 text-sm text-white/55'>
            <li><Link to='/collection' className='transition hover:text-[#FF6B35]'>All Collections</Link></li>
            <li><Link to='/collection' className='transition hover:text-[#FF6B35]'>New Arrivals</Link></li>
            <li><Link to='/collection' className='transition hover:text-[#FF6B35]'>Best Sellers</Link></li>
            <li><Link to='/cart' className='transition hover:text-[#FF6B35]'>Your Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className='mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-white/90'>Company</h3>
          <ul className='flex flex-col gap-3 text-sm text-white/55'>
            <li><Link to='/' className='transition hover:text-[#FF6B35]'>Home</Link></li>
            <li><Link to='/about' className='transition hover:text-[#FF6B35]'>About Us</Link></li>
            <li><Link to='/contact' className='transition hover:text-[#FF6B35]'>Contact</Link></li>
            <li><Link to='/our-policy' className='transition hover:text-[#FF6B35]'>Our Policy</Link></li>
          </ul>
        </div>

        <div>
          <h3 className='mb-5 text-sm font-extrabold uppercase tracking-[0.18em] text-white/90'>Support</h3>
          <ul className='flex flex-col gap-3 text-sm text-white/55'>
            <li>+92 344 9478761</li>
            <li className='break-all'>muhammadkhalil.web@gmail.com</li>
            <li>7 day return window</li>
            <li>Secure checkout</li>
          </ul>
        </div>
      </div>

      <div className='flex flex-col gap-3 py-6 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between'>
        <p>Copyright 2026 E-Store. All Rights Reserved.</p>
        <p>Built for clean, confident shopping.</p>
      </div>
    </footer>
  )
}

export default Footer
