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
import ServiceRelated, { RelatedContentData } from '../ServiceRelated'

export type ServiceDetailSection = {
    title: string
    description: string
    image: string
}

export type CustomHbButton = {
    text: string
    link: string
}

export type ServiceItemType = {
    id: string
    categoryId: string
    title: string

    // Thumbnail
    thumbnailTitle: string
    thumbnailImage: string
    mainImage: string
    thumbnailDescription: string // Rich Text
    customButtons: CustomHbButton[]

    // Hero
    heroTitle: string
    heroImage: string
    heroDescription: string // Plain or Rich Text (User asked for description)
    // CTA
    ctaText?: string
    ctaLink?: string

    // Intro
    introTitle: string
    introDescription: string // Rich Text

    // Dynamic Detail (Multiple)
    details: ServiceDetailSection[]

    // Conclusion
    conclusionDescription: string // Rich Text
    conclusionImage: string

    // Related
    relatedContent: RelatedContentData
}

type Props = {
    dataToEdit?: ServiceItemType
    categoryId: string
    onSave: (data: ServiceItemType) => void
    onCancel: () => void
}

const ServicePageEditor = ({ dataToEdit, categoryId, onSave, onCancel }: Props) => {
    const {
        control,
        handleSubmit,
        setValue,
        watch,
        reset,
        formState: { errors }
    } = useForm<ServiceItemType>({
        defaultValues: {
            id: '',
            categoryId: categoryId,
            title: '',

            thumbnailTitle: '',
            thumbnailImage: '',
            mainImage: '',
            thumbnailDescription: '',
            customButtons: [],

            heroTitle: '',
            heroImage: '',
            heroDescription: '',
            ctaText: '',
            ctaLink: '',

            introTitle: '',
            introDescription: '',

            details: [
                { title: '', description: '', image: '' }
            ],

            conclusionDescription: '',
            conclusionImage: '',

            relatedContent: {
                sectionTypes: [],
                relatedBlogs: [],
                relatedServices: [],
                relatedParts: [],
                relatedProjects: []
            }
        }
    })

    const { fields: detailFields, append: appendDetail, remove: removeDetail } = useFieldArray({
        control,
        name: 'details'
    })

    const { fields: buttonFields, append: appendButton, remove: removeButton } = useFieldArray({
        control,
        name: 'customButtons'
    })

    const relatedContentValue = watch('relatedContent')

    useEffect(() => {
        if (dataToEdit) {
            reset({
                ...dataToEdit,
                thumbnailTitle: dataToEdit.thumbnailTitle || '',
                thumbnailImage: dataToEdit.thumbnailImage || '',
                mainImage: dataToEdit.mainImage || '',
                thumbnailDescription: dataToEdit.thumbnailDescription || '',
                customButtons: dataToEdit.customButtons || [],
                heroDescription: dataToEdit.heroDescription || '',
                details: dataToEdit.details || [{ title: '', description: '', image: '' }],
                conclusionDescription: dataToEdit.conclusionDescription || '',
                ctaText: dataToEdit.ctaText || '',
                ctaLink: dataToEdit.ctaLink || ''
            })
        } else {
            reset({
                id: Date.now().toString(),
                categoryId: categoryId,
                title: '',

                thumbnailTitle: '',
                thumbnailImage: '',
                mainImage: '',
                thumbnailDescription: '',
                customButtons: [],

                heroTitle: '',
                heroImage: '',
                heroDescription: '',
                ctaText: '',
                ctaLink: '',

                introTitle: '',
                introDescription: '',

                details: [
                    { title: '', description: '', image: '' }
                ],

                conclusionDescription: '',
                conclusionImage: '',

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

    const onSubmit = (data: ServiceItemType) => {
        onSave(data)
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Card>
                <CardHeader title='Service Page Editor' action={
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
                                        label='Service Name'
                                        placeholder='e.g. Strategic Planning'
                                        error={Boolean(errors.title)}
                                        helperText={errors.title && 'Service Name is required'}
                                        className='mbe-4'
                                    />
                                )}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }}> <Divider /> </Grid>

                        {/* Thumbnail Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Thumbnail Section</Typography>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='thumbnailTitle'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Thumbnail Title'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant='body2' className='mbe-1'>Thumbnail Description</Typography>
                                    <Controller
                                        name='thumbnailDescription'
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
                                        name='thumbnailImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Thumbnail Image'
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
                                                <Button component='label' variant='outlined' htmlFor='service-pg-thumb-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='service-pg-thumb-image'
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
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='mainImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Main Image'
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
                                                <Button component='label' variant='outlined' htmlFor='service-pg-main-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='service-pg-main-image'
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
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='mainImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Main Image'
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
                                                <Button component='label' variant='outlined' htmlFor='service-pg-main-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='service-pg-main-image'
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

                                {/* Custom Buttons */}
                                <Grid size={{ xs: 12 }}>
                                    <div className='flex justify-between items-center mbe-2'>
                                        <Typography variant='subtitle1'>Custom Buttons</Typography>
                                        <Button size='small' variant='outlined' startIcon={<i className='ri-add-line' />} onClick={() => appendButton({ text: '', link: '' })}>
                                            Add Button
                                        </Button>
                                    </div>
                                    {buttonFields.map((item, index) => (
                                        <div key={item.id} className='flex gap-4 mbe-2 items-center'>
                                            <Controller
                                                name={`customButtons.${index}.text` as const}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        size='small'
                                                        fullWidth
                                                        label='Button Text'
                                                    />
                                                )}
                                            />
                                            <Controller
                                                name={`customButtons.${index}.link` as const}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        size='small'
                                                        fullWidth
                                                        label='Button Link'
                                                    />
                                                )}
                                            />
                                            <IconButton size='small' color='error' onClick={() => removeButton(index)}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                    ))}
                                </Grid>
                            </Grid>
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
                                    <Typography variant='body2' className='mbe-1'>Hero Description</Typography>
                                    <Controller
                                        name='heroDescription'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                minRows={2}
                                                placeholder='Hero description...'
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
                                                <Button component='label' variant='outlined' htmlFor='service-pg-hero-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='service-pg-hero-image'
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='ctaText'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='CTA Button Text'
                                                placeholder='e.g. Get Started'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='ctaLink'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='CTA Button Link'
                                                placeholder='e.g. /contact'
                                            />
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
                                <Button size='small' variant='outlined' startIcon={<i className='ri-add-line' />} onClick={() => appendDetail({ title: '', description: '', image: '' })}>
                                    Add Section
                                </Button>
                            </div>

                            {detailFields.map((item, index) => (
                                <Card key={item.id} variant='outlined' className='mbe-4'>
                                    <CardContent>
                                        <div className='flex justify-between items-center mbe-4'>
                                            <Typography variant='subtitle1' className='font-medium'>Section {index + 1}</Typography>
                                            <IconButton size='small' color='error' onClick={() => removeDetail(index)}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`details.${index}.title` as const}
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
                                                    name={`details.${index}.description` as const}
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
                                                    name={`details.${index}.image` as const}
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
                                                            <Button component='label' variant='outlined' htmlFor={`service-detail-image-${index}`} className='min-is-fit'>
                                                                Choose
                                                                <input
                                                                    hidden
                                                                    id={`service-detail-image-${index}`}
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

                        {/* Conclusion Section */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Conclusion Section</Typography>
                            <Grid container spacing={4}>
                                <Grid size={{ xs: 12 }}>
                                    <Typography variant='body2' className='mbe-1'>Conclusion Description</Typography>
                                    <Controller
                                        name='conclusionDescription'
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
                                        name='conclusionImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Conclusion Image'
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
                                                <Button component='label' variant='outlined' htmlFor='service-conclusion-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='service-conclusion-image'
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

                        {/* Related Content */}
                        <Grid size={{ xs: 12 }}>
                            <Typography variant='h6' className='mbe-2'>Related Content</Typography>
                            <ServiceRelated
                                serviceData={relatedContentValue}
                                onSave={handleRelatedContentSave}
                            />
                        </Grid>

                        <Grid size={{ xs: 12 }} className='flex justify-end pt-5'>
                            <Button variant='contained' size='large' type='submit'>
                                Save Service
                            </Button>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </form>
    )
}

export default ServicePageEditor
