'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Component Imports
import TextEditor from '@components/TextEditor'
import PartsRelated, { RelatedContentData } from '../../../parts/PartsRelated'

export type ProductDetailSection = {
    heading: string
    description: string
    image: string
}

export type ProductItemType = {
    id: string
    categoryId: string
    title: string
    shortDescription: string
    // Hero
    heroTitle: string
    heroImage: string
    // Intro
    introTitle: string
    introDescription: string // Rich Text
    // Dynamic Detail (Multiple)
    details: ProductDetailSection[]
    // Related
    relatedContent: RelatedContentData
}

type Props = {
    dataToEdit?: ProductItemType
    categoryId: string
    onSave: (data: ProductItemType) => void
    onCancel: () => void
}

const ProductPageEditor = ({ dataToEdit, categoryId, onSave, onCancel }: Props) => {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<ProductItemType>({
        defaultValues: {
            id: '',
            categoryId: categoryId,
            title: '',
            shortDescription: '',
            heroTitle: '',
            heroImage: '',
            introTitle: '',
            introDescription: '',
            details: [
                { heading: '', description: '', image: '' }
            ],
            relatedContent: {
                sectionTypes: [],
                relatedBlogs: [],
                relatedServices: [],
                relatedParts: [],
                relatedProjects: []
            }
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'details'
    })

    const relatedContentValue = watch('relatedContent')

    useEffect(() => {
        if (dataToEdit) {
            // Migration check: if old data exists but no new 'details' array, could migrate here.
            // For now, assume fresh or compatiable data.
            reset({
                ...dataToEdit,
                shortDescription: dataToEdit.shortDescription || '',
                details: dataToEdit.details || [{ heading: '', description: '', image: '' }]
            })
        } else {
            reset({
                id: Date.now().toString(),
                categoryId: categoryId,
                title: '',
                shortDescription: '',
                heroTitle: '',
                heroImage: '',
                introTitle: '',
                introDescription: '',
                details: [
                    { heading: '', description: '', image: '' }
                ],
                relatedContent: {
                    sectionTypes: [],
                    relatedBlogs: [],
                    relatedServices: [],
                    relatedParts: [],
                    relatedProjects: []
                }
            })
        }
    }, [dataToEdit, categoryId, reset])

    const onSubmit = (data: ProductItemType) => {
        onSave(data)
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader title='Product Page Editor' action={
                    <Button startIcon={<i className='ri-arrow-go-back-line' />} onClick={onCancel} variant='outlined'>Back to List</Button>
                } />
                <CardContent>
                    <Grid container spacing={5}>
                        {/* Basic Info */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Basic Info</Typography>
                            <Controller
                                name='title'
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label='Product Name'
                                        placeholder='e.g. Single Grider Crane'
                                        error={Boolean(errors.title)}
                                        helperText={errors.title && 'Product Name is required'}
                                        className='mbe-4'
                                    />
                                )}
                            />
                            <Controller
                                name='shortDescription'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        minRows={2}
                                        label='Short Description'
                                        placeholder='Brief product summary...'
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}> <Divider /> </Grid>

                        {/* Hero Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Hero Section</Typography>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heroTitle'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Hero Title'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heroImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Hero Image'
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
                                                <Button component='label' variant='outlined' htmlFor='prod-hero-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='prod-hero-image'
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
                        </Grid>

                        <Grid size={{ xs: 12 }}> <Divider /> </Grid>

                        {/* Intro Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Intro Section</Typography>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='introTitle'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Intro Title'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant='body2' className='mbe-1'>Intro Paragraph</Typography>
                                    <Controller
                                        name='introDescription'
                                        control={control}
                                        render={({ field }) => (
                                            <TextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid size={{ xs: 12 }}> <Divider /> </Grid>

                        {/* Dynamic Detail Sections */}
                        <Grid size={{ xs: 12 }}>
                            <div className='flex justify-between items-center mbe-2'>
                                <Typography variant='h6'>Dynamic Detail Sections</Typography>
                                <Button size='small' variant='outlined' startIcon={<i className='ri-add-line' />} onClick={() => append({ heading: '', description: '', image: '' })}>
                                    Add Section
                                </Button>
                            </div>

                            {fields.map((item, index) => (
                                <Card key={item.id} variant='outlined' className='mbe-4'>
                                    <CardContent>
                                        <div className='flex justify-between items-center mbe-4'>
                                            <Typography variant='subtitle1' className='font-medium'>Section {index + 1}</Typography>
                                            <IconButton size='small' color='error' onClick={() => remove(index)}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`details.${index}.heading`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='Detail Heading'
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Typography variant='body2' className='mbe-1'>Detail Description</Typography>
                                                <Controller
                                                    name={`details.${index}.description`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`details.${index}.image`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className='flex items-center gap-4'>
                                                            <TextField
                                                                {...field}
                                                                size='small'
                                                                fullWidth
                                                                placeholder='No file chosen'
                                                                variant='outlined'
                                                                label='Detail Image'
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
                                                            <Button component='label' variant='outlined' htmlFor={`prod-detail-image-${index}`} className='min-is-fit'>
                                                                Choose
                                                                <input
                                                                    hidden
                                                                    id={`prod-detail-image-${index}`}
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
                            ))}
                        </Grid>

                        <Grid size={{ xs: 12 }}> <Divider /> </Grid>

                        {/* Related Content */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Related Content</Typography>
                            <PartsRelated
                                partsData={relatedContentValue}
                                onSave={handleRelatedContentSave}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} className='flex justify-end pt-5'>
                            <Button variant='contained' size='large' type='submit'>
                                Save Product
                            </Button>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </form>
    )
}

export default ProductPageEditor
