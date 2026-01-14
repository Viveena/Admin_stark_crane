// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CareerAddHeader from '@views/apps/career/add/CareerAddHeader'
import CareerInformation from '@views/apps/career/add/CareerInformation'
import CareerRelated from '@views/apps/career/add/CareerRelated'

// Data Imports
import { getEcommerceData } from '@/app/server/actions'

const CareerEdit = async ({ params }: { params: { id: string } }) => {
    // Vars
    const data = await getEcommerceData()
    const careerData = data?.careers?.find((item: any) => item.id == params.id)

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <CareerAddHeader isEdit />
            </Grid>
            <Grid size={{ xs: 12, md: 12 }}>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12 }}>
                        <CareerInformation careerData={careerData} />
                    </Grid>
                    <Grid size={{ xs: 12 }}>
                        <CareerRelated careerData={careerData} id={params.id} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default CareerEdit
