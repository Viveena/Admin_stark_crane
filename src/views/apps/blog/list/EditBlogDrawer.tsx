// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import InputAdornment from '@mui/material/InputAdornment'
import Divider from '@mui/material/Divider'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
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
import EditorToolbar from '../write/EditorToolbar'
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
}

type Props = {
    open: boolean
    handleClose: () => void
    blogData: any
    onUpdate: () => void
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

const EditBlogDrawer = ({ open, handleClose, blogData, onUpdate }: Props) => {
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
    const [selectedSectionFiles, setSelectedSectionFiles] = useState<{ [key: number]: File }>({})

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

    useEffect(() => {
        if (categoriesData && categoriesData.categories) {
            setCategories(categoriesData.categories);
        }
    }, [categoriesData])

    useEffect(() => {
        if (postsData && postsData.items) {
            setAllBlogs(postsData.items);
        }
    }, [postsData])

    useEffect(() => {
        if (open && blogData) {
            reset({
                category: blogData.category || '',
                blogTitle: blogData.blogTitle || '',
                mainImage: blogData.mainImage || '',
                relatedBlogs: blogData.relatedBlogs || [],
                sections: blogData.sections || [{ title: '', content: '', imageUrl: '' }]
            })
            setSelectedSectionFiles({});
        }
    }, [open, blogData, reset])

    const onSubmit = async (data: FormValues) => {
        setIsSaving(true);
        try {
            // Upload Section Images if any new ones selected
            const updatedSections = await Promise.all(data.sections.map(async (section, index) => {
                let sectionImageUrl = section.imageUrl;
                if (selectedSectionFiles[index]) {
                    sectionImageUrl = await uploadImage(selectedSectionFiles[index]);
                }
                return { ...section, imageUrl: sectionImageUrl };
            }));

            const savedPosts = postsData?.items || [];
            const timestamp = new Date().toISOString()

            const newPosts = savedPosts.map((post: any) =>
                post.id === blogData.id ? {
                    ...post,
                    ...data,
                    sections: updatedSections,
                    updatedAt: timestamp
                } : post
            )

            await savePosts({ items: newPosts });
            handleClose()
            onUpdate()
        } catch (error) {
            console.error("Failed to update blog", error);
            alert("Failed to update blog post");
        } finally {
            setIsSaving(false);
        }
    }

    const handleSectionFileSelect = (index: number, file: File) => {
        setSelectedSectionFiles(prev => ({ ...prev, [index]: file }));
        setValue(`sections.${index}.imageUrl`, file.name);
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>Edit Blog</Typography>
                <IconButton size='small' onClick={handleClose}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 overflow-y-auto flex-1'>
                {postsError && <Alert severity="error">{postsError}</Alert>}
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <Controller
                        name='category'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControl fullWidth error={Boolean(errors.category)}>
                                <InputLabel id='edit-category-select'>Category</InputLabel>
                                <Select
                                    {...field}
                                    labelId='edit-category-select'
                                    label='Category'
                                >
                                    {categories.map((cat) => (
                                        <MenuItem key={cat.id} value={cat.title}>
                                            {cat.title}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />
                    <Controller
                        name='blogTitle'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Blog Title'
                                error={Boolean(errors.blogTitle)}
                                helperText={errors.blogTitle && 'Title is required'}
                            />
                        )}
                    />

                    <Controller
                        name='relatedBlogs'
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel id='edit-related-blogs-label'>Related Blogs</InputLabel>
                                <Select
                                    {...field}
                                    labelId='edit-related-blogs-label'
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
                                        (blogData && blog.id !== blogData.id) && (
                                            <MenuItem key={blog.id} value={blog.id}>
                                                {blog.blogTitle}
                                            </MenuItem>
                                        )
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    {/* Sections */}
                    <div className='flex items-center justify-between'>
                        <Typography variant='h6'>Sections</Typography>
                        <Button size='small' variant='outlined' onClick={() => append({ title: '', content: '', imageUrl: '' })}>
                            Add Section
                        </Button>
                    </div>

                    {fields.map((field, index) => (
                        <Card key={field.id} className='border'>
                            <CardContent className='flex flex-col gap-4'>
                                <div className='flex justify-between items-center'>
                                    <Typography variant='subtitle1'>Section {index + 1}</Typography>
                                    <IconButton onClick={() => remove(index)} color='error' size='small'>
                                        <i className='ri-delete-bin-line' />
                                    </IconButton>
                                </div>
                                <Controller
                                    name={`sections.${index}.title`}
                                    control={control}
                                    rules={{ required: true }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            size='small'
                                            label='Section Title'
                                        />
                                    )}
                                />
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
                                                slotProps={{
                                                    input: {
                                                        readOnly: true,
                                                    }
                                                }}
                                            />
                                        )}
                                    />
                                    <Button component='label' variant='outlined' htmlFor={`edit-section-image-upload-${index}`} className='min-is-fit'>
                                        Change
                                        <input
                                            hidden
                                            id={`edit-section-image-upload-${index}`}
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
                                    {(selectedSectionFiles[index]) && (
                                        <img
                                            src={URL.createObjectURL(selectedSectionFiles[index])}
                                            alt="Preview"
                                            className="h-10 w-10 object-cover rounded"
                                        />
                                    )}
                                </div>
                                <Controller
                                    name={`sections.${index}.content`}
                                    control={control}
                                    render={({ field }) => (
                                        <TiptapEditor value={field.value} onChange={field.onChange} />
                                    )}
                                />
                            </CardContent>
                        </Card>
                    ))}

                    <div className='flex items-center gap-4'>
                        <Button variant='contained' type='submit' fullWidth disabled={isSaving}>
                            {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Update'}
                        </Button>
                        <Button variant='outlined' color='secondary' fullWidth onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default EditBlogDrawer
