'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter, useSearchParams } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Grid from '@mui/material/Grid2'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Local Imports
import CaseStudyRelated, { RelatedContentData } from './CaseStudyRelated'
import TextEditor from '@/components/TextEditor'

type FormValues = {
    heading: string
    slug: string
    heroImage: string
    description: string
    startSectionHeading: string
    startSectionShortDescription: string
    detailsImage: string
    detailsContent: string
    caseStudyDetail: string
    relatedContent: RelatedContentData
}

export type CaseStudyPost = {
    id: string
    updatedAt: string
} & FormValues

type Props = {
    isDrawer?: boolean
    handleClose?: () => void
    dataToEdit?: CaseStudyPost
    onSuccess?: () => void
}

const CaseStudyEditor = ({ isDrawer, handleClose, dataToEdit, onSuccess }: Props) => {
    const router = useRouter()
    const searchParams = useSearchParams()

    const editId = isDrawer ? dataToEdit?.id : searchParams?.get('id')

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        watch,
        formState: { errors }
    } = useForm<FormValues>({
        defaultValues: {
            heading: '',
            slug: '',
            heroImage: '',
            description: '',
            startSectionHeading: '',
            startSectionShortDescription: '',
            detailsImage: '',
            detailsContent: '',
            caseStudyDetail: '',
            relatedContent: {
                sectionTypes: [],
                relatedBlogs: [],
                relatedServices: [],
                relatedParts: [],
                relatedProjects: []
            }
        }
    })

    const relatedContentValue = watch('relatedContent')
    const headingValue = watch('heading')

    // Auto-generate slug from heading if slug is empty
    useEffect(() => {
        if (headingValue && !watch('slug')) {
            const generatedSlug = headingValue
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '')
            setValue('slug', generatedSlug)
        }
    }, [headingValue, setValue, watch])


    useEffect(() => {
        const savedPosts = JSON.parse(localStorage.getItem('casestudy-posts') || '[]')

        if (editId && (dataToEdit || !isDrawer)) {
            const postToEdit = dataToEdit || savedPosts.find((post: any) => post.id === editId)

            if (postToEdit) {
                reset({
                    heading: postToEdit.heading || '',
                    slug: postToEdit.slug || '',
                    heroImage: postToEdit.heroImage || '',
                    description: postToEdit.description || '',
                    startSectionHeading: postToEdit.startSectionHeading || '',
                    startSectionShortDescription: postToEdit.startSectionShortDescription || '',
                    detailsImage: postToEdit.detailsImage || '',
                    detailsContent: postToEdit.detailsContent || '',
                    caseStudyDetail: postToEdit.caseStudyDetail || '',
                    relatedContent: postToEdit.relatedContent || {
                        sectionTypes: [],
                        relatedBlogs: [],
                        relatedServices: [],
                        relatedParts: [],
                        relatedProjects: []
                    }
                })
            }
        }
    }, [editId, reset, dataToEdit, isDrawer])

    const onSubmit = (data: FormValues) => {
        const savedPosts = JSON.parse(localStorage.getItem('casestudy-posts') || '[]')
        const timestamp = new Date().toISOString()

        const finalData = {
            ...data
        }

        let newPostsList
        if (editId) {
            newPostsList = savedPosts.map((post: any) =>
                post.id === editId ? { ...post, ...finalData, updatedAt: timestamp } : post
            )
        } else {
            const newPost = {
                id: Date.now().toString(),
                ...finalData,
                updatedAt: timestamp
            }
            newPostsList = [...savedPosts, newPost]
        }

        localStorage.setItem('casestudy-posts', JSON.stringify(newPostsList))

        if (isDrawer) {
            if (onSuccess) onSuccess()
            if (handleClose) handleClose()
        } else {
            alert(editId ? 'Case Study Updated!' : 'Case Study Created!')
            if (!editId) {
                reset()
            } else {
                router.push('/apps/casestudy/list')
            }
        }
    }

    const handleRelatedContentSave = (data: RelatedContentData) => {
        setValue('relatedContent', data)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={6}>
                <Grid size={{ xs: 12 }}>
                    <Card className={isDrawer ? 'shadow-none border-none' : ''}>
                        {!isDrawer && <CardHeader title='Case Study Editor' />}
                        <CardContent className={isDrawer ? 'p-0' : ''}>
                            <Grid container spacing={5}>
                                {/* Heading */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Heading'
                                                placeholder='Case Study Title...'
                                                error={Boolean(errors.heading)}
                                                helperText={errors.heading && 'Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Slug (Page Slug) */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='slug'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Page Slug'
                                                placeholder='case-study-title'
                                                error={Boolean(errors.slug)}
                                                helperText={errors.slug && 'Slug is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Hero Image */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='heroImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Hero Image'
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: field.value ? (
                                                                <InputAdornment position='end'>
                                                                    <IconButton size='small' edge='end' onClick={() => field.onChange('')}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='hero-image-upload' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='hero-image-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                field.onChange(files[0].name)
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Description */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='description'
                                        control={control}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={3}
                                                label='Main Description'
                                                placeholder='General overview...'
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Start Section</Divider>
                                </Grid>

                                {/* Start Section Heading */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startSectionHeading'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                label='Start Section Heading'
                                                placeholder='Introduction Title...'
                                                error={Boolean(errors.startSectionHeading)}
                                                helperText={errors.startSectionHeading && 'Start Section Heading is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                {/* Start Section Short Description */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='startSectionShortDescription'
                                        control={control}
                                        rules={{ required: true }}
                                        render={({ field }) => (
                                            <TextField
                                                {...field}
                                                fullWidth
                                                multiline
                                                rows={2}
                                                label='Start Section Short Description'
                                                placeholder='Brief intro...'
                                                error={Boolean(errors.startSectionShortDescription)}
                                                helperText={errors.startSectionShortDescription && 'Short Description is required'}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Details Section</Divider>
                                </Grid>

                                {/* Details Image */}
                                <Grid size={{ xs: 12 }}>
                                    <Controller
                                        name='detailsImage'
                                        control={control}
                                        render={({ field }) => (
                                            <div className='flex items-center gap-4'>
                                                <TextField
                                                    {...field}
                                                    size='small'
                                                    fullWidth
                                                    placeholder='No file chosen'
                                                    variant='outlined'
                                                    label='Details Image'
                                                    slotProps={{
                                                        input: {
                                                            endAdornment: field.value ? (
                                                                <InputAdornment position='end'>
                                                                    <IconButton size='small' edge='end' onClick={() => field.onChange('')}>
                                                                        <i className='ri-close-line' />
                                                                    </IconButton>
                                                                </InputAdornment>
                                                            ) : null
                                                        }
                                                    }}
                                                />
                                                <Button component='label' variant='outlined' htmlFor='details-image-upload' className='min-is-fit'>
                                                    Choose Image
                                                    <input
                                                        hidden
                                                        id='details-image-upload'
                                                        type='file'
                                                        accept='image/*'
                                                        onChange={(event) => {
                                                            const { files } = event.target
                                                            if (files && files.length !== 0) {
                                                                field.onChange(files[0].name)
                                                            }
                                                        }}
                                                    />
                                                </Button>
                                            </div>
                                        )}
                                    />
                                </Grid>

                                {/* Details Content - Text Editor */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Details Content</Typography>
                                    <Controller
                                        name='detailsContent'
                                        control={control}
                                        render={({ field }) => (
                                            <TextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </Grid>


                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Full Case Study Detail</Divider>
                                </Grid>

                                {/* Case Study Detail - Text Editor */}
                                <Grid size={{ xs: 12 }}>
                                    <Typography className='mbe-2'>Full Case Study Detail</Typography>
                                    <Controller
                                        name='caseStudyDetail'
                                        control={control}
                                        render={({ field }) => (
                                            <TextEditor
                                                value={field.value}
                                                onChange={field.onChange}
                                            />
                                        )}
                                    />
                                </Grid>

                                <Grid size={{ xs: 12 }}>
                                    <Divider textAlign='left'>Related Content</Divider>
                                </Grid>

                                {/* Related Content */}
                                <Grid size={{ xs: 12 }}>
                                    <CaseStudyRelated
                                        caseStudyData={relatedContentValue}
                                        onSave={handleRelatedContentSave}
                                    />
                                </Grid>

                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12 }} className='flex justify-end pbe-10 gap-4'>
                    {isDrawer && handleClose && (
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    )}
                    <Button variant='contained' size='large' type='submit'>
                        {editId ? 'Update Case Study' : 'Create Case Study'}
                    </Button>
                </Grid>
            </Grid>
        </form>
    )
}

export default CaseStudyEditor
