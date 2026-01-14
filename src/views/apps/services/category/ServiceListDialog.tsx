'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// Type Imports
import type { ServiceItemType } from '../service/ServicePageEditor'
import type { ServiceCategoryType } from './ServiceCategoryEditor'

type Props = {
    open: boolean
    onClose: () => void
    onEdit: (service: ServiceItemType) => void
}

const ServiceListDialog = ({ open, onClose, onEdit }: Props) => {
    const [services, setServices] = useState<ServiceItemType[]>([])
    const [categories, setCategories] = useState<ServiceCategoryType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        if (open) {
            loadData()
        }
    }, [open])

    const loadData = () => {
        const allServices = JSON.parse(localStorage.getItem('category-services') || '[]') as ServiceItemType[]
        const allCategories = JSON.parse(localStorage.getItem('service-categories') || '[]') as ServiceCategoryType[]
        setServices(allServices)
        setCategories(allCategories)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this service?')) {
            const updatedServices = services.filter(s => s.id !== id)
            localStorage.setItem('category-services', JSON.stringify(updatedServices))
            setServices(updatedServices)
        }
    }

    const getCategoryName = (categoryId: string) => {
        const cat = categories.find(c => c.id === categoryId)
        return cat ? cat.title : 'Unassigned'
    }

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='md'>
            <DialogTitle>List of Services</DialogTitle>
            <DialogContent dividers>
                <div className='mbe-4'>
                    <TextField
                        size='small'
                        fullWidth
                        placeholder='Search Services'
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value)
                            setPage(0)
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <i className='ri-search-line' />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <TableContainer>
                    <Table size='small'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Service Name</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredServices.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={3} align='center'>
                                        <Typography>No services found</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredServices
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((service) => (
                                        <TableRow key={service.id}>
                                            <TableCell>{service.title}</TableCell>
                                            <TableCell>{getCategoryName(service.categoryId)}</TableCell>
                                            <TableCell>
                                                <div className='flex gap-2'>
                                                    <IconButton size='small' onClick={() => onEdit(service)} title="Edit Service">
                                                        <i className='ri-pencil-line' />
                                                    </IconButton>
                                                    <IconButton size='small' color='error' onClick={() => handleDelete(service.id)} title="Delete Service">
                                                        <i className='ri-delete-bin-line' />
                                                    </IconButton>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component='div'
                    count={filteredServices.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} variant='outlined' color='secondary'>Close</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ServiceListDialog
