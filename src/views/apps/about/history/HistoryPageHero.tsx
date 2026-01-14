'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { styled } from '@mui/material/styles'
import type { BoxProps } from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { useForm } from 'react-hook-form'

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

const HistoryPageHero = () => {
    // Local Form
    const { handleSubmit, setValue } = useForm()
    const [files, setFiles] = useState<File[]>([])

    // Load data from LocalStorage on mount
    useEffect(() => {
        // Only loading metadata if we were doing real persistence, 
        // for image-only sections without file restoration, we start blank mostly.
        // But for consistency we can reset.
    }, [])

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
        // Save metadata
        localStorage.setItem('history_page_hero_data', JSON.stringify({ saved: true }))
        console.log('History Page Hero Saved:', files)
        alert('History Page Hero Save: Data saved to LocalStorage')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='History Hero Section'
                    action={
                        <Button variant='contained' type='submit'>
                            Save Hero
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    <div>
                        <Typography variant='caption' className='mb-2 block'>Hero Image (Image Only)</Typography>
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
                </CardContent>
            </form>
        </Card>
    )
}

export default HistoryPageHero
