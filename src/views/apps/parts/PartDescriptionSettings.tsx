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

// Third-party Imports
import { useForm, Controller, useFieldArray } from 'react-hook-form'

// Local Imports
import PartsRelated, { RelatedContentData } from './PartsRelated'

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
        const savedSettings = localStorage.getItem('part-description')
        if (savedSettings) {
            reset(JSON.parse(savedSettings))
        }
    }, [reset])

    const onSubmit = (data: DescriptionFormValues) => {
        localStorage.setItem('part-description', JSON.stringify(data))
        alert('Part Description Page Settings Saved!')
        if (handleClose) handleClose()
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    const renderImageInput = (controlName: any, label: string) => (
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
                                        <IconButton size='small' edge='end' onClick={() => field.onChange('')}>
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
                                    field.onChange(files[0].name)
                                }
                            }}
                        />
                    </Button>
                </div>
            )}
        />
    )

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={8}>
                <Grid size={{ xs: 12 }}>
                    <Card className='shadow-none border-none'>
                        <CardHeader title='Part Description Page Configuration' />
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
                                                    {renderImageInput(`dynamicSections.${index}.image`, 'Section Image')}
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
                                                    {renderImageInput(`techSpecCards.${index}.image`, 'Card Image (Icon)')}
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

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4'>
                    {handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit'>
                        Save Description Settings
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartDescriptionSettings
