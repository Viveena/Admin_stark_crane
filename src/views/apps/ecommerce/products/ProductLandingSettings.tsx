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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import PartsRelated, { RelatedContentData } from '../../parts/PartsRelated'
import { usePageSection } from '@/hooks/usePageSection'

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
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'products',
        sectionKey: 'landing'
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
        if (sectionData) {
            reset({
                heroTitle: sectionData.heroTitle || '',
                heroImage: sectionData.heroImage || '',
                heroCtaText: sectionData.heroCtaText || '',
                heroCtaLink: sectionData.heroCtaLink || '',
                secondSectionHeading: sectionData.secondSectionHeading || '',
                secondSectionParagraph: sectionData.secondSectionParagraph || '',
                relatedContent: sectionData.relatedContent || {
                    sectionTypes: [],
                    relatedBlogs: [],
                    relatedServices: [],
                    relatedParts: [],
                    relatedProjects: []
                }
            })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: FormData) => {
        setSaveStatus('saving');
        try {
            let imageUrl = data.heroImage;
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            const dataToSave = {
                ...data,
                heroImage: imageUrl
            };

            await saveSection(dataToSave);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        }
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                </Grid>

                {/* Hero Section */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader
                            title='Hero Section'
                            subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
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
                                                                    <IconButton size='small' edge='end' onClick={() => {
                                                                        field.onChange('')
                                                                        setSelectedFile(null)
                                                                    }}>
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
                                                                setSelectedFile(files[0])
                                                                field.onChange(files[0].name)
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {(field.value || selectedFile) && (
                                                    <img
                                                        src={selectedFile ? URL.createObjectURL(selectedFile) : field.value}
                                                        alt="Hero Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
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

                <Grid size={{ xs: 12 }} className='flex justify-end items-center gap-4'>
                    {saveStatus === 'success' && <Typography color="success.main">Saved!</Typography>}
                    {saveStatus === 'error' && <Typography color="error.main">Error saving!</Typography>}
                    <Button variant='contained' type='submit' size='large' disabled={saveStatus === 'saving'}>
                        {saveStatus === 'saving' ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default ProductLandingSettings
