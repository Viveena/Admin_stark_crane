'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Hook Import
import { usePageSection } from '@/hooks/usePageSection'

// Placeholder Options
const PRODUCT_OPTIONS = [
    'Hoist',
    'Winch',
    'EOT Crane',
    'Gantry Crane',
    'Jib Crane',
    'Electric Wire Rope Hoist'
]

const HomeProductsSection = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection, canEdit } = usePageSection({
        pageKey: 'home',
        sectionKey: 'products'
    });

    const [isSaving, setIsSaving] = useState(false);

    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            subtitle: '',
            selectedProducts: [] as string[]
        }
    })

    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                title: sectionData.title || '',
                subtitle: sectionData.subtitle || '',
                selectedProducts: sectionData.selectedProducts || []
            })
        }
    }, [sectionData, reset])

    const onSubmit = async (data: any) => {
        setIsSaving(true);
        try {
            await saveSection(data);
            alert('Products Section Saved'); // Optional, mainly using loading state
        } catch (e) {
            console.error(e);
            alert('Failed to save products section');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Products Section'
                    action={
                        <div className="flex items-center gap-4">
                            <Controller
                                name='isVisible'
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel
                                        control={<Switch checked={field.value} onChange={field.onChange} />}
                                        label={field.value ? "Visible" : "Hidden"}
                                    />
                                )}
                            />
                            <Button variant='contained' type='submit' disabled={isSaving || !canEdit}>
                                {isSaving ? <CircularProgress size={24} color="inherit" /> : 'Save'}
                            </Button>
                        </div>
                    }
                />
                <CardContent>
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                    <div className='flex flex-col gap-6'>
                        <Controller
                            name='title'
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label='Title' placeholder='Our Products' />
                            )}
                        />
                        <Controller
                            name='subtitle'
                            control={control}
                            render={({ field }) => (
                                <TextField {...field} fullWidth label='Subtitle' placeholder='Explore our range...' />
                            )}
                        />
                        <Controller
                            name='selectedProducts'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Select Products</InputLabel>
                                    <Select
                                        multiple
                                        {...field}
                                        label='Select Products'
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {(selected as string[]).map((value) => (
                                                    <Chip key={value} label={value} size="small" />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {PRODUCT_OPTIONS.map((name) => (
                                            <MenuItem key={name} value={name}>
                                                {name}
                                            </MenuItem>
                                        ))}
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

export default HomeProductsSection
