'use client'

import React from 'react'
import { useForm, FormProvider, useFormContext, Controller } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import CareerAddHeader from './CareerAddHeader'
const CareerInformation = dynamic(() => import('./CareerInformation'), { ssr: false })
import CareerRelated from './CareerRelated'
import Grid from '@mui/material/Grid2'
import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'

type CareerFormData = {
    job_title: string
    location: string
    salary: string
    category: string
    job_type: string
    description: string
    status: string
    related_content: {
        sectionTypes: string[]
        relatedBlogs: string[]
        relatedServices: string[]
        relatedParts: string[]
        relatedProjects: string[]
    }
}


const CareerForm = ({ initialData, id }: { initialData?: any; id?: string }) => {
    const router = useRouter()

    // Parse initial related content if it exists in DB (it might be JSON)
    const initialRelated = initialData?.related_content || {
        sectionTypes: [],
        relatedBlogs: [],
        relatedServices: [],
        relatedParts: [],
        relatedProjects: []
    }

    const methods = useForm<CareerFormData>({
        defaultValues: {
            job_title: initialData?.jobTitle || initialData?.job_title || '',
            location: initialData?.location || '',
            salary: initialData?.salary || '',
            category: initialData?.category || '',
            job_type: initialData?.jobType || initialData?.job_type || '',
            description: initialData?.description || '',
            status: initialData?.status || 'Active',
            related_content: initialRelated
        }
    })

    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' as 'success' | 'error' })

    const onSubmit = async (data: CareerFormData) => {
        try {
            const url = id ? `http://localhost:5000/api/careers/${id}` : 'http://localhost:5000/api/careers'
            const method = id ? 'PUT' : 'POST'

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage.getItem('token') || ''
                },
                body: JSON.stringify(data)
            })

            if (!response.ok) {
                throw new Error(id ? 'Failed to update job' : 'Failed to create job')
            }

            setSnackbar({ open: true, message: id ? 'Job updated successfully!' : 'Job created successfully!', severity: 'success' })
            setTimeout(() => {
                router.push('/en/apps/career/list')
            }, 1500)
        } catch (error) {
            console.error(error)
            setSnackbar({ open: true, message: id ? 'Error updating job' : 'Error creating job', severity: 'error' })
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                        <CareerAddHeader isEdit={!!id} />
                    </Grid>
                    <Grid size={{ xs: 12, md: 12 }}>
                        <Grid container spacing={6}>
                            <Grid size={{ xs: 12 }}>
                                <CareerInformation careerData={initialData} />
                            </Grid>
                            {/* CareerRelated might need adjustment if it has form fields, but focusing on core fields first */}
                            <Grid size={{ xs: 12 }}>
                                <CareerRelated />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
                <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
                    <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
                </Snackbar>
            </form>
        </FormProvider>
    )
}

export default CareerForm
