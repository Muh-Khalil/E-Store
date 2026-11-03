import { useMemo } from 'react'
import { useAppSelector } from '../store/hooks'
import { selectProducts, selectCurrency } from '../store/selectors'
import Title from './Title'
import ProductItem from './ProductItem'

interface RelatedProductProps {
  category: string;
  subCategory: string;
}

const RelatedProduct = ({ category, subCategory }: RelatedProductProps) => {
  const products = useAppSelector(selectProducts)
  const currency = useAppSelector(selectCurrency)

  const related = useMemo(() => {
    if (!products) return []
    let productCopy = products.slice()
    productCopy = productCopy.filter((item) => category === item.category)
    productCopy = productCopy.filter(item => subCategory === item.subCategory)
    return productCopy
  }, [products, category, subCategory])

  return (
    <div className='my-24'>
      <div className='text-center text-3xl py-2'>
        <Title text1={'RELATED'} text2={'PRODUCTS'} />
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6  '>
        {
          related.map((item) => {
            return <ProductItem key={item._id} id={item._id} name={item.name} price={item.price} image={item.image} currency={currency} />
          })
        }
      </div>
    </div>
  )
}

export default RelatedProduct
