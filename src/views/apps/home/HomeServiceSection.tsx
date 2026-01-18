'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import Switch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import TextField from '@mui/material/TextField'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'
import Avatar from '@mui/material/Avatar'

// Third-party Imports
import { useForm, Controller } from 'react-hook-form'

// Component Imports
import HomeServiceDrawer from './HomeServiceDrawer'

// Hook Import
import { usePageSection } from '@/hooks/usePageSection'

type ServiceItem = {
    icon: string
    title: string
    text: string
    image?: string | null // Changed to string for URL
}

const HomeServiceSection = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection, uploadImage, canEdit } = usePageSection({
        pageKey: 'home',
        sectionKey: 'services'
    });

    // Main Form
    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            isVisible: true,
            title: '',
            text: ''
        }
    })

    const [serviceItems, setServiceItems] = useState<ServiceItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const [isSaving, setIsSaving] = useState(false)

    // Load data
    useEffect(() => {
        if (sectionData) {
            reset({
                isVisible: sectionData.isVisible !== undefined ? sectionData.isVisible : true,
                title: sectionData.title || '',
                text: sectionData.text || ''
            })
            setServiceItems(sectionData.serviceItems || [])
        }
    }, [sectionData, reset])

    const saveAllData = async (items: ServiceItem[], formData: any) => {
        setIsSaving(true)
        try {
            const dataToSave = {
                isVisible: formData.isVisible,
                title: formData.title,
                text: formData.text,
                serviceItems: items
            }
            await saveSection(dataToSave)
        } catch (e) {
            console.error("Failed to save service section", e)
        } finally {
            setIsSaving(false)
        }
    }

    const onMainSubmit = (data: any) => {
        saveAllData(serviceItems, data)
    }

    const handleAdd = () => {
        setEditingIndex(null)
        setDrawerOpen(true)
    }

    const handleEdit = (index: number) => {
        setEditingIndex(index)
        setDrawerOpen(true)
    }

    const handleDelete = (index: number) => {
        if (confirm("Are you sure you want to delete this service?")) {
            const newItems = serviceItems.filter((_, i) => i !== index)
            setServiceItems(newItems)
            handleSubmit((data) => saveAllData(newItems, data))()
        }
    }

    const handleDrawerSave = async (data: any) => {
        // Upload image if present
        let imageUrl = editingIndex !== null ? serviceItems[editingIndex].image : null;

        if (data.image instanceof File) {
            try {
                imageUrl = await uploadImage(data.image);
            } catch (e) {
                console.error("Failed to upload image", e);
                alert("Failed to upload image, saving without it.");
            }
        }

        const newItem: ServiceItem = {
            icon: data.icon,
            title: data.title,
            text: data.text,
            image: imageUrl
        }

        let newItems = [...serviceItems]
        if (editingIndex !== null) {
            newItems[editingIndex] = newItem
        } else {
            newItems.push(newItem)
        }

        setServiceItems(newItems)
        setDrawerOpen(false)
        handleSubmit((formData) => saveAllData(newItems, formData))()
    }

    return (
        <>
            <Card>
                <form onSubmit={handleSubmit(onMainSubmit)}>
                    <CardHeader
                        title='Service Section'
                        action={
                            <div className="flex items-center gap-4">
                                {isSaving && <CircularProgress size={20} />}
                                <Controller
                                    name='isVisible'
                                    control={control}
                                    render={({ field }) => (
                                        <FormControlLabel
                                            control={<Switch checked={field.value} onChange={field.onChange} />}
                                            label={field.value ? "Visible" : "Hidden"}
                                        />
                                    )}
                                />
                                <Button variant='contained' type='submit' disabled={isSaving || !canEdit}>
                                    Save
                                </Button>
                            </div>
                        }
                    />
                    <Divider />
                    <CardContent>
                        {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                        <div className="flex flex-col gap-4 mb-6">
                            <Controller
                                name='title'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label='Section Title'
                                        placeholder='Services We Offer'
                                    />
                                )}
                            />
                            <Controller
                                name='text'
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        multiline
                                        rows={2}
                                        label='Section Text'
                                        placeholder='Intro text...'
                                    />
                                )}
                            />
                        </div>

                        <div className="flex justify-between items-center mb-4">
                            <Typography variant="h6">Service Items</Typography>
                            <Button
                                variant='outlined'
                                onClick={handleAdd}
                                startIcon={<i className="ri-add-line" />}
                                disabled={!canEdit}
                            >
                                Add Service
                            </Button>
                        </div>

                        {serviceItems.length > 0 ? (
                            <TableContainer component={Paper} variant="outlined">
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Image</TableCell>
                                            <TableCell>Icon</TableCell>
                                            <TableCell>Title</TableCell>
                                            <TableCell>Text</TableCell>
                                            <TableCell align="right">Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {serviceItems.map((item, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {item.image ? (
                                                        <Avatar src={item.image} variant="rounded" />
                                                    ) : (
                                                        <Avatar variant="rounded">-</Avatar>
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    <i className={item.icon || 'ri-circle-fill'} />
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="subtitle2">{item.title}</Typography>
                                                </TableCell>
                                                <TableCell>
                                                    <Typography variant="body2" className="max-w-xs truncate">
                                                        {item.text}
                                                    </Typography>
                                                </TableCell>
                                                <TableCell align="right">
                                                    <IconButton size="small" onClick={() => handleEdit(index)} color="primary" disabled={!canEdit}>
                                                        <i className="ri-pencil-line" />
                                                    </IconButton>
                                                    <IconButton size="small" onClick={() => handleDelete(index)} color="error" disabled={!canEdit}>
                                                        <i className="ri-delete-bin-line" />
                                                    </IconButton>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        ) : (
                            <div className="text-center p-6 border-dashed border-2 rounded-lg">
                                <Typography variant='body1' color='text.secondary'>
                                    No services added yet.
                                </Typography>
                            </div>
                        )}
                    </CardContent>
                </form>
            </Card>

            <HomeServiceDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? serviceItems[editingIndex] : undefined}
            />
        </>
    )
}

export default HomeServiceSection
