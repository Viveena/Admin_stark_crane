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
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

// Type Imports
import type { ServiceCategoryType } from './ServiceCategoryEditor'
import type { ServiceItemType } from '../service/ServicePageEditor'

type Props = {
    open: boolean
    category: ServiceCategoryType
    onClose: () => void
    onEditService: (service: ServiceItemType) => void
    onCreateService: () => void
}

const ServiceAssignmentModal = ({ open, category, onClose, onEditService, onCreateService }: Props) => {
    // State
    const [allServices, setAllServices] = useState<ServiceItemType[]>([])
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
    const [searchTerm, setSearchTerm] = useState('')

    // Load services
    useEffect(() => {
        if (open) {
            const services = JSON.parse(localStorage.getItem('category-services') || '[]') as ServiceItemType[]
            setAllServices(services)

            // Pre-select services in this category
            const currentCategoryIds = new Set(services.filter(s => s.categoryId === category.id).map(s => s.id))
            setSelectedIds(currentCategoryIds)
        }
    }, [open, category.id])

    const handleToggle = (id: string) => {
        const newSelected = new Set(selectedIds)
        if (newSelected.has(id)) {
            newSelected.delete(id)
        } else {
            newSelected.add(id)
        }
        setSelectedIds(newSelected)
    }

    const handleSave = () => {
        // Update all services
        const updatedServices = allServices.map(s => {
            if (selectedIds.has(s.id)) {
                // Assign to this category
                return { ...s, categoryId: category.id }
            } else if (s.categoryId === category.id) {
                // Was in this category, but now unselected -> Unassign
                return { ...s, categoryId: '' }
            }
            return s
        })

        localStorage.setItem('category-services', JSON.stringify(updatedServices))
        onClose()
    }

    const filteredServices = allServices.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
            <DialogTitle>
                <div className='flex justify-between items-center'>
                    <span>Manage Services for {category.title}</span>
                    <IconButton size='small' onClick={onClose}>
                        <i className='ri-close-line' />
                    </IconButton>
                </div>
            </DialogTitle>
            <DialogContent dividers>
                <div className='mbe-4 flex gap-2'>
                    <TextField
                        fullWidth
                        size='small'
                        placeholder='Search Services...'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position='start'>
                                    <i className='ri-search-line' />
                                </InputAdornment>
                            )
                        }}
                    />
                    <Button
                        variant='contained'
                        onClick={onCreateService}
                        className='min-is-fit'
                        startIcon={<i className='ri-add-line' />}
                    >
                        Create
                    </Button>
                </div>
                {filteredServices.length === 0 ? (
                    <Typography align='center' className='bs-20 flex items-center justify-center text-textSecondary'>
                        No services found.
                    </Typography>
                ) : (
                    <List>
                        {filteredServices.map(service => {
                            const isChecked = selectedIds.has(service.id)
                            return (
                                <ListItem
                                    key={service.id}
                                    dense
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="edit" onClick={() => onEditService(service)}>
                                            <i className='ri-pencil-line' />
                                        </IconButton>
                                    }
                                >
                                    <Checkbox
                                        edge="start"
                                        checked={isChecked}
                                        tabIndex={-1}
                                        disableRipple
                                        onChange={() => handleToggle(service.id)}
                                    />
                                    <ListItemText
                                        primary={service.title}
                                        secondary={
                                            service.categoryId && service.categoryId !== category.id
                                                ? '(Assigned to another category)'
                                                : null
                                        }
                                        secondaryTypographyProps={{ color: 'warning.main', variant: 'caption' }}
                                    />
                                </ListItem>
                            )
                        })}
                    </List>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color='secondary' variant='outlined'>Cancel</Button>
                <Button onClick={handleSave} variant='contained'>Save Assignments</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ServiceAssignmentModal
