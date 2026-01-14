'use client'

// React Imports
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Component Imports
import ProductPageEditor, { ProductItemType } from '../product/ProductPageEditor'

const AllProductsManager = () => {
    // Hooks
    const router = useRouter()

    // State
    const [view, setView] = useState<'list' | 'editor'>('list')
    const [products, setProducts] = useState<ProductItemType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [editingProduct, setEditingProduct] = useState<ProductItemType | undefined>(undefined)

    // Load products
    useEffect(() => {
        loadProducts()
    }, [])

    const loadProducts = () => {
        const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
        setProducts(allProducts)
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
            setProducts(newProducts)
        }
    }

    const handleSave = (product: ProductItemType) => {
        const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
        const otherProducts = allProducts.filter(p => p.id !== product.id)
        const updatedAllProducts = [...otherProducts, product]

        localStorage.setItem('category-products', JSON.stringify(updatedAllProducts))
        loadProducts()
        setView('list')
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const filteredProducts = products.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (view === 'editor') {
        return (
            <ProductPageEditor
                categoryId={editingProduct?.categoryId || ''} // Pass existing category if editing, else empty (unassigned or new)
                dataToEdit={editingProduct}
                onSave={handleSave}
                onCancel={() => {
                    setView('list')
                }}
            />
        )
    }

    return (
        <Card>
            <CardHeader
                title='All Products'
                action={
                    <div className='flex gap-2'>
                        <Button variant='outlined' onClick={() => router.back()} startIcon={<i className='ri-arrow-left-line' />}>
                            Back
                        </Button>
                        <Link href='/apps/ecommerce/products/add'>
                            <Button variant='contained' startIcon={<i className='ri-add-line' />}>
                                Add New Product
                            </Button>
                        </Link>
                    </div>
                }
            />
            <CardContent>
                <div className='flex justify-end mbe-4'>
                    <TextField
                        size='small'
                        placeholder='Search Products...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <i className='ri-search-line' />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Product Name</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredProducts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align='center'>No products found.</TableCell>
                            </TableRow>
                        ) : (
                            filteredProducts
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(product => (
                                    <TableRow key={product.id}>
                                        <TableCell>
                                            <Typography className='font-medium'>{product.title}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {product.categoryId ? 'Assigned' : 'Unassigned'}
                                        </TableCell>
                                        <TableCell>
                                            <div className='flex gap-2'>
                                                <IconButton size='small' onClick={() => handleEdit(product)} title='Edit'>
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
                <TablePagination
                    component='div'
                    count={filteredProducts.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>
        </Card>
    )
}

export default AllProductsManager
