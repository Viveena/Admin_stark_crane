'use client'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// React Imports
import { useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'

// Type Imports
import type { Locale } from '@configs/i18n'

// Util Imports
import { getLocalizedUrl } from '@/utils/i18n'

// Component Imports
import AddCategoryDrawer from './AddCategoryDrawer'
import AddJobTypeDrawer from './AddJobTypeDrawer'

const CareerAddHeader = ({ isEdit }: { isEdit?: boolean }) => {
  // Hooks
  const { lang: locale } = useParams()

  // States
  const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
  const [jobTypeDrawerOpen, setJobTypeDrawerOpen] = useState(false)

  return (
    <>
      <div className='flex flex-wrap sm:items-center justify-between max-sm:flex-col gap-6'>
        <div>
          <Typography variant='h4' className='mbe-1'>
            {isEdit ? 'Edit Job' : 'Add a new Job'}
          </Typography>

        </div>
        <div className='flex flex-wrap max-sm:flex-col gap-4'>
          <Button variant='outlined' color='secondary' component={Link} href={getLocalizedUrl('/apps/career/list', locale as Locale)}>
            Discard
          </Button>
          <Button variant='contained' component={Link} href={getLocalizedUrl('/apps/career/list', locale as Locale)}>
            View
          </Button>
          <Button variant='contained' onClick={() => setCategoryDrawerOpen(true)}>
            Add Category
          </Button>
          <Button variant='contained' onClick={() => setJobTypeDrawerOpen(true)}>
            Add Job Type
          </Button>
          <Button variant='contained'>{isEdit ? 'Update' : 'Publish'}</Button>
        </div>
      </div>
      <AddCategoryDrawer open={categoryDrawerOpen} handleClose={() => setCategoryDrawerOpen(false)} />
      <AddJobTypeDrawer open={jobTypeDrawerOpen} handleClose={() => setJobTypeDrawerOpen(false)} />
    </>
  )
}

export default CareerAddHeader
