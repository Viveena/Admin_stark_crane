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
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'

// Third-party Imports
import { useDropzone } from 'react-dropzone'
import { Controller, useForm } from 'react-hook-form'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Hook Import
import { usePageSection } from '@/hooks/usePageSection'

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
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection, uploadImage, canEdit } = usePageSection({
        pageKey: 'home',
        sectionKey: 'hero'
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Local Form
    const { control, handleSubmit, setValue, reset, watch } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            subtitle: '',
            btnText: '',
            image: null as string | null
        }
    })

    const [files, setFiles] = useState<File[]>([])
    const isVisible = watch('isVisible')

    // Load data from hook
    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                title: sectionData.title || '',
                subtitle: sectionData.subtitle || '',
                btnText: sectionData.btnText || '',
                image: sectionData.image || null
            });
        }
    }, [sectionData, reset]);

    const { getRootProps, getInputProps } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
        },
        onDrop: (acceptedFiles: File[]) => {
            const file = acceptedFiles[0]
            if (file) {
                setFiles([Object.assign(file)])
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

    const onSubmit = async (data: any) => {
        setSaveStatus('saving');
        try {
            let imageUrl = data.image;

            // Upload image if selected
            if (files.length > 0) {
                imageUrl = await uploadImage(files[0]);
            }

            const dataToSave = {
                isVisible: data.isVisible,
                title: data.title,
                subtitle: data.subtitle,
                btnText: data.btnText,
                image: imageUrl
            }

            await saveSection(dataToSave);
            setSaveStatus('success');

            // Clear success message after 3 seconds
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error(error);
            setSaveStatus('error');
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Hero Section'
                    subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                    action={
                        <div className="flex items-center gap-4">
                            {saveStatus === 'success' && <Typography color="success.main" variant="body2">Saved!</Typography>}
                            {saveStatus === 'error' && <Typography color="error.main" variant="body2">Error!</Typography>}

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
                            <Button variant='contained' type='submit' disabled={saveStatus === 'saving' || !canEdit}>
                                {saveStatus === 'saving' ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                            </Button>
                        </div>
                    }
                />
                <Divider />
                <CardContent>
                    {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}

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

                            {/* Display existing image if available and no new file selected */}
                            {!files.length && watch('image') && (
                                <div className="mb-4">
                                    <img src={watch('image') as string} alt="Current Hero" style={{ maxHeight: 200, borderRadius: 8 }} />
                                </div>
                            )}

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
