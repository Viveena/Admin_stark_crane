// React Imports
import type { ReactElement } from 'react'

// Next Imports
import dynamic from 'next/dynamic'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { PricingPlanType } from '@/types/pages/pricingTypes'

// Component Imports
import UserLeftOverview from '@views/apps/user/view/user-left-overview'
import UserRight from '@views/apps/user/view/user-right'

// Data Imports
import { getPricingData } from '@/app/server/actions'

const OverViewTab = dynamic(() => import('@views/apps/user/view/user-right/overview'))
const SecurityTab = dynamic(() => import('@views/apps/user/view/user-right/security'))
const BillingPlans = dynamic(() => import('@views/apps/user/view/user-right/billing-plans'))
const NotificationsTab = dynamic(() => import('@views/apps/user/view/user-right/notifications'))
const ConnectionsTab = dynamic(() => import('@views/apps/user/view/user-right/connections'))

// Vars
const tabContentList = (data?: PricingPlanType[]): { [key: string]: ReactElement } => ({
    overview: <OverViewTab />,
    security: <SecurityTab />,
    'billing-plans': <BillingPlans data={data} />,
    notifications: <NotificationsTab />,
    connections: <ConnectionsTab />
})

const UserViewTab = async ({ params }: { params: Promise<{ id: string }> }) => {
    // Vars
    const { id } = await params
    const pricingData = await getPricingData()

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12, lg: 12, md: 12 }}>
                <UserLeftOverview userId={id} />
            </Grid>

        </Grid>
    )
}

export default UserViewTab
