
'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Drawer from '@mui/material/Drawer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'

// Type Imports
import type { ProductCategoryType } from './ProductCategoryEditor'

// Component Imports
import ProductCategoryEditor from './ProductCategoryEditor'
import ProductPageEditor from '../product/ProductPageEditor'
import ProductAssignmentModal from './ProductAssignmentModal'
import { ProductItemType } from '../product/ProductPageEditor'

// Row Component
const Row = ({
    row,
    productCount,
    handleEdit,
    handleDelete,
    handleManageProducts
}: {
    row: ProductCategoryType,
    productCount: number,
    handleEdit: (item: ProductCategoryType) => void,
    handleDelete: (id: string) => void,
    handleManageProducts: (item: ProductCategoryType) => void
}) => {
    return (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <div className='flex items-center gap-2'>
                    <div>
                        <Typography variant='body1' className='font-medium'>{row.title}</Typography>
                        {row.shortDescription && (
                            <Typography variant='caption' color='text.secondary' className='truncate block max-w-xs'>
                                {row.shortDescription}
                            </Typography>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                {row.image && <Typography variant='caption' color='textSecondary'>{row.image}</Typography>}
            </TableCell>
            <TableCell>
                <Chip label={`${productCount} Products`} size='small' color='primary' variant='outlined' />
            </TableCell>
            <TableCell>
                <div className='flex gap-2'>
                    <IconButton size='small' color='primary' onClick={() => handleManageProducts(row)} title="Manage Products">
                        <i className='ri-list-settings-line' />
                    </IconButton>
                    <IconButton size='small' onClick={() => handleEdit(row)} title="Edit Category">
                        <i className='ri-pencil-line' />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleDelete(row.id)} title="Delete Category">
                        <i className='ri-delete-bin-line' />
                    </IconButton>
                </div>
            </TableCell>
        </TableRow>
    )
}

const ProductCategoryList = () => {
    // States
    const [data, setData] = useState<ProductCategoryType[]>([])
    const [filteredData, setFilteredData] = useState<ProductCategoryType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Product Stats
    const [categoryProductCounts, setCategoryProductCounts] = useState<Record<string, number>>({})

    // View State
    const [viewMode, setViewMode] = useState<'list' | 'product-editor'>('list')
    const [productToEdit, setProductToEdit] = useState<ProductItemType | undefined>(undefined)

    // Modals
    const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<ProductCategoryType | undefined>(undefined)

    // Drawer States
    const [editorOpen, setEditorOpen] = useState(false)
    const [editingNode, setEditingNode] = useState<ProductCategoryType | undefined>(undefined)

    // Load data
    const loadData = () => {
        // Categories
        const savedData = localStorage.getItem('product-categories')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            setData(parsedData)
            setFilteredData(parsedData)
        }

        // Products & Counts
        const savedProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
        const counts: Record<string, number> = {}
        savedProducts.forEach(p => {
            if (p.categoryId) {
                counts[p.categoryId] = (counts[p.categoryId] || 0) + 1
            }
        })
        setCategoryProductCounts(counts)
    }

    useEffect(() => {
        loadData()
    }, [viewMode, assignmentModalOpen])

    // Filter
    useEffect(() => {
        const result = data.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(result)
        setPage(0)
    }, [searchTerm, data])

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    // Actions
    const handleAddNew = () => {
        setEditingNode(undefined)
        setEditorOpen(true)
    }

    const handleEdit = (item: ProductCategoryType) => {
        setEditingNode(item)
        setEditorOpen(true)
    }

    const handleManageProducts = (item: ProductCategoryType) => {
        setSelectedCategory(item)
        setAssignmentModalOpen(true)
    }

    const handleEditProductFromModal = (product: ProductItemType) => {
        setProductToEdit(product)
        setAssignmentModalOpen(false) // Close modal
        setViewMode('product-editor') // Switch to full page editor
    }

    const handleCreateProductFromModal = () => {
        setProductToEdit(undefined) // Fresh product
        setAssignmentModalOpen(false)
        setViewMode('product-editor')
    }

    const handleProductSave = (product: ProductItemType) => {
        const allProducts = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]

        const otherProducts = allProducts.filter(p => p.id !== product.id)
        const updatedAllProducts = [...otherProducts, product]

        localStorage.setItem('category-products', JSON.stringify(updatedAllProducts))

        setViewMode('list')
        setProductToEdit(undefined)

        if (selectedCategory) {
            setAssignmentModalOpen(true)
        }
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const newData = data.filter(cat => cat.id !== id)
            localStorage.setItem('product-categories', JSON.stringify(newData))
            loadData()
        }
    }

    const handleEditorSuccess = () => {
        loadData()
        setEditorOpen(false)
    }

    if (viewMode === 'product-editor') {
        return (
            <ProductPageEditor
                categoryId={productToEdit?.categoryId || ''}
                dataToEdit={productToEdit}
                onSave={handleProductSave}
                onCancel={() => {
                    setViewMode('list')
                    if (selectedCategory) setAssignmentModalOpen(true)
                }}
            />
        )
    }

    return (
        <Card>
            <CardHeader
                title='Product Categories'
                action={
                    <div className='flex gap-4 items-center'>
                        <TextField
                            size='small'
                            placeholder='Search Categories'
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-search-line' />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddNew}>
                            Add Category
                        </Button>
                    </div>
                }
            />
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title & Description</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Info</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align='center'>
                                    <Typography>No categories found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <Row
                                        key={row.id}
                                        row={row}
                                        productCount={categoryProductCounts[row.id] || 0}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                        handleManageProducts={handleManageProducts}
                                    />
                                ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                rowsPerPageOptions={[10, 25, 50]}
                component='div'
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Drawer
                open={editorOpen}
                anchor='right'
                onClose={() => setEditorOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '500px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>
                        {editingNode ? 'Edit Category' : 'Add New Category'}
                    </Typography>
                    <IconButton size='small' onClick={() => setEditorOpen(false)}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <ProductCategoryEditor
                        isDrawer
                        handleClose={() => setEditorOpen(false)}
                        onSuccess={handleEditorSuccess}
                        dataToEdit={editingNode}
                    />
                </div>
            </Drawer>

            {selectedCategory && (
                <ProductAssignmentModal
                    open={assignmentModalOpen}
                    category={selectedCategory}
                    onClose={() => setAssignmentModalOpen(false)}
                    onEditProduct={handleEditProductFromModal}
                    onCreateProduct={handleCreateProductFromModal}
                />
            )}
        </Card>
    )
}

export default ProductCategoryList
