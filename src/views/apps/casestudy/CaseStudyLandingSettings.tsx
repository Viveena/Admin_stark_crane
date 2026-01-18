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
import MenuItem from '@mui/material/MenuItem'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import CaseStudyRelated, { RelatedContentData } from './CaseStudyRelated'
import { usePageSection } from '@/hooks/usePageSection'

type LandingFormValues = {
    heading: string
    subheading: string
    ctaButtonText: string
    ctaButtonLink: string
    heroImage: string
    sectionHeading: string
    sectionDescription: string
    relatedContent: RelatedContentData
}

type Props = {
    handleClose?: () => void
}

const INTERNAL_PAGES = [
    { label: 'Home', value: '/dashboards/crm' },
    { label: 'Case Studies', value: '/apps/casestudy/list' },
    { label: 'Academy', value: '/apps/academy/dashboard' },
    { label: 'Jobs', value: '/apps/career/dashboard' },
    { label: 'Events', value: '/apps/events/list' },
    { label: 'News', value: '/apps/news/list' },
    { label: 'Blog', value: '/apps/blog/dashboard' },
    { label: 'Contact Us', value: '/pages/contact' },
    { label: 'About Us', value: '/pages/about' },
    { label: 'FAQ', value: '/pages/faq' },
    { label: 'Pricing', value: '/pages/pricing' }
]

const CaseStudyLandingSettings = ({ handleClose }: Props) => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection, uploadImage } = usePageSection({
        pageKey: 'case-study',
        sectionKey: 'landing'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<LandingFormValues>({
        defaultValues: {
            heading: '',
            subheading: '',
            ctaButtonText: 'Learn More',
            ctaButtonLink: '',
            heroImage: '',
            sectionHeading: '',
            sectionDescription: '',
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
            reset(sectionData);
        }
    }, [sectionData, reset])

    const onSubmit = async (data: LandingFormValues) => {
        setIsSaving(true);
        try {
            let heroImageUrl = data.heroImage;
            if (selectedFile) {
                heroImageUrl = await uploadImage(selectedFile);
            }

            const finalData = { ...data, heroImage: heroImageUrl };
            await saveSection(finalData);
            alert('Landing Page Settings Saved!')
            if (handleClose) handleClose()
        } catch (e) {
            console.error("Failed to save landing settings", e);
            alert("Failed to save settings.")
        } finally {
            setIsSaving(false);
        }
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {error && <Alert severity='error' className='mbe-4'>{error}</Alert>}
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className='shadow-none border-none'>
                        <CardHeader title='Landing Page Configuration' />
                        <CardContent className='p-0'>
                            <Grid container spacing={5}>
                                {/* Heading */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Page Heading'
                                                placeholder='Main Page Title...'
                                                error={Boolean(errors.heading)}
                                                helperText={errors.heading && 'Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Subheading */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='subheading'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Subheading'
                                                placeholder='Subtitle...'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* CTA Button Text */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='ctaButtonText'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='CTA Button Text'
                                                placeholder='Learn More'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* CTA Button Link */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='ctaButtonLink'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                select
                                                fullWidth
                                                label='CTA Button Link'
                                                defaultValue=''
                                            >
                                                <MenuItem value=''>
                                                    <em>None</em>
                                                </MenuItem>
                                                {INTERNAL_PAGES.map((page) => (
                                                    <MenuItem key={page.value} value={page.value}>
                                                        {page.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
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
                                                                    <IconButton size='small' edge='end' onClick={() => {
                                                                        field.onChange('');
                                                                        setSelectedFile(null);
                                                                    }}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='landing-hero-image-upload' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='landing-hero-image-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                field.onChange(files[0].name);
                                                                setSelectedFile(files[0]);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {/* Preview */}
                                                {(field.value || selectedFile) && (
                                                    <img
                                                        src={selectedFile ? URL.createObjectURL(selectedFile) : field.value}
                                                        alt="Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Content Section</Divider>
                                </Grid>

                                {/* Fixed Section Heading */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='sectionHeading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Section Heading'
                                                placeholder='Section Title...'
                                                error={Boolean(errors.sectionHeading)}
                                                helperText={errors.sectionHeading && 'Section Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Fixed Section Description */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='sectionDescription'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={4}
                                                label='Section Description'
                                                placeholder='Content paragraph...'
                                                error={Boolean(errors.sectionDescription)}
                                                helperText={errors.sectionDescription && 'Section Description is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Related Content</Divider>
                                </Grid>

                                {/* Related Content */}
                                <Grid size={{ xs: 12 }}>
                                    <CaseStudyRelated
                                        caseStudyData={relatedContentValue}
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
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Settings'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default CaseStudyLandingSettings
