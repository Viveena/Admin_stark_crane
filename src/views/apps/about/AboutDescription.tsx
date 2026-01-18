'use client'

// React Imports
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import Alert from '@mui/material/Alert'

// Component Imports
import TextEditor from '@components/TextEditor'

// Hook Import
import { usePageSection } from '@/hooks/usePageSection'

const AboutDescription = () => {
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection } = usePageSection({
        pageKey: 'about',
        sectionKey: 'description'
    });

    const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');

    // Local Form
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            description: ''
        }
    })

    // Load data from hook
    useEffect(() => {
        if (sectionData) {
            reset({ description: sectionData.description || '' })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: any) => {
        setSaveStatus('saving');
        try {
            await saveSection(data);
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (err) {
            console.error(err);
            setSaveStatus('error');
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='About Description'
                    subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                    action={
                        <div className="flex items-center gap-4">
                            {saveStatus === 'success' && <Typography color="success.main" variant="body2">Saved!</Typography>}
                            {saveStatus === 'error' && <Typography color="error.main" variant="body2">Error!</Typography>}
                            <Button variant='contained' type='submit' disabled={saveStatus === 'saving'}>
                                {saveStatus === 'saving' ? <CircularProgress size={24} color="inherit" /> : 'Save Description'}
                            </Button>
                        </div>
                    }
                />
                <CardContent>
                    {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}

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
