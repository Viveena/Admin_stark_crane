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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import IndustryRelated, { RelatedContentData } from './IndustryRelated'
import { usePageSection } from '@/hooks/usePageSection'

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
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'industry',
        sectionKey: 'landing'
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
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
        if (sectionData) {
            reset({
                heroImage: sectionData.heroImage || '',
                title: sectionData.title || '',
                shortLine: sectionData.shortLine || '',
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
            if (handleClose) handleClose();
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

                <Grid size={{ xs: 12 }}>
                    <Card className='shadow-none border-none'>
                        <CardHeader
                            title='Industry Page Configuration'
                            subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                        />
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

export default IndustryLandingSettings
