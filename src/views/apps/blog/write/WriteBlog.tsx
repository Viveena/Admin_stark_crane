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

// Third-party Imports
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'

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
    blogTitle: string
    mainImage: string
    relatedBlogs: string[]
    sections: Section[]
}

type Category = {
    id: string
    title: string
}

type BlogPost = {
    id: string
    blogTitle: string /* ... other fields ... */
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
        // Fix for hydration mismatch (if needed, though 'immediatelyRender: false' is clearer)
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

const WriteBlog = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [allBlogs, setAllBlogs] = useState<BlogPost[]>([])
    const router = useRouter()
    const searchParams = useSearchParams()
    const editId = searchParams.get('id')

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            category: '',
            blogTitle: '',
            mainImage: '',
            relatedBlogs: [],
            sections: [{ title: '', content: '', imageUrl: '' }]
        }
    })

    const { fields, append, remove } = useFieldArray({
        control,
        name: 'sections'
    })

    // Fetch categories and post data (if editing)
    useEffect(() => {
        // Load Categories
        const savedCategories = localStorage.getItem('blog-categories')
        if (savedCategories) {
            setCategories(JSON.parse(savedCategories))
        }

        const savedPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]')
        setAllBlogs(savedPosts)

        // Load Post if editing
        if (editId) {
            console.log('Saved Posts:', savedPosts) // Debug log
            const postToEdit = savedPosts.find((post: any) => post.id === editId)
            console.log('Post to Edit:', postToEdit) // Debug log

            if (postToEdit) {
                // Explicitly mapping to ensure only form values are reset and structure is correct
                reset({
                    category: postToEdit.category || '',
                    blogTitle: postToEdit.blogTitle || '',
                    mainImage: postToEdit.mainImage || '',
                    relatedBlogs: postToEdit.relatedBlogs || [],
                    sections: postToEdit.sections || [{ title: '', content: '', imageUrl: '' }]
                })
            }
        }
    }, [editId, reset])

    const onSubmit = (data: FormValues) => {
        const savedPosts = JSON.parse(localStorage.getItem('blog-posts') || '[]')
        const timestamp = new Date().toISOString()

        let newPosts
        if (editId) {
            // Update existing
            newPosts = savedPosts.map((post: any) =>
                post.id === editId ? { ...post, ...data, updatedAt: timestamp } : post
            )
        } else {
            // Create new
            const newPost = {
                id: Date.now().toString(),
                ...data,
                publishedAt: timestamp,
                updatedAt: timestamp
            }
            newPosts = [...savedPosts, newPost]
        }

        localStorage.setItem('blog-posts', JSON.stringify(newPosts))
        alert(editId ? 'Blog Post Updated!' : 'Blog Post Published!')
        if (!editId) {
            reset()
        } else {
            router.push('/apps/blog/list')
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                {/* Main Details */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardHeader title='Write New Blog' />
                        <CardContent>
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
                                        name='blogTitle'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Blog Title'
                                                placeholder='Exciting Blog Post'
                                                error={Boolean(errors.blogTitle)}
                                                helperText={errors.blogTitle && 'Title is required'}
                                            />
                                        )}
                                    />
                                </Grid>
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='relatedBlogs'
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl fullWidth>
                                                <InputLabel id='related-blogs-label'>Related Blogs</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId='related-blogs-label'
                                                    multiple
                                                    input={<OutlinedInput label='Related Blogs' />}
                                                    renderValue={(selected) => (
                                                        <div className='flex flex-wrap gap-2'>
                                                            {(selected as string[]).map((value) => {
                                                                const blog = allBlogs.find((b: any) => b.id === value)
                                                                return <Chip key={value} label={blog?.blogTitle || value} size='small' />
                                                            })}
                                                        </div>
                                                    )}
                                                >
                                                    {allBlogs.map((blog: any) => (
                                                        blog.id !== editId && (
                                                            <MenuItem key={blog.id} value={blog.id}>
                                                                {blog.blogTitle}
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
                                    {/* File Upload UI can be added here if needed */}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Table of Contents & Sections */}
                <Grid size={{ xs: 12 }}>
                    <div className='flex items-center justify-between'>
                        <Typography variant='h5'>Table of Content & Sections</Typography>
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
                                                    label='Section Title (TOC Item)'
                                                    placeholder='Introduction'
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

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10'>
                    <Button variant='contained' size='large' type='submit'>
                        Publish Blog
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default WriteBlog
