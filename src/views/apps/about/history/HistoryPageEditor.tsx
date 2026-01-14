'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import HistoryPageHero from './HistoryPageHero'
import OurHistorySection from './OurHistorySection'
import HistoryTimeline from './HistoryTimeline'

const HistoryPageEditor = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h4'>History Page Editor</Typography>
                <Typography variant='body2' color='text.secondary'>
                    Manage the content for the History page: Hero, Description, and Timeline.
                </Typography>
            </Grid>

            {/* Hero Section */}
            <Grid item xs={12}>
                <HistoryPageHero />
            </Grid>

            {/* Our History Section */}
            <Grid item xs={12}>
                <OurHistorySection />
            </Grid>

            {/* Timeline Section */}
            <Grid item xs={12}>
                <HistoryTimeline />
            </Grid>
        </Grid>
    )
}

export default HistoryPageEditor
