'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

type Props = {
    open: boolean
    handleClose: () => void
    onSave: (data: any) => void
    initialData?: any
}

const SOCIAL_PLATFORMS = [
    { name: 'Facebook', icon: 'ri-facebook-fill' },
    { name: 'Twitter / X', icon: 'ri-twitter-x-fill' },
    { name: 'Instagram', icon: 'ri-instagram-line' },
    { name: 'LinkedIn', icon: 'ri-linkedin-fill' },
    { name: 'YouTube', icon: 'ri-youtube-fill' },
    { name: 'WhatsApp', icon: 'ri-whatsapp-line' },
    { name: 'Pinterest', icon: 'ri-pinterest-line' },
    { name: 'TikTok', icon: 'ri-tiktok-fill' },
    { name: 'GitHub', icon: 'ri-github-fill' },
    { name: 'Dribbble', icon: 'ri-dribbble-line' },
    { name: 'Behance', icon: 'ri-behance-fill' }
]

const SocialLinksDrawer = ({ open, handleClose, onSave, initialData }: Props) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            platform: '',
            url: ''
        }
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                // Find platform key based on icon if possible, or just use what's saved
                const foundPlatform = SOCIAL_PLATFORMS.find(p => p.icon === initialData.icon)
                reset({
                    platform: foundPlatform ? foundPlatform.icon : (initialData.icon || ''), // We store icon class as value
                    url: initialData.url || ''
                })
            } else {
                reset({
                    platform: '',
                    url: ''
                })
            }
        }
    }, [open, initialData, reset])

    const handleReset = () => {
        reset()
        handleClose()
    }

    const onSubmit = (data: any) => {
        const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.icon === data.platform)
        const payload = {
            icon: data.platform,
            name: selectedPlatform ? selectedPlatform.name : 'Unknown', // Derive name from icon selection
            url: data.url
        }
        onSave(payload)
        handleReset()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleReset}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>{initialData ? 'Edit Social Link' : 'Add New Social Link'}</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5'>
                    <Controller
                        name='platform'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormControl fullWidth>
                                <InputLabel>Select Platform</InputLabel>
                                <Select
                                    {...field}
                                    label='Select Platform'
                                    renderValue={(selected) => {
                                        const p = SOCIAL_PLATFORMS.find(item => item.icon === selected)
                                        return (
                                            <div className="flex items-center gap-2">
                                                <i className={selected as string} />
                                                <span>{p?.name}</span>
                                            </div>
                                        )
                                    }}
                                >
                                    {SOCIAL_PLATFORMS.map((item) => (
                                        <MenuItem key={item.icon} value={item.icon}>
                                            <ListItemIcon>
                                                <i className={item.icon} />
                                            </ListItemIcon>
                                            <ListItemText primary={item.name} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    />

                    <Controller
                        name='url'
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='URL'
                                placeholder='https://...'
                            />
                        )}
                    />

                    <div className='flex items-center gap-4 mt-4'>
                        <Button variant='contained' type='submit'>
                            Save
                        </Button>
                        <Button variant='outlined' color='error' onClick={handleReset}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default SocialLinksDrawer
