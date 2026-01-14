'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import SocialLinksList from './SocialLinksList'

const SocialLinksPage = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h4'>Social Links</Typography>
                <Typography variant='body2' color='text.secondary'>
                    Connect with your audience by adding your social media profiles.
                </Typography>
            </Grid>

            {/* List Section */}
            <Grid item xs={12}>
                <SocialLinksList />
            </Grid>
        </Grid>
    )
}

export default SocialLinksPage
