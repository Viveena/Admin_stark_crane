// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'

// Type Imports
import type { FaqType } from '@/types/apps/ecommerceTypes'

// Component Imports
import TextEditor from '@/components/TextEditor'

type Props = {
    open: boolean
    handleClose: () => void
    faqData?: FaqType | null
    setData: (data: FaqType[]) => void
    data: FaqType[]
}

const FaqDrawer = ({ open, handleClose, faqData, setData, data }: Props) => {
    // States
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')

    useEffect(() => {
        if (faqData) {
            setTitle(faqData.title)
            setDescription(faqData.description)
        } else {
            setTitle('')
            setDescription('')
        }
    }, [faqData, open])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (faqData) {
            // Edit logic
            const updatedData = data.map(item =>
                item.id === faqData.id ? { ...item, title, description } : item
            )
            setData(updatedData)
        } else {
            // Add logic
            const newFaq = {
                id: data.length + 1,
                title,
                description
            }
            setData([...data, newFaq])
        }
        handleClose()
    }

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>{faqData ? 'Edit FAQ' : 'Add New FAQ'}</Typography>
                <IconButton size='small' onClick={handleClose}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <TextField
                        fullWidth
                        label='Title'
                        placeholder='FAQ Title'
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                    />
                    <div className='flex flex-col gap-2'>
                        <Typography className='font-medium' color='text.primary'>
                            Description
                        </Typography>
                        <TextEditor
                            value={description}
                            onChange={setDescription}
                            label='FAQ Details'
                        />
                    </div>
                    <div className='flex items-center gap-4'>
                        <Button variant='contained' type='submit'>
                            {faqData ? 'Update' : 'Submit'}
                        </Button>
                        <Button variant='outlined' color='secondary' onClick={handleClose}>
                            Cancel
                        </Button>
                    </div>
                </form>
            </div>
        </Drawer>
    )
}

export default FaqDrawer
