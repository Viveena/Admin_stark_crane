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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import IndustryRelated, { RelatedContentData } from './IndustryRelated'

type LandingFormValues = {
    heroImage: string
    title: string
    shortLine: string
    relatedContent: RelatedContentData
}

type Props = {
    handleClose?: () => void
}

const IndustryLandingSettings = ({ handleClose }: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<LandingFormValues>({
        defaultValues: {
            heroImage: '',
            title: '',
            shortLine: '',
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

    useEffect(() => {
        const savedSettings = localStorage.getItem('industry-landing')
        if (savedSettings) {
            reset(JSON.parse(savedSettings))
        }
    }, [reset])

    const onSubmit = (data: LandingFormValues) => {
        localStorage.setItem('industry-landing', JSON.stringify(data))
        alert('Industry Landing Page Settings Saved!')
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
                        <CardHeader title='Industry Page Configuration' />
                        <CardContent className='p-0'>
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
                                                label='Page Title'
                                                placeholder='Main Page Title...'
                                                error={Boolean(errors.title)}
                                                helperText={errors.title && 'Title is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Short Line */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='shortLine'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Short Line / Subtitle'
                                                placeholder='Brief description...'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Hero Image */}
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
                                                <Button component='label' variant='outlined' htmlFor='industry-landing-hero-image' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='industry-landing-hero-image'
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
                                    <Divider textAlign='left'>Related Content</Divider>
                                </Grid>

                                {/* Related Content */}
                                <Grid size={{ xs: 12 }}>
                                    <IndustryRelated
                                        industryData={relatedContentValue}
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

export default IndustryLandingSettings
