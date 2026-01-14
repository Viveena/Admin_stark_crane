'use client'

// React Imports
import { useState, useEffect, useRef } from 'react'
import type { ChangeEvent } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Chip from '@mui/material/Chip'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

type FormValues = {
    title: string
}

type Category = {
    id: string
    title: string
    image: string
    status: string
}

const CreateCategory = () => {
    // States
    const [categories, setCategories] = useState<Category[]>([])
    const [fileName, setFileName] = useState('')
    const [status, setStatus] = useState('Published')
    const [editId, setEditId] = useState<string | null>(null)

    // Refs
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Hooks
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            title: ''
        }
    })

    // Load Data
    useEffect(() => {
        const savedData = localStorage.getItem('blog-categories')
        if (savedData) {
            setCategories(JSON.parse(savedData))
        }
    }, [])

    const saveCategories = (newCategories: Category[]) => {
        setCategories(newCategories)
        localStorage.setItem('blog-categories', JSON.stringify(newCategories))
    }

    // Handle File Upload
    const handleFileUpload = (event: ChangeEvent<HTMLInputElement>) => {
        const { files } = event.target
        if (files && files.length !== 0) {
            setFileName(files[0].name)
        }
    }

    const resetForm = () => {
        reset({ title: '' })
        setFileName('')
        setStatus('Published')
        setEditId(null)
    }

    // Handle Form Submit
    const onSubmit = (data: FormValues) => {
        const newCategory: Category = {
            id: editId || Date.now().toString(),
            title: data.title,
            image: fileName,
            status
        }

        let updatedCategories
        if (editId) {
            updatedCategories = categories.map(cat => (cat.id === editId ? newCategory : cat))
        } else {
            updatedCategories = [...categories, newCategory]
        }

        saveCategories(updatedCategories)
        alert(editId ? 'Category Updated' : 'Category Created')
        resetForm()
    }

    const handleEdit = (category: Category) => {
        setEditId(category.id)
        setValue('title', category.title)
        setFileName(category.image)
        setStatus(category.status)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const updatedCategories = categories.filter(cat => cat.id !== id)
            saveCategories(updatedCategories)
        }
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardHeader title={editId ? 'Edit Category' : 'Create New Category'} />
                    <CardContent>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Grid container spacing={5}>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='title'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Category Title'
                                                placeholder='e.g. Technology'
                                                error={Boolean(errors.title)}
                                                helperText={errors.title && 'Title is required'}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <div className='flex items-center gap-4'>
                                        <TextField
                                            size='small'
                                            placeholder='No file chosen'
                                            variant='outlined'
                                            value={fileName}
                                            className='flex-auto'
                                            slotProps={{
                                                input: {
                                                    readOnly: true,
                                                    endAdornment: fileName ? (
                                                        <InputAdornment position='end'>
                                                            <IconButton size='small' edge='end' onClick={() => setFileName('')}>
                                                                <i className='ri-close-line' />
                                                            </IconButton>
                                                        </InputAdornment>
                                                    ) : null
                                                }
                                            }}
                                        />
                                        <Button component='label' variant='outlined' htmlFor='category-image' className='min-is-fit'>
                                            Choose Image
                                            <input hidden id='category-image' type='file' onChange={handleFileUpload} ref={fileInputRef} />
                                        </Button>
                                    </div>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <FormControl fullWidth>
                                        <InputLabel id='status-select'>Status</InputLabel>
                                        <Select
                                            labelId='status-select'
                                            label='Status'
                                            value={status}
                                            onChange={e => setStatus(e.target.value)}
                                        >
                                            <MenuItem value='Published'>Published</MenuItem>
                                            <MenuItem value='Scheduled'>Scheduled</MenuItem>
                                            <MenuItem value='Hidden'>Hidden</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid size={{ xs: 12 }} className='flex gap-4 justify-end'>
                                    <Button variant='outlined' color='secondary' onClick={resetForm}>
                                        Reset
                                    </Button>
                                    <Button variant='contained' type='submit'>
                                        {editId ? 'Update Category' : 'Create Category'}
                                    </Button>
                                </Grid>
                            </Grid>
                        </form>
                    </CardContent>
                </Card>
            </Grid>

            {/* Categories Table */}
            <Grid size={{ xs: 12 }}>
                <Card>
                    <CardHeader title='Categories List' />
                    <TableContainer component={Paper} className='shadow-none border rounded'>
                        <Table aria-label='categories table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>S.No</TableCell>
                                    <TableCell>Title</TableCell>
                                    <TableCell>Image</TableCell>
                                    <TableCell>Status</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {categories.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align='center'>No categories found</TableCell>
                                    </TableRow>
                                ) : (
                                    categories.map((row, index) => (
                                        <TableRow key={row.id}>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell component='th' scope='row'>
                                                {row.title}
                                            </TableCell>
                                            <TableCell>{row.image || 'No Image'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={row.status}
                                                    color={row.status === 'Published' ? 'success' : row.status === 'Hidden' ? 'secondary' : 'warning'}
                                                    size='small'
                                                    variant='tonal'
                                                />
                                            </TableCell>
                                            <TableCell align='right'>
                                                <IconButton onClick={() => handleEdit(row)} color='primary' size='small'>
                                                    <i className='ri-edit-box-line' />
                                                </IconButton>
                                                <IconButton onClick={() => handleDelete(row.id)} color='error' size='small'>
                                                    <i className='ri-delete-bin-7-line' />
                                                </IconButton>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Card>
            </Grid>
        </Grid>
    )
}

export default CreateCategory
