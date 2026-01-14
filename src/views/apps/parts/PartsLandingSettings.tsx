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
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Local Imports
import PartsRelated, { RelatedContentData } from './PartsRelated'

type HeroSlide = {
    image: string
    title: string
    shortLine: string
    ctaText: string
    ctaLink: string
}

type LandingFormValues = {
    heroSlides: HeroSlide[]
    contentHeading: string
    contentDescription: string
    relatedContent: RelatedContentData
}

type Props = {
    handleClose?: () => void
}

const PartsLandingSettings = ({ handleClose }: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<LandingFormValues>({
        defaultValues: {
            heroSlides: [{ image: '', title: '', shortLine: '', ctaText: '', ctaLink: '' }],
            contentHeading: '',
            contentDescription: '',
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
        name: 'heroSlides'
    })

    const relatedContentValue = watch('relatedContent')

    useEffect(() => {
        const savedSettings = localStorage.getItem('parts-landing')
        if (savedSettings) {
            reset(JSON.parse(savedSettings))
        }
    }, [reset])

    const onSubmit = (data: LandingFormValues) => {
        localStorage.setItem('parts-landing', JSON.stringify(data))
        alert('Parts Landing Page Settings Saved!')
        if (handleClose) handleClose()
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className='shadow-none border-none'>
                        <CardHeader title='Parts Page Configuration' />
                        <CardContent className='p-0'>
                            <Grid container spacing={5}>

                                {/* Dynamic Hero Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Dynamic Hero Slides</Divider>
                                </Grid>

                                {fields.map((item, index) => (
                                    <Grid size={{ xs: 12 }} key={item.id} className='border rounded p-4 relative'>
                                        <div className='flex justify-between items-center mbe-4'>
                                            <Typography variant='h6'>Slide {index + 1}</Typography>
                                            <IconButton size='small' color='error' onClick={() => remove(index)}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`heroSlides.${index}.title`}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='Title'
                                                            placeholder='Slide Title...'
                                                            error={Boolean(errors.heroSlides?.[index]?.title)}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`heroSlides.${index}.shortLine`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='Short Line'
                                                            placeholder='Brief tag...'
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`heroSlides.${index}.image`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className='flex items-center gap-4'>
                                                            <TextField
                                                                {...field}
                                                                size='small'
                                                                fullWidth
                                                                placeholder='No file chosen'
                                                                variant='outlined'
                                                                label='Slide Image'
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
                                                            <Button component='label' variant='outlined' htmlFor={`parts-hero-image-${index}`} className='min-is-fit'>
                                                                Choose
                                                                <input
                                                                    hidden
                                                                    id={`parts-hero-image-${index}`}
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
                                                    name={`heroSlides.${index}.ctaText`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='CTA Text'
                                                            placeholder='e.g. Learn More'
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12, sm: 6 }}>
                                                <Controller
                                                    name={`heroSlides.${index}.ctaLink`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='CTA Link'
                                                            placeholder='e.g. /contact'
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}

                                <Grid size={{ xs: 12 }}>
                                    <Button variant='outlined' onClick={() => append({ image: '', title: '', shortLine: '', ctaText: '', ctaLink: '' })}>
                                        Add Hero Slide
                                    </Button>
                                </Grid>

                                {/* Content Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Content Section</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='contentHeading'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Heading'
                                                placeholder='Main Content Heading'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='contentDescription'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label='Description'
                                                placeholder='Detailed description...'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Related Content */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Related Content</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <PartsRelated
                                        partsData={relatedContentValue}
                                        onSave={handleRelatedContentSave}
                                    />
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4'>
                    {handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit'>
                        Save Settings
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartsLandingSettings
