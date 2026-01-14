'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

import Autocomplete from '@mui/material/Autocomplete'

// ... existing imports

type FormValues = {
    title: string
    image: string
    assignedProducts?: string[]
}

export type PartsCategoryType = {
    id: string
    updatedAt: string
    subcategories?: PartsCategoryType[]
    assignedProducts?: string[]
} & FormValues

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: PartsCategoryType
    onSuccess?: () => void
    parentCategory?: PartsCategoryType
}

const PartsCategoryEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess, parentCategory }: Props) => {
    // State for available parts
    const [partsList, setPartsList] = useState<any[]>([])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            image: '',
            assignedProducts: []
        }
    })

    useEffect(() => {
        // Load available parts
        const savedParts = localStorage.getItem('part-descriptions')
        if (savedParts) {
            setPartsList(JSON.parse(savedParts))
        }
    }, [])

    useEffect(() => {
        if (dataToEdit) {
            reset({
                title: dataToEdit.title || '',
                image: dataToEdit.image || '',
                assignedProducts: dataToEdit.assignedProducts || []
            })
        }
    }, [dataToEdit, reset])

    const onSubmit = (data: FormValues) => {
        const savedCategories = JSON.parse(localStorage.getItem('parts-categories') || '[]')
        const timestamp = new Date().toISOString()

        let newCategoryList

        if (parentCategory) {
            // Adding a subcategory (recursively find parent)
            const addSubcategoryRecursive = (categories: PartsCategoryType[]): PartsCategoryType[] => {
                return categories.map(cat => {
                    if (cat.id === parentCategory.id) {
                        const newSubcategory = {
                            id: Date.now().toString(),
                            ...data,
                            updatedAt: timestamp,
                            subcategories: []
                        }
                        return {
                            ...cat,
                            subcategories: [...(cat.subcategories || []), newSubcategory]
                        }
                    }
                    if (cat.subcategories && cat.subcategories.length > 0) {
                        return { ...cat, subcategories: addSubcategoryRecursive(cat.subcategories) }
                    }
                    return cat
                })
            }
            newCategoryList = addSubcategoryRecursive(savedCategories)
        } else if (dataToEdit) {
            // Editing an existing category (or subcategory - simplified for now to just top level or passed data)
            // Note: Use a recursive update if editing deeper nodes is required, 
            // but for now assuming top-level edit or we need a finder function.
            // Let's implement a simple recursive finder/updater.

            const updateRecursive = (categories: PartsCategoryType[]): PartsCategoryType[] => {
                return categories.map(cat => {
                    if (cat.id === dataToEdit.id) {
                        return { ...cat, ...data, updatedAt: timestamp }
                    }
                    if (cat.subcategories && cat.subcategories.length > 0) {
                        return { ...cat, subcategories: updateRecursive(cat.subcategories) }
                    }
                    return cat
                })
            }

            newCategoryList = updateRecursive(savedCategories)
        } else {
            // Adding new top-level category
            const newItem = {
                id: Date.now().toString(),
                ...data,
                updatedAt: timestamp,
                subcategories: []
            }
            newCategoryList = [...savedCategories, newItem]
        }

        localStorage.setItem('parts-categories', JSON.stringify(newCategoryList))

        if (onSuccess) onSuccess()
        if (handleClose) handleClose()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                        {!isDrawer && <CardHeader title='Category Editor' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
                            <Grid container spacing={5}>
                                {/* Title */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='title'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Category Title'
                                                placeholder='e.g. Engine Parts'
                                                error={Boolean(errors.title)}
                                                helperText={errors.title && 'Title is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Assigned Products/Parts */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='assignedProducts'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Autocomplete
                                                multiple
                                                options={partsList}
                                                getOptionLabel={(option) => option.partName}
                                                // Value: map stored IDs back to part objects
                                                value={partsList.filter((p: any) => (value || []).includes(p.id))}
                                                onChange={(_, newValue) => {
                                                    // Store just the IDs
                                                    onChange(newValue.map((p: any) => p.id))
                                                }}
                                                renderInput={(params) => (
                                                    <TextField
                                                        {...params}
                                                        label='Assign Parts'
                                                        placeholder='Select parts...'
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Image */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='image'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Category Image'
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: field.value ? (
                                                                <InputAdornment position='end'>
                                                                    <IconButton size='small' edge='end' onClick={() => field.onChange('')}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='parts-cat-image' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='parts-cat-image'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                field.onChange(files[0].name)
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4'>
                    {isDrawer && handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit'>
                        {dataToEdit ? 'Update Category' : 'Save Category'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartsCategoryEditor
