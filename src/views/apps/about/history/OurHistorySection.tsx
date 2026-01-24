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
import { usePageSection } from '@/hooks/usePageSection'

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
    // Hook
    const { data: sectionData, loading, error, saveSection, uploadImage } = usePageSection({
        pageKey: 'about',
        sectionKey: 'our_history'
    });

    // Local Form
    const { control, handleSubmit, reset, setValue } = useForm({
        defaultValues: {
            description: '',
            image: null
        }
    })

    const [files, setFiles] = useState<File[]>([])
    const [savedImageUrl, setSavedImageUrl] = useState<string | null>(null)

    // Load data
    useEffect(() => {
        if (sectionData) {
            reset({
                description: sectionData.description || '',
                image: sectionData.image || null
            })
            if (sectionData.image) {
                setSavedImageUrl(sectionData.image)
            }
        }
    }, [sectionData, reset])

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

    const onSubmit = async (data: any) => {
        try {
            let imageUrl = savedImageUrl;
            if (files.length > 0) {
                imageUrl = await uploadImage(files[0])
            }

            const dataToSave = {
                description: data.description,
                image: imageUrl
            }

            await saveSection(dataToSave)
            alert('Our History Section Saved to Database')
        } catch (err) {
            console.error(err)
            alert('Error saving Our History')
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Our History Section'
                    action={
                        <Button variant='contained' type='submit' disabled={loading}>
                            {loading ? 'Saving...' : 'Save'}
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
                                    {files.length > 0 || savedImageUrl ? (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center'>
                                                {files.length > 0 ? (
                                                    <img width={38} height={38} alt={files[0].name} src={URL.createObjectURL(files[0])} className='mr-2' />
                                                ) : (
                                                    <img width={38} height={38} alt="Saved" src={savedImageUrl!} className='mr-2' />
                                                )}
                                                <Typography variant='body2'>{files.length > 0 ? files[0].name : 'Saved Image'}</Typography>
                                            </div>
                                            <IconButton onClick={() => { setFiles([]); setSavedImageUrl(null); setValue('image', null) }}>
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
