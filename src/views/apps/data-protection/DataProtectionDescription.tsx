'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import TextEditor from '@components/TextEditor'

const DataProtectionDescription = () => {
    // Local Form
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            description: ''
        }
    })

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('data_protection_description_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            reset({ description: parsed.description || '' })
        }
    }, [reset])

    const onSubmit = (data: any) => {
        localStorage.setItem('data_protection_description_data', JSON.stringify({ description: data.description }))
        console.log('Data Protection Description Saved:', data)
        alert('Data Protection Description Saved')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Data Protection Description'
                    action={
                        <Button variant='contained' type='submit'>
                            Save
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
                                label='Write about Data Protection...'
                            />
                        )}
                    />
                </CardContent>
            </form>
        </Card>
    )
}

export default DataProtectionDescription
