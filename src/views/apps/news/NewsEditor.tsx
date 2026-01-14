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
import OutlinedInput from '@mui/material/OutlinedInput'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormLabel from '@mui/material/FormLabel'

// Third-party Imports
import { useForm, useFieldArray, Controller } from 'react-hook-form'
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

type Section = {
    title: string
    content: string
    imageUrl: string
}

type FormValues = {
    category: string
    newsHeadline: string
    mainImage: string
    relatedNews: string[]
    sections: Section[]
    status: 'published' | 'scheduled' | 'draft'
    publishedDate: Date | null
}

type Category = {
    id: string
    title: string
}

type NewsPost = {
    id: string
    newsHeadline: string
    status: string
    publishedDate: string | null
    /* ... other fields ... */
}

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: NewsPost
    onSuccess?: () => void
}

const TiptapEditor = ({ value, onChange }: { value: string; onChange: (content: string) => void }) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: 'Write section content here...'
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

const NewsEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess }: Props) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [allNews, setAllNews] = useState<NewsPost[]>([])
    const router = useRouter()
    const searchParams = useSearchParams()

    // Use dataToEdit id if in drawer, else URL param
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
            category: '',
            newsHeadline: '',
            mainImage: '',
            relatedNews: [],
            sections: [{ title: '', content: '', imageUrl: '' }],
            status: 'draft',
            publishedDate: new Date()
        }
    })

    const statusValue = watch('status')

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'sections'
    })

    useEffect(() => {
        // Load Categories
        const savedCategories = localStorage.getItem('news-categories')
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        } else {
            // Default categories if none exist
            const defaultCategories = [{ id: '1', title: 'Startups' }, { id: '2', title: 'Technology' }, { id: '3', title: 'Business' }]
            setCategories(defaultCategories)
            localStorage.setItem('news-categories', JSON.stringify(defaultCategories))
        }

        const savedNews = JSON.parse(localStorage.getItem('news-posts') || '[]')
        setAllNews(savedNews)

        if (editId && (dataToEdit || !isDrawer)) {
            const postToEdit = dataToEdit || savedNews.find((post: any) => post.id === editId)

            if (postToEdit) {
                reset({
                    category: postToEdit.category || '',
                    newsHeadline: postToEdit.newsHeadline || '',
                    mainImage: postToEdit.mainImage || '',
                    relatedNews: postToEdit.relatedNews || [],
                    sections: postToEdit.sections || [{ title: '', content: '', imageUrl: '' }],
                    status: postToEdit.status || 'draft',
                    publishedDate: postToEdit.publishedDate ? new Date(postToEdit.publishedDate) : new Date()
                })
            }
        }
    }, [editId, reset, dataToEdit, isDrawer])

    const onSubmit = (data: FormValues) => {
        const savedNews = JSON.parse(localStorage.getItem('news-posts') || '[]')
        const timestamp = new Date().toISOString()

        let finalStatus = data.status
        // Logic: if user clicks "Publish now" -> date is now. If "Schedule" -> check date.
        // But here we rely on form values.

        const finalData = {
            ...data,
            publishedDate: data.publishedDate ? data.publishedDate.toISOString() : null
        }

        let newNewsList
        if (editId) {
            newNewsList = savedNews.map((post: any) =>
                post.id === editId ? { ...post, ...finalData, updatedAt: timestamp } : post
            )
        } else {
            const newPost = {
                id: Date.now().toString(),
                ...finalData,
                publishedAt: timestamp,
                updatedAt: timestamp
            }
            newNewsList = [...savedNews, newPost]
        }

        localStorage.setItem('news-posts', JSON.stringify(newNewsList))

        if (isDrawer) {
            if (onSuccess) onSuccess()
            if (handleClose) handleClose()
        } else {
            alert(editId ? 'News Updated!' : 'News Published!')
            if (!editId) {
                reset()
            } else {
                router.push('/apps/news/list')
            }
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                        {!isDrawer && <CardHeader title='News Editing and Uploading' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
                            <Grid container spacing={5}>
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
                                <Grid size={{ xs: 12, sm: 6 }}>
                                    <Controller
                                        name='newsHeadline'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='News Headline'
                                                placeholder='Breaking News...'
                                                error={Boolean(errors.newsHeadline)}
                                                helperText={errors.newsHeadline && 'Headline is required'}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='relatedNews'
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel id='related-news-label'>Related News</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId='related-news-label'
                                                    multiple
                                                    input={<OutlinedInput label='Related News' />}
                                                    renderValue={(selected) => (
                                                        <div className='flex flex-wrap gap-2'>
                                                            {(selected as string[]).map((value) => {
                                                                const news = allNews.find((b: any) => b.id === value)
                                                                return <Chip key={value} label={news?.newsHeadline || value} size='small' />
                                                            })}
                                                        </div>
                                                    )}
                                                >
                                                    {allNews.map((news: any) => (
                                                        news.id !== editId && (
                                                            <MenuItem key={news.id} value={news.id}>
                                                                {news.newsHeadline}
                                                            </MenuItem>
                                                        )
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </Grid>
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
                                                                    <IconButton size='small' edge='end' onClick={() => field.onChange('')}>
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
                                                                field.onChange(files[0].name)
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </Grid>

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
                                            name="publishedDate"
                                            control={control}
                                            render={({ field }) => (
                                                <div className='flex flex-col gap-2'>
                                                    <InputLabel>Scheduled Date</InputLabel>
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

                <Grid size={{ xs: 12 }}>
                    <div className='flex items-center justify-between'>
                        <Typography variant='h5'>News Content</Typography>
                        <Button variant='contained' onClick={() => append({ title: '', content: '', imageUrl: '' })}>
                            Add Section
                        </Button>
                    </div>
                </Grid>

                {fields.map((field, index) => (
                    <Grid size={{ xs: 12 }} key={field.id}>
                        <Card>
                            <CardHeader
                                title={`Section ${index + 1}`}
                                action={
                                    <IconButton onClick={() => remove(index)} color='error'>
                                        <i className='ri-delete-bin-line' />
                                    </IconButton>
                                }
                            />
                            <CardContent>
                                <Grid container spacing={5}>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name={`sections.${index}.title`}
                                            control={control}
                                            rules={{ required: true }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    label='Section Title'
                                                    placeholder='Subheading'
                                                    error={Boolean(errors.sections?.[index]?.title)}
                                                    helperText={errors.sections?.[index]?.title && 'Title is required'}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <div className='flex items-center gap-4'>
                                            <Controller
                                                name={`sections.${index}.imageUrl`}
                                                control={control}
                                                render={({ field }) => (
                                                    <TextField
                                                        {...field}
                                                        size='small'
                                                        fullWidth
                                                        label='Section Image URL'
                                                        placeholder='No file chosen'
                                                        variant='outlined'
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
                                                )}
                                            />
                                            <Button component='label' variant='outlined' htmlFor={`section-image-upload-${index}`} className='min-is-fit'>
                                                Choose Image
                                                <input
                                                    hidden
                                                    id={`section-image-upload-${index}`}
                                                    type='file'
                                                    accept='image/*'
                                                    onChange={(event) => {
                                                        const { files } = event.target
                                                        if (files && files.length !== 0) {
                                                            setValue(`sections.${index}.imageUrl`, files[0].name)
                                                        }
                                                    }}
                                                />
                                            </Button>
                                        </div>
                                    </Grid>
                                    <Grid size={{ xs: 12 }}>
                                        <Typography className='mbe-2'>Description</Typography>
                                        <Controller
                                            name={`sections.${index}.content`}
                                            control={control}
                                            render={({ field }) => (
                                                <TiptapEditor value={field.value} onChange={field.onChange} />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4'>
                    {isDrawer && handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit'>
                        {editId ? 'Update News' : 'Publish News'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default NewsEditor
