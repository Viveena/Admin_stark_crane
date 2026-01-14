'use client'

import { useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
import Drawer from '@mui/material/Drawer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'

import EventsEditor from '../EventsEditor'
import AddCategoryDrawer from './AddCategoryDrawer'

type EventPost = {
    id: string
    heading: string
    category: string
    status: string
    eventDate: string | null
    location: string
    updatedAt: string
}

const EventsList = () => {
    const [events, setEvents] = useState<EventPost[]>([])
    const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
    const [eventDrawerOpen, setEventDrawerOpen] = useState(false)
    const [selectedEvent, setSelectedEvent] = useState<EventPost | undefined>(undefined)

    // Pagination and Search State
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')

    const fetchEvents = () => {
        const savedEvents = JSON.parse(localStorage.getItem('events-posts') || '[]')
        setEvents(savedEvents)
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    const handleEdit = (post: EventPost) => {
        setSelectedEvent(post)
        setEventDrawerOpen(true)
    }

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this event?')) {
            const updatedEvents = events.filter(item => item.id !== id)
            localStorage.setItem('events-posts', JSON.stringify(updatedEvents))
            setEvents(updatedEvents)
        }
    }

    const handleEventSuccess = () => {
        fetchEvents()
        setEventDrawerOpen(false)
        setSelectedEvent(undefined)
    }

    const handleEventDrawerClose = () => {
        setEventDrawerOpen(false)
        setSelectedEvent(undefined)
    }

    // Pagination Handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Filter and Pagination Logic
    const filteredEvents = events.filter((item) => {
        const term = searchTerm.toLowerCase()
        return (
            item.heading.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term) ||
            (item.location && item.location.toLowerCase().includes(term))
        )
    })

    const displayedEvents = filteredEvents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Card>
            <CardHeader
                title='Events List'
                action={
                    <div className='flex gap-2 items-center'>
                        <TextField
                            size='small'
                            placeholder='Search Events...'
                            variant='outlined'
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
                        <Button variant='outlined' onClick={() => setCategoryDrawerOpen(true)}>
                            Manage Categories
                        </Button>
                        <Button variant='contained' onClick={() => { setSelectedEvent(undefined); setEventDrawerOpen(true); }}>
                            Add Event
                        </Button>
                    </div>
                }
            />
            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Heading</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Location</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Event Date</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedEvents.length > 0 ? (
                                displayedEvents.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Typography variant='subtitle1' className='font-medium'>{item.heading}</Typography>
                                            <Typography variant='caption' color='text.secondary'>ID: {item.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={item.category} size='small' color='primary' variant='outlined' />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2'>{item.location}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.status || 'Draft'}
                                                size='small'
                                                color={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.eventDate ? new Date(item.eventDate).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <div className='flex justify-end gap-2'>
                                                <Tooltip title='Edit'>
                                                    <IconButton color='primary' size='small' onClick={() => handleEdit(item)}>
                                                        <i className='ri-pencil-line' />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Delete'>
                                                    <IconButton color='error' size='small' onClick={() => handleDelete(item.id)}>
                                                        <i className='ri-delete-bin-line' />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} align='center'>
                                        <Typography className='p-5'>No events found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredEvents.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>

            <AddCategoryDrawer
                open={categoryDrawerOpen}
                handleClose={() => setCategoryDrawerOpen(false)}
            />

            <Drawer
                open={eventDrawerOpen}
                anchor='right'
                onClose={handleEventDrawerClose}
                ModalProps={{ keepMounted: false }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '800px', lg: '1000px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>{selectedEvent ? 'Edit Event' : 'Add Event'}</Typography>
                    <IconButton size='small' onClick={handleEventDrawerClose}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <EventsEditor
                        isDrawer={true}
                        handleClose={handleEventDrawerClose}
                        onSuccess={handleEventSuccess}
                        dataToEdit={selectedEvent}
                    />
                </div>
            </Drawer>
        </Card>
    )
}

export default EventsList
