'use client'

import { useEffect, useState } from 'react'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
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

const NEWS_OPTIONS = ['New Office Opening', 'Award Won', 'Exhibition in Dubai', 'Quarterly Results']

const HomeNewsSection = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'home',
        sectionKey: 'news'
    });

    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: { isVisible: true, title: '', subtitle: '', selectedNews: [] as string[] }
    })

    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                title: sectionData.title || '',
                subtitle: sectionData.subtitle || '',
                selectedNews: sectionData.selectedNews || []
            })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await saveSection(data);
            alert('News Section Saved');
        } catch (e) {
            console.error(e);
            alert('Failed to save news section');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='News Section'
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
                        <Controller name='title' control={control} render={({ field }) => <TextField {...field} fullWidth label='Title' />} />
                        <Controller name='subtitle' control={control} render={({ field }) => <TextField {...field} fullWidth label='Subtitle' />} />
                        <Controller
                            name='selectedNews'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Select News</InputLabel>
                                    <Select
                                        multiple
                                        {...field}
                                        label='Select News'
                                        renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{(selected as string[]).map((value) => <Chip key={value} label={value} size="small" />)}</Box>}
                                    >
                                        {NEWS_OPTIONS.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
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

export default HomeNewsSection
