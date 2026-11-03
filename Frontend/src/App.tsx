import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import SearchBar from './Components/SearchBar'
import { ToastContainer } from 'react-toastify'
import LoadingSpinner from './Components/LoadingSpinner'
import { useAppDispatch } from './store/hooks'
import { fetchProducts } from './store/productSlice'

const Home = lazy(() => import('./Pages/Home'))
const Collection = lazy(() => import('./Pages/Collections'))
const About = lazy(() => import('./Pages/About'))
const Cart = lazy(() => import('./Pages/Cart'))
const Contact = lazy(() => import('./Pages/Contact'))
const Orders = lazy(() => import('./Pages/Orders'))
const Product = lazy(() => import('./Pages/Product'))
const PlaceOrder = lazy(() => import('./Pages/PlaceOrder'))
const Login = lazy(() => import('./Pages/Login'))
const Verify = lazy(() => import('./Pages/Verify'))
const CustomerPortal = lazy(() => import('./Pages/CustomerPortal'))
const Account = lazy(() => import('./Pages/Account'))
const Wishlist = lazy(() => import('./Pages/Wishlist'))
const Notifications = lazy(() => import('./Pages/Notifications'))
const Support = lazy(() => import('./Pages/Support'))
const Rewards = lazy(() => import('./Pages/Rewards'))
const OurPolicy = lazy(() => import('./Pages/OurPolicy'))

const App = () => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(fetchProducts({ limit: 100 }))
  }, [dispatch])

  return (
    <div className='px-4 sm:px-6 md:px-8 lg:px-12'>
      <ToastContainer />
      <Navbar/>
      <SearchBar/>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/collection' element={<Collection/>} />
          <Route path='/about' element={<About/>} />
          <Route path='/cart' element={<Cart/>} />
          <Route path='/contact'  element={<Contact/>}/>
          <Route path='/orders' element={<Orders/>} />
          <Route path='/product/:productId' element={<Product/>} />
          <Route path='/place-order' element={<PlaceOrder />} />
          <Route path='/login' element={<Login/>} />
          <Route path='/verify' element={<Verify/>} />
          <Route path='/portal' element={<CustomerPortal/>} />
          <Route path='/account' element={<Account/>} />
          <Route path='/wishlist' element={<Wishlist/>} />
          <Route path='/notifications' element={<Notifications/>} />
          <Route path='/support' element={<Support/>} />
          <Route path='/rewards' element={<Rewards/>} />
          <Route path='/our-policy' element={<OurPolicy/>} />
          <Route path='*' element={
            <div className='flex flex-col items-center justify-center py-20'>
              <h1 className='text-6xl font-bold text-gray-300'>404</h1>
              <p className='mt-4 text-xl text-gray-500'>Page not found</p>
              <Link to='/' className='mt-6 rounded bg-[#E8420A] px-6 py-2 text-white'>Go Home</Link>
            </div>
          } />
        </Routes>
      </Suspense>
      <Footer/>
    </div>
  )
}

export default App
