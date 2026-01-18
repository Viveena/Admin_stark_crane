'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
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
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Type Imports
import type { LocationType } from '../LocationEditor'

// Component Imports
import LocationEditor from '../LocationEditor'

// Hook Imports
import { usePageSection } from '@/hooks/usePageSection'

const LocationList = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'location',
        sectionKey: 'items'
    });

    // States
    const [data, setData] = useState<LocationType[]>([])
    const [filteredData, setFilteredData] = useState<LocationType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [editorOpen, setEditorOpen] = useState(false)
    const [editingNode, setEditingNode] = useState<LocationType | undefined>(undefined)

    // Sync from hook
    useEffect(() => {
        if (sectionData) {
            if (Array.isArray(sectionData.items)) {
                setData(sectionData.items);
                setFilteredData(sectionData.items);
            } else if (Array.isArray(sectionData)) {
                // Fallback / legacy support
                setData(sectionData);
                setFilteredData(sectionData);
            } else {
                setData([]);
                setFilteredData([]);
            }
        }
    }, [sectionData])

    // Filter data based on search term
    useEffect(() => {
        const result = data.filter(item =>
            item.heroTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.contactAddress.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(result)
        setPage(0)
    }, [searchTerm, data])

    // Handle Pagination
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    // Actions
    const handleAddNew = () => {
        setEditingNode(undefined)
        setEditorOpen(true)
    }

    const handleEdit = (item: LocationType) => {
        setEditingNode(item)
        setEditorOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this location?')) {
            const newData = data.filter(item => item.id !== id)
            setData(newData); // Optimistic
            try {
                await saveSection({ items: newData });
            } catch (e) {
                console.error("Failed to delete", e);
            }
        }
    }

    const handleEditorSave = async (itemData: LocationType) => {
        let newData;
        if (editingNode) {
            // Update
            newData = data.map(item => item.id === itemData.id ? itemData : item);
        } else {
            // Add
            newData = [...data, itemData];
        }

        setData(newData);
        setEditorOpen(false);
        await saveSection({ items: newData });
    }

    return (
        <Card>
            <CardHeader
                title='Locations'
                action={
                    <div className='flex gap-4 items-center'>
                        {loading && <CircularProgress size={20} />}
                        <TextField
                            size='small'
                            placeholder='Search Location'
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-search-line' />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddNew}>
                            Add Location
                        </Button>
                    </div>
                }
            />
            {error && <Alert severity='error' className='m-4'>{error}</Alert>}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Address</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align='center'>
                                    <Typography>No locations found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <Typography variant='body1' className='font-medium'>{row.heroTitle}</Typography>
                                                {row.heroImage && <Typography variant='caption' color='textSecondary'>{row.heroImage}</Typography>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{row.contactAddress}</TableCell>
                                        <TableCell>{row.contactPhone}</TableCell>
                                        <TableCell>
                                            <div className='flex gap-2'>
                                                <IconButton size='small' onClick={() => handleEdit(row)}>
                                                    <i className='ri-pencil-line' />
                                                </IconButton>
                                                <IconButton size='small' color='error' onClick={() => handleDelete(row.id)}>
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
                count={filteredData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            <Drawer
                open={editorOpen}
                anchor='right'
                onClose={() => setEditorOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '700px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>{editingNode ? 'Edit Location' : 'Add New Location'}</Typography>
                    <IconButton size='small' onClick={() => setEditorOpen(false)}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <LocationEditor
                        isDrawer
                        handleClose={() => setEditorOpen(false)}
                        onSave={handleEditorSave}
                        dataToEdit={editingNode}
                    />
                </div>
            </Drawer>
        </Card>
    )
}

export default LocationList
