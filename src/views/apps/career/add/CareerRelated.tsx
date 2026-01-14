'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'
import Button from '@mui/material/Button'

// Third-party Imports
import { useForm, Controller, useWatch } from 'react-hook-form'

type RelatedSectionType = 'blogs' | 'services' | 'parts' | 'projects'

type RelatedContentData = {
    sectionTypes: RelatedSectionType[]
    relatedBlogs: string[]
    relatedServices: string[]
    relatedParts: string[]
    relatedProjects: string[]
}

// Mock Data
const MOCK_BLOGS = [
    { id: '1', title: 'Top 10 Career Tips' },
    { id: '2', title: 'Resume Building Guide' },
    { id: '3', title: 'Interview Preparation' },
    { id: '4', title: 'Workplace Etiquette' }
]

const MOCK_SERVICES = [
    { id: 's1', title: 'Resume Review' },
    { id: 's2', title: 'Career Counseling' },
    { id: 's3', title: 'Mock Interview' },
    { id: 's4', title: 'LinkedIn Profile Optimization' }
]

const MOCK_PARTS = [
    { id: 'p1', title: 'Office Equipment' },
    { id: 'p2', title: 'Software Licenses' },
    { id: 'p3', title: 'Training Materials' },
    { id: 'p4', title: 'IT Support' }
]

const MOCK_PROJECTS = [
    { id: 'pr1', title: 'Internal Tool Development' },
    { id: 'pr2', title: 'Client Website Redesign' },
    { id: 'pr3', title: 'Mobile App Launch' },
    { id: 'pr4', title: 'Data Analytics Dashboard' }
]

