import { useAppSelector } from '../store/hooks'
import { selectBestSellers, selectCurrency } from '../store/selectors'
import Title from './Title';
import ProductItem from './ProductItem'

const BestSeller = () => {
  const bestSeller = useAppSelector(selectBestSellers)
  const currency = useAppSelector(selectCurrency)

  return (
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1={'BEST'} text2={'SELLERS'} />
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Our most-loved products are flying off the shelves! Shop our best sellers before they're gone!</p>
      </div>

      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6'>
        {
          bestSeller.map((item) => (
            <ProductItem key={item._id} id={item._id} name={item.name} image={item.image} price={item.price} currency={currency} />
          ))
        }
      </div>
    </div>
  )
}

export default BestSeller
