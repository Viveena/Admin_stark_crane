'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import Checkbox from '@mui/material/Checkbox'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'

// Type Imports
import type { ServiceItemType } from '../service/ServicePageEditor'

type Props = {
    open: boolean
    onClose: () => void
    categoryId: string
    onSave: () => void
}

const ServiceMappingDialog = ({ open, onClose, categoryId, onSave }: Props) => {
    const [services, setServices] = useState<ServiceItemType[]>([])
    const [checked, setChecked] = useState<string[]>([])
    const [searchTerm, setSearchTerm] = useState('')

    // Pagination
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    useEffect(() => {
        if (open) {
            const allServices = JSON.parse(localStorage.getItem('category-services') || '[]') as ServiceItemType[]
            setServices(allServices)

            // Pre-select services that are already in this category
            const currentCategoryServices = allServices
                .filter(s => s.categoryId === categoryId)
                .map(s => s.id)
            setChecked(currentCategoryServices)
        }
    }, [open, categoryId])

    const handleToggle = (value: string) => () => {
        const currentIndex = checked.indexOf(value)
        const newChecked = [...checked]

        if (currentIndex === -1) {
            newChecked.push(value)
        } else {
            newChecked.splice(currentIndex, 1)
        }

        setChecked(newChecked)
    }

    const handleSave = () => {
        const allServices = JSON.parse(localStorage.getItem('category-services') || '[]') as ServiceItemType[]

        // Update services
        const updatedServices = allServices.map(service => {
            if (checked.includes(service.id)) {
                // If checked, assign to this category
                return { ...service, categoryId: categoryId }
            } else if (service.categoryId === categoryId) {
                // If was in this category but now unchecked, remove from category (set to empty)
                return { ...service, categoryId: '' }
            }
            return service
        })

        localStorage.setItem('category-services', JSON.stringify(updatedServices))
        onSave()
        onClose()
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    const filteredServices = services.filter(service =>
        service.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const displayedServices = filteredServices.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>Map Services</DialogTitle>
            <DialogContent dividers className='p-0'>
                <div className='p-6 pb-0'>
                    <TextField
                        size='small'
                        fullWidth
                        placeholder='Search Services'
                        value={searchTerm}
                        onChange={e => {
                            setSearchTerm(e.target.value)
                            setPage(0)
                        }}
                        className='mbe-4'
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <i className='ri-search-line' />
                                </InputAdornment>
                            )
                        }}
                    />
                </div>
                <List sx={{ width: '100%', bgcolor: 'background.paper', maxHeight: 400, overflow: 'auto' }}>
                    {displayedServices.map((service) => {
                        const labelId = `checkbox-list-label-${service.id}`

                        return (
                            <ListItem
                                key={service.id}
                                disablePadding
                            >
                                <ListItemButton role={undefined} onClick={handleToggle(service.id)} dense>
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={checked.indexOf(service.id) !== -1}
                                            tabIndex={-1}
                                            disableRipple
                                            inputProps={{ 'aria-labelledby': labelId }}
                                        />
                                    </ListItemIcon>
                                    <ListItemText id={labelId} primary={service.title} secondary={service.categoryId && service.categoryId !== categoryId ? '(Assigned to another category)' : ''} />
                                </ListItemButton>
                            </ListItem>
                        )
                    })}
                    {filteredServices.length === 0 && (
                        <ListItem>
                            <ListItemText primary="No services found" />
                        </ListItem>
                    )}
                </List>
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
                <Button onClick={onClose} color='secondary' variant='outlined'>Cancel</Button>
                <Button onClick={handleSave} variant='contained'>Save Mapping</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ServiceMappingDialog
