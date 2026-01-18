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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'
import { useDropzone } from 'react-dropzone'

// Component Imports
import TextEditor from '@components/TextEditor'
import AppReactDropzone from '@/libs/styles/AppReactDropzone'

// Hook Import
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

const HomeAboutSection = () => {
    // Hook for API interaction
    const { data: sectionData, loading: dataLoading, error, meta, saveSection, uploadImage } = usePageSection({
        pageKey: 'home',
        sectionKey: 'about'
    })

    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    // Local Form
    const { control, handleSubmit, reset, setValue, watch } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            text: '',
            image: null,
            imageUrl: '' // Store generic URL here
        }
    })

    const [files, setFiles] = useState<File[]>([])

    // Watch image for preview if needed, though we track files state separately for upload
    const currentImageUrl = watch('imageUrl');

    // Load data when fetched
    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                title: sectionData.title || '',
                text: sectionData.text || '',
                imageUrl: sectionData.imageUrl || '',
                image: null
            })
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
        setIsSaving(true);
        setSaveMessage(null);
        try {
            let finalImageUrl = data.imageUrl;

            // Upload image if a new file is selected
            if (data.image && data.image instanceof File) {
                // Upload logic
                const uploadedUrl = await uploadImage(data.image);
                finalImageUrl = uploadedUrl;
            }

            // Save section data
            await saveSection({
                isVisible: data.isVisible,
                title: data.title,
                text: data.text,
                imageUrl: finalImageUrl
            });

            // Update form with new URL if changed
            if (finalImageUrl !== data.imageUrl) {
                setValue('imageUrl', finalImageUrl);
                setFiles([]); // Clear file selection on success
                setValue('image', null);
            }

            setSaveMessage({ type: 'success', text: 'Section saved successfully!' });
        } catch (err) {
            console.error(err);
            setSaveMessage({ type: 'error', text: 'Failed to save section.' });
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='About Us Section'
                    subheader={meta?.updated_at ? `Last updated by ${meta.updated_by_name || 'User'} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
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
                            <Button
                                variant='contained'
                                type='submit'
                                disabled={isSaving || dataLoading}
                                startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                            >
                                {isSaving ? 'Saving...' : 'Save'}
                            </Button>
                        </div>
                    }
                />
                <CardContent>
                    {saveMessage && (
                        <Alert severity={saveMessage.type} className='mb-4' onClose={() => setSaveMessage(null)}>
                            {saveMessage.text}
                        </Alert>
                    )}

                    {dataLoading && !sectionData ? (
                        <div className="flex justify-center p-4"><CircularProgress /></div>
                    ) : (
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
                                                {currentImageUrl && (
                                                    <img src={currentImageUrl} alt="Current Section" className="h-20 object-contain mb-2" />
                                                )}
                                                <i className='ri-upload-2-line text-xl' />
                                                <Typography variant='caption'>Upload New Image</Typography>
                                            </div>
                                        )}
                                    </div>
                                </Dropzone>
                            </div>
                        </div>
                    )}
                </CardContent>
            </form>
        </Card>
    )
}

export default HomeAboutSection
