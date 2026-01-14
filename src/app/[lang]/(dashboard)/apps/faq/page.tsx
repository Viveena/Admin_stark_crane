// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FaqListTable from '@/views/apps/faq/FaqListTable'
import FaqCard from '@/views/apps/faq/FaqCard'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const FaqList = async () => {
    // Vars
    const data = await getEcommerceData()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FaqCard />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <FaqListTable faqData={data?.faqs} />
            </Grid>
        </Grid>
    )
}

export default FaqList
