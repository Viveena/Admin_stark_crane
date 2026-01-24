'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import useMediaQuery from '@mui/material/useMediaQuery'
import type { Theme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'

// Component Imports
import CustomAvatar from '@core/components/mui/Avatar'

type DataType = {
    title: string
    value: string
    icon: string
}

// Vars
// Vars removed as we use props now

const FaqCard = ({ totalFaqs }: { totalFaqs: number }) => {
    // Hooks
    const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

    return (
        <Card>
            <CardContent>
                <Grid container spacing={6}>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <div className='flex flex-col gap-1'>
                            <div className='flex justify-between'>
                                <div className='flex flex-col gap-1'>
                                    <Typography>Total FAQs</Typography>
                                    <Typography variant='h4'>{totalFaqs}</Typography>
                                </div>
                                <CustomAvatar variant='rounded' size={44}>
                                    <i className={classnames('ri-question-answer-line', 'text-[28px]')} />
                                </CustomAvatar>
                            </div>
                        </div>
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    )
}

export default FaqCard
