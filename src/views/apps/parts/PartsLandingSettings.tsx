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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Local Imports
import PartsRelated, { RelatedContentData } from './PartsRelated'
import { usePageSection } from '@/hooks/usePageSection'

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
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'parts',
        sectionKey: 'landing'
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    const [selectedFiles, setSelectedFiles] = useState<{ [key: number]: File }>({});

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
    const heroSlides = watch('heroSlides');

    useEffect(() => {
        if (sectionData) {
            reset({
                heroSlides: sectionData.heroSlides || [{ image: '', title: '', shortLine: '', ctaText: '', ctaLink: '' }],
                contentHeading: sectionData.contentHeading || '',
                contentDescription: sectionData.contentDescription || '',
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

    const onSubmit = async (data: LandingFormValues) => {
        setSaveStatus('saving');
        try {
            // Process uploads for hero slides
            const updatedSlides = await Promise.all(data.heroSlides.map(async (slide, index) => {
                let imageUrl = slide.image;
                if (selectedFiles[index]) {
                    imageUrl = await uploadImage(selectedFiles[index]);
                }
                return { ...slide, image: imageUrl };
            }));

            const dataToSave = {
                ...data,
                heroSlides: updatedSlides
            };

            await saveSection(dataToSave);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
            if (handleClose) handleClose();
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        }
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    const handleFileSelect = (index: number, file: File) => {
        setSelectedFiles(prev => ({ ...prev, [index]: file }));
        setValue(`heroSlides.${index}.image`, file.name);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card className='shadow-none border-none'>
                        <CardHeader title='Parts Page Configuration'
                            subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                        />
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
                                            <IconButton size='small' color='error' onClick={() => {
                                                remove(index);
                                                // Clean up file selection
                                                const newFiles = { ...selectedFiles };
                                                delete newFiles[index];
                                                setSelectedFiles(newFiles);
                                            }}>
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
                                                                                <IconButton size='small' edge='end' onClick={() => {
                                                                                    field.onChange('');
                                                                                    const newFiles = { ...selectedFiles };
                                                                                    delete newFiles[index];
                                                                                    setSelectedFiles(newFiles);
                                                                                }}>
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
                                                                            handleFileSelect(index, files[0]);
                                                                        }
                                                                    }}
                                                                />
                                                            </Button>
                                                            {/* Preview */}
                                                            {(field.value || selectedFiles[index]) && (
                                                                <img
                                                                    src={selectedFiles[index] ? URL.createObjectURL(selectedFiles[index]) : field.value}
                                                                    alt="Preview"
                                                                    className="h-10 w-10 object-cover rounded"
                                                                />
                                                            )}
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

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4 items-center'>
                    {saveStatus === 'success' && <Typography color="success.main">Saved!</Typography>}
                    {saveStatus === 'error' && <Typography color="error.main">Error saving!</Typography>}
                    {handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit' disabled={saveStatus === 'saving'}>
                        {saveStatus === 'saving' ? <CircularProgress size={24} color="inherit" /> : 'Save Settings'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartsLandingSettings
