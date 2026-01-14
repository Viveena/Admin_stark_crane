'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Local Imports
import TextEditor from '@/components/TextEditor'

type DetailSection = {
    heading: string
    detail: string
}

type FormValues = {
    locationName: string
    slug: string
    heroTitle: string
    heroImage: string
    startingHeading: string
    startingText: string
    startingImage: string
    detailSections: DetailSection[]
    closingHeading: string
    closingDetail: string
    contactPhone: string
    contactEmail: string
    contactAddress: string
}

export type LocationType = {
    id: string
    updatedAt: string
} & FormValues

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: LocationType
    onSuccess?: () => void
}

const LocationEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess }: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            locationName: '',
            slug: '',
            heroTitle: '',
            heroImage: '',
            startingHeading: '',
            startingText: '',
            startingImage: '',
            detailSections: [{ heading: '', detail: '' }],
            closingHeading: '',
            closingDetail: '',
            contactPhone: '',
            contactEmail: '',
            contactAddress: ''
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'detailSections'
    })

    const locationNameValue = watch('locationName')

    // Auto-generate slug from locationName if slug is empty
    useEffect(() => {
        if (locationNameValue && !watch('slug')) {
            const generatedSlug = locationNameValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setValue('slug', generatedSlug)
        }
    }, [locationNameValue, setValue, watch])

    useEffect(() => {
        if (dataToEdit) {
            reset({
                locationName: dataToEdit.locationName || '',
                slug: dataToEdit.slug || '',
                heroTitle: dataToEdit.heroTitle || '',
                heroImage: dataToEdit.heroImage || '',
                startingHeading: dataToEdit.startingHeading || '',
                startingText: dataToEdit.startingText || '',
                startingImage: dataToEdit.startingImage || '',
                detailSections: dataToEdit.detailSections?.length ? dataToEdit.detailSections : [{ heading: '', detail: '' }],
                closingHeading: dataToEdit.closingHeading || '',
                closingDetail: dataToEdit.closingDetail || '',
                contactPhone: dataToEdit.contactPhone || '',
                contactEmail: dataToEdit.contactEmail || '',
                contactAddress: dataToEdit.contactAddress || ''
            })
        } else {
            reset({
                locationName: '',
                slug: '',
                heroTitle: '',
                heroImage: '',
                startingHeading: '',
                startingText: '',
                startingImage: '',
                detailSections: [{ heading: '', detail: '' }],
                closingHeading: '',
                closingDetail: '',
                contactPhone: '',
                contactEmail: '',
                contactAddress: ''
            })
        }
    }, [dataToEdit, reset])

    const onSubmit = (data: FormValues) => {
        const savedLocations = JSON.parse(localStorage.getItem('location-list') || '[]')
        const timestamp = new Date().toISOString()

        let newLocationsList
        if (dataToEdit) {
            newLocationsList = savedLocations.map((loc: LocationType) =>
                loc.id === dataToEdit.id ? { ...loc, ...data, updatedAt: timestamp } : loc
            )
        } else {
            const newLocation = {
                id: Date.now().toString(),
                ...data,
                updatedAt: timestamp
            }
            newLocationsList = [...savedLocations, newLocation]
        }

        localStorage.setItem('location-list', JSON.stringify(newLocationsList))

        if (onSuccess) onSuccess()
        if (handleClose) handleClose()
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                        {!isDrawer && <CardHeader title='Location Editor' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
                            <Grid container spacing={5}>
                                {/* Location Info */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Location Info</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='locationName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Location Name'
                                                placeholder='e.g. New York'
                                                error={Boolean(errors.locationName)}
                                                helperText={errors.locationName && 'Location Name is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='slug'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Slug'
                                                placeholder='new-york'
                                                error={Boolean(errors.slug)}
                                                helperText={errors.slug && 'Slug is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Hero Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Hero Section</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heroTitle'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Hero Title'
                                                placeholder='Location Name or Title...'
                                                error={Boolean(errors.heroTitle)}
                                                helperText={errors.heroTitle && 'Hero Title is required'}
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
                                                <Button component='label' variant='outlined' htmlFor='loc-hero-image' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='loc-hero-image'
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

                                {/* Starting Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Starting Section</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startingHeading'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Starting Heading'
                                                placeholder='Introduction Title...'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startingText'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label='Starting Text'
                                                placeholder='Introduction text...'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startingImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Starting Section Image'
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
                                                <Button component='label' variant='outlined' htmlFor='loc-start-image' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='loc-start-image'
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

                                {/* Details Section (Renamed from FAQs) */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Details Sections</Divider>
                                </Grid>

                                {fields.map((item, index) => (
                                    <Grid size={{ xs: 12 }} key={item.id} className='border rounded p-4 relative'>
                                        <div className='flex justify-between items-center mbe-4'>
                                            <Typography variant='h6'>Detail Section {index + 1}</Typography>
                                            <IconButton size='small' color='error' onClick={() => remove(index)}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`detailSections.${index}.heading`}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label={`Heading`}
                                                            placeholder='Details Heading...'
                                                            error={Boolean(errors.detailSections?.[index]?.heading)}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Typography className='mbe-2'>Detail Content</Typography>
                                                <Controller
                                                    name={`detailSections.${index}.detail`}
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
                                ))}

                                <Grid size={{ xs: 12 }}>
                                    <Button variant='outlined' onClick={() => append({ heading: '', detail: '' })}>
                                        Add Details Section
                                    </Button>
                                </Grid>

                                {/* Closing Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Closing Section</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='closingHeading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Closing Heading'
                                                placeholder='Conclusion Title...'
                                                error={Boolean(errors.closingHeading)}
                                                helperText={errors.closingHeading && 'Closing Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Closing Detail</Typography>
                                    <Controller
                                        name='closingDetail'
                                        control={control}
                                        render={({ field }) => (
                                            <TextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Contact Details */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Contact Details</Divider>
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='contactPhone'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Phone Number'
                                                placeholder='+1 234 567 8900'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='contactEmail'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Email Address'
                                                placeholder='info@example.com'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='contactAddress'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label='Address'
                                                placeholder='123 Main St, City, Country'
                                            />
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
                        {dataToEdit ? 'Update Location' : 'Save Location'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default LocationEditor
