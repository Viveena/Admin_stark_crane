
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
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { ProductCategoryType } from './ProductCategoryEditor'
import type { ProductItemType } from '../product/ProductPageEditor'

type Props = {
    open: boolean
    category: ProductCategoryType
    onClose: () => void
    onEditProduct: (product: ProductItemType) => void
    onCreateProduct: () => void
}

const ProductAssignmentModal = ({ open, category, onClose, onEditProduct, onCreateProduct }: Props) => {
    // State
    const [allProducts, setAllProducts] = useState<ProductItemType[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')

    // Load products
    useEffect(() => {
        if (open) {
            const products = JSON.parse(localStorage.getItem('category-products') || '[]') as ProductItemType[]
            setAllProducts(products)

            // Pre-select products in this category
            const currentCategoryIds = new Set(products.filter(p => p.categoryId === category.id).map(p => p.id))
            setSelectedIds(currentCategoryIds)
        }
    }, [open, category.id])

    const handleToggle = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const handleSave = () => {
        // Update all products
        const updatedProducts = allProducts.map(p => {
            if (selectedIds.has(p.id)) {
                // Assign to this category
                return { ...p, categoryId: category.id }
            } else if (p.categoryId === category.id) {
                // Was in this category, but now unselected -> Unassign
                return { ...p, categoryId: '' }
            }
            return p
        })

        localStorage.setItem('category-products', JSON.stringify(updatedProducts))
        onClose()
    }

    const filteredProducts = allProducts.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                <div className='flex justify-between items-center'>
                    <span>Manage Products for {category.title}</span>
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
                        Create
                    </Button>
                </div>
                {filteredProducts.length === 0 ? (
                    <Typography align='center' className='bs-20 flex items-center justify-center text-textSecondary'>
                        No products found.
                    </Typography>
                ) : (
                    <List>
                        {filteredProducts.map(product => {
                            const isChecked = selectedIds.has(product.id)
                            return (
                                <ListItem
                                    key={product.id}
                                    dense
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="edit" onClick={() => onEditProduct(product)}>
                                            <i className='ri-pencil-line' />
                                        </IconButton>
                                    }
                                >
                                    <Checkbox
                                        edge="start"
                                        checked={isChecked}
                                        tabIndex={-1}
                                        disableRipple
                                        onChange={() => handleToggle(product.id)}
                                    />
                                    <ListItemText
                                        primary={product.title}
                                        secondary={
                                            product.categoryId && product.categoryId !== category.id
                                                ? '(Assigned to another category)'
                                                : null
                                        }
                                        secondaryTypographyProps={{ color: 'warning.main', variant: 'caption' }}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='secondary' variant='outlined'>Cancel</Button>
                <Button onClick={handleSave} variant='contained'>Save Assignments</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ProductAssignmentModal
