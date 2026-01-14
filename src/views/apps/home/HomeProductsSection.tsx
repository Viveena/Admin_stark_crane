'use client'

// React Imports
import { useEffect } from 'react'

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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

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
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            subtitle: '',
            selectedProducts: [] as string[]
        }
    })

    useEffect(() => {
        const savedData = localStorage.getItem('home_products_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            reset({
                isVisible: parsed.isVisible !== undefined ? parsed.isVisible : true,
                title: parsed.title || '',
                subtitle: parsed.subtitle || '',
                selectedProducts: parsed.selectedProducts || []
            })
        }
    }, [reset])

    const onSubmit = (data: any) => {
        localStorage.setItem('home_products_data', JSON.stringify(data))
        alert('Products Section Saved')
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
                            <Button variant='contained' type='submit'>Save</Button>
                        </div>
                    }
                />
                <CardContent>
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
