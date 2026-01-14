
// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import TablePagination from '@mui/material/TablePagination'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { ProductItemType } from './ProductPageEditor'

type Props = {
    open: boolean
    onClose: () => void
    onEditProduct: (product: ProductItemType) => void
    onCreateProduct: () => void
}

const ProductManagerModal = ({ open, onClose, onEditProduct, onCreateProduct }: Props) => {
    // State
    const [allProducts, setAllProducts] = useState<ProductItemType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Load products
    useEffect(() => {
        if (open) {
            loadProducts()
        }
    }, [open])

    const loadProducts = () => {
        const products = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
        setAllProducts(products)
    }

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            const updatedProducts = allProducts.filter(p => p.id !== id)
            localStorage.setItem('category-products', JSON.stringify(updatedProducts))
            setAllProducts(updatedProducts)
        }
    }

    const filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                <div className='flex justify-between items-center'>
                    <span>All Products</span>
                    <IconButton size='small' onClick={onClose}>
                        <i className='ri-close-line' />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                <div className='mbe-4 flex gap-2'>
                    <TextField
                        fullWidth
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
                    <Button
                        variant='contained'
                        onClick={onCreateProduct}
                        className='min-is-fit'
                        startIcon={<i className='ri-add-line' />}
                    >
                        Add New
                    </Button>
                </div>
                {filteredProducts.length === 0 ? (
                    <Typography align='center' className='bs-20 flex items-center justify-center text-textSecondary'>
                        No products found.
                    </Typography>
                ) : (
                    <>
                        <List>
                            {filteredProducts
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map(product => (
                                    <ListItem
                                        key={product.id}
                                        dense
                                        divider
                                        secondaryAction={
                                            <div className='flex gap-1'>
                                                <IconButton edge="end" aria-label="edit" onClick={() => onEditProduct(product)}>
                                                    <i className='ri-pencil-line' />
                                                </IconButton>
                                                <IconButton edge="end" aria-label="delete" color='error' onClick={() => handleDelete(product.id)}>
                                                    <i className='ri-delete-bin-line' />
                                                </IconButton>
                                            </div>
                                        }
                                    >
                                        <ListItemText
                                            primary={product.title}
                                            secondary={product.categoryId ? 'Assigned' : 'Unassigned'}
                                        />
                                    </ListItem>
                                ))}
                        </List>
                        <TablePagination
                            component='div'
                            count={filteredProducts.length}
                            page={page}
                            onPageChange={handleChangePage}
                            rowsPerPage={rowsPerPage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined'>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProductManagerModal
