// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

// Vars
const data: UserDataType[] = [
  
  {
    title: 'Active Users',
    stats: '19,860',
    avatarIcon: 'ri-user-follow-line',
    avatarColor: 'success',
   
  },
  {
    title: 'Pending Users',
    stats: '237',
    avatarIcon: 'ri-user-search-line',
    avatarColor: 'warning',
   
  }
]

const UserListCards = () => {
  return (
    <Grid container spacing={6}>
      {data.map((item, i) => (
        <Grid key={i} size={{ xs: 12, sm: 6, md: 3 }}>
          <HorizontalWithSubtitle {...item} />
        </Grid>
      ))}
    </Grid>
  )
}

export default UserListCards
