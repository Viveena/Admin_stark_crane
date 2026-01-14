'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import HomeHeroSection from './HomeHeroSection'
import HomeAboutSection from './HomeAboutSection'
import HomeServiceSection from './HomeServiceSection'
import HomeProductsSection from './HomeProductsSection'
import HomePartsSection from './HomePartsSection'
import HomeCaseStudySection from './HomeCaseStudySection'
import HomeArticlesSection from './HomeArticlesSection'
import HomeNewsSection from './HomeNewsSection'
import HomeTestimonialsSection from './HomeTestimonialsSection'
import HomeEventsSection from './HomeEventsSection'

const HomeEditor = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h4'>Home Page Editor</Typography>
                <Typography variant='body2' color='text.secondary'>
                    Manage sections of the Home Page, including visibility and content.
                </Typography>
            </Grid>

            <Grid item xs={12}>
                <HomeHeroSection />
            </Grid>
            <Grid item xs={12}>
                <HomeAboutSection />
            </Grid>
            <Grid item xs={12}>
                <HomeServiceSection />
            </Grid>
            <Grid item xs={12}>
                <HomeProductsSection />
            </Grid>
            <Grid item xs={12}>
                <HomePartsSection />
            </Grid>
            <Grid item xs={12}>
                <HomeCaseStudySection />
            </Grid>
            <Grid item xs={12}>
                <HomeArticlesSection />
            </Grid>
            <Grid item xs={12}>
                <HomeNewsSection />
            </Grid>
            <Grid item xs={12}>
                <HomeTestimonialsSection />
            </Grid>
            <Grid item xs={12}>
                <HomeEventsSection />
            </Grid>
        </Grid>
    )
}

export default HomeEditor
