'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ProductItemType } from './ProductPageEditor'

// Component Imports
import ProductPageEditor from './ProductPageEditor'
import { ProductCategoryType } from '../category/ProductCategoryEditor'

type Props = {
    category: ProductCategoryType
    onBack: () => void
}

const CategoryProductsManager = ({ category, onBack }: Props) => {
    // State
    const [view, setView] = useState<'list' | 'editor'>('list')
    const [products, setProducts] = useState<ProductItemType[]>([])
    const [editingProduct, setEditingProduct] = useState<ProductItemType | undefined>(undefined)

    // Load products
    useEffect(() => {
        const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
        const categoryProducts = allProducts.filter(p => p.categoryId === category.id)
        setProducts(categoryProducts)
    }, [category.id, view]) // Reload when view changes (after save)

    const handleAddNew = () => {
        setEditingProduct(undefined)
        setView('editor')
    }

    const handleEdit = (product: ProductItemType) => {
        setEditingProduct(product)
        setView('editor')
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
            const newProducts = allProducts.filter(p => p.id !== id)
            localStorage.setItem('category-products', JSON.stringify(newProducts))

            // Update local state
            setProducts(products.filter(p => p.id !== id))
        }
    }

    const handleSave = (product: ProductItemType) => {
        const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]

        // Remove existing version of this product if it exists (update)
        const otherProducts = allProducts.filter(p => p.id !== product.id)

        // Add updated/new product
        const updatedAllProducts = [...otherProducts, product]

        localStorage.setItem('category-products', JSON.stringify(updatedAllProducts))
        setView('list')
    }

    if (view === 'editor') {
        return (
            <ProductPageEditor
                categoryId={category.id}
                dataToEdit={editingProduct}
                onSave={handleSave}
                onCancel={() => setView('list')}
            />
        )
    }

    return (
        <Card>
            <CardHeader
                title={`Products in ${category.title}`}
                action={
                    <div className='flex gap-2'>
                        <Button variant='outlined' onClick={onBack} startIcon={<i className='ri-arrow-go-back-line' />}>
                            Back to Categories
                        </Button>
                        <Button variant='contained' onClick={handleAddNew} startIcon={<i className='ri-add-line' />}>
                            Add Product
                        </Button>
                    </div>
                }
            />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Product Name</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={2} align='center'>No products added to this category yet.</TableCell>
                        </TableRow>
                    ) : (
                        products.map(product => (
                            <TableRow key={product.id}>
                                <TableCell>
                                    <Typography className='font-medium'>{product.title}</Typography>
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-2'>
                                        <IconButton size='small' onClick={() => handleEdit(product)} title='Edit Page'>
                                            <i className='ri-pencil-line' />
                                        </IconButton>
                                        <IconButton size='small' color='error' onClick={() => handleDelete(product.id)} title='Delete'>
                                            <i className='ri-delete-bin-line' />
                                        </IconButton>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </Card>
    )
}

export default CategoryProductsManager
