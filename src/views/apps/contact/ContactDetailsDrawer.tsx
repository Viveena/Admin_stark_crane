// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Type Imports
import type { ContactType } from '@/types/apps/ecommerceTypes'

type Props = {
    open: boolean
    handleClose: () => void
    data: ContactType | null
}

const ContactDetailsDrawer = ({ open, handleClose, data }: Props) => {
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
                <Typography variant='h5'>Contact Details</Typography>
                <IconButton size='small' onClick={handleClose}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 flex flex-col gap-6'>

                {/* Personal Info */}
                <div className='flex flex-col gap-2'>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Personal Info
                    </Typography>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>
                            {data.title} {data.firstName} {data.surname}
                        </Typography>
                        <Typography variant='caption' color='text.secondary'>Full Name</Typography>
                    </div>
                    <div className='flex justify-between'>
                        <div>
                            <Typography variant='body2' className='font-medium' color='text.primary'>{data.role}</Typography>
                            <Typography variant='caption' color='text.secondary'>Role</Typography>
                        </div>
                        <div>
                            <Typography variant='body2' className='font-medium' color='text.primary'>{data.company}</Typography>
                            <Typography variant='caption' color='text.secondary'>Company</Typography>
                        </div>
                    </div>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>{data.industry}</Typography>
                        <Typography variant='caption' color='text.secondary'>Industry</Typography>
                    </div>
                </div>

                <Divider />

                {/* Address Info */}
                <div className='flex flex-col gap-2'>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Address
                    </Typography>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>{data.street}</Typography>
                        <Typography variant='caption' color='text.secondary'>Street</Typography>
                    </div>
                    <div className='flex justify-between'>
                        <div>
                            <Typography variant='body2' className='font-medium' color='text.primary'>{data.city}</Typography>
                            <Typography variant='caption' color='text.secondary'>City</Typography>
                        </div>
                        <div>
                            <Typography variant='body2' className='font-medium' color='text.primary'>{data.country}</Typography>
                            <Typography variant='caption' color='text.secondary'>Country</Typography>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Contact Info */}
                <div className='flex flex-col gap-2'>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Contact Info
                    </Typography>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>{data.email}</Typography>
                        <Typography variant='caption' color='text.secondary'>Email ID</Typography>
                    </div>
                    <div className='flex justify-between'>
                        <div>
                            <Typography variant='body2' className='font-medium' color='text.primary'>{data.telephone}</Typography>
                            <Typography variant='caption' color='text.secondary'>Telephone</Typography>
                        </div>
                        <div>
                            <Typography variant='body2' className='font-medium' color='text.primary'>{data.mobile}</Typography>
                            <Typography variant='caption' color='text.secondary'>Mobile</Typography>
                        </div>
                    </div>
                </div>

                <Divider />

                {/* Enquiry Details */}
                <div className='flex flex-col gap-2'>
                    <Typography variant='caption' className='uppercase' color='text.disabled'>
                        Enquiry Details
                    </Typography>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>{data.purpose}</Typography>
                        <Typography variant='caption' color='text.secondary'>Purpose of Enquiry</Typography>
                    </div>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>{data.subject}</Typography>
                        <Typography variant='caption' color='text.secondary'>Subject</Typography>
                    </div>
                    <div>
                        <Typography variant='body2' className='font-medium' color='text.primary'>{data.message}</Typography>
                        <Typography variant='caption' color='text.secondary'>Additional Information</Typography>
                    </div>
                </div>

            </div>
        </Drawer>
    )
}

export default ContactDetailsDrawer
