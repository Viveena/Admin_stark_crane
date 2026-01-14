'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

type Props = {
    open: boolean
    handleClose: () => void
    handleSave: (password: string) => void
}

const ChangePasswordDialog = ({ open, handleClose, handleSave }: Props) => {
    const [password, setPassword] = useState('')
    const [error, setError] = useState(false)

    const handleSubmit = () => {
        if (!password) {
            setError(true)
            return
        }
        handleSave(password)
        resetForm()
    }

    const resetForm = () => {
        setPassword('')
        setError(false)
        handleClose()
    }

    return (
        <Dialog open={open} onClose={handleClose} fullWidth maxWidth='sm'>
            <DialogTitle className='flex items-center justify-between'>
                <Typography variant='h5'>Change Password</Typography>
                <IconButton size='small' onClick={resetForm}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </DialogTitle>
            <DialogContent>
                <div className='flex flex-col gap-4 pt-2'>
                    <TextField
                        fullWidth
                        label='New Password'
                        type='password'
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value)
                            if (e.target.value) setError(false)
                        }}
                        error={error}
                        helperText={error ? 'Password is required' : ''}
                    />
                </div>
            </DialogContent>
            <DialogActions className='p-5'>
                <Button variant='outlined' color='secondary' onClick={resetForm}>
                    Cancel
                </Button>
                <Button variant='contained' onClick={handleSubmit}>
                    Save
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default ChangePasswordDialog
