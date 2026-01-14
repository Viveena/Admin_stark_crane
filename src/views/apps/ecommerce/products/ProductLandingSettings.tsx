// React Imports
import { useState, useEffect } from 'react'
import Link from 'next/link'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import PartsRelated, { RelatedContentData } from '../../parts/PartsRelated'

type FormData = {
    heroTitle: string
    heroImage: string
    heroCtaText: string
    heroCtaLink: string
    secondSectionHeading: string
    secondSectionParagraph: string
    relatedContent: RelatedContentData
}

const ProductLandingSettings = () => {
    // Hooks
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            heroTitle: '',
            heroImage: '',
            heroCtaText: '',
            heroCtaLink: '',
            secondSectionHeading: '',
            secondSectionParagraph: '',
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
        const savedData = localStorage.getItem('product-landing-settings')
        if (savedData) {
            reset(JSON.parse(savedData))
        }
    }, [reset])

    const onSubmit = (data: FormData) => {
        localStorage.setItem('product-landing-settings', JSON.stringify(data))
        alert('Product Landing Settings Saved!')
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                {/* Hero Section */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader
                            title='Hero Section'
                            action={
                                <div className='flex gap-2'>
                                    <Link href='/apps/ecommerce/products/add'>
                                        <Button variant='contained' startIcon={<i className='ri-add-line' />}>
                                            Add Product
                                        </Button>
                                    </Link>
                                    <Link href='/apps/ecommerce/products/all'>
                                        <Button variant='outlined' startIcon={<i className='ri-list-settings-line' />}>
                                            Manage Products
                                        </Button>
                                    </Link>
                                </div>
                            }
                        />
                        <CardContent>
                            <Grid container spacing={5}>
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
                                                placeholder='e.g. Discover Our Premium Products'
                                                error={Boolean(errors.heroTitle)}
                                                helperText={errors.heroTitle && 'This field is required'}
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
                                                <Button component='label' variant='outlined' htmlFor='product-hero-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='product-hero-image'
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
                                        name='heroCtaText'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='CTA Button Text'
                                                placeholder='e.g. Shop Now'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='heroCtaLink'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='CTA Button Link'
                                                placeholder='e.g. /products/all'
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Second Section */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader title='Introduction Section' />
                        <CardContent>
                            <Grid container spacing={5}>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='secondSectionHeading'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Heading'
                                                placeholder='e.g. Quality You Can Trust'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='secondSectionParagraph'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label='Paragraph'
                                                placeholder='Describe your product philosophy...'
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Related Section */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant='h5' className='mbe-4'>Related Content (Home Landing)</Typography>
                    <PartsRelated
                        partsData={relatedContentValue}
                        onSave={handleRelatedContentSave}
                    />
                </Grid>

                <Grid size={{ xs: 12 }} className='flex justify-end'>
                    <Button variant='contained' type='submit' size='large'>
                        Save Changes
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default ProductLandingSettings