const CareerRelated = ({ careerData, id }: { careerData?: any; id?: string }) => {
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm<RelatedContentData>({
        defaultValues: {
            sectionTypes: [],
            relatedBlogs: [],
            relatedServices: [],
            relatedParts: [],
            relatedProjects: []
        }
    })

    // Watch section types to handle conditioning and side-effects
    const selectedSectionTypes = useWatch({ control, name: 'sectionTypes' }) || []

    // Load saved data or props on mount
    useEffect(() => {
        const storageKey = `career-related-${id || 'new'}`
        const savedData = localStorage.getItem(storageKey)

        if (savedData) {
            reset(JSON.parse(savedData))
        } else if (careerData) {
            reset({
                sectionTypes: careerData.sectionTypes || [],
                relatedBlogs: careerData.relatedBlogs || [],
                relatedServices: careerData.relatedServices || [],
                relatedParts: careerData.relatedParts || [],
                relatedProjects: careerData.relatedProjects || []
            })
        }
    }, [careerData, reset, id])

    const onSubmit = (data: RelatedContentData) => {
        const storageKey = `career-related-${id || 'new'}`
        localStorage.setItem(storageKey, JSON.stringify(data))
        console.log('Submitted Career Related Content:', data)
        alert('Career Related Content Saved!')
    }

    const availableOptions = [
        { value: 'blogs', label: 'Related Blogs' },
        { value: 'services', label: 'Related Services' },
        { value: 'parts', label: 'Related Parts' },
        { value: 'projects', label: 'Related Projects' }
    ]

    return (
        <Card>
            <CardHeader title='Related Content Configuration' subheader='Choose up to 2 sections to display' />
            <CardContent>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={5}>
                        <Grid size={{ xs: 12 }}>
                            <Controller
                                name='sectionTypes'
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth error={selectedSectionTypes.length > 2}>
                                        <InputLabel id='career-section-types-label'>Select Related Sections (Max 2)</InputLabel>
                                        <Select
                                            {...field}
                                            labelId='career-section-types-label'
                                            multiple
                                            input={<OutlinedInput label='Select Related Sections (Max 2)' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip
                                                            key={value}
                                                            label={availableOptions.find(opt => opt.value === value)?.label || value}
                                                            size='small'
                                                            onDelete={() => {
                                                                const newValue = (selected as string[]).filter((item) => item !== value)
                                                                field.onChange(newValue)
                                                            }}
                                                            onMouseDown={(event) => {
                                                                event.stopPropagation()
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            onChange={(e) => {
                                                const value = e.target.value as string[]
                                                if (value.length <= 2) {
                                                    field.onChange(value)
                                                }
                                            }}
                                        >
                                            {availableOptions.map((option) => (
                                                <MenuItem
                                                    key={option.value}
                                                    value={option.value}
                                                    disabled={selectedSectionTypes.length >= 2 && !selectedSectionTypes.includes(option.value as RelatedSectionType)}
                                                >
                                                    {option.label}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        {selectedSectionTypes.length >= 2 && (
                                            <FormHelperText>Maximum 2 sections selected</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Grid>

                        {selectedSectionTypes.includes('blogs') && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name='relatedBlogs'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id='career-related-blogs-label'>Select Related Blogs</InputLabel>
                                            <Select
                                                {...field}
                                                labelId='career-related-blogs-label'
                                                multiple
                                                input={<OutlinedInput label='Select Related Blogs' />}
                                                renderValue={(selected) => (
                                                    <div className='flex flex-wrap gap-2'>
                                                        {(selected as string[]).map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={MOCK_BLOGS.find(b => b.id === value)?.title || value}
                                                                size='small'
                                                                onDelete={() => {
                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                    field.onChange(newValue)
                                                                }}
                                                                onMouseDown={(event) => event.stopPropagation()}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {MOCK_BLOGS.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        )}

                        {selectedSectionTypes.includes('services') && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name='relatedServices'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id='career-related-services-label'>Select Related Services</InputLabel>
                                            <Select
                                                {...field}
                                                labelId='career-related-services-label'
                                                multiple
                                                input={<OutlinedInput label='Select Related Services' />}
                                                renderValue={(selected) => (
                                                    <div className='flex flex-wrap gap-2'>
                                                        {(selected as string[]).map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={MOCK_SERVICES.find(s => s.id === value)?.title || value}
                                                                size='small'
                                                                onDelete={() => {
                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                    field.onChange(newValue)
                                                                }}
                                                                onMouseDown={(event) => event.stopPropagation()}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {MOCK_SERVICES.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        )}

                        {selectedSectionTypes.includes('parts') && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name='relatedParts'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id='career-related-parts-label'>Select Related Parts</InputLabel>
                                            <Select
                                                {...field}
                                                labelId='career-related-parts-label'
                                                multiple
                                                input={<OutlinedInput label='Select Related Parts' />}
                                                renderValue={(selected) => (
                                                    <div className='flex flex-wrap gap-2'>
                                                        {(selected as string[]).map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={MOCK_PARTS.find(p => p.id === value)?.title || value}
                                                                size='small'
                                                                onDelete={() => {
                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                    field.onChange(newValue)
                                                                }}
                                                                onMouseDown={(event) => event.stopPropagation()}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {MOCK_PARTS.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        )}

                        {selectedSectionTypes.includes('projects') && (
                            <Grid size={{ xs: 12 }}>
                                <Controller
                                    name='relatedProjects'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth>
                                            <InputLabel id='career-related-projects-label'>Select Related Projects</InputLabel>
                                            <Select
                                                {...field}
                                                labelId='career-related-projects-label'
                                                multiple
                                                input={<OutlinedInput label='Select Related Projects' />}
                                                renderValue={(selected) => (
                                                    <div className='flex flex-wrap gap-2'>
                                                        {(selected as string[]).map((value) => (
                                                            <Chip
                                                                key={value}
                                                                label={MOCK_PROJECTS.find(p => p.id === value)?.title || value}
                                                                size='small'
                                                                onDelete={() => {
                                                                    const newValue = (selected as string[]).filter((item) => item !== value)
                                                                    field.onChange(newValue)
                                                                }}
                                                                onMouseDown={(event) => event.stopPropagation()}
                                                            />
                                                        ))}
                                                    </div>
                                                )}
                                            >
                                                {MOCK_PROJECTS.map((item) => (
                                                    <MenuItem key={item.id} value={item.id}>{item.title}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Grid>
                        )}
                        <Grid size={{ xs: 12 }} className='flex justify-end'>
                            <Button variant='contained' type='submit'>
                                Save Related Content
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </CardContent>
        </Card>
    )
}

export default CareerRelated
