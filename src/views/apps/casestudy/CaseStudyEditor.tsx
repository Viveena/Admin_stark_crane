'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import CaseStudyRelated, { RelatedContentData } from './CaseStudyRelated'
import TextEditor from '@/components/TextEditor'
import { usePageSection } from '@/hooks/usePageSection'

type FormValues = {
    heading: string
    slug: string
    heroImage: string
    description: string
    startSectionHeading: string
    startSectionShortDescription: string
    detailsImage: string
    detailsContent: string
    caseStudyDetail: string
    relatedContent: RelatedContentData
}

export type CaseStudyPost = {
    id: string
    updatedAt: string
} & FormValues

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: CaseStudyPost
    onSuccess?: () => void
    onSave?: (data: CaseStudyPost) => Promise<void> | void
}

const CaseStudyEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess, onSave }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Hook for Uploads
    const { uploadImage } = usePageSection({
        pageKey: 'case-study',
        sectionKey: 'temp'
    });

    const [isSaving, setIsSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});

    const editId = isDrawer ? dataToEdit?.id : searchParams?.get('id')

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            heading: '',
            slug: '',
            heroImage: '',
            description: '',
            startSectionHeading: '',
            startSectionShortDescription: '',
            detailsImage: '',
            detailsContent: '',
            caseStudyDetail: '',
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
    const headingValue = watch('heading')

    // Auto-generate slug from heading if slug is empty
    useEffect(() => {
        if (headingValue && !watch('slug')) {
            const generatedSlug = headingValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setValue('slug', generatedSlug)
        }
    }, [headingValue, setValue, watch])


    useEffect(() => {
        if (editId && dataToEdit) {
            reset({
                heading: dataToEdit.heading || '',
                slug: dataToEdit.slug || '',
                heroImage: dataToEdit.heroImage || '',
                description: dataToEdit.description || '',
                startSectionHeading: dataToEdit.startSectionHeading || '',
                startSectionShortDescription: dataToEdit.startSectionShortDescription || '',
                detailsImage: dataToEdit.detailsImage || '',
                detailsContent: dataToEdit.detailsContent || '',
                caseStudyDetail: dataToEdit.caseStudyDetail || '',
                relatedContent: dataToEdit.relatedContent || {
                    sectionTypes: [],
                    relatedBlogs: [],
                    relatedServices: [],
                    relatedParts: [],
                    relatedProjects: []
                }
            })
        }
    }, [editId, reset, dataToEdit])

    const handleFileSelect = (key: string, file: File, field: any) => {
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
        field.onChange(file.name);
    }

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);
        try {
            // Upload Images
            let heroImageUrl = data.heroImage;
            if (selectedFiles['heroImage']) {
                heroImageUrl = await uploadImage(selectedFiles['heroImage']);
            }

            let detailsImageUrl = data.detailsImage;
            if (selectedFiles['detailsImage']) {
                detailsImageUrl = await uploadImage(selectedFiles['detailsImage']);
            }

            const timestamp = new Date().toISOString()
            const finalData: CaseStudyPost = {
                id: dataToEdit?.id || Date.now().toString(),
                updatedAt: timestamp,
                ...data,
                heroImage: heroImageUrl,
                detailsImage: detailsImageUrl
            };

            if (onSave) {
                await onSave(finalData);
            }

            if (isDrawer) {
                if (onSuccess) onSuccess()
                if (handleClose) handleClose()
            } else {
                alert(editId ? 'Case Study Updated!' : 'Case Study Created!')
                if (!editId) {
                    reset()
                    setSelectedFiles({});
                } else {
                    router.push('/apps/casestudy/list')
                }
            }
        } catch (error) {
            console.error("Error saving case study:", error);
            alert("Failed to save case study.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                        {!isDrawer && <CardHeader title='Case Study Editor' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
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
                                                label='Heading'
                                                placeholder='Case Study Title...'
                                                error={Boolean(errors.heading)}
                                                helperText={errors.heading && 'Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Slug (Page Slug) */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='slug'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Page Slug'
                                                placeholder='case-study-title'
                                                error={Boolean(errors.slug)}
                                                helperText={errors.slug && 'Slug is required'}
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
                                                                        const newFiles = { ...selectedFiles };
                                                                        delete newFiles['heroImage'];
                                                                        setSelectedFiles(newFiles);
                                                                    }}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='hero-image-upload' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='hero-image-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                handleFileSelect('heroImage', files[0], field);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {/* Preview */}
                                                {(field.value || selectedFiles['heroImage']) && (
                                                    <img
                                                        src={selectedFiles['heroImage'] ? URL.createObjectURL(selectedFiles['heroImage']) : field.value}
                                                        alt="Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Description */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='description'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label='Main Description'
                                                placeholder='General overview...'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Start Section</Divider>
                                </Grid>

                                {/* Start Section Heading */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startSectionHeading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Start Section Heading'
                                                placeholder='Introduction Title...'
                                                error={Boolean(errors.startSectionHeading)}
                                                helperText={errors.startSectionHeading && 'Start Section Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Start Section Short Description */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startSectionShortDescription'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label='Start Section Short Description'
                                                placeholder='Brief intro...'
                                                error={Boolean(errors.startSectionShortDescription)}
                                                helperText={errors.startSectionShortDescription && 'Short Description is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Details Section</Divider>
                                </Grid>

                                {/* Details Image */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='detailsImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Details Image'
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: field.value ? (
                                                                <InputAdornment position='end'>
                                                                    <IconButton size='small' edge='end' onClick={() => {
                                                                        field.onChange('');
                                                                        const newFiles = { ...selectedFiles };
                                                                        delete newFiles['detailsImage'];
                                                                        setSelectedFiles(newFiles);
                                                                    }}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='details-image-upload' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='details-image-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                handleFileSelect('detailsImage', files[0], field);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {/* Preview */}
                                                {(field.value || selectedFiles['detailsImage']) && (
                                                    <img
                                                        src={selectedFiles['detailsImage'] ? URL.createObjectURL(selectedFiles['detailsImage']) : field.value}
                                                        alt="Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Details Content - Text Editor */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Details Content</Typography>
                                    <Controller
                                        name='detailsContent'
                                        control={control}
                                        render={({ field }) => (
                                            <TextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Full Case Study Detail</Divider>
                                </Grid>

                                {/* Case Study Detail - Text Editor */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Full Case Study Detail</Typography>
                                    <Controller
                                        name='caseStudyDetail'
                                        control={control}
                                        render={({ field }) => (
                                            <TextEditor
                                                value={field.value}
                                                onChange={field.onChange}
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

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4 items-center'>
                    {isDrawer && handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit' disabled={isSaving}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : (editId ? 'Update Case Study' : 'Create Case Study')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default CaseStudyEditor
