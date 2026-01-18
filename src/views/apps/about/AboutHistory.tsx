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
import Chip from '@mui/material/Chip'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

// Component Imports
import HistoryDrawer from './HistoryDrawer'
import usePermission from '@/hooks/usePermission'
import { usePageSection } from '@/hooks/usePageSection'

type HistoryItem = {
    heading: string
    text: string
    link: string
    image?: any
}

const AboutHistory = () => {
    // Hook Integration
    const { data: sectionData, loading, error, meta, saveSection } = usePageSection({
        pageKey: 'about',
        sectionKey: 'history'
    });

    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)
    const { canCreate } = usePermission('about-us')
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');

    // Load data
    useEffect(() => {
        if (sectionData && sectionData.historyValues) {
            setHistoryItems(sectionData.historyValues || [])
        }
    }, [sectionData])

    const handleSaveToApi = async (currentItems: HistoryItem[]) => {
        setIsSaving(true);
        setSaveStatus('idle');
        try {
            await saveSection({ historyValues: currentItems });
            setSaveStatus('success');
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error(error);
            setSaveStatus('error');
        } finally {
            setIsSaving(false);
        }
    }

    const handleManualSave = () => {
        handleSaveToApi(historyItems);
    }

    const handleDelete = (index: number) => {
        const newItems = historyItems.filter((_, i) => i !== index)
        setHistoryItems(newItems)
    }

    const handleDrawerSave = (data: any) => {
        const newItem: HistoryItem = {
            heading: data.heading,
            text: data.text,
            link: data.link
        }

        let newItems = [...historyItems]
        if (editingIndex !== null) {
            newItems[editingIndex] = newItem
        } else {
            newItems.push(newItem)
        }

        setHistoryItems(newItems)
        setDrawerOpen(false)
    }

    const handleAdd = () => {
        setEditingIndex(null)
        setDrawerOpen(true)
    }

    const handleEdit = (index: number) => {
        setEditingIndex(index)
        setDrawerOpen(true)
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='History & Business Vertical'
                    subheader={meta?.updated_by_name ? `Last updated by ${meta.updated_by_name} on ${new Date(meta.updated_at).toLocaleString()}` : ''}
                    action={
                        <div className="flex items-center gap-2">
                            {saveStatus === 'success' && <Typography color="success.main" variant="body2">Saved!</Typography>}
                            {saveStatus === 'error' && <Typography color="error.main" variant="body2">Error!</Typography>}
                            {canCreate && (
                                <>
                                    <Button
                                        variant='outlined'
                                        onClick={handleAdd}
                                        disabled={historyItems.length >= 4}
                                        startIcon={<i className="ri-add-line" />}
                                    >
                                        Add Item
                                    </Button>
                                    <Button
                                        variant='contained'
                                        onClick={handleManualSave}
                                        disabled={loading || isSaving}
                                        startIcon={isSaving ? <CircularProgress size={20} color="inherit" /> : null}
                                    >
                                        Save List
                                    </Button>
                                </>
                            )}
                        </div>
                    }
                />
                <Divider />
                <CardContent>
                    {loading && <div className="mb-4"><CircularProgress size={20} /> Loading data...</div>}
                    {error && <Alert severity="error" className="mb-4">{error}</Alert>}

                    {historyItems.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Heading</TableCell>
                                        <TableCell>Text</TableCell>
                                        <TableCell>Link</TableCell>
                                        <TableCell align="right">Actions (Local)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {historyItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Typography variant="subtitle2">{item.heading}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="max-w-xs truncate">
                                                    {item.text}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {item.link ? (
                                                    <Chip label="Link" size="small" variant="outlined" component="a" href={item.link} target="_blank" clickable />
                                                ) : '-'}
                                            </TableCell>
                                            <TableCell align="right">
                                                <IconButton size="small" onClick={() => handleEdit(index)} color="primary">
                                                    <i className="ri-pencil-line" />
                                                </IconButton>
                                                <IconButton size="small" onClick={() => handleDelete(index)} color="error">
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
                                No history or business items added yet.
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            <HistoryDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? historyItems[editingIndex] : undefined}
            />
        </>
    )
}

export default AboutHistory
