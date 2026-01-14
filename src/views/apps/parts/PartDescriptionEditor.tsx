'use client'

// React Imports
import { useEffect } from 'react'

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
    images: string[]
}

export type PartDescriptionType = {
    id: string
    partName: string
    partBrand: string
    dynamicSections: DynamicSectionItem[]
    techSpecsTitle: string
    techSpecCards: TechSpecCardItem[]
    relatedContent: RelatedContentData
    updatedAt?: string
}

type Props = {
    dataToEdit?: PartDescriptionType
    onSave: (data: PartDescriptionType) => void
    onCancel: () => void
}

const TechSpecCard = ({
    control,
    index,
    remove,
    errors
}: {
    control: any,
    index: number,
    remove: (index: number) => void,
    errors: any
}) => {
    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: `techSpecCards.${index}.images` as const
    })

    return (
        <div className='flex gap-4 items-start mbe-6 border rounded p-6 relative'>
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
                    <Typography variant='body2' className='mbe-2'>Images</Typography>
                    {imageFields.map((img, imgIndex) => (
                        <Controller
                            key={img.id}
                            name={`techSpecCards.${index}.images.${imgIndex}`}
                            control={control}
                            render={({ field }) => (
                                <div className='flex items-center gap-2 mbe-2'>
                                    <TextField
                                        {...field}
                                        fullWidth
                                        size='small'
                                        placeholder='No file chosen'
                                        variant='outlined'
                                        label={`Image ${imgIndex + 1}`}
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
                                    <Button component='label' variant='outlined' htmlFor={`spec-img-${index}-${imgIndex}`} className='min-is-fit'>
                                        Choose
                                        <input
                                            hidden
                                            id={`spec-img-${index}-${imgIndex}`}
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
                                    <IconButton size='small' color='error' onClick={() => removeImage(imgIndex)}>
                                        <i className='ri-delete-bin-line' />
                                    </IconButton>
                                </div>
                            )}
                        />
                    ))}
                    <Button variant='outlined' size='small' onClick={() => appendImage('')}>
                        Add Image
                    </Button>
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
            <IconButton size='small' color='error' onClick={() => remove(index)} className='absolute top-2 right-2'>
                <i className='ri-delete-bin-line' />
            </IconButton>
        </div>
    )
}

const PartDescriptionEditor = ({ dataToEdit, onSave, onCancel }: Props) => {
    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<PartDescriptionType>({
        defaultValues: {
            id: '',
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
        if (dataToEdit) {
            // Ensure images array safety for older data
            const sanitizedData = {
                ...dataToEdit,
                techSpecCards: dataToEdit.techSpecCards.map((card: any) => ({
                    ...card,
                    images: card.images || (card.image ? [card.image] : [])
                }))
            }
            reset(sanitizedData)
        } else {
            reset({
                id: '',
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
            })
        }
    }, [dataToEdit, reset])

    const onSubmit = (data: PartDescriptionType) => {
        onSave(data)
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
                        <CardHeader title={dataToEdit ? 'Edit Part Description' : 'Add New Part Description'} />
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
                                        <TechSpecCard
                                            key={item.id}
                                            control={control}
                                            index={index}
                                            remove={removeTechSpec}
                                            errors={errors}
                                        />
                                    ))}
                                    <Button variant='outlined' onClick={() => appendTechSpec({ title: '', description: '', images: [] })}>
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
                    <Button variant='outlined' color='secondary' onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button variant='contained' size='large' type='submit'>
                        {dataToEdit ? 'Update Part' : 'Save Part'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default PartDescriptionEditor
