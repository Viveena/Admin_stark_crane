'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Grid from '@mui/material/Grid2'
import Button from '@mui/material/Button'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Chip from '@mui/material/Chip'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputLabel from '@mui/material/InputLabel'
import FormControl from '@mui/material/FormControl'
import FormHelperText from '@mui/material/FormHelperText'

// Third-party Imports
import { useFormContext, Controller, useWatch } from 'react-hook-form'

type RelatedSectionType = 'blogs' | 'services' | 'parts' | 'projects'

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

const CareerRelated = () => {
    const { control } = useFormContext()

    // Watch section types to handle conditioning and side-effects
    const selectedSectionTypes = useWatch({ control, name: 'related_content.sectionTypes' }) || []

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
                <Grid container spacing={5}>
                    <Grid size={{ xs: 12 }}>
                        <Controller
                            name='related_content.sectionTypes'
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
                                        onChange={(event) => {
                                            const {
                                                target: { value }
                                            } = event
                                            const newValue = typeof value === 'string' ? value.split(',') : value
                                            if (newValue.length <= 2) {
                                                field.onChange(newValue)
                                            }
                                        }}
                                    >
                                        {availableOptions.map((option) => (
                                            <MenuItem key={option.value} value={option.value} disabled={selectedSectionTypes.length >= 2 && !selectedSectionTypes.includes(option.value)}>
                                                {option.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                    {selectedSectionTypes.length > 2 && <FormHelperText>You can only select up to 2 sections.</FormHelperText>}
                                </FormControl>
                            )}
                        />
                    </Grid>

                    {selectedSectionTypes.includes('blogs') && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name='related_content.relatedBlogs'
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id='related-blogs-label'>Related Blogs</InputLabel>
                                        <Select
                                            {...field}
                                            labelId='related-blogs-label'
                                            multiple
                                            input={<OutlinedInput label='Related Blogs' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_BLOGS.find(b => b.id === value)?.title} size='small' onDelete={() => {
                                                            const newValue = (selected as string[]).filter((item) => item !== value)
                                                            field.onChange(newValue)
                                                        }} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            {MOCK_BLOGS.map((blog) => (
                                                <MenuItem key={blog.id} value={blog.id}>
                                                    {blog.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    )}

                    {selectedSectionTypes.includes('services') && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name='related_content.relatedServices'
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id='related-services-label'>Related Services</InputLabel>
                                        <Select
                                            {...field}
                                            labelId='related-services-label'
                                            multiple
                                            input={<OutlinedInput label='Related Services' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_SERVICES.find(s => s.id === value)?.title} size='small' onDelete={() => {
                                                            const newValue = (selected as string[]).filter((item) => item !== value)
                                                            field.onChange(newValue)
                                                        }} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            {MOCK_SERVICES.map((service) => (
                                                <MenuItem key={service.id} value={service.id}>
                                                    {service.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    )}

                    {selectedSectionTypes.includes('parts') && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name='related_content.relatedParts'
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id='related-parts-label'>Related Parts</InputLabel>
                                        <Select
                                            {...field}
                                            labelId='related-parts-label'
                                            multiple
                                            input={<OutlinedInput label='Related Parts' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_PARTS.find(p => p.id === value)?.title} size='small' onDelete={() => {
                                                            const newValue = (selected as string[]).filter((item) => item !== value)
                                                            field.onChange(newValue)
                                                        }} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            {MOCK_PARTS.map((part) => (
                                                <MenuItem key={part.id} value={part.id}>
                                                    {part.title}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                )}
                            />
                        </Grid>
                    )}

                    {selectedSectionTypes.includes('projects') && (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Controller
                                name='related_content.relatedProjects'
                                control={control}
                                render={({ field }) => (
                                    <FormControl fullWidth>
                                        <InputLabel id='related-projects-label'>Related Projects</InputLabel>
                                        <Select
                                            {...field}
                                            labelId='related-projects-label'
                                            multiple
                                            input={<OutlinedInput label='Related Projects' />}
                                            renderValue={(selected) => (
                                                <div className='flex flex-wrap gap-2'>
                                                    {(selected as string[]).map((value) => (
                                                        <Chip key={value} label={MOCK_PROJECTS.find(pr => pr.id === value)?.title} size='small' onDelete={() => {
                                                            const newValue = (selected as string[]).filter((item) => item !== value)
                                                            field.onChange(newValue)
                                                        }} onMouseDown={(e) => e.stopPropagation()} />
                                                    ))}
                                                </div>
                                            )}
                                        >
                                            {MOCK_PROJECTS.map((project) => (
                                                <MenuItem key={project.id} value={project.id}>
                                                    {project.title}
                                                </MenuItem>
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
            </CardContent>
        </Card>
    )
}

export default CareerRelated
