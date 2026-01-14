'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import SeoList from './SeoList'

const SeoPage = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h4'>SEO Configuration</Typography>
                <Typography variant='body2' color='text.secondary'>
                    Optimize your website for search engines by managing meta tags for each page.
                </Typography>
            </Grid>

            {/* List Section */}
            <Grid item xs={12}>
                <SeoList />
            </Grid>
        </Grid>
    )
}

export default SeoPage
