'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import Chip from '@mui/material/Chip'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import { useForm, Controller } from 'react-hook-form'

import { usePageSection } from '@/hooks/usePageSection'

const EVENT_OPTIONS = ['Annual Meet 2025', 'Product Launch Nov', 'Safety Workshop', 'Charity Run']

const HomeEventsSection = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'home',
        sectionKey: 'events'
    });

    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: { isVisible: true, selectedEvents: [] as string[] }
    })

    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                selectedEvents: sectionData.selectedEvents || []
            })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await saveSection(data);
            alert('Events Section Saved');
        } catch (e) {
            console.error(e);
            alert('Failed to save events section');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Events Section'
                    action={
                        <div className="flex items-center gap-4">
                            <Controller
                                name='isVisible'
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label={field.value ? "Visible" : "Hidden"} />
                                )}
                            />
                            <Button variant='contained' type='submit' disabled={isSaving}>
                                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                            </Button>
                        </div>
                    }
                />
                <CardContent>
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                    <div className='flex flex-col gap-6'>
                        <Controller
                            name='selectedEvents'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Select Events</InputLabel>
                                    <Select
                                        multiple
                                        {...field}
                                        label='Select Events'
                                        renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{(selected as string[]).map((value) => <Chip key={value} label={value} size="small" />)}</Box>}
                                    >
                                        {EVENT_OPTIONS.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
                                    </Select>
                                </FormControl>
                            )}
                        />
                    </div>
                </CardContent>
            </form>
        </Card>
    )
}

export default HomeEventsSection
