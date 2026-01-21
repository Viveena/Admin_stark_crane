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
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller, useWatch } from 'react-hook-form'

// Local Imports
import { usePageSection } from '@/hooks/usePageSection'

type HeroSectionData = {
    heroTitle: string
    heroSubtitle: string
    heroImageUrl: string
    ctaText: string
    ctaLink: string
}

type InfoSectionData = {
    infoHeading: string
    infoParagraph: string
}

type RelatedSectionType = 'blogs' | 'services' | 'parts'

type RelatedContentData = {
    sectionTypes: RelatedSectionType[]
    relatedBlogs: string[]
    relatedServices: string[]
    relatedParts: string[]
}

type FormValues = HeroSectionData & InfoSectionData & RelatedContentData

// Mock Data
const MOCK_BLOGS = [
    { id: '1', title: 'Top 10 Car Maintenance Tips' },
    { id: '2', title: 'Understanding Engine Oil' },
    { id: '3', title: 'Guide to Tire Safety' },
    { id: '4', title: 'Winter Driving Essentials' }
]

const MOCK_SERVICES = [
    { id: 's1', title: 'Oil Change Service' },
    { id: 's2', title: 'Tire Rotation' },
    { id: 's3', title: 'Brake Inspection' },
    { id: 's4', title: 'Engine Tuning' }
]

const MOCK_PARTS = [
    { id: 'p1', title: 'Synthetic Motor Oil 5W-30' },
    { id: 'p2', title: 'Air Filter Type A' },
    { id: 'p3', title: 'Ceramic Brake Pads' },
    { id: 'p4', title: 'All-Season Tires' }
]

