'use client'

// React Imports
import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Component Imports
import TextEditor from '@components/TextEditor'

const AboutDescription = () => {
    // Local Form
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            description: ''
        }
    })

    // Load data from LocalStorage
    useEffect(() => {
        const savedData = localStorage.getItem('about_description_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            reset({ description: parsed.description || '' })
        }
    }, [reset])

    const onSubmit = (data: any) => {
        localStorage.setItem('about_description_data', JSON.stringify(data))
        console.log('Description Section Saved:', data)
        alert('Description Section Save: Data saved to LocalStorage')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='About Description'
                    action={
                        <Button variant='contained' type='submit'>
                            Save Description
                        </Button>
                    }
                />
                <CardContent>
                    <Controller
                        name='description'
                        control={control}
                        render={({ field }) => (
                            <TextEditor
                                value={field.value}
                                onChange={field.onChange}
                                label='About Us Description...'
                            />
                        )}
                    />
                </CardContent>
            </form>
        </Card>
    )
}

export default AboutDescription
