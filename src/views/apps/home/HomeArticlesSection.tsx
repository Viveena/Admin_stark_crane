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

const ARTICLE_OPTIONS = ['Crane Safety Tips', 'Maintenance Guide', 'Choosing the Right Hoist', 'Industry Trends 2025']

const HomeArticlesSection = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'home',
        sectionKey: 'articles'
    });

    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: { isVisible: true, title: '', subtitle: '', selectedArticles: [] as string[] }
    })

    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                title: sectionData.title || '',
                subtitle: sectionData.subtitle || '',
                selectedArticles: sectionData.selectedArticles || []
            })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await saveSection(data);
            alert('Articles Section Saved');
        } catch (e) {
            console.error(e);
            alert('Failed to save articles section');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Articles Section'
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
                            name='selectedArticles'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Select Articles</InputLabel>
                                    <Select
                                        multiple
                                        {...field}
                                        label='Select Articles'
                                        renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{(selected as string[]).map((value) => <Chip key={value} label={value} size="small" />)}</Box>}
                                    >
                                        {ARTICLE_OPTIONS.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
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

export default HomeArticlesSection
