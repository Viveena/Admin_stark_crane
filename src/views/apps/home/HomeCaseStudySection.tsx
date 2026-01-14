'use client'

import { useEffect } from 'react'
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
import { useForm, Controller } from 'react-hook-form'

const CASE_STUDY_OPTIONS = ['Steel Plant Project', 'Port Crane Installation', 'Automobile Factory Hoists', 'Warehouse Automation']

const HomeCaseStudySection = () => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: { isVisible: true, title: '', subtitle: '', selectedCaseStudies: [] as string[] }
    })

    useEffect(() => {
        const savedData = localStorage.getItem('home_casestudy_data')
        if (savedData) reset(JSON.parse(savedData))
    }, [reset])

    const onSubmit = (data: any) => {
        localStorage.setItem('home_casestudy_data', JSON.stringify(data))
        alert('Case Study Section Saved')
    }

    return (
        <Card>
            <form onSubmit={handleSubmit(onSubmit)}>
                <CardHeader
                    title='Case Study Section'
                    action={
                        <div className="flex items-center gap-4">
                            <Controller
                                name='isVisible'
                                control={control}
                                render={({ field }) => (
                                    <FormControlLabel control={<Switch checked={field.value} onChange={field.onChange} />} label={field.value ? "Visible" : "Hidden"} />
                                )}
                            />
                            <Button variant='contained' type='submit'>Save</Button>
                        </div>
                    }
                />
                <CardContent>
                    <div className='flex flex-col gap-6'>
                        <Controller name='title' control={control} render={({ field }) => <TextField {...field} fullWidth label='Title' />} />
                        <Controller name='subtitle' control={control} render={({ field }) => <TextField {...field} fullWidth label='Subtitle' />} />
                        <Controller
                            name='selectedCaseStudies'
                            control={control}
                            render={({ field }) => (
                                <FormControl fullWidth>
                                    <InputLabel>Select Case Studies</InputLabel>
                                    <Select
                                        multiple
                                        {...field}
                                        label='Select Case Studies'
                                        renderValue={(selected) => <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>{(selected as string[]).map((value) => <Chip key={value} label={value} size="small" />)}</Box>}
                                    >
                                        {CASE_STUDY_OPTIONS.map((name) => <MenuItem key={name} value={name}>{name}</MenuItem>)}
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

export default HomeCaseStudySection
