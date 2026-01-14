'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'

// Component Imports
import TextEditor from '@components/TextEditor'
import CustomAvatar from '@core/components/mui/Avatar'
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

const OurHistorySection = () => {
    // Local Form
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            description: '',
            image: null
        }
    })

    const [files, setFiles] = useState<File[]>([])

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('our_history_section_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            reset({ description: parsed.description || '', image: null })
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
        localStorage.setItem('our_history_section_data', JSON.stringify({ description: data.description }))
        console.log('Our History Section Saved:', data)
        alert('Our History Section Saved')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Our History Section'
                    action={
                        <Button variant='contained' type='submit'>
                            Save
                        </Button>
                    }
                />
                <CardContent>
                    <div className='flex flex-col gap-6'>
                        <Controller
                            name='description'
                            control={control}
                            render={({ field }) => (
                                <TextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    label='Write about the history...'
                                />
                            )}
                        />
                        <div>
                            <Typography variant='caption' className='mb-2 block'>Supporting Image</Typography>
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

export default OurHistorySection
