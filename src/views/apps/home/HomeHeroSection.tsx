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
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'

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

const HomeHeroSection = () => {
    // Local Form
    const { control, handleSubmit, setValue, reset, watch } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            subtitle: '',
            btnText: '',
            image: null
        }
    })

    const [files, setFiles] = useState<File[]>([])
    const isVisible = watch('isVisible')

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('home_hero_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            reset({
                isVisible: parsed.isVisible !== undefined ? parsed.isVisible : true,
                title: parsed.title || '',
                subtitle: parsed.subtitle || '',
                btnText: parsed.btnText || '',
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

    const renderFilePreview = (file: FileProp) => {
        if (file.type.startsWith('image')) {
            return <img width={38} height={38} alt={file.name} src={URL.createObjectURL(file as any)} />
        } else {
            return <i className='ri-file-text-line' />
        }
    }

    const handleRemoveFile = () => {
        setFiles([])
        setValue('image', null)
    }

    const onSubmit = (data: any) => {
        const dataToSave = {
            isVisible: data.isVisible,
            title: data.title,
            subtitle: data.subtitle,
            btnText: data.btnText
        }
        localStorage.setItem('home_hero_data', JSON.stringify(dataToSave))

        console.log('Home Hero Saved:', data)
        alert('Home Hero Saved')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Hero Section'
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
                <Divider />
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
                                    placeholder='Hero Title'
                                />
                            )}
                        />
                        <Controller
                            name='subtitle'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='Subtitle'
                                    placeholder='Hero Subtitle'
                                />
                            )}
                        />
                        <Controller
                            name='btnText'
                            control={control}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    label='CTA Button Text'
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

export default HomeHeroSection
