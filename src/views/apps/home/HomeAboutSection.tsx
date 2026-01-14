'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import IconButton from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'

// Component Imports
import TextEditor from '@components/TextEditor'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Styled Dropzone
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
    '& .dropzone': {
        minHeight: 'unset',
        padding: theme.spacing(6),
        border: `1px dashed ${theme.palette.divider}`,
        borderRadius: theme.shape.borderRadius,
        textAlign: 'center'
    }
}))

const HomeAboutSection = () => {
    // Local Form
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            text: '',
            image: null
        }
    })

    const [files, setFiles] = useState<File[]>([])

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('home_about_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            reset({
                isVisible: parsed.isVisible !== undefined ? parsed.isVisible : true,
                title: parsed.title || '',
                text: parsed.text || '',
                image: null
            })
        }
    }, [reset])

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

    const onSubmit = (data: any) => {
        localStorage.setItem('home_about_data', JSON.stringify({
            isVisible: data.isVisible,
            title: data.title,
            text: data.text
        }))
        console.log('Home About Saved:', data)
        alert('Home About Saved')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='About Us Section'
                    action={
                        <div className="flex items-center gap-4">
                            <Controller
                                name='isVisible'
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch checked={field.value} onChange={field.onChange} />}
                                        label={field.value ? "Visible" : "Hidden"}
                                    />
                                )}
                            />
                            <Button variant='contained' type='submit'>
                                Save
                            </Button>
                        </div>
                    }
                />
                <CardContent>
                    <div className='flex flex-col gap-6'>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Title'
                                    placeholder='About Title'
                                />
                            )}
                        />
                        <Controller
                            name='text'
                            control={control}
                            render={({ field }) => (
                                <TextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    label='About Us Text...'
                                />
                            )}
                        />
                        <div>
                            <Typography variant='caption' className='mb-2 block'>Section Image</Typography>
                            <Dropzone>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    {files.length > 0 ? (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                <img width={38} height={38} alt={files[0].name} src={URL.createObjectURL(files[0])} className='mr-2' />
                                                <Typography variant='body2'>{files[0].name}</Typography>
                                            </div>
                                            <IconButton onClick={() => { setFiles([]); setValue('image', null) }}>
                                                <i className='ri-close-line' />
                                            </IconButton>
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
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}

export default HomeAboutSection
