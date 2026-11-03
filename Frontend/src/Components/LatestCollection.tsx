import { useAppSelector } from '../store/hooks'
import { selectLatestProducts, selectCurrency } from '../store/selectors'
import Title from './Title'
import ProductItems from './ProductItem'

const LatestCollection = () => {
  const latestProducts = useAppSelector(selectLatestProducts)
  const currency = useAppSelector(selectCurrency)

  return (
    <div className='my-10'>
      <div className='text-center py-8 text-3xl'>
        <Title text1={'LATEST'} text2={'COLLECTIONS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>New season, new styles! We've curated an exclusive collection of trendy and stylish pieces that make you stand out effortlessly. Don't miss out—shop the latest fashion now!</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          latestProducts.map((item) => (
            <ProductItems key={item._id} id={item._id} image={item.image} price={item.price} name={item.name} currency={currency} />
          ))
        }
      </div>
    </div>
  )
}

export default LatestCollection
