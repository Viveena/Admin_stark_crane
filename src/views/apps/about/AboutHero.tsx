'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

type FileProp = {
    name: string
    type: string
    size: number
}

// Styled Dropzone Component
const Dropzone = styled(AppReactDropzone)<BoxProps>(({ theme }) => ({
    '& .dropzone': {
        minHeight: 'unset',
        padding: theme.spacing(12),
        [theme.breakpoints.down('sm')]: {
            paddingInline: theme.spacing(5)
        },
        '&+.MuiList-root .MuiListItem-root .file-name': {
            fontWeight: theme.typography.body1.fontWeight
        }
    }
}))

const AboutHero = () => {
    // Local Form
    const { control, handleSubmit, setValue, reset } = useForm({
        defaultValues: {
            heroTitle: '',
            heroSubtitle: '',
            heroBtnText: '',
            heroImage: null
        }
    })

    const [files, setFiles] = useState<File[]>([])

    // Load data from LocalStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('about_hero_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            // Reset form with saved string data
            // Note: We cannot restore the File object for the image from localStorage
            reset({
                heroTitle: parsed.heroTitle || '',
                heroSubtitle: parsed.heroSubtitle || '',
                heroBtnText: parsed.heroBtnText || '',
                heroImage: null
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
                setValue('heroImage', file)
            }
        }
    })

    const renderFilePreview = (file: FileProp) => {
        if (file.type.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
        } else {
            return <i className='ri-file-text-line' />
        }
    }

    const handleRemoveFile = () => {
        setFiles([])
        setValue('heroImage', null)
    }

    const onSubmit = (data: any) => {
        // Save text data to LocalStorage
        const dataToSave = {
            heroTitle: data.heroTitle,
            heroSubtitle: data.heroSubtitle,
            heroBtnText: data.heroBtnText
        }
        localStorage.setItem('about_hero_data', JSON.stringify(dataToSave))

        console.log('Hero Section Saved:', data)
        alert('Hero Section Save: Data saved to LocalStorage')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Hero Section'
                    action={
                        <Button variant='contained' type='submit'>
                            Save Hero
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    <div className='flex flex-col gap-6'>
                        <Controller
                            name='heroTitle'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Hero Title Text'
                                    placeholder='Enter hero title'
                                />
                            )}
                        />
                        <Controller
                            name='heroSubtitle'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Hero Subtitle'
                                    placeholder='Enter hero subtitle'
                                />
                            )}
                        />
                        <Controller
                            name='heroBtnText'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Hero Button Text'
                                    placeholder='e.g. Learn More'
                                />
                            )}
                        />

                        <div>
                            <Typography variant='caption' className='mb-2 block'>Hero Image</Typography>
                            <Dropzone>
                                <div {...getRootProps({ className: 'dropzone' })}>
                                    <input {...getInputProps()} />
                                    <div className='flex items-center flex-col gap-2 text-center'>
                                        <CustomAvatar variant='rounded' skin='light' color='secondary'>
                                            <i className='ri-upload-2-line' />
                                        </CustomAvatar>
                                        <Typography variant='h6'>Drag and Drop Your Image Here</Typography>
                                        <Typography color='text.disabled'>or</Typography>
                                        <Button variant='outlined' size='small'>
                                            Browse Image
                                        </Button>
                                    </div>
                                </div>
                                {files.length > 0 && (
                                    <List>
                                        <ListItem className='pis-4 plb-3'>
                                            <div className='file-details'>
                                                <div className='file-preview'>{renderFilePreview(files[0])}</div>
                                                <div>
                                                    <Typography className='file-name font-medium' color='text.primary'>
                                                        {files[0].name}
                                                    </Typography>
                                                    <Typography className='file-size' variant='body2'>
                                                        {(files[0].size / 1024).toFixed(2)} kb
                                                    </Typography>
                                                </div>
                                            </div>
                                            <IconButton onClick={handleRemoveFile}>
                                                <i className='ri-close-line text-xl' />
                                            </IconButton>
                                        </ListItem>
                                    </List>
                                )}
                            </Dropzone>
                        </div>
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}

export default AboutHero
