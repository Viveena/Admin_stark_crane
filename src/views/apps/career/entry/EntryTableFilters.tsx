// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import type { SelectChangeEvent } from '@mui/material/Select'

// Type Imports
import type { EntryType } from '@/types/apps/ecommerceTypes'

type Props = {
    setData: (data: EntryType[]) => void
    entryData?: EntryType[]
}

const EntryTableFilters = ({ setData, entryData }: Props) => {
    // States
    const [sponsorship, setSponsorship] = useState<string>('')
    const [appliedBefore, setAppliedBefore] = useState<string>('')

    useEffect(() => {
        const newData = entryData?.filter(entry => {
            // Filter by Sponsorship
            const matchesSponsorship =
                sponsorship === '' ||
                (sponsorship === 'yes' ? entry.sponsorship : !entry.sponsorship)

            // Filter by Applied Before
            const matchesAppliedBefore =
                appliedBefore === '' ||
                (appliedBefore === 'yes' ? entry.appliedBefore : !entry.appliedBefore)

            return matchesSponsorship && matchesAppliedBefore
        })

        setData(newData ?? [])
    }, [sponsorship, appliedBefore, entryData, setData])

    return (
        <Grid container spacing={6} className='p-5'>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                    <InputLabel id='sponsorship-select'>Sponsorship Required</InputLabel>
                    <Select
                        fullWidth
                        id='select-sponsorship'
                        value={sponsorship}
                        onChange={e => setSponsorship(e.target.value)}
                        label='Sponsorship Required'
                        labelId='sponsorship-select'
                    >
                        <MenuItem value=''>Select Status</MenuItem>
                        <MenuItem value='yes'>Yes</MenuItem>
                        <MenuItem value='no'>No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth>
                    <InputLabel id='applied-before-select'>Applied Before</InputLabel>
                    <Select
                        fullWidth
                        id='select-applied-before'
                        value={appliedBefore}
                        onChange={e => setAppliedBefore(e.target.value)}
                        label='Applied Before'
                        labelId='applied-before-select'
                    >
                        <MenuItem value=''>Select Status</MenuItem>
                        <MenuItem value='yes'>Yes</MenuItem>
                        <MenuItem value='no'>No</MenuItem>
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    )
}

export default EntryTableFilters
