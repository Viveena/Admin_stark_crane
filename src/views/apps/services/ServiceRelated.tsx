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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

type RelatedSectionType = 'blogs' | 'services' | 'parts' | 'projects'

export type RelatedContentData = {
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

const ServiceRelated = ({ serviceData, onSave }: { serviceData?: any; onSave?: (data: RelatedContentData) => void }) => {
    const {
        control,
        handleSubmit,
        reset,
        watch
    } = useForm<RelatedContentData>({
        defaultValues: {
            sectionTypes: [],
            relatedBlogs: [],
            relatedServices: [],
            relatedParts: [],
            relatedProjects: []
        }
    })

    const selectedSectionTypes = watch('sectionTypes') || []

    useEffect(() => {
        if (serviceData) {
            reset({
                sectionTypes: serviceData.sectionTypes || [],
                relatedBlogs: serviceData.relatedBlogs || [],
                relatedServices: serviceData.relatedServices || [],
                relatedParts: serviceData.relatedParts || [],
                relatedProjects: serviceData.relatedProjects || []
            })
        }
    }, [serviceData, reset])

    const onSubmit = (data: RelatedContentData) => {
        if (onSave) {
            onSave(data)
        }
    }

    const availableOptions = [
        { value: 'blogs', label: 'Related Blogs' },
        { value: 'services', label: 'Related Services' },
        { value: 'parts', label: 'Related Parts' },
        { value: 'projects', label: 'Related Projects' }
    ]

    return (
        <Card>
            <CardHeader title='Related Content' subheader='Choose up to 2 sections' />
            <CardContent>
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name='sectionTypes'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth error={selectedSectionTypes.length > 2}>
                                    <InputLabel id='service-section-types-label'>Select Related Sections (Max 2)</InputLabel>
                                    <Select
                                        {...field}
                                        labelId='service-section-types-label'
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
                                                handleSubmit(onSubmit)()
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
                                        <InputLabel>Select Related Blogs</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            input={<OutlinedInput label='Select Related Blogs' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_BLOGS.find(b => b.id === value)?.title || value} size='small' onDelete={() => field.onChange(selected.filter(i => i !== value))} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                handleSubmit(onSubmit)()
                                            }}
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
                                        <InputLabel>Select Related Services</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            input={<OutlinedInput label='Select Related Services' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_SERVICES.find(s => s.id === value)?.title || value} size='small' onDelete={() => field.onChange(selected.filter(i => i !== value))} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                handleSubmit(onSubmit)()
                                            }}
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
                                        <InputLabel>Select Related Parts</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            input={<OutlinedInput label='Select Related Parts' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_PARTS.find(p => p.id === value)?.title || value} size='small' onDelete={() => field.onChange(selected.filter(i => i !== value))} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                handleSubmit(onSubmit)()
                                            }}
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
                                        <InputLabel>Select Related Projects</InputLabel>
                                        <Select
                                            {...field}
                                            multiple
                                            input={<OutlinedInput label='Select Related Projects' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_PROJECTS.find(p => p.id === value)?.title || value} size='small' onDelete={() => field.onChange(selected.filter(i => i !== value))} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                            onChange={(e) => {
                                                field.onChange(e.target.value)
                                                handleSubmit(onSubmit)()
                                            }}
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
                </Grid>
            </CardContent>
        </Card>
    )
}

export default ServiceRelated
