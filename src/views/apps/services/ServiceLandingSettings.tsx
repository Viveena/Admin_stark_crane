'use client'

// Next Imports
import Link from 'next/link'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Local Imports
import ServiceRelated, { RelatedContentData } from './ServiceRelated'
import { usePageSection } from '@/hooks/usePageSection'

type DetailSection = {
    title: string
    description: string
}

type FormData = {
    heroTitle: string
    heroImage: string
    shortDescription: string
    heroCtaText: string
    heroCtaLink: string
    detailSections: DetailSection[]
    relatedContent: RelatedContentData
}

const ServiceLandingSettings = () => {
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'service',
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
            shortDescription: '',
            heroCtaText: '',
            heroCtaLink: '',
            detailSections: [{ title: '', description: '' }],
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
        name: 'detailSections'
    })

    const relatedContentValue = watch('relatedContent')

    useEffect(() => {
        if (sectionData) {
            reset({
                heroTitle: sectionData.heroTitle || '',
                heroImage: sectionData.heroImage || '',
                shortDescription: sectionData.shortDescription || '',
                heroCtaText: sectionData.heroCtaText || '',
                heroCtaLink: sectionData.heroCtaLink || '',
                detailSections: sectionData.detailSections || [{ title: '', description: '' }],
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
                                <Link href='/apps/services/category/list' className='no-underline'>
                                    <Button variant='outlined' startIcon={<i className='ri-list-settings-line' />}>
                                        Manage Categories
                                    </Button>
                                </Link>
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
                                                placeholder='e.g. Professional Services'
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
                                                <Button component='label' variant='outlined' htmlFor='service-hero-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='service-hero-image'
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
                                                {/* Preview */}
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
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='shortDescription'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label='Short Description'
                                                placeholder='Brief overview...'
                                            />
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
                                                placeholder='e.g. Contact Us'
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
                                                placeholder='e.g. /contact'
                                            />
                                        )}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Dynamic Detail Sections */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader
                            title='Detail Sections'
                            action={
                                <Button
                                    variant='contained'
                                    size='small'
                                    startIcon={<i className='ri-add-line' />}
                                    onClick={() => append({ title: '', description: '' })}
                                >
                                    Add Section
                                </Button>
                            }
                        />
                        <CardContent>
                            {fields.map((item, index) => (
                                <div key={item.id} className='mbe-6 last:mbe-0'>
                                    <div className='flex items-center justify-between mbe-2'>
                                        <Typography variant='subtitle1' className='font-medium'>Section {index + 1}</Typography>
                                        <IconButton size='small' color='error' onClick={() => remove(index)} disabled={fields.length === 1}>
                                            <i className='ri-delete-bin-line' />
                                        </IconButton>
                                    </div>
                                    <Grid container spacing={5}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name={`detailSections.${index}.title` as const}
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label='Detail Title'
                                                        placeholder='Section Heading'
                                                        error={Boolean(errors.detailSections?.[index]?.title)}
                                                        helperText={errors.detailSections?.[index]?.title && 'Title is required'}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name={`detailSections.${index}.description` as const}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        label='Detail Description'
                                                        placeholder='Content...'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                    {index < fields.length - 1 && <Divider className='mbs-6' />}
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Related Section */}
                <Grid size={{ xs: 12 }}>
                    <Typography variant='h5' className='mbe-4'>Related Content</Typography>
                    <ServiceRelated
                        serviceData={relatedContentValue}
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

export default ServiceLandingSettings
