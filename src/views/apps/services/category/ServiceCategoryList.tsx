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
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Type Imports
import type { ServiceCategoryType } from './ServiceCategoryEditor'

// Component Imports
import ServiceCategoryEditor from './ServiceCategoryEditor'
import ServicePageEditor, { ServiceItemType } from '../service/ServicePageEditor'
import ServiceMappingDialog from './ServiceMappingDialog'
import ServiceListDialog from './ServiceListDialog'
import { number } from 'valibot'

// Local Imports
import { usePageSection } from '@/hooks/usePageSection'

// Row Component
type RowProps = {
    row: ServiceCategoryType
    serviceCount: number
    handleEdit: (item: ServiceCategoryType) => void
    handleDelete: (id: string) => void
    handleMapServices: (category: ServiceCategoryType) => void
}

const Row = ({
    row,
    serviceCount,
    handleEdit,
    handleDelete,
    handleMapServices
}: RowProps) => {
    return (
        <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
            <TableCell>
                <div className='flex items-center gap-2'>
                    <div>
                        <Typography variant='body1' className='font-medium'>{row.title}</Typography>
                        {row.shortDescription && (
                            <Typography variant='caption' color='text.secondary' className='truncate block max-w-xs'>
                                {row.shortDescription}
                            </Typography>
                        )}
                    </div>
                </div>
            </TableCell>
            <TableCell>
                {row.image && <img src={row.image} alt={row.title} className="h-8 w-8 object-contain" />}
            </TableCell>
            <TableCell>
                <Chip label={`${serviceCount} Services`} size='small' color='primary' variant='outlined' />
            </TableCell>
            <TableCell>
                <div className='flex gap-2'>
                    <IconButton size='small' onClick={() => handleEdit(row)} title="Edit Category">
                        <i className='ri-pencil-line' />
                    </IconButton>
                    <IconButton size='small' color='primary' onClick={() => handleMapServices(row)} title="Map Services">
                        <i className='ri-list-check' />
                    </IconButton>
                    <IconButton size='small' color='error' onClick={() => handleDelete(row.id)} title="Delete Category">
                        <i className='ri-delete-bin-line' />
                    </IconButton>
                </div>
            </TableCell>
        </TableRow>
    )
}