const EditBlog = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection, uploadImage } = usePageSection({
        pageKey: 'blogs',
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
    } = useForm<FormValues>({
        defaultValues: {
            heroTitle: 'Welcome to Our Blog',
            heroSubtitle: 'Discover the latest news, updates, and stories from our team.',
            heroImageUrl: 'hero-image.jpg',
            ctaText: 'Read Latest Posts',
            ctaLink: '/apps/blog/write',
            infoHeading: 'What We Write About',
            infoParagraph: 'We share insights on technology, lifestyle, and industry trends. Stay tuned for expert articles and in-depth guides.',
            sectionTypes: [],
            relatedBlogs: [],
            relatedServices: [],
            relatedParts: []
        }
    })

    // Watch section types to handle conditioning and side-effects
    const selectedSectionTypes = useWatch({ control, name: 'sectionTypes' }) || []

    // Load saved data from DB on mount/update
    useEffect(() => {
        if (sectionData) {
            reset({
                heroTitle: sectionData.heroTitle || '',
                heroSubtitle: sectionData.heroSubtitle || '',
                heroImageUrl: sectionData.heroImageUrl || '',
                ctaText: sectionData.ctaText || '',
                ctaLink: sectionData.ctaLink || '',
                infoHeading: sectionData.infoHeading || '',
                infoParagraph: sectionData.infoParagraph || '',
                sectionTypes: sectionData.sectionTypes || [],
                relatedBlogs: sectionData.relatedBlogs || [],
                relatedServices: sectionData.relatedServices || [],
                relatedParts: sectionData.relatedParts || []
            })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);
        try {
            let imageUrl = data.heroImageUrl;
            if (selectedFile) {
                imageUrl = await uploadImage(selectedFile);
            }

            const dataToSave = {
                ...data,
                heroImageUrl: imageUrl
            };

            await saveSection(dataToSave);
            alert('Blog Page Updated and Saved!')
        } catch (err) {
            console.error("Failed to save blog settings", err);
            alert("Failed to save settings.")
        } finally {
            setIsSaving(false);
        }
    }

    const availableOptions = [
        { value: 'blogs', label: 'Related Blogs' },
        { value: 'services', label: 'Related Services' },
        { value: 'parts', label: 'Related Parts' }
    ]

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                {error && <Alert severity="error" className="mb-4">{error}</Alert>}
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={6}>
                        {/* Hero Section */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardHeader title='Hero Section Editing' />
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
                                                        label='Title'
                                                        placeholder='Blog Title'
                                                        error={Boolean(errors.heroTitle)}
                                                        helperText={errors.heroTitle && 'Title is required'}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='heroSubtitle'
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label='Subtitle'
                                                        placeholder='Blog Subtitle'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='heroImageUrl'
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
                                                                    readOnly: true,
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
                                                                        field.onChange(files[0].name)
                                                                        setSelectedFile(files[0])
                                                                    }
                                                                }}
                                                            />
                                                        </Button>
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
                                        <Grid size={{ xs: 12, sm: 6 }}>
                                            <Controller
                                                name='ctaText'
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label='CTA Button Text'
                                                        placeholder='Read More'
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
                                                        label='CTA Button Link'
                                                        placeholder='/apps/blog/write'
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Info Section */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardHeader title='Info Section Editing' />
                                <CardContent>
                                    <Grid container spacing={5}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='infoHeading'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        label='Heading'
                                                        placeholder='Section Heading'
                                                        error={Boolean(errors.infoHeading)}
                                                        helperText={errors.infoHeading && 'Heading is required'}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='infoParagraph'
                                                control={control}
                                                rules={{ required: true }}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        multiline
                                                        rows={4}
                                                        label='Paragraph'
                                                        placeholder='Section Content...'
                                                        error={Boolean(errors.infoParagraph)}
                                                        helperText={errors.infoParagraph && 'Content is required'}
                                                    />
                                                )}
                                            />
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Related Content Configuration */}
                        <Grid size={{ xs: 12 }}>
                            <Card>
                                <CardHeader title='Related Content Configuration' subheader='Choose up to 2 sections to display' />
                                <CardContent>
                                    <Grid container spacing={5}>
                                        <Grid size={{ xs: 12 }}>
                                            <Controller
                                                name='sectionTypes'
                                                control={control}
                                                render={({ field }) => (
                                                    <FormControl fullWidth error={selectedSectionTypes.length > 2}>
                                                        <InputLabel id='section-types-label'>Select Related Sections (Max 2)</InputLabel>
                                                        <Select
                                                            {...field}
                                                            labelId='section-types-label'
                                                            multiple
                                                            input={<OutlinedInput label='Select Related Sections (Max 2)' />}
                                                            renderValue={(selected) => (
                                                                <div className='flex flex-wrap gap-2'>
                                                                    {(selected as string[]).map((value) => (
                                                                        <Chip
                                                                            key={value}
                                                                            label={availableOptions.find(opt => opt.value === value)?.label || value}
                                                                            size='small'
                                                                            onDelete={() => {
                                                                                const newValue = (selected as string[]).filter((item) => item !== value)
                                                                                field.onChange(newValue)
                                                                            }}
                                                                            onMouseDown={(event) => event.stopPropagation()}
                                                                        />
                                                                    ))}
                                                                </div>
                                                            )}
                                                            onChange={(e) => {
                                                                const value = e.target.value as string[]
                                                                if (value.length <= 2) {
                                                                    field.onChange(value)
                                                                }
                                                            }}
                                                        >
                                                            {availableOptions.map((option) => (
                                                                <MenuItem
                                                                    key={option.value}
                                                                    value={option.value}
                                                                    disabled={selectedSectionTypes.length >= 2 && !selectedSectionTypes.includes(option.value as RelatedSectionType)}
                                                                >
                                                                    {option.label}
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                        {selectedSectionTypes.length >= 2 && (
                                                            <FormHelperText>Maximum 2 sections selected</FormHelperText>
                                                        )}
                                                    </FormControl>
                                                )}
                                            />
                                        </Grid>

                                        {selectedSectionTypes.includes('blogs') && (
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name='relatedBlogs'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id='related-blogs-select-label'>Select Related Blogs</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId='related-blogs-select-label'
                                                                multiple
                                                                input={<OutlinedInput label='Select Related Blogs' />}
                                                                renderValue={(selected) => (
                                                                    <div className='flex flex-wrap gap-2'>
                                                                        {(selected as string[]).map((value) => (
                                                                            <Chip
                                                                                key={value}
                                                                                label={MOCK_BLOGS.find(b => b.id === value)?.title || value}
                                                                                size='small'
                                                                                onDelete={() => {
                                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                                    field.onChange(newValue)
                                                                                }}
                                                                                onMouseDown={(event) => event.stopPropagation()}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            >
                                                                {MOCK_BLOGS.map((item) => (
                                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                        )}

                                        {selectedSectionTypes.includes('services') && (
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name='relatedServices'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id='related-services-select-label'>Select Related Services</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId='related-services-select-label'
                                                                multiple
                                                                input={<OutlinedInput label='Select Related Services' />}
                                                                renderValue={(selected) => (
                                                                    <div className='flex flex-wrap gap-2'>
                                                                        {(selected as string[]).map((value) => (
                                                                            <Chip
                                                                                key={value}
                                                                                label={MOCK_SERVICES.find(s => s.id === value)?.title || value}
                                                                                size='small'
                                                                                onDelete={() => {
                                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                                    field.onChange(newValue)
                                                                                }}
                                                                                onMouseDown={(event) => event.stopPropagation()}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            >
                                                                {MOCK_SERVICES.map((item) => (
                                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                        )}

                                        {selectedSectionTypes.includes('parts') && (
                                            <Grid size={{ xs: 12 }}>
                                                <Controller
                                                    name='relatedParts'
                                                    control={control}
                                                    render={({ field }) => (
                                                        <FormControl fullWidth>
                                                            <InputLabel id='related-parts-select-label'>Select Related Parts</InputLabel>
                                                            <Select
                                                                {...field}
                                                                labelId='related-parts-select-label'
                                                                multiple
                                                                input={<OutlinedInput label='Select Related Parts' />}
                                                                renderValue={(selected) => (
                                                                    <div className='flex flex-wrap gap-2'>
                                                                        {(selected as string[]).map((value) => (
                                                                            <Chip
                                                                                key={value}
                                                                                label={MOCK_PARTS.find(p => p.id === value)?.title || value}
                                                                                size='small'
                                                                                onDelete={() => {
                                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                                    field.onChange(newValue)
                                                                                }}
                                                                                onMouseDown={(event) => event.stopPropagation()}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            >
                                                                {MOCK_PARTS.map((item) => (
                                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    )}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12 }} className='flex justify-end'>
                            <Button variant='contained' type='submit' disabled={isSaving}>
                                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save Changes'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Grid>
        </Grid>
    )
}

export default EditBlog
