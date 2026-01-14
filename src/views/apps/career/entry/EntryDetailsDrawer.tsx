// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Chip from '@mui/material/Chip'

// Type Imports
import type { EntryType } from '@/types/apps/ecommerceTypes'

type Props = {
    open: boolean
    handleClose: () => void
    data: EntryType | null
}

const EntryDetailsDrawer = ({ open, handleClose, data }: Props) => {
    if (!data) return null

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>Entry Details</Typography>
                <IconButton size='small' onClick={handleClose}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 flex flex-col gap-4'>
                <div>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Personal Info
                    </Typography>
                    <div className='flex flex-col gap-2 mt-2'>
                        <Typography variant='h6' color='text.primary'>
                            {data.firstName} {data.lastName}
                        </Typography>
                        <div className='flex items-center gap-2'>
                            <i className='ri-mail-line text-xl' />
                            <Typography>{data.email}</Typography>
                        </div>
                        <div className='flex items-center gap-2'>
                            <i className='ri-phone-line text-xl' />
                            <Typography>{data.phone}</Typography>
                        </div>
                    </div>
                </div>
                <Divider />
                <div>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Application Questions
                    </Typography>
                    <div className='flex flex-col gap-3 mt-2'>
                        <div className='flex justify-between items-center'>
                            <Typography variant='body2' color='text.primary'>Applied Before?</Typography>
                            <Chip label={data.appliedBefore ? 'Yes' : 'No'} color={data.appliedBefore ? 'warning' : 'info'} size='small' variant='tonal' />
                        </div>
                        <div className='flex justify-between items-center'>
                            <Typography variant='body2' color='text.primary'>Sponsorship Required?</Typography>
                            <Chip label={data.sponsorship ? 'Yes' : 'No'} color={data.sponsorship ? 'error' : 'secondary'} size='small' variant='tonal' />
                        </div>
                        <div className='flex justify-between items-center'>
                            <Typography variant='body2' color='text.primary'>Over 18?</Typography>
                            <Chip label={data.isOver18 ? 'Yes' : 'No'} color={data.isOver18 ? 'success' : 'error'} size='small' variant='tonal' />
                        </div>
                    </div>
                </div>
                <Divider />
                <div>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Additional Info
                    </Typography>
                    <div className='flex flex-col gap-2 mt-2'>
                        <div className='flex items-center gap-2'>
                            <i className='ri-user-follow-line text-xl' />
                            <Typography>Referral: <strong>{data.referral}</strong></Typography>
                        </div>
                        <div className='flex items-center gap-2'>
                            <i className='ri-file-text-line text-xl' />
                            <Typography>Resume: <strong>{data.resume}</strong></Typography>
                        </div>
                    </div>
                </div>

            </div>
        </Drawer>
    )
}

export default EntryDetailsDrawer