const ServiceCategoryList = () => {
    // Hooks Integration
    const { data: categoriesData, loading: catLoading, error: catError, saveSection: saveCategories } = usePageSection({
        pageKey: 'services',
        sectionKey: 'categories'
    });

    const { data: servicesData, loading: svcLoading, error: svcError, saveSection: saveServices } = usePageSection({
        pageKey: 'services',
        sectionKey: 'items'
    });

    // States
    const [data, setData] = useState<ServiceCategoryType[]>([])
    const [filteredData, setFilteredData] = useState<ServiceCategoryType[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)

    // Service Stats
    const [categoryServiceCounts, setCategoryServiceCounts] = useState<Record<string, number>>({})

    // View State
    const [viewMode, setViewMode] = useState<'list' | 'service-editor'>('list')
    const [serviceToEdit, setServiceToEdit] = useState<ServiceItemType | undefined>(undefined)

    // Modals
    const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryType | undefined>(undefined)

    // Service List Modal
    const [serviceListOpen, setServiceListOpen] = useState(false)

    // Mapping Dialog State
    const [mappingDialogOpen, setMappingDialogOpen] = useState(false)
    const [categoryToMap, setCategoryToMap] = useState<ServiceCategoryType | undefined>(undefined)

    // Drawer States
    const [editorOpen, setEditorOpen] = useState(false)
    const [editingNode, setEditingNode] = useState<ServiceCategoryType | undefined>(undefined)

    useEffect(() => {
        if (categoriesData && categoriesData.categories) {
            setData(categoriesData.categories);
            setFilteredData(categoriesData.categories);
        }
    }, [categoriesData])

    useEffect(() => {
        if (servicesData && servicesData.items) {
            const counts: Record<string, number> = {}
            servicesData.items.forEach((s: ServiceItemType) => {
                if (s.categoryId) {
                    counts[s.categoryId] = (counts[s.categoryId] || 0) + 1
                }
            })
            setCategoryServiceCounts(counts)
        }
    }, [servicesData])

    // Filter
    useEffect(() => {
        if (data) {
            const result = data.filter(item =>
                item.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            setFilteredData(result)
            setPage(0)
        }
    }, [searchTerm, data])

    const handleChangePage = (event: unknown, newPage: number) => setPage(newPage)
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(+event.target.value)
        setPage(0)
    }

    // Actions
    const handleAddNew = () => {
        setEditingNode(undefined)
        setEditorOpen(true)
    }

    const handleCreateService = () => {
        setServiceToEdit(undefined)
        setSelectedCategory(undefined) // Independent service initially
        setViewMode('service-editor')
    }

    const handleEditFromList = (service: ServiceItemType) => {
        setServiceListOpen(false)
        setServiceToEdit(service)
        setSelectedCategory(undefined)
        setViewMode('service-editor')
    }

    const handleEdit = (item: ServiceCategoryType) => {
        setEditingNode(item)
        setEditorOpen(true)
    }

    const handleMapServices = (category: ServiceCategoryType) => {
        setCategoryToMap(category)
        setMappingDialogOpen(true)
    }

    const handleMappingSave = () => {
        // loadData() // Handled by hook
        setMappingDialogOpen(false)
    }

    const handleServiceSave = async (service: ServiceItemType) => {
        const allServices = servicesData?.items || [];
        const otherServices = allServices.filter((s: ServiceItemType) => s.id !== service.id)
        const updatedAllServices = [...otherServices, service]

        await saveServices({ items: updatedAllServices });

        setViewMode('list')
        setServiceToEdit(undefined)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this category?')) {
            const newData = data.filter(cat => cat.id !== id)
            await saveCategories({ categories: newData });
        }
    }

    const handleEditorSuccess = () => {
        // loadData() // Handled by hook
        setEditorOpen(false)
    }

    if (viewMode === 'service-editor') {
        return (
            <ServicePageEditor
                categoryId={serviceToEdit?.categoryId || (selectedCategory?.id || '')}
                dataToEdit={serviceToEdit}
                onSave={handleServiceSave}
                onCancel={() => {
                    setViewMode('list')
                    // if (selectedCategory) setAssignmentModalOpen(true)
                }}
            />
        )
    }

    return (
        <Card>
            <CardHeader
                title='Service Categories'
                action={
                    <div className='flex gap-4 items-center'>
                        <TextField
                            size='small'
                            placeholder='Search Categories'
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
                        <Button variant='outlined' startIcon={<i className='ri-list-check' />} onClick={() => setServiceListOpen(true)}>
                            List of Services
                        </Button>
                        <Button variant='outlined' startIcon={<i className='ri-add-line' />} onClick={handleCreateService}>
                            Create Service
                        </Button>
                        <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddNew}>
                            Add Category
                        </Button>
                    </div>
                }
            />
            {(catLoading || svcLoading) && <div className="p-4"><CircularProgress size={20} /> Loading...</div>}
            {(catError || svcError) && <Alert severity="error" className="m-4">Error loading data</Alert>}

            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title & Description</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Info</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredData.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align='center'>
                                    <Typography>No categories found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredData
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row) => (
                                    <Row
                                        key={row.id}
                                        row={row}
                                        serviceCount={categoryServiceCounts[row.id] || 0}
                                        handleEdit={handleEdit}
                                        handleDelete={handleDelete}
                                        handleMapServices={handleMapServices}
                                    />
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
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '500px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>
                        {editingNode ? 'Edit Category' : 'Add New Category'}
                    </Typography>
                    <IconButton size='small' onClick={() => setEditorOpen(false)}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <ServiceCategoryEditor
                        isDrawer
                        handleClose={() => setEditorOpen(false)}
                        onSuccess={handleEditorSuccess}
                        dataToEdit={editingNode}
                    />
                </div>
            </Drawer>

            {categoryToMap && (
                <ServiceMappingDialog
                    open={mappingDialogOpen}
                    onClose={() => setMappingDialogOpen(false)}
                    categoryId={categoryToMap.id}
                    onSave={handleMappingSave}
                />
            )}

            <ServiceListDialog
                open={serviceListOpen}
                onClose={() => {
                    setServiceListOpen(false)
                    // loadData() // Refreshed automatically via hook
                }}
                onEdit={handleEditFromList}
            />

        </Card>
    )
}

export default ServiceCategoryList
