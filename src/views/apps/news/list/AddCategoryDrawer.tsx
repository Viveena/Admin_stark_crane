'use client'

import { useState, useEffect } from 'react'

import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Tooltip from '@mui/material/Tooltip'

import { useForm, Controller } from 'react-hook-form'

type Category = {
    id: string
    title: string
}

type Props = {
    open: boolean
    handleClose: () => void
}

const AddCategoryDrawer = ({ open, handleClose }: Props) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [editingId, setEditingId] = useState<string | null>(null)

    const { control, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            title: ''
        }
    })

    useEffect(() => {
        if (open) {
            const savedCategories = localStorage.getItem('news-categories')
            if (savedCategories) {
                setCategories(JSON.parse(savedCategories))
            }
        }
    }, [open])

    const saveCategories = (newCategories: Category[]) => {
        setCategories(newCategories)
        localStorage.setItem('news-categories', JSON.stringify(newCategories))
    }

    const onSubmit = (data: { title: string }) => {
        if (editingId) {
            const updatedCategories = categories.map(cat =>
                cat.id === editingId ? { ...cat, title: data.title } : cat
            )
            saveCategories(updatedCategories)
            setEditingId(null)
        } else {
            const newCategory = {
                id: Date.now().toString(),
                title: data.title
            }
            saveCategories([...categories, newCategory])
        }
        reset()
    }

    const handleEdit = (category: Category) => {
        setEditingId(category.id)
        setValue('title', category.title)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = categories.filter(cat => cat.id !== id)
            saveCategories(updatedCategories)
        }
    }

    const handleReset = () => {
        setEditingId(null)
        reset()
        handleClose()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            onClose={handleReset}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>Manage Categories</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 flex flex-col gap-6'>
                {/* Form to Add/Edit */}
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-4'>
                    <Controller
                        name='title'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label={editingId ? 'Edit Category' : 'New Category Name'}
                                placeholder='Technology'
                                error={Boolean(errors.title)}
                                helperText={errors.title && 'Title is required'}
                            />
                        )}
                    />
                    <div className='flex gap-2'>
                        <Button variant='contained' type='submit' fullWidth>
                            {editingId ? 'Update' : 'Add'}
                        </Button>
                        {editingId && (
                            <Button variant='outlined' color='secondary' onClick={() => { setEditingId(null); reset(); }} fullWidth>
                                Cancel Edit
                            </Button>
                        )}
                    </div>
                </form>

                <Divider />

                {/* Categories Table */}
                <Typography variant='h6'>Existing Categories</Typography>
                <TableContainer component={Paper} className='shadow-none border'>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {categories.length > 0 ? (
                                categories.map((cat) => (
                                    <TableRow key={cat.id}>
                                        <TableCell>{cat.title}</TableCell>
                                        <TableCell align='right'>
                                            <div className='flex justify-end gap-2'>
                                                <Tooltip title='Edit'>
                                                    <IconButton size='small' onClick={() => handleEdit(cat)}>
                                                        <i className='ri-pencil-line' />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Delete'>
                                                    <IconButton size='small' color='error' onClick={() => handleDelete(cat.id)}>
                                                        <i className='ri-delete-bin-line' />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={2} align='center'>No categories found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </Drawer>
    )
}

export default AddCategoryDrawer
