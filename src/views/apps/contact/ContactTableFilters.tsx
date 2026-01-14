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
import type { ContactType } from '@/types/apps/ecommerceTypes'

type Props = {
  setData: (data: ContactType[]) => void
  contactData?: ContactType[]
}

const ContactTableFilters = ({ setData, contactData }: Props) => {
  // States
  const [purpose, setPurpose] = useState<string>('')

  useEffect(() => {
    const newData = contactData?.filter(contact => {
      const matchesPurpose = purpose === '' || contact.purpose === purpose

      return matchesPurpose
    })

    setData(newData ?? [])
  }, [purpose, contactData, setData])

  return (
    <Grid container spacing={6} className='p-5'>
      <Grid size={{ xs: 12, sm: 6 }}>
        <FormControl fullWidth>
          <InputLabel id='purpose-select'>Purpose</InputLabel>
          <Select
            fullWidth
            id='select-purpose'
            value={purpose}
            onChange={e => setPurpose(e.target.value)}
            label='Purpose'
            labelId='purpose-select'
          >
            <MenuItem value=''>Select Purpose</MenuItem>
            <MenuItem value='Business Proposal'>Business Proposal</MenuItem>
            <MenuItem value='General Enquiry'>General Enquiry</MenuItem>
            <MenuItem value='Partnership'>Partnership</MenuItem>
            <MenuItem value='Service Request'>Service Request</MenuItem>
            <MenuItem value='Sales'>Sales</MenuItem>
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  )
}

export default ContactTableFilters
