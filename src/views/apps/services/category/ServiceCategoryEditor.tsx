'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'

// Component Imports
import ServiceRelated, { RelatedContentData } from '../ServiceRelated'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'


// Styled Dropzone
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
    '& .dropzone': {
        minHeight: 'unset',
        padding: theme.spacing(4),
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    }
}))

type FormValues = {
    title: string
    shortDescription: string
    image: string
    // Hero Section
    heroTitle: string
    cardSubheading: string
    heroSubheading: string
    // Intro Section
    introTitle: string
    introDescription: string
    // Related
    relatedContent: RelatedContentData
}

export type ServiceCategoryType = {
    id: string
    updatedAt: string
} & FormValues

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: ServiceCategoryType
    onSuccess?: () => void
}

const ServiceCategoryEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess }: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            shortDescription: '',
            image: '',
            heroTitle: '',
            cardSubheading: '',
            heroSubheading: '',
            introTitle: '',
            introDescription: '',
            relatedContent: {
                sectionTypes: [],
                relatedBlogs: [],
                relatedServices: [],
                relatedParts: [],
                relatedProjects: []
            }
        }
    })

    const relatedContentValue = watch('relatedContent')
    const imageValue = watch('image')

    const [files, setFiles] = useState<File[]>([])

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        onDrop: (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                setFiles([file])
                const reader = new FileReader()
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setValue('image', e.target.result as string)
                    }
                }
                reader.readAsDataURL(file)
            }
        }
    })

    useEffect(() => {
        if (dataToEdit) {
            reset({
                title: dataToEdit.title || '',
                shortDescription: dataToEdit.shortDescription || '',
                image: dataToEdit.image || '',
                heroTitle: dataToEdit.heroTitle || '',
                cardSubheading: dataToEdit.cardSubheading || '',
                heroSubheading: dataToEdit.heroSubheading || '',
                introTitle: dataToEdit.introTitle || '',
                introDescription: dataToEdit.introDescription || '',
                relatedContent: dataToEdit.relatedContent || {
                    sectionTypes: [],
                    relatedBlogs: [],
                    relatedServices: [],
                    relatedParts: [],
                    relatedProjects: []
                }
            })
        }
    }, [dataToEdit, reset])

    const onSubmit = (data: FormValues) => {
        const savedCategories = JSON.parse(localStorage.getItem('service-categories') || '[]')
        const timestamp = new Date().toISOString()

        let newCategoryList

        if (dataToEdit) {
            // Editing existing
            newCategoryList = savedCategories.map((cat: ServiceCategoryType) =>
                cat.id === dataToEdit.id ? { ...cat, ...data, updatedAt: timestamp } : cat
            )
        } else {
            // New Category
            const newItem = {
                id: Date.now().toString(),
                ...data,
                updatedAt: timestamp
            }
            newCategoryList = [...savedCategories, newItem]
        }

        localStorage.setItem('service-categories', JSON.stringify(newCategoryList))

        if (onSuccess) onSuccess()
        if (handleClose) handleClose()
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                        <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                            {!isDrawer && <CardHeader title='Service Category Editor' />}
                            <CardContent className={isDrawer ? 'p-0' : ''}>
                                <Grid container spacing={5}>
                                    {/* Basic Info */}
                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant='h6' className='mbe-2'>Basic Information</Typography>
                                        <Controller
                                            name='title'
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Category Title'
                                                    placeholder='e.g. Consulting'
                                                    error={Boolean(errors.title)}
                                                    helperText={errors.title && 'Title is required'}
                                                    className='mbe-4'
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='cardSubheading'
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Card Subheading'
                                                    placeholder='Subheading for the card...'
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
                                                    placeholder='Brief summary for listing...'
                                                    className='mbe-4'
                                                />
                                            )}
                                        />

                                        <Typography variant='caption' className='mb-2 block'>Thumbnail Image</Typography>
                                        <Dropzone>
                                            <div {...getRootProps({ className: 'dropzone' })}>
                                                <input {...getInputProps()} />
                                                {imageValue ? (
                                                    <div className="flex flex-col items-center">
                                                        <img
                                                            src={imageValue}
                                                            alt="Preview"
                                                            style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain', marginBottom: 8 }}
                                                        />
                                                        <Button variant='outlined' size='small' color='secondary' onClick={(e) => {
                                                            e.stopPropagation()
                                                            setValue('image', '')
                                                            setFiles([])
                                                        }}>
                                                            Remove Image
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className='flex flex-col items-center gap-2'>
                                                        <i className='ri-image-add-line text-2xl' />
                                                        <Typography variant='caption'>Upload Thumbnail Image</Typography>
                                                    </div>
                                                )}
                                            </div>
                                        </Dropzone>
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant='h6' className='mbe-2'>Hero Section</Typography>
                                        <Controller
                                            name='heroTitle'
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Hero Title'
                                                    placeholder='Title for the hero section...'
                                                    className='mbe-4'
                                                />
                                            )}
                                        />

                                        <Controller
                                            name='heroSubheading'
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Hero Subheading'
                                                    placeholder='Subheading for the hero section...'
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant='h6' className='mbe-2'>Introduction Section</Typography>
                                        <Controller
                                            name='introTitle'
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Intro Title'
                                                    placeholder='Title for the introduction...'
                                                    className='mbe-4'
                                                />
                                            )}
                                        />
                                        <Controller
                                            name='introDescription'
                                            control={control}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    multiline
                                                    minRows={3}
                                                    label='Intro Description'
                                                    placeholder='Detailed description...'
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12 }}>
                                        <Typography variant='h6' className='mbe-2'>Related Content</Typography>
                                        <ServiceRelated serviceData={relatedContentValue} onSave={handleRelatedContentSave} />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>

                    <Grid size={{ xs: 12 }} className='flex justify-end pt-5'>
                        <Button variant='contained' size='large' type='submit'>
                            Save Category
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </>
    )
}

export default ServiceCategoryEditor
