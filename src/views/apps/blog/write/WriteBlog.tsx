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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

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
import { usePageSection } from '@/hooks/usePageSection'

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
    blogTitle: string
    mainImage: string
    category: string
    relatedBlogs: string[]
    sections: Section[]
    publishedAt: string
    updatedAt: string
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
        // Fix for hydration mismatch
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
    // Hooks Integration
    const { data: postsData, loading: postsLoading, error: postsError, saveSection: savePosts, uploadImage } = usePageSection({
        pageKey: 'blogs',
        sectionKey: 'items'
    });

    const { data: categoriesData } = usePageSection({
        pageKey: 'blogs',
        sectionKey: 'categories'
    });

    const [categories, setCategories] = useState<Category[]>([])
    const [allBlogs, setAllBlogs] = useState<BlogPost[]>([])
    const [isSaving, setIsSaving] = useState(false)
    const [selectedMainFile, setSelectedMainFile] = useState<File | null>(null)
    const [selectedSectionFiles, setSelectedSectionFiles] = useState<{ [key: number]: File }>({})

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
        if (categoriesData && categoriesData.categories) {
            setCategories(categoriesData.categories);
        }
    }, [categoriesData])

    useEffect(() => {
        if (postsData && postsData.items) {
            setAllBlogs(postsData.items);

            if (editId) {
                const postToEdit = postsData.items.find((post: any) => post.id === editId)
                if (postToEdit) {
                    reset({
                        category: postToEdit.category || '',
                        blogTitle: postToEdit.blogTitle || '',
                        mainImage: postToEdit.mainImage || '',
                        relatedBlogs: postToEdit.relatedBlogs || [],
                        sections: postToEdit.sections || [{ title: '', content: '', imageUrl: '' }]
                    })
                }
            }
        }
    }, [postsData, editId, reset])

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);
        try {
            // Upload Main Image
            let mainImageUrl = data.mainImage;
            if (selectedMainFile) {
                mainImageUrl = await uploadImage(selectedMainFile);
            }

            // Upload Section Images
            const updatedSections = await Promise.all(data.sections.map(async (section, index) => {
                let sectionImageUrl = section.imageUrl;
                if (selectedSectionFiles[index]) {
                    sectionImageUrl = await uploadImage(selectedSectionFiles[index]);
                }
                return { ...section, imageUrl: sectionImageUrl };
            }));

            const timestamp = new Date().toISOString()
            const savedPosts = postsData?.items || [];

            let newPosts
            if (editId) {
                // Update existing
                newPosts = savedPosts.map((post: any) =>
                    post.id === editId ? {
                        ...post,
                        ...data,
                        mainImage: mainImageUrl,
                        sections: updatedSections,
                        updatedAt: timestamp
                    } : post
                )
            } else {
                // Create new
                const newPost = {
                    id: Date.now().toString(),
                    ...data,
                    mainImage: mainImageUrl,
                    sections: updatedSections,
                    publishedAt: timestamp,
                    updatedAt: timestamp
                }
                newPosts = [...savedPosts, newPost]
            }

            await savePosts({ items: newPosts });
            alert(editId ? 'Blog Post Updated!' : 'Blog Post Published!')

            if (!editId) {
                reset();
                setSelectedMainFile(null);
                setSelectedSectionFiles({});
            } else {
                router.push('/apps/blog/list')
            }

        } catch (error) {
            console.error("Error saving blog post:", error);
            alert("Failed to save blog post.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleSectionFileSelect = (index: number, file: File) => {
        setSelectedSectionFiles(prev => ({ ...prev, [index]: file }));
        setValue(`sections.${index}.imageUrl`, file.name);
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            {postsError && <Alert severity="error" className="mb-4">{postsError}</Alert>}
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
                                                            readOnly: true,
                                                            endAdornment: field.value ? (
                                                                <InputAdornment position='end'>
                                                                    <IconButton size='small' edge='end' onClick={() => {
                                                                        field.onChange('');
                                                                        setSelectedMainFile(null);
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
                                                                field.onChange(files[0].name);
                                                                setSelectedMainFile(files[0]);
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                                {(field.value || selectedMainFile) && (
                                                    <img
                                                        src={selectedMainFile ? URL.createObjectURL(selectedMainFile) : field.value}
                                                        alt="Preview"
                                                        className="h-10 w-10 object-cover rounded"
                                                    />
                                                )}
                                            </div>
                                        )}
                                    />
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
                                                    <div className="flex-auto">
                                                        <TextField
                                                            {...field}
                                                            size='small'
                                                            fullWidth
                                                            label='Section Image URL'
                                                            placeholder='No file chosen'
                                                            variant='outlined'
                                                            slotProps={{
                                                                input: {
                                                                    readOnly: true,
                                                                    endAdornment: field.value ? (
                                                                        <InputAdornment position='end'>
                                                                            <IconButton size='small' edge='end' onClick={() => {
                                                                                field.onChange('');
                                                                                // Clean up file selection for this index if cleared
                                                                                const newFiles = { ...selectedSectionFiles };
                                                                                delete newFiles[index];
                                                                                setSelectedSectionFiles(newFiles);
                                                                            }}>
                                                                                <i className='ri-close-line' />
                                                                            </IconButton>
                                                                        </InputAdornment>
                                                                    ) : null
                                                                }
                                                            }}
                                                        />
                                                    </div>
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
                                                            handleSectionFileSelect(index, files[0]);
                                                        }
                                                    }}
                                                />
                                            </Button>
                                            {/* Preview for section image */}
                                            {(field.imageUrl || selectedSectionFiles[index]) && (
                                                <img
                                                    src={selectedSectionFiles[index] ? URL.createObjectURL(selectedSectionFiles[index]) : field.imageUrl}
                                                    alt="Preview"
                                                    className="h-10 w-10 object-cover rounded"
                                                />
                                            )}
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
                    <Button variant='contained' size='large' type='submit' disabled={isSaving || postsLoading}>
                        {isSaving ? <CircularProgress size={24} color="inherit" /> : (editId ? 'Update Blog' : 'Publish Blog')}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default WriteBlog
