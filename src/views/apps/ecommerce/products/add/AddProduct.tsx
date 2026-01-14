'use client'

// React Imports
import { useRouter } from 'next/navigation'

// Component Imports
import ProductPageEditor, { ProductItemType } from '../product/ProductPageEditor'

const AddProduct = () => {
    const router = useRouter()

    const handleSave = (product: ProductItemType) => {
        const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
        const updatedAllProducts = [...allProducts, product]

        localStorage.setItem('category-products', JSON.stringify(updatedAllProducts))

        router.push('/apps/ecommerce/products/all')
    }

    const handleCancel = () => {
        router.back()
    }

    return (
        <ProductPageEditor
            categoryId='' // No category pre-selected for global add
            onSave={handleSave}
            onCancel={handleCancel}
        />
    )
}

export default AddProduct
