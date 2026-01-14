// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import TermsEditor from '@/views/apps/terms/TermsEditor'

// Data Imports
import { getTermsData } from '@/app/server/actions'

const TermsPage = async () => {
    // Vars
    const data = await getTermsData()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <TermsEditor data={data} />
            </Grid>
        </Grid>
    )
}

export default TermsPage
