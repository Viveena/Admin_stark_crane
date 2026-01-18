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
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Chip from '@mui/material/Chip'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import DatePicker from 'react-datepicker'

// Style Imports
import 'react-datepicker/dist/react-datepicker.css'

// Local Imports
import EditorToolbar from './EditorToolbar'
import '@/libs/styles/tiptapEditor.css'
import { usePageSection } from '@/hooks/usePageSection'

type FormValues = {
    category: string
    heading: string
    shortDescription: string
    longDetail: string
    location: string
    eventDate: Date | null
    mainImage: string
    gallery: string[]
    status: 'published' | 'scheduled' | 'draft'
    scheduledDate: Date | null
}

type Category = {
    id: string
    title: string
}

export type EventPost = {
    id: string
    heading: string
    status: string
    eventDate: string | null
    category: string
    shortDescription: string
    longDetail: string
    location: string
    mainImage: string
    gallery: string[]
    scheduledDate: string | null
    updatedAt: string
    publishedAt?: string
}

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: EventPost
    onSuccess?: () => void
    onSave?: (data: EventPost) => Promise<void> | void
}

const TiptapEditor = ({ value, onChange, placeholder }: { value: string; onChange: (content: string) => void; placeholder?: string }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: placeholder || 'Write content here...'
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Underline
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        },
        immediatelyRender: false
    })

    // Update content if value changes externally (e.g. initial load)
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value);
        }
    }, [value, editor]);


    return (
        <Card className='p-0 border shadow-none'>
            <CardContent className='p-0'>
                <EditorToolbar editor={editor} />
                <Divider className='mli-5' />
                <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex ' />
            </CardContent>
        </Card>
    )
}

const EventsEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess, onSave }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    // Hook for Categories (Read Only here)
    const { data: categoriesData } = usePageSection({
        pageKey: 'events',
        sectionKey: 'categories'
    });

    // Hook for Uploads
    const { uploadImage } = usePageSection({
        pageKey: 'events',
        sectionKey: 'temp'
    });

    const [categories, setCategories] = useState<Category[]>([])
    const [isSaving, setIsSaving] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<{ [key: string]: File }>({});
    const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

    useEffect(() => {
        if (categoriesData) {
            if (Array.isArray(categoriesData)) {
                setCategories(categoriesData);
            } else if (categoriesData.categories && Array.isArray(categoriesData.categories)) {
                setCategories(categoriesData.categories);
            } else {
                setCategories([]);
            }
        }
    }, [categoriesData])

    // Use dataToEdit id if in drawer, else URL param
    const editId = isDrawer ? dataToEdit?.id : searchParams?.get('id')

    const {
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            category: '',
            heading: '',
            shortDescription: '',
            longDetail: '',
            location: '',
            eventDate: new Date(),
            mainImage: '',
            gallery: [],
            status: 'draft',
            scheduledDate: new Date()
        }
    })

    const statusValue = watch('status')

    useEffect(() => {
        if (editId && dataToEdit) {
            reset({
                category: dataToEdit.category || '',
                heading: dataToEdit.heading || '',
                shortDescription: dataToEdit.shortDescription || '',
                longDetail: dataToEdit.longDetail || '',
                location: dataToEdit.location || '',
                eventDate: dataToEdit.eventDate ? new Date(dataToEdit.eventDate) : new Date(),
                mainImage: dataToEdit.mainImage || '',
                gallery: dataToEdit.gallery || [],
                status: (dataToEdit.status as any) || 'draft',
                scheduledDate: dataToEdit.scheduledDate ? new Date(dataToEdit.scheduledDate) : new Date()
            })
        }
    }, [editId, reset, dataToEdit])

    const handleFileSelect = (key: string, file: File, field: any) => {
        setSelectedFiles(prev => ({ ...prev, [key]: file }));
        field.onChange(file.name);
    }

    const handleGallerySelect = (files: FileList | null, field: any) => {
        if (files) {
            const newFiles = Array.from(files);
            setGalleryFiles(prev => [...prev, ...newFiles]);
            field.onChange([...field.value, ...newFiles.map(f => f.name)]);
        }
    }

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);
        try {
            // Upload Main Image
            let mainImageUrl = data.mainImage;
            if (selectedFiles['mainImage']) {
                mainImageUrl = await uploadImage(selectedFiles['mainImage']);
            }

            // Upload Gallery Images
            let galleryUrls = [...data.gallery];
            // Identify which strings in data.gallery are actually file names waiting to be uploaded
            // For simplicity, we can just upload all invalid URLs again? No, that's inefficient.
            // Better: Iterate through galleryFiles and upload them, then replace their names in galleryUrls with the returned URL.
            // Assumption: The order of addition corresponds? Hard to guarantee.
            // Simplest robust strategy:
            // 1. Upload all new files.
            // 2. We need to know which file corresponds to which name in data.gallery.
            //    Since we just appended names, we know new files match the names they provided.

            // Let's iterate over galleryFiles, upload them, and replace the *exact name match* in galleryUrls.
            // Note: If multiple files have same name, this could be ambiguous. Assumes unique names or handles first match.

            for (const file of galleryFiles) {
                const uploadedUrl = await uploadImage(file);
                // Replace the filename with the URL in the gallery array
                // We find the index of the filename.
                const index = galleryUrls.indexOf(file.name);
                if (index !== -1) {
                    galleryUrls[index] = uploadedUrl;
                }
            }

            const timestamp = new Date().toISOString()
            const finalData: EventPost = {
                id: dataToEdit?.id || Date.now().toString(),
                updatedAt: timestamp,
                ...data,
                eventDate: data.eventDate ? data.eventDate.toISOString() : null,
                scheduledDate: data.scheduledDate ? data.scheduledDate.toISOString() : null,
                mainImage: mainImageUrl,
                gallery: galleryUrls,
                publishedAt: (!editId && data.status === 'published') ? timestamp : (dataToEdit?.publishedAt || undefined)
            };

            if (onSave) {
                await onSave(finalData);
            }

            if (isDrawer) {
                if (onSuccess) onSuccess()
                if (handleClose) handleClose()
            } else {
                alert(editId ? 'Event Updated!' : 'Event Published!')
                if (!editId) {
                    reset()
                    setSelectedFiles({});
                    setGalleryFiles([]);
                } else {
                    router.push('/apps/events/list')
                }
            }

        } catch (error) {
            console.error("Error saving event:", error);
            alert("Failed to save event.");
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                        {!isDrawer && <CardHeader title='Event Creating and Editing' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
                            <Grid container spacing={5}>
                                {/* Category */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='category'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <FormControl fullWidth error={Boolean(errors.category)}>
                                                <InputLabel id='category-select'>Category</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId='category-select'
                                                    label='Category'
                                                >
                                                    <MenuItem value='' disabled>Select a Category</MenuItem>
                                                    {categories.map((cat) => (
                                                        <MenuItem key={cat.id} value={cat.title}>
                                                            {cat.title}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                                {errors.category && <Typography color='error' variant='caption'>Category is required</Typography>}
                                            </FormControl>
                                        )}
                                    />
                                </Grid>

                                {/* Heading */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='heading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Event Heading'
                                                placeholder='Event Name...'
                                                error={Boolean(errors.heading)}
                                                helperText={errors.heading && 'Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Location */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='location'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Event Location'
                                                placeholder='New York, USA'
                                                error={Boolean(errors.location)}
                                                helperText={errors.location && 'Location is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Event Date */}
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name="eventDate"
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-2'>
                                                <DatePicker
                                                    selected={field.value}
                                                    onChange={(date) => field.onChange(date)}
                                                    showTimeSelect
                                                    dateFormat="Pp"
                                                    className='w-full border rounded p-2'
                                                    customInput={<TextField fullWidth label="Event Date" />}
                                                />
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Main Image */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='mainImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Main Image'
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: field.value ? (
                                                                <InputAdornment position='end'>
                                                                    <IconButton size='small' edge='end' onClick={() => {
                                                                        field.onChange('');
                                                                        const newFiles = { ...selectedFiles };
                                                                        delete newFiles['mainImage'];
                                                                        setSelectedFiles(newFiles);
                                                                    }}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='main-image-upload' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='main-image-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                handleFileSelect('mainImage', files[0], field);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {/* Preview */}
                                                {(field.value || selectedFiles['mainImage']) && (
                                                    <img
                                                        src={selectedFiles['mainImage'] ? URL.createObjectURL(selectedFiles['mainImage']) : field.value}
                                                        alt="Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Gallery (Multiple Images) */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Event Gallery</Typography>
                                    <Controller
                                        name='gallery'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex flex-col gap-4'>
                                                <Button component='label' variant='outlined' htmlFor='gallery-upload' className='w-fit'>
                                                    Upload Gallery Images
                                                    <input
                                                        hidden
                                                        id='gallery-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        multiple
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            handleGallerySelect(files, field);
                                                        }}
                                                    />
                                                </Button>
                                                <div className='flex flex-wrap gap-2'>
                                                    {field.value && field.value.map((img, index) => (
                                                        <Chip
                                                            key={index}
                                                            label={img.length > 20 ? img.substring(0, 20) + '...' : img}
                                                            onDelete={() => {
                                                                const newGallery = field.value.filter((_, i) => i !== index)
                                                                field.onChange(newGallery)
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Short Description */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='shortDescription'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label='Short Description'
                                                placeholder='Brief summary of the event...'
                                                error={Boolean(errors.shortDescription)}
                                                helperText={errors.shortDescription && 'Short Description is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Long Detail */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Long Detail</Typography>
                                    <Controller
                                        name='longDetail'
                                        control={control}
                                        render={({ field }) => (
                                            <TiptapEditor value={field.value} onChange={field.onChange} placeholder="Full event details..." />
                                        )}
                                    />
                                </Grid>

                                {/* Publishing Status */}
                                <Grid size={{ xs: 12, sm: 12 }}>
                                    <FormControl>
                                        <FormLabel id="status-group-label" className='mbe-2'>Publishing Status</FormLabel>
                                        <Controller
                                            name="status"
                                            control={control}
                                            render={({ field }) => (
                                                <RadioGroup
                                                    row
                                                    aria-labelledby="status-group-label"
                                                    {...field}
                                                >
                                                    <FormControlLabel value="draft" control={<Radio />} label="Draft" />
                                                    <FormControlLabel value="published" control={<Radio />} label="Publish Now" />
                                                    <FormControlLabel value="scheduled" control={<Radio />} label="Schedule" />
                                                </RadioGroup>
                                            )}
                                        />
                                    </FormControl>
                                </Grid>

                                {statusValue === 'scheduled' && (
                                    <Grid size={{ xs: 12, sm: 6 }}>
                                        <Controller
                                            name="scheduledDate"
                                            control={control}
                                            render={({ field }) => (
                                                <div className='flex flex-col gap-2'>
                                                    <InputLabel>Scheduled Date & Time</InputLabel>
                                                    <DatePicker
                                                        selected={field.value}
                                                        onChange={(date) => field.onChange(date)}
                                                        showTimeSelect
                                                        dateFormat="Pp"
                                                        className='w-full border rounded p-2'
                                                        customInput={<TextField fullWidth size='small' />}
                                                    />
                                                </div>
                                            )}
                                        />
                                    </Grid>
                                )}
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
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : (editId ? 'Update Event' : 'Publish Event')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default EventsEditor
