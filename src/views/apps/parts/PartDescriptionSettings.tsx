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

type DynamicSectionItem = {
    title: string
    description: string
    image: string
}

type TechSpecCardItem = {
    title: string
    description: string
    image: string
}

type DescriptionFormValues = {
    partName: string
    partBrand: string
    dynamicSections: DynamicSectionItem[]
    techSpecsTitle: string
    techSpecCards: TechSpecCardItem[]
    relatedContent: RelatedContentData
}

type Props = {
    handleClose?: () => void
}

const PartDescriptionSettings = ({ handleClose }: Props) => {
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'parts',
        sectionKey: 'description'
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
    // Using string keys like "dynamicSections-0", "techSpecCards-1" to map files
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<DescriptionFormValues>({
        defaultValues: {
            partName: '',
            partBrand: '',
            dynamicSections: [],
            techSpecsTitle: 'Technical Specifications',
            techSpecCards: [],
            relatedContent: {
                sectionTypes: [],
                relatedBlogs: [],
                relatedServices: [],
                relatedParts: [],
                relatedProjects: []
            }
        }
    })

    const { fields: dynamicSectionFields, append: appendDynamicSection, remove: removeDynamicSection } = useFieldArray({
        control,
        name: 'dynamicSections'
    })

    const { fields: techSpecFields, append: appendTechSpec, remove: removeTechSpec } = useFieldArray({
        control,
        name: 'techSpecCards'
    })

    const relatedContentValue = watch('relatedContent')

    useEffect(() => {
        if (sectionData) {
            reset({
                partName: sectionData.partName || '',
                partBrand: sectionData.partBrand || '',
                dynamicSections: sectionData.dynamicSections || [],
                techSpecsTitle: sectionData.techSpecsTitle || 'Technical Specifications',
                techSpecCards: sectionData.techSpecCards || [],
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

    const onSubmit = async (data: DescriptionFormValues) => {
        setSaveStatus('saving');
        try {
            // Process uploads for Dynamic Sections
            const updatedDynamicSections = await Promise.all(data.dynamicSections.map(async (item, index) => {
                let imageUrl = item.image;
                const fileKey = `dynamicSections-${index}`;
                if (selectedFiles[fileKey]) {
                    imageUrl = await uploadImage(selectedFiles[fileKey]);
                }
                return { ...item, image: imageUrl };
            }));

            // Process uploads for Tech Spec Cards
            const updatedTechSpecCards = await Promise.all(data.techSpecCards.map(async (item, index) => {
                let imageUrl = item.image;
                const fileKey = `techSpecCards-${index}`;
                if (selectedFiles[fileKey]) {
                    imageUrl = await uploadImage(selectedFiles[fileKey]);
                }
                return { ...item, image: imageUrl };
            }));

            const dataToSave = {
                ...data,
                dynamicSections: updatedDynamicSections,
                techSpecCards: updatedTechSpecCards
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

    const handleFileSelect = (keyPrefix: string, index: number, file: File, field: any) => {
        const key = `${keyPrefix}-${index}`;
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
        field.onChange(file.name);
    }

    const renderImageInput = (controlName: any, label: string, keyPrefix: string, index: number) => (
        <Controller
            name={controlName}
            control={control}
            render={({ field }) => (
                <div className='flex items-center gap-4'>
                    <TextField
                        {...field}
                        fullWidth
                        placeholder='No file chosen'
                        variant='outlined'
                        label={label}
                        slotProps={{
                            input: {
                                endAdornment: field.value ? (
                                    <InputAdornment position='end'>
                                        <IconButton size='small' edge='end' onClick={() => {
                                            field.onChange('');
                                            const key = `${keyPrefix}-${index}`;
                                            const newFiles = { ...selectedFiles };
                                            delete newFiles[key];
                                            setSelectedFiles(newFiles);
                                        }}>
                                            <i className='ri-close-line' />
                                        </IconButton>
                                    </InputAdornment>
                                ) : null
                            }
                        }}
                    />
                    <Button component='label' variant='outlined' htmlFor={`file-${controlName}`} className='min-is-fit'>
                        Choose
                        <input
                            hidden
                            id={`file-${controlName}`}
                            type='file'
                            accept='image/*'
                            onChange={(event) => {
                                const { files } = event.target
                                if (files && files.length !== 0) {
                                    handleFileSelect(keyPrefix, index, files[0], field);
                                }
                            }}
                        />
                    </Button>
                    {/* Preview */}
                    {(field.value || selectedFiles[`${keyPrefix}-${index}`]) && (
                        <img
                            src={selectedFiles[`${keyPrefix}-${index}`] ? URL.createObjectURL(selectedFiles[`${keyPrefix}-${index}`]) : field.value}
                            alt="Preview"
                            className="h-10 w-10 object-cover rounded"
                        />
                    )}
                </div>
            )}
        />
    )

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
                            title='Part Description Page Configuration'
                            subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                        />
                        <CardContent>
                            <Grid container spacing={6}>

                                {/* General Info */}
                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>General Information</Divider>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='partName'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Part Name'
                                                placeholder='e.g. Industrial Hydraulic Pump'
                                                error={Boolean(errors.partName)}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='partBrand'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Brand'
                                                placeholder='e.g. Stark Industries'
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Dynamic Sections */}
                                <Grid size={{ xs: 12 }} className='mbe-4 mte-4'>
                                    <Divider textAlign='left'>Dynamic Content Sections</Divider>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    {dynamicSectionFields.map((item, index) => (
                                        <div key={item.id} className='flex gap-4 items-start mbe-6 border rounded p-6 relative'>
                                            <Grid container spacing={4} sx={{ width: '100%' }}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name={`dynamicSections.${index}.title`}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label='Section Title'
                                                                placeholder='e.g. Advanced Performance'
                                                                error={Boolean(errors.dynamicSections?.[index]?.title)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    {renderImageInput(`dynamicSections.${index}.image`, 'Section Image', 'dynamicSections', index)}
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name={`dynamicSections.${index}.description`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                multiline
                                                                rows={3}
                                                                label='Description'
                                                                placeholder='Detailed section content...'
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <IconButton size='small' color='error' onClick={() => removeDynamicSection(index)} className='absolute top-2 right-2'>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                    ))}
                                    <Button variant='outlined' onClick={() => appendDynamicSection({ title: '', description: '', image: '' })}>
                                        Add Content Section
                                    </Button>
                                </Grid>

                                {/* Technical Specifications */}
                                <Grid size={{ xs: 12 }} className='mbe-4 mte-4'>
                                    <Divider textAlign='left'>Technical Specifications</Divider>
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='techSpecsTitle'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Section Title'
                                                placeholder='Technical Specifications'
                                                className='mbe-4'
                                            />
                                        )}
                                    />

                                    <Typography variant='subtitle1' className='mbe-4'>Specification Cards</Typography>

                                    {techSpecFields.map((item, index) => (
                                        <div key={item.id} className='flex gap-4 items-start mbe-6 border rounded p-6 relative'>
                                            <Grid container spacing={4} sx={{ width: '100%' }}>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name={`techSpecCards.${index}.title`}
                                                        control={control}
                                                        rules={{ required: true }}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                label='Card Title'
                                                                placeholder='e.g. Dimensions'
                                                                error={Boolean(errors.techSpecCards?.[index]?.title)}
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    {renderImageInput(`techSpecCards.${index}.image`, 'Card Image (Icon)', 'techSpecCards', index)}
                                                </Grid>
                                                <Grid size={{ xs: 12 }}>
                                                    <Controller
                                                        name={`techSpecCards.${index}.description`}
                                                        control={control}
                                                        render={({ field }) => (
                                                            <TextField
                                                                {...field}
                                                                fullWidth
                                                                multiline
                                                                rows={2}
                                                                label='Description'
                                                                placeholder='Short spec description...'
                                                            />
                                                        )}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <IconButton size='small' color='error' onClick={() => removeTechSpec(index)} className='absolute top-2 right-2'>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </div>
                                    ))}
                                    <Button variant='outlined' onClick={() => appendTechSpec({ title: '', description: '', image: '' })}>
                                        Add Spec Card
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

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4 items-center'>
                    {saveStatus === 'success' && <Typography color="success.main">Saved!</Typography>}
                    {saveStatus === 'error' && <Typography color="error.main">Error saving!</Typography>}
                    {handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit' disabled={saveStatus === 'saving'}>
                        {saveStatus === 'saving' ? <CircularProgress size={24} color="inherit" /> : 'Save Description Settings'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartDescriptionSettings
