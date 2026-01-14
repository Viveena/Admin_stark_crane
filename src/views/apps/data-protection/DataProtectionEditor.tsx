'use client'

// MUI Imports
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'

// Component Imports
import DataProtectionDescription from './DataProtectionDescription'
import DataProtectionTabs from './DataProtectionTabs'

const DataProtectionEditor = () => {
    return (
        <Grid container spacing={6}>
            <Grid item xs={12}>
                <Typography variant='h4'>Data Protection Editor</Typography>
                <Typography variant='body2' color='text.secondary'>
                    Manage the Data Protection page content and dynamic policy tabs.
                </Typography>
            </Grid>

            {/* Description Section */}
            <Grid item xs={12}>
                <DataProtectionDescription />
            </Grid>

            {/* Tabs Section */}
            <Grid item xs={12}>
                <DataProtectionTabs />
            </Grid>
        </Grid>
    )
}

export default DataProtectionEditor
