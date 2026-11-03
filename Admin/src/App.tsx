import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Login from './components/Login'
import ErrorBoundary from './components/ErrorBoundary'
import { ToastContainer } from 'react-toastify'
import { useAppSelector } from './store/hooks'
import { selectAdminToken } from './store/selectors'

const Add = lazy(() => import('./pages/Add'))
const List = lazy(() => import('./pages/List'))
const Orders = lazy(() => import('./pages/Orders'))
const AdminSection = lazy(() => import('./pages/AdminSection'))
const EditProduct = lazy(() => import('./pages/EditProduct'))
const Customers = lazy(() => import('./pages/Customers'))
const Inventory = lazy(() => import('./pages/Inventory'))
const Categories = lazy(() => import('./pages/Categories'))
const Reviews = lazy(() => import('./pages/Reviews'))
const Promotions = lazy(() => import('./pages/Promotions'))
const Marketing = lazy(() => import('./pages/Marketing'))
const ContentManagement = lazy(() => import('./pages/ContentManagement'))
const Analytics = lazy(() => import('./pages/Analytics'))

export const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000'
export const currency = '$'

const App = () => {
  const token = useAppSelector(selectAdminToken)

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {!token ? <Login /> :
        <>
          <Navbar />
          <div className='flex w-full'>
            <Sidebar />
            <main className='min-w-0 flex-1 px-4 py-6 text-base text-gray-600 sm:px-6 lg:px-8'>
              <ErrorBoundary>
                <Suspense fallback={<div className='flex items-center justify-center py-20'><div className='h-10 w-10 animate-spin rounded-full border-4 border-gray-300 border-t-[#E8420A]' /></div>}>
                  <Routes>
                    <Route path='/' element={<AdminSection sectionKey='products' />} />
                    <Route path='/products' element={<AdminSection sectionKey='products' />} />
                    <Route path='/add' element={<Add />} />
                    <Route path='/list' element={<List />} />
                    <Route path='/edit/:productId' element={<EditProduct />} />
                    <Route path='/orders' element={<Orders />} />
                    <Route path='/customers' element={<Customers />} />
                    <Route path='/inventory' element={<Inventory />} />
                    <Route path='/categories' element={<Categories />} />
                    <Route path='/promotions' element={<Promotions />} />
                    <Route path='/content' element={<ContentManagement />} />
                    <Route path='/analytics' element={<Analytics />} />
                    <Route path='/marketing' element={<Marketing />} />
                    <Route path='/reviews' element={<Reviews />} />
                    <Route path='/shipping' element={<AdminSection sectionKey='shipping' />} />
                    <Route path='/payments' element={<AdminSection sectionKey='payments' />} />
                    <Route path='/staff' element={<AdminSection sectionKey='staff' />} />
                    <Route path='/settings' element={<AdminSection sectionKey='settings' />} />
                    <Route path='/support' element={<AdminSection sectionKey='support' />} />
                    <Route path='*' element={
                      <div className='flex flex-col items-center justify-center py-20'>
                        <h1 className='text-6xl font-bold text-gray-300'>404</h1>
                        <p className='mt-4 text-xl text-gray-500'>Page not found</p>
                      </div>
                    } />
                  </Routes>
                </Suspense>
              </ErrorBoundary>
            </main>
          </div>
        </>
      }
    </div>
  )
}

export default App
