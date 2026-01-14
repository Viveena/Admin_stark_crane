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
const data: DataType[] = [
    {
        title: 'Total FAQs',
        value: '5',
        icon: 'ri-question-answer-line',
    }
]

const FaqCard = () => {
    // Hooks
    const isBelowMdScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'))
    const isSmallScreen = useMediaQuery((theme: Theme) => theme.breakpoints.down('sm'))

    return (
        <Card>
            <CardContent>
                <Grid container spacing={6}>
                    {data.map((item, index) => (
                        <Grid
                            size={{ xs: 12, sm: 6, md: 3 }}
                            key={index}
                        >
                            <div className='flex flex-col gap-1'>
                                <div className='flex justify-between'>
                                    <div className='flex flex-col gap-1'>
                                        <Typography>{item.title}</Typography>
                                        <Typography variant='h4'>{item.value}</Typography>
                                    </div>
                                    <CustomAvatar variant='rounded' size={44}>
                                        <i className={classnames(item.icon, 'text-[28px]')} />
                                    </CustomAvatar>
                                </div>
                            </div>
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
        </Card>
    )
}

export default FaqCard
