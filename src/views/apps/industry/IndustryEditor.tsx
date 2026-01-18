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

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Local Imports
import IndustryRelated, { RelatedContentData } from './IndustryRelated'
import TextEditor from '@/components/TextEditor'
import { usePageSection } from '@/hooks/usePageSection'

type DynamicSection = {
    heading: string
    content: string
    image: string
}

type FormValues = {
    title: string
    slug: string
    heroImage: string
    description: string
    dynamicSections: DynamicSection[]
    relatedContent: RelatedContentData
}

export type IndustryType = {
    id: string
    updatedAt: string
} & FormValues

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: IndustryType
    onSave?: (data: IndustryType) => Promise<void> | void
}

const IndustryEditor = ({ isDrawer, handleClose, dataToEdit, onSave }: Props) => {
    // We utilize usePageSection here specifically for the image upload utility
    // We do not READ the list from here, the list is passed to us or managed by parent
    const { uploadImage } = usePageSection({
        pageKey: 'industry',
        sectionKey: 'temp' // Key doesn't matter for upload only
    });

    const [isSaving, setIsSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});

    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            title: '',
            slug: '',
            heroImage: '',
            description: '',
            dynamicSections: [{ heading: '', content: '', image: '' }],
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
        name: 'dynamicSections'
    })

    const relatedContentValue = watch('relatedContent')
    const titleValue = watch('title')

    // Auto-generate slug from title
    useEffect(() => {
        if (titleValue && !watch('slug')) {
            const generatedSlug = titleValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setValue('slug', generatedSlug)
        }
    }, [titleValue, setValue, watch])

    useEffect(() => {
        if (dataToEdit) {
            reset({
                title: dataToEdit.title || '',
                slug: dataToEdit.slug || '',
                heroImage: dataToEdit.heroImage || '',
                description: dataToEdit.description || '',
                dynamicSections: dataToEdit.dynamicSections?.length ? dataToEdit.dynamicSections : [{ heading: '', content: '', image: '' }],
                relatedContent: dataToEdit.relatedContent || {
                    sectionTypes: [],
                    relatedBlogs: [],
                    relatedServices: [],
                    relatedParts: [],
                    relatedProjects: []
                }
            })
        }
    }, [dataToEdit, reset])

    const handleFileSelect = (key: string, file: File, field: any) => {
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
        field.onChange(file.name);
    }

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);
        try {
            // 1. Upload Hero Image
            let heroImageUrl = data.heroImage;
            if (selectedFiles['heroImage']) {
                heroImageUrl = await uploadImage(selectedFiles['heroImage']);
            }

            // 2. Upload Dynamic Section Images
            const updatedDynamicSections = await Promise.all(data.dynamicSections.map(async (section, index) => {
                let sectionImageUrl = section.image;
                const fileKey = `dynamicSection-${index}`;
                if (selectedFiles[fileKey]) {
                    sectionImageUrl = await uploadImage(selectedFiles[fileKey]);
                }
                return { ...section, image: sectionImageUrl };
            }));

            const timestamp = new Date().toISOString()
            const finalData: IndustryType = {
                id: dataToEdit?.id || Date.now().toString(),
                updatedAt: timestamp,
                ...data,
                heroImage: heroImageUrl,
                dynamicSections: updatedDynamicSections
            };

            if (onSave) {
                await onSave(finalData);
            }

            if (handleClose) handleClose()
        } catch (error) {
            console.error("Error saving industry:", error);
            alert("Failed to save industry. Please try again.");
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
                        {!isDrawer && <CardHeader title='Industry Editor' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
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
                                                label='Title'
                                                placeholder='Industry Title...'
                                                error={Boolean(errors.title)}
                                                helperText={errors.title && 'Title is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Slug */}
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
                                                placeholder='industry-title'
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
                                                <Button component='label' variant='outlined' htmlFor='industry-hero-image' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='industry-hero-image'
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
                                                label='Description'
                                                placeholder='Brief description...'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Dynamic Sections */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Dynamic Sections</Divider>
                                </Grid>

                                {fields.map((item, index) => (
                                    <Grid size={{ xs: 12 }} key={item.id} className='border rounded p-4 relative'>
                                        <div className='flex justify-between items-center mbe-4'>
                                            <Typography variant='h6'>Section {index + 1}</Typography>
                                            <IconButton size='small' color='error' onClick={() => {
                                                remove(index);
                                                // Cleanup file selection
                                                const newFiles = { ...selectedFiles };
                                                delete newFiles[`dynamicSection-${index}`];
                                                setSelectedFiles(newFiles);
                                            }}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                        <Grid container spacing={4}>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`dynamicSections.${index}.heading`}
                                                    control={control}
                                                    rules={{ required: true }}
                                                    render={({ field }) => (
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            label='Heading'
                                                            placeholder='Section Heading...'
                                                            error={Boolean(errors.dynamicSections?.[index]?.heading)}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name={`dynamicSections.${index}.image`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className='flex items-center gap-4'>
                                                            <TextField
                                                                {...field}
                                                                size='small'
                                                                fullWidth
                                                                placeholder='No file chosen'
                                                                variant='outlined'
                                                                label='Section Image'
                                                                slotProps={{
                                                                    input: {
                                                                        endAdornment: field.value ? (
                                                                            <InputAdornment position='end'>
                                                                                <IconButton size='small' edge='end' onClick={() => {
                                                                                    field.onChange('');
                                                                                    const newFiles = { ...selectedFiles };
                                                                                    delete newFiles[`dynamicSection-${index}`];
                                                                                    setSelectedFiles(newFiles);
                                                                                }}>
                                                                                    <i className='ri-close-line' />
                                                                                </IconButton>
                                                                            </InputAdornment>
                                                                        ) : null
                                                                    }
                                                                }}
                                                            />
                                                            <Button component='label' variant='outlined' htmlFor={`industry-section-image-${index}`} className='min-is-fit'>
                                                                Choose
                                                                <input
                                                                    hidden
                                                                    id={`industry-section-image-${index}`}
                                                                    type='file'
                                                                    accept='image/*'
                                                                    onChange={(event) => {
                                                                        const { files } = event.target
                                                                        if (files && files.length !== 0) {
                                                                            handleFileSelect(`dynamicSection-${index}`, files[0], field);
                                                                        }
                                                                    }}
                                                                />
                                                            </Button>
                                                            {/* Preview */}
                                                            {(field.value || selectedFiles[`dynamicSection-${index}`]) && (
                                                                <img
                                                                    src={selectedFiles[`dynamicSection-${index}`] ? URL.createObjectURL(selectedFiles[`dynamicSection-${index}`]) : field.value}
                                                                    alt="Preview"
                                                                    className="h-10 w-10 object-cover rounded"
                                                                />
                                                            )}
                                                        </div>
                                                    )}
                                                />
                                            </Grid>
                                            <Grid size={{ xs: 12 }}>
                                                <Typography className='mbe-2'>Content</Typography>
                                                <Controller
                                                    name={`dynamicSections.${index}.content`}
                                                    control={control}
                                                    render={({ field }) => (
                                                        <TextEditor
                                                            value={field.value}
                                                            onChange={field.onChange}
                                                        />
                                                    )}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                ))}

                                <Grid size={{ xs: 12 }}>
                                    <Button variant='outlined' onClick={() => append({ heading: '', content: '', image: '' })}>
                                        Add Section
                                    </Button>
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
                    {isDrawer && handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit' disabled={isSaving}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : (dataToEdit ? 'Update Industry' : 'Save Industry')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default IndustryEditor
