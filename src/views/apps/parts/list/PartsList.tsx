'use client'

// React Imports
import { useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Grid from '@mui/material/Grid2'

// Component Imports
import PartsLandingSettings from '../PartsLandingSettings'
import PartsDetailSettings from '../PartsDetailSettings'
// import PartDescriptionSettings from '../PartDescriptionSettings' // Replaced by Manager
import PartDescriptionManager from '../PartDescriptionManager'

const PartsList = () => {
    // State
    const [viewMode, setViewMode] = useState<'landing' | 'detail' | 'description'>('landing')

    // Hooks
    const params = useParams()
    const { lang: locale } = params

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <div className='flex justify-between items-center'>
                    <Typography variant='h3'>Parts Management</Typography>
                    <div className='flex gap-2'>
                        <Button
                            variant={viewMode === 'landing' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('landing')}
                        >
                            Landing Page
                        </Button>
                        <Button
                            variant={viewMode === 'detail' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('detail')}
                        >
                            Detail Page
                        </Button>
                        <Button
                            variant={viewMode === 'description' ? 'contained' : 'outlined'}
                            onClick={() => setViewMode('description')}
                        >
                            Description Page
                        </Button>
                        <Button
                            component={Link}
                            href={`/${locale}/apps/parts/category/list`}
                            variant='tonal'
                            color='secondary'
                            startIcon={<i className='ri-list-settings-line' />}
                        >
                            Categories
                        </Button>
                    </div>
                </div>
            </Grid>

            {/* Main Content */}
            <Grid size={{ xs: 12 }}>
                {viewMode === 'landing' && <PartsLandingSettings />}
                {viewMode === 'detail' && <PartsDetailSettings />}
                {viewMode === 'description' && <PartDescriptionManager />}
            </Grid>
        </Grid>
    )
}

export default PartsList
