'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'

// Component Imports
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Styled Dropzone
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
    '& .dropzone': {
        minHeight: 'unset',
        padding: theme.spacing(4),
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    }
}))

type Props = {
    open: boolean
    handleClose: () => void
    onSave: (data: any) => void
    initialData?: any
}

const PAGES_OPTIONS = [
    'Home',
    'About Us',
    'Services',
    'Products',
    'Contact',
    'Data Protection',
    'Terms',
    'Careers',
    'Blog',
    'FAQ'
]

const SeoDrawer = ({ open, handleClose, onSave, initialData }: Props) => {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            page: '',
            metaTitle: '',
            metaDescription: '',
            keywords: '',
            canonicalUrl: '',
            robots: 'index, follow',
            author: '',
            ogTitle: '',
            ogType: 'website',
            hreflang: '',
            ogImage: null
        }
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    page: initialData.page || '',
                    metaTitle: initialData.metaTitle || '',
                    metaDescription: initialData.metaDescription || '',
                    keywords: initialData.keywords || '',
                    canonicalUrl: initialData.canonicalUrl || '',
                    robots: initialData.robots || 'index, follow',
                    author: initialData.author || '',
                    ogTitle: initialData.ogTitle || '',
                    ogType: initialData.ogType || 'website',
                    hreflang: initialData.hreflang || '',
                    ogImage: null
                })
            } else {
                reset({
                    page: '',
                    metaTitle: '',
                    metaDescription: '',
                    keywords: '',
                    canonicalUrl: '',
                    robots: 'index, follow',
                    author: '',
                    ogTitle: '',
                    ogType: 'website',
                    hreflang: '',
                    ogImage: null
                })
            }
        }
    }, [open, initialData, reset])

    const [files, setFiles] = useState<File[]>([])

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        onDrop: (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                setFiles([Object.assign(file)])
                setValue('ogImage', file as any)
            }
        }
    })

    const handleReset = () => {
        reset()
        setFiles([])
        handleClose()
    }

    const onSubmit = (data: any) => {
        onSave(data)
        handleReset()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleReset}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>{initialData ? 'Edit SEO' : 'Add Page SEO'}</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 h-full overflow-y-auto'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>

                    {/* Page Selection */}
                    <Typography variant='subtitle1' className='font-bold bg-gray-100 dark:bg-gray-800 p-2 rounded'>Basic Info</Typography>

                    <Controller
                        name='page'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Select Page</InputLabel>
                                <Select
                                    {...field}
                                    label='Select Page'
                                >
                                    {PAGES_OPTIONS.map((page) => (
                                        <MenuItem key={page} value={page}>
                                            {page}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    <Controller
                        name='metaTitle'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Meta Title'
                                placeholder='Page Title | Brand'
                            />
                        )}
                    />

                    <Controller
                        name='metaDescription'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={3}
                                label='Meta Description'
                                placeholder='Brief description of the page content...'
                            />
                        )}
                    />

                    <Controller
                        name='keywords'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Keywords'
                                placeholder='comma, separated, keywords'
                            />
                        )}
                    />

                    {/* Advanced Tags */}
                    <Typography variant='subtitle1' className='font-bold bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2'>Advanced Tags</Typography>

                    <div className='flex gap-4'>
                        <Controller
                            name='canonicalUrl'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Canonical URL'
                                    placeholder='https://example.com/page'
                                />
                            )}
                        />
                        <Controller
                            name='hreflang'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Hreflang'
                                    placeholder='en-us'
                                />
                            )}
                        />
                    </div>

                    <div className='flex gap-4'>
                        <Controller
                            name='robots'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Robots Tag</InputLabel>
                                    <Select {...field} label='Robots Tag'>
                                        <MenuItem value='index, follow'>Index, Follow</MenuItem>
                                        <MenuItem value='noindex, follow'>No Index, Follow</MenuItem>
                                        <MenuItem value='index, nofollow'>Index, No Follow</MenuItem>
                                        <MenuItem value='noindex, nofollow'>No Index, No Follow</MenuItem>
                                    </Select>
                                </FormControl>
                            )}
                        />

                        <Controller
                            name='author'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Author'
                                    placeholder='Author Name'
                                />
                            )}
                        />
                    </div>

                    {/* Open Graph */}
                    <Typography variant='subtitle1' className='font-bold bg-gray-100 dark:bg-gray-800 p-2 rounded mt-2'>Open Graph</Typography>

                    <Controller
                        name='ogTitle'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='OG Title'
                                placeholder='Open Graph Title'
                                helperText='Defaults to Meta Title if empty'
                            />
                        )}
                    />

                    <Controller
                        name='ogType'
                        control={control}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>OG Type</InputLabel>
                                <Select {...field} label='OG Type'>
                                    <MenuItem value='website'>Website</MenuItem>
                                    <MenuItem value='article'>Article</MenuItem>
                                    <MenuItem value='profile'>Profile</MenuItem>
                                    <MenuItem value='video.other'>Video</MenuItem>
                                </Select>
                            </FormControl>
                        )}
                    />

                    <div>
                        <Typography variant='caption' className='mb-2 block'>OG Image (Social Share Image)</Typography>
                        <Dropzone>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                {files.length > 0 ? (
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={URL.createObjectURL(files[0])}
                                            alt="Preview"
                                            style={{ maxHeight: 150, maxWidth: '100%', objectFit: 'contain', marginBottom: 8 }}
                                        />
                                        <Typography variant='caption'>{files[0].name}</Typography>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center gap-2'>
                                        <i className='ri-image-add-line text-2xl' />
                                        <Typography variant='caption'>Upload OG Image</Typography>
                                    </div>
                                )}
                            </div>
                        </Dropzone>
                    </div>

                    <div className='flex items-center gap-4 mt-4'>
                        <Button variant='contained' type='submit'>
                            Save
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleReset}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default SeoDrawer
