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

type DetailListItem = {
    heading: string
    description: string
}

type DetailFormValues = {
    // Hero Section
    heroImage: string
    heroTitle: string
    heroDescription: string
    ctaText: string
    ctaLink: string

    // Second Section
    section2Heading: string
    section2Description: string

    // Third Section (Details)
    detailsTitle: string
    detailsDescription: string
    detailsList: DetailListItem[]

    // Related
    relatedContent: RelatedContentData
}

type Props = {
    handleClose?: () => void
}

const PartsDetailSettings = ({ handleClose }: Props) => {
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'parts',
        sectionKey: 'detail'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [selectedHeroFile, setSelectedHeroFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<DetailFormValues>({
        defaultValues: {
            heroImage: '',
            heroTitle: '',
            heroDescription: '',
            ctaText: '',
            ctaLink: '',
            section2Heading: '',
            section2Description: '',
            detailsTitle: '',
            detailsDescription: '',
            detailsList: [{ heading: '', description: '' }],
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
        name: 'detailsList'
    })

    const relatedContentValue = watch('relatedContent')

    useEffect(() => {
        if (sectionData) {
            try {
                // Migration check: if old format (label/value) exists, convert to heading/description
                let detailsList = sectionData.detailsList || [{ heading: '', description: '' }];
                if (detailsList.length > 0 && 'label' in detailsList[0]) {
                    detailsList = detailsList.map((item: any) => ({
                        heading: item.label,
                        description: item.value
                    }))
                }

                reset({
                    heroImage: sectionData.heroImage || '',
                    heroTitle: sectionData.heroTitle || '',
                    heroDescription: sectionData.heroDescription || '',
                    ctaText: sectionData.ctaText || '',
                    ctaLink: sectionData.ctaLink || '',
                    section2Heading: sectionData.section2Heading || '',
                    section2Description: sectionData.section2Description || '',
                    detailsTitle: sectionData.detailsTitle || '',
                    detailsDescription: sectionData.detailsDescription || '',
                    detailsList: detailsList,
                    relatedContent: sectionData.relatedContent || {
                        sectionTypes: [],
                        relatedBlogs: [],
                        relatedServices: [],
                        relatedParts: [],
                        relatedProjects: []
                    }
                })
            } catch (e) {
                console.error("Failed to parse parts-detail settings", e)
            }
        }
    }, [sectionData, reset])

    const onSubmit = async (data: DetailFormValues) => {
        setIsSaving(true);
        try {
            let heroImageUrl = data.heroImage;
            if (selectedHeroFile) {
                heroImageUrl = await uploadImage(selectedHeroFile);
            }

            const dataToSave = {
                ...data,
                heroImage: heroImageUrl
            };

            await saveSection(dataToSave);
            alert('Parts Detail Page Settings Saved!');
            if (handleClose) handleClose();
        } catch (e) {
            console.error(e);
            alert('Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    const handleHeroFileSelect = (file: File) => {
        setSelectedHeroFile(file);
        setValue('heroImage', file.name);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={8}>
                <Grid size={{ xs: 12 }}>
                    {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                </Grid>

                <Grid size={{ xs: 12 }}>
                    <Card className='shadow-none border-none'>
                        <CardHeader
                            title='Parts Detail Page Configuration'
                            subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                        />
                        <CardContent className='p-2'>
                            <Grid container spacing={6}>

                                {/* Hero Section */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Hero Section</Divider>
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
                                                                    <IconButton size='small' edge='end' onClick={() => {
                                                                        field.onChange('');
                                                                        setSelectedHeroFile(null);
                                                                    }}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='detail-hero-image' className='min-is-fit'>
                                                    Choose
                                                    <input
                                                        hidden
                                                        id='detail-hero-image'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                handleHeroFileSelect(files[0]);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {/* Preview */}
                                                {(field.value || selectedHeroFile) && (
                                                    <img
                                                        src={selectedHeroFile ? URL.createObjectURL(selectedHeroFile) : field.value}
                                                        alt="Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
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
                                                placeholder='Page Title...'
                                                error={Boolean(errors.heroTitle)}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heroDescription'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label='Hero Description'
                                                placeholder='Brief description...'
                                            />
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
                                                placeholder='e.g. Request Quote'
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
                                                label='CTA Link'
                                                placeholder='e.g. /contact'
                                            />
                                        )}
                                    />
                                </Grid>


                                {/* Second Section */}
                                <Grid size={{ xs: 12 }} className='mbe-4 mte-4'>
                                    <Divider textAlign='left'>Section 2 (Info)</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='section2Heading'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Heading'
                                                placeholder='Section Heading...'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='section2Description'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label='Description'
                                                placeholder='Section content...'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Third Section (Details) */}
                                <Grid size={{ xs: 12 }} className='mbe-4 mte-4'>
                                    <Divider textAlign='left'>Section 3 (Details)</Divider>
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='detailsTitle'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Details Title'
                                                placeholder='e.g. Technical Specifications'
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='detailsDescription'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label='Details Description'
                                                placeholder='Extra info...'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Typography variant='subtitle1' className='mbe-4'>Detail Items</Typography>
                                    {fields.map((item, index) => (
                                        <div key={item.id} className='flex gap-4 items-start mbe-6 border rounded p-4 relative'>
                                            <Grid container spacing={4} sx={{ width: '100%' }}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name={`detailsList.${index}.heading`}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                size='small'
                                                                label='Detail Heading'
                                                                placeholder='e.g. Material'
                                                                error={Boolean(errors.detailsList?.[index]?.heading)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name={`detailsList.${index}.description`}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                size='small'
                                                                label='Detail Description'
                                                                placeholder='e.g. High-grade Aluminum Alloy...'
                                                                error={Boolean(errors.detailsList?.[index]?.description)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <IconButton size='small' color='error' onClick={() => remove(index)} className='absolute top-2 right-2'>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                    ))}
                                    <Button variant='outlined' onClick={() => append({ heading: '', description: '' })}>
                                        Add Details Item
                                    </Button>
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
                    <Button variant='contained' size='large' type='submit' disabled={isSaving}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Detail Settings'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartsDetailSettings
