'use client'

// React Imports
import { type FormEvent, useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

type Props = {
    open: boolean
    handleClose: () => void
}

type CategoryType = {
    id: number
    name: string
}

const initialCategories: CategoryType[] = [
    { id: 1, name: 'Engineering' },
    { id: 2, name: 'Design' },
    { id: 3, name: 'Product' },
    { id: 4, name: 'Marketing' }
]



const AddCategoryDrawer = ({ open, handleClose }: Props) => {
    // States
    const [categories, setCategories] = useState<CategoryType[]>([])
    const [categoryName, setCategoryName] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('career-categories')
        if (savedData) {
            setCategories(JSON.parse(savedData))
        } else {
            setCategories(initialCategories)
        }
    }, [])

    // Save to localStorage whenever categories change
    useEffect(() => {
        if (categories.length > 0) { // Avoid overwriting with empty array on initial render before load
            localStorage.setItem('career-categories', JSON.stringify(categories))
        }
    }, [categories])

    const handleReset = () => {
        setCategoryName('')
        setEditingId(null)
        handleClose()
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!categoryName.trim()) return

        if (editingId !== null) {
            // Update
            const updatedCategories = categories.map(cat => (cat.id === editingId ? { ...cat, name: categoryName } : cat))
            setCategories(updatedCategories)
            setEditingId(null)
        } else {
            // Add
            const newCategory = {
                id: Date.now(), // Use timestamp for unique ID
                name: categoryName
            }
            const updatedCategories = [...categories, newCategory]
            setCategories(updatedCategories)
        }
        setCategoryName('')
    }

    const handleEdit = (category: CategoryType) => {
        setCategoryName(category.name)
        setEditingId(category.id)
    }

    const handleDelete = (id: number) => {
        const updatedCategories = categories.filter(cat => cat.id !== id)
        setCategories(updatedCategories)
    }

    const handleCancelEdit = () => {
        setCategoryName('')
        setEditingId(null)
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleReset}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>Add Category</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 flex flex-col gap-6'>
                {/* Form Section */}
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <TextField
                        fullWidth
                        label='Category Name'
                        placeholder='e.g. Engineering'
                        value={categoryName}
                        onChange={e => setCategoryName(e.target.value)}
                    />
                    <div className='flex items-center gap-4'>
                        <Button variant='contained' type='submit'>
                            {editingId !== null ? 'Update' : 'Add'}
                        </Button>
                        {editingId !== null ? (
                            <Button variant='outlined' color='secondary' onClick={handleCancelEdit}>
                                Cancel Edit
                            </Button>
                        ) : (
                            <Button variant='outlined' color='secondary' onClick={handleReset}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>

                <Divider />

                {/* Table Section */}
                <div>
                    <Typography variant='h6' className='mbe-3'>Categories List</Typography>
                    <TableContainer component={Paper} elevation={0} className='border'>
                        <Table size='small' aria-label='a dense table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.map(row => (
                                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component='th' scope='row'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <IconButton size='small' onClick={() => handleEdit(row)}>
                                                <i className='ri-pencil-line text-[20px]' />
                                            </IconButton>
                                            <IconButton size='small' onClick={() => handleDelete(row.id)}>
                                                <i className='ri-delete-bin-line text-[20px] text-error' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Drawer>
    )
}

export default AddCategoryDrawer
