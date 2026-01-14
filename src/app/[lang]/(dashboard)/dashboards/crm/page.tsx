// MUI Imports
import Grid from '@mui/material/Grid2'

// Components Imports

import CardStatVertical from '@components/card-statistics/Vertical'
import StackedBarChart from '@views/dashboards/crm/StackedBarChart'
import DonutChart from '@views/dashboards/crm/DonutChart'
import OrganicSessions from '@views/dashboards/crm/OrganicSessions'
import ProjectTimeline from '@views/dashboards/crm/ProjectTimeline'
import WeeklyOverview from '@views/dashboards/crm/WeeklyOverview'
import SocialNetworkVisits from '@views/dashboards/crm/SocialNetworkVisits'
import MonthlyBudget from '@views/dashboards/crm/MonthlyBudget'
import MeetingSchedule from '@views/dashboards/crm/MeetingSchedule'
import ExternalLinks from '@views/dashboards/crm/ExternalLinks'
import PaymentHistory from '@views/dashboards/crm/PaymentHistory'
import SalesInCountries from '@views/dashboards/crm/SalesInCountries'
import UserTable from '@views/dashboards/crm/UserTable'

// Server Action Imports
import { getServerMode } from '@core/utils/serverHelpers'

// Data Imports
import { getUserData } from '@/app/server/actions'

/**
 * ! If you need data using an API call, uncomment the below API code, update the `process.env.API_URL` variable in the
 * ! `.env` file found at root of your project and also update the API endpoints like `/apps/user-list` in below example.
 * ! Also, remove the above server action import and the action itself from the `src/app/server/actions.ts` file to clean up unused code
 * ! because we've used the server action for getting our static data.
 */

/* const getUserData = async () => {
  // Vars
  const res = await fetch(`${process.env.API_URL}/apps/user-list`)

  if (!res.ok) {
    throw new Error('Failed to fetch userData')
  }

  return res.json()
} */

const DashboardCRM = async () => {
  // Vars
  const data = await getUserData()
  const serverMode = await getServerMode()

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber={''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber=  {''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber={''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber=  {''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber={''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber={''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber={''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>
      <Grid size={{ xs: 12, md: 3, sm: 3 }}>
        <CardStatVertical
          stats='155k'
          title='Total Orders'
          trendNumber={''}
          trend={''} 
          avatarIcon={''} 
          chipText={''}        />
      </Grid>

      
      
      <Grid size={{ xs: 12, md: 4 }}>
        <OrganicSessions />
      </Grid>
      
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <WeeklyOverview />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <SocialNetworkVisits />
      </Grid>
      <Grid size={{ xs: 12, sm: 6, md: 4 }}>
        <MonthlyBudget />
      </Grid>
      
      <Grid size={{ xs: 12, md: 8 }}>
        <UserTable tableData={data} />
      </Grid>
    </Grid>
  )
}

export default DashboardCRM
