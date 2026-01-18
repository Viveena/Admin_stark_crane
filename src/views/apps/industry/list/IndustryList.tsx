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
import type { IndustryType } from '../IndustryEditor'

// Component Imports
import IndustryEditor from '../IndustryEditor'
import IndustryLandingSettings from '../IndustryLandingSettings'

// Hook Imports
import { usePageSection } from '@/hooks/usePageSection'

const IndustryList = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'industry',
        sectionKey: 'items'
    });

    // States
    const [data, setData] = useState<IndustryType[]>([])
    const [filteredData, setFilteredData] = useState<IndustryType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Drawer States
    const [editorOpen, setEditorOpen] = useState(false)
    const [landingOpen, setLandingOpen] = useState(false)
    const [editingNode, setEditingNode] = useState<IndustryType | undefined>(undefined)

    // Sync data from hook to local state
    useEffect(() => {
        if (sectionData && Array.isArray(sectionData.items)) {
            setData(sectionData.items);
            setFilteredData(sectionData.items);
        } else if (sectionData) {
            // Fallback if data structure is just the array directly or different
            // Check if sectionData itself is the array (legacy support or flat structure)
            if (Array.isArray(sectionData)) {
                setData(sectionData);
                setFilteredData(sectionData);
            } else {
                setData([]);
                setFilteredData([]);
            }
        }
    }, [sectionData])

    // Filter
    useEffect(() => {
        const result = data.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
        setFilteredData(result)
        setPage(0)
    }, [searchTerm, data])

    // Pagination
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

    const handleEdit = (item: IndustryType) => {
        setEditingNode(item)
        setEditorOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this industry?')) {
            const newData = data.filter(item => item.id !== id)
            setData(newData); // Optimistic update
            try {
                // We wrap the list in an object key 'items' to be consistent with usePageSection expects object usually
                await saveSection({ items: newData });
            } catch (e) {
                console.error("Delete failed", e);
                // Revert or show error could happen here
            }
        }
    }

    const handleEditorSave = async (itemData: IndustryType) => {
        let newData;
        if (editingNode) {
            // Update existing
            newData = data.map(item => item.id === itemData.id ? itemData : item);
        } else {
            // Add new
            newData = [...data, itemData];
        }

        // Optimistic update
        setData(newData);
        setEditorOpen(false);

        // API Save
        await saveSection({ items: newData });
    }

    return (
        <Card>
            <CardHeader
                title='Industry'
                action={
                    <div className='flex gap-4 items-center'>
                        {loading && <CircularProgress size={20} />}
                        <TextField
                            size='small'
                            placeholder='Search Industry'
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
                        <Button variant='outlined' onClick={() => setLandingOpen(true)}>
                            Page Config
                        </Button>
                        <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddNew}>
                            Add Industry
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
                            <TableCell>Slug</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={3} align='center'>
                                    <Typography>No industries found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <TableRow key={row.id}>
                                        <TableCell>
                                            <div className='flex flex-col'>
                                                <Typography variant='body1' className='font-medium'>{row.title}</Typography>
                                                {row.heroImage && <Typography variant='caption' color='textSecondary'>{row.heroImage}</Typography>}
                                            </div>
                                        </TableCell>
                                        <TableCell>{row.slug}</TableCell>
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

            {/* Editor Drawer */}
            <Drawer
                open={editorOpen}
                anchor='right'
                onClose={() => setEditorOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '700px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>{editingNode ? 'Edit Industry' : 'Add New Industry'}</Typography>
                    <IconButton size='small' onClick={() => setEditorOpen(false)}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <IndustryEditor
                        isDrawer
                        handleClose={() => setEditorOpen(false)}
                        onSave={handleEditorSave}
                        dataToEdit={editingNode}
                    />
                </div>
            </Drawer>

            {/* Landing Settings Drawer */}
            <Drawer
                open={landingOpen}
                anchor='right'
                onClose={() => setLandingOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '800px', lg: '1000px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>Configure Landing Page</Typography>
                    <IconButton size='small' onClick={() => setLandingOpen(false)}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <IndustryLandingSettings handleClose={() => setLandingOpen(false)} />
                </div>
            </Drawer>

        </Card>
    )
}

export default IndustryList
