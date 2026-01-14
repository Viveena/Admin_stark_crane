'use client'

// React Imports
import { type FormEvent, useEffect, useState } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'

type Props = {
    open: boolean
    handleClose: () => void
}

type JobType = {
    id: number
    name: string
}

const initialJobTypes: JobType[] = [
    { id: 1, name: 'Full Time' },
    { id: 2, name: 'Part Time' },
    { id: 3, name: 'Contract' },
    { id: 4, name: 'Internship' }
]



const AddJobTypeDrawer = ({ open, handleClose }: Props) => {
    // States
    const [jobTypes, setJobTypes] = useState<JobType[]>([])
    const [jobTypeName, setJobTypeName] = useState('')
    const [editingId, setEditingId] = useState<number | null>(null)

    // Load from localStorage on mount
    useEffect(() => {
        const savedData = localStorage.getItem('career-job-types')
        if (savedData) {
            setJobTypes(JSON.parse(savedData))
        } else {
            setJobTypes(initialJobTypes)
        }
    }, [])

    // Save to localStorage whenever jobTypes change
    useEffect(() => {
        if (jobTypes.length > 0) {
            localStorage.setItem('career-job-types', JSON.stringify(jobTypes))
        }
    }, [jobTypes])

    const handleReset = () => {
        setJobTypeName('')
        setEditingId(null)
        handleClose()
    }

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        if (!jobTypeName.trim()) return

        if (editingId !== null) {
            // Update
            const updatedJobTypes = jobTypes.map(type => (type.id === editingId ? { ...type, name: jobTypeName } : type))
            setJobTypes(updatedJobTypes)
            setEditingId(null)
        } else {
            // Add
            const newJobType = {
                id: Date.now(),
                name: jobTypeName
            }
            const updatedJobTypes = [...jobTypes, newJobType]
            setJobTypes(updatedJobTypes)
        }
        setJobTypeName('')
    }

    const handleEdit = (jobType: JobType) => {
        setJobTypeName(jobType.name)
        setEditingId(jobType.id)
    }

    const handleDelete = (id: number) => {
        const updatedJobTypes = jobTypes.filter(type => type.id !== id)
        setJobTypes(updatedJobTypes)
    }

    const handleCancelEdit = () => {
        setJobTypeName('')
        setEditingId(null)
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
                <Typography variant='h5'>Add Job Type</Typography>
                <IconButton size='small' onClick={handleReset}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 flex flex-col gap-6'>
                {/* Form Section */}
                <form onSubmit={handleSubmit} className='flex flex-col gap-5'>
                    <TextField
                        fullWidth
                        label='Job Type Name'
                        placeholder='e.g. Full Time'
                        value={jobTypeName}
                        onChange={e => setJobTypeName(e.target.value)}
                    />
                    <div className='flex items-center gap-4'>
                        <Button variant='contained' type='submit'>
                            {editingId !== null ? 'Update' : 'Add'}
                        </Button>
                        {editingId !== null ? (
                            <Button variant='outlined' color='secondary' onClick={handleCancelEdit}>
                                Cancel Edit
                            </Button>
                        ) : (
                            <Button variant='outlined' color='secondary' onClick={handleReset}>
                                Cancel
                            </Button>
                        )}
                    </div>
                </form>

                <Divider />

                {/* Table Section */}
                <div>
                    <Typography variant='h6' className='mbe-3'>Job Types List</Typography>
                    <TableContainer component={Paper} elevation={0} className='border'>
                        <Table size='small' aria-label='a dense table'>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell align='right'>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {jobTypes.map(row => (
                                    <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                        <TableCell component='th' scope='row'>
                                            {row.name}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <IconButton size='small' onClick={() => handleEdit(row)}>
                                                <i className='ri-pencil-line text-[20px]' />
                                            </IconButton>
                                            <IconButton size='small' onClick={() => handleDelete(row.id)}>
                                                <i className='ri-delete-bin-line text-[20px] text-error' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </div>
            </div>
        </Drawer>
    )
}

export default AddJobTypeDrawer
