// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import CareerAddHeader from '@views/apps/career/add/CareerAddHeader'
import CareerInformation from '@views/apps/career/add/CareerInformation'
import CareerRelated from '@views/apps/career/add/CareerRelated'

const CareerAdd = () => {
  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <CareerAddHeader />
      </Grid>
      <Grid size={{ xs: 12, md: 12 }}>
        <Grid container spacing={6}>
          <Grid size={{ xs: 12 }}>
            <CareerInformation />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <CareerRelated />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  )
}

export default CareerAdd
