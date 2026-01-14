// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CardContent from '@mui/material/CardContent'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'

// Type Imports
import type { CareerType } from '@/types/apps/ecommerceTypes'

const TableFilters = ({
  setData,
  careerData
}: {
  setData: (data: CareerType[]) => void
  careerData?: CareerType[]
}) => {
  // States
  const [category, setCategory] = useState<CareerType['category']>('')
  const [status, setStatus] = useState<CareerType['status']>('')
  const [jobType, setJobType] = useState<CareerType['jobType']>('')

  useEffect(
    () => {
      const filteredData = careerData?.filter(career => {
        if (category && career.category !== category) return false
        if (status && career.status !== status) return false
        if (jobType && career.jobType !== jobType) return false

        return true
      })

      setData(filteredData ?? [])
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category, status, jobType, careerData]
  )

  return (
    <CardContent>
      <Grid container spacing={6}>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='status-select'>Status</InputLabel>
            <Select
              fullWidth
              id='select-status'
              label='Status'
              value={status}
              onChange={e => setStatus(e.target.value)}
              labelId='status-select'
            >
              <MenuItem value=''>Select Status</MenuItem>
              <MenuItem value='Active'>Active</MenuItem>
              <MenuItem value='Inactive'>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='category-select'>Category</InputLabel>
            <Select
              fullWidth
              id='select-category'
              value={category}
              onChange={e => setCategory(e.target.value)}
              label='Category'
              labelId='category-select'
            >
              <MenuItem value=''>Select Category</MenuItem>
              <MenuItem value='Engineering'>Engineering</MenuItem>
              <MenuItem value='Design'>Design</MenuItem>
              <MenuItem value='Product'>Product</MenuItem>
              <MenuItem value='Marketing'>Marketing</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl fullWidth>
            <InputLabel id='job-type-select'>Job Type</InputLabel>
            <Select
              fullWidth
              id='select-job-type'
              value={jobType}
              onChange={e => setJobType(e.target.value)}
              label='Job Type'
              labelId='job-type-select'
            >
              <MenuItem value=''>Select Job Type</MenuItem>
              <MenuItem value='Full Time'>Full Time</MenuItem>
              <MenuItem value='Part Time'>Part Time</MenuItem>
              <MenuItem value='Contract'>Contract</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </CardContent>
  )
}

export default TableFilters
