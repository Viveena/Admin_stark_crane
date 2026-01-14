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

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import TextEditor from '@components/TextEditor'

type Props = {
    open: boolean
    handleClose: () => void
    onSave: (data: any) => void
    initialData?: any
}

const DataProtectionTabsDrawer = ({ open, handleClose, onSave, initialData }: Props) => {
    const { control, handleSubmit, reset } = useForm({
        defaultValues: {
            tabName: '',
            tabDescription: ''
        }
    })

    useEffect(() => {
        if (open) {
            if (initialData) {
                reset({
                    tabName: initialData.tabName || '',
                    tabDescription: initialData.tabDescription || ''
                })
            } else {
                reset({
                    tabName: '',
                    tabDescription: ''
                })
            }
        }
    }, [open, initialData, reset])

    const handleReset = () => {
        reset()
        handleClose()
    }

    const onSubmit = (data: any) => {
        onSave(data)
        handleReset()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleReset}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 600 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>{initialData ? 'Edit Tab' : 'Add New Tab'}</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 h-full overflow-y-auto'>
                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-5 h-full'>
                    <Controller
                        name='tabName'
                        control={control}
                        render={({ field }) => (
                            <TextField
                                {...field}
                                fullWidth
                                label='Tab Name'
                                placeholder='e.g. Cookie Policy'
                            />
                        )}
                    />
                    <div className="flex-grow">
                        <Typography variant='caption' className='mb-2 block'>Tab Description</Typography>
                        <Controller
                            name='tabDescription'
                            control={control}
                            render={({ field }) => (
                                <TextEditor
                                    value={field.value}
                                    onChange={field.onChange}
                                    label='Write detail description...'
                                />
                            )}
                        />
                    </div>

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

export default DataProtectionTabsDrawer
