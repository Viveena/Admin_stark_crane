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

const HomeServiceDrawer = ({ open, handleClose, onSave, initialData }: Props) => {
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            icon: '',
            title: '',
            text: '',
            image: null
        }
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    icon: initialData.icon || '',
                    title: initialData.title || '',
                    text: initialData.text || '',
                    image: null
                })
            } else {
                reset({
                    icon: '',
                    title: '',
                    text: '',
                    image: null
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
                setValue('image', file as any)
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
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>{initialData ? 'Edit Service' : 'Add New Service'}</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <Controller
                        name='icon'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Icon Class'
                                placeholder='e.g. ri-service-line'
                            />
                        )}
                    />
                    <Controller
                        name='title'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Service Title'
                                placeholder='Title'
                            />
                        )}
                    />
                    <Controller
                        name='text'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                multiline
                                rows={3}
                                label='Text'
                                placeholder='Details...'
                            />
                        )}
                    />

                    <div>
                        <Typography variant='caption' className='mb-2 block'>Image</Typography>
                        <Dropzone>
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                {files.length > 0 ? (
                                    <div className="flex flex-col items-center">
                                        <img
                                            src={URL.createObjectURL(files[0])}
                                            alt="Preview"
                                            style={{ maxHeight: 100, maxWidth: '100%', objectFit: 'contain', marginBottom: 8 }}
                                        />
                                        <Typography variant='caption'>{files[0].name}</Typography>
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center gap-2'>
                                        <i className='ri-upload-2-line text-xl' />
                                        <Typography variant='caption'>Upload Image</Typography>
                                    </div>
                                )}
                            </div>
                        </Dropzone>
                    </div>

                    <div className='flex items-center gap-4'>
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

export default HomeServiceDrawer
