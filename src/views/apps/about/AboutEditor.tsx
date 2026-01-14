'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import AboutHero from './AboutHero'
import AboutMission from './AboutMission'
import AboutHistory from './AboutHistory'
import AboutDescription from './AboutDescription'

const AboutEditor = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h4'>About Us Page Editor</Typography>
                <Typography variant='body2' color='text.secondary'>
                    Manage the content for the public About Us page. Save each section independently.
                </Typography>
            </Grid>

            {/* Hero Section */}
            <Grid item xs={12}>
                <AboutHero />
            </Grid>

            {/* Description Section */}
            <Grid item xs={12}>
                <AboutDescription />
            </Grid>

            {/* Mission Section */}
            <Grid item xs={12}>
                <AboutMission />
            </Grid>

            {/* History Section */}
            <Grid item xs={12}>
                <AboutHistory />
            </Grid>
        </Grid>
    )
}

export default AboutEditor
