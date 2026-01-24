// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FaqView from '@/views/apps/faq/FaqView'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const FaqList = async () => {
    // Vars
    const data = await getEcommerceData()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FaqView initialData={data?.faqs} />
            </Grid>
        </Grid>
    )
}

export default FaqList
