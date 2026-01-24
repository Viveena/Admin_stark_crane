// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UserDataType } from '@components/card-statistics/HorizontalWithSubtitle'
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import HorizontalWithSubtitle from '@components/card-statistics/HorizontalWithSubtitle'

const UserListCards = ({ userData }: { userData: UsersType[] }) => {

  const activeCount = userData.filter(u => u.status === 'active').length
  const pendingCount = userData.filter(u => u.status === 'pending').length

  const data: UserDataType[] = [
    {
      title: 'Active Users',
      stats: activeCount.toLocaleString(),
      avatarIcon: 'ri-user-follow-line',
      avatarColor: 'success',

    },
    {
      title: 'Pending Users',
      stats: pendingCount.toLocaleString(),
      avatarIcon: 'ri-user-search-line',
      avatarColor: 'warning',

    }
  ]

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
