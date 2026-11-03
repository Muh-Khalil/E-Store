import { v2 as cloudinary } from 'cloudinary'
import productModel from '../models/productModel.js'
import { Request, Response } from 'express'
import { paginate } from '../helpers.js'

const addProduct = async (req: Request, res: Response) => {
  console.log('Add Product Request Body:', req.body)
  try {
    const { name, description, price, category, subCategory, sizes, bestSeller } = req.body

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
    const image1 = files?.image1?.[0]
    const image2 = files?.image2?.[0]
    const image3 = files?.image3?.[0]
    const image4 = files?.image4?.[0]

    console.log(name, description, price, category, subCategory, sizes, bestSeller)

    const images = [image1, image2, image3, image4].filter((item): item is Express.Multer.File => item !== undefined)

    console.log(images)

    let imageUrl = await Promise.all(
      images.map(async (item) => {
        let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
        return result.secure_url
      })
    )

    const productData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === 'true' || bestSeller === true,
      sizes: JSON.parse(sizes),
      image: imageUrl,
      date: Date.now(),
    }

    const product = new productModel(productData)
    await product.save()
    res.json({ success: true, message: 'Product Added  ' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const listProduct = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.query
    const { skip, limit: pageLimit, page: currentPage } = paginate(Number(page), Number(limit))
    const [products, total] = await Promise.all([
      productModel.find({}).skip(skip).limit(pageLimit),
      productModel.countDocuments({}),
    ])
    res.json({ success: true, products, page: currentPage, limit: pageLimit, total })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const removeProduct = async (req: Request, res: Response) => {
  try {
    await productModel.findByIdAndDelete(req.body.id)
    res.json({ success: true, message: 'Product Removed' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id, name, description, price, category, subCategory, sizes, bestSeller } = req.body

    const product = await productModel.findById(id)
    if (!product) {
      return res.json({ success: false, message: 'Product not found' })
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined
    const image1 = files?.image1?.[0]
    const image2 = files?.image2?.[0]
    const image3 = files?.image3?.[0]
    const image4 = files?.image4?.[0]
    const images = [image1, image2, image3, image4].filter((item): item is Express.Multer.File => item !== undefined)

    let imageUrl = product.image
    if (images.length > 0) {
      imageUrl = await Promise.all(
        images.map(async (item) => {
          let result = await cloudinary.uploader.upload(item.path, { resource_type: 'image' })
          return result.secure_url
        })
      )
    }

    const updateData = {
      name,
      description,
      category,
      price: Number(price),
      subCategory,
      bestSeller: bestSeller === 'true' || bestSeller === true,
      sizes: typeof sizes === 'string' ? JSON.parse(sizes) : sizes,
      image: imageUrl,
    }

    await productModel.findByIdAndUpdate(id, updateData)
    res.json({ success: true, message: 'Product Updated' })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

const singleProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.body
    const product = await productModel.findById(productId)
    res.json({ success: true, product })
  } catch (err) {
    console.log(err)
    res.json({ success: false, message: (err as Error).message })
  }
}

export { addProduct, removeProduct, updateProduct, listProduct, singleProduct }
