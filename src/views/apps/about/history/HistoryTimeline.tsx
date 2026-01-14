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

// Component Imports
import HistoryTimelineDrawer from './HistoryTimelineDrawer'

type TimelineItem = {
    year: string
    title: string
    text: string
    image?: any
}

const HistoryTimeline = () => {
    const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('history_timeline_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            setTimelineItems(parsed.timelineValues || [])
        }
    }, [])

    const saveData = (newItems: TimelineItem[]) => {
        setTimelineItems(newItems)
        localStorage.setItem('history_timeline_data', JSON.stringify({ timelineValues: newItems }))
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
        const newItems = timelineItems.filter((_, i) => i !== index)
        saveData(newItems)
    }

    const handleDrawerSave = (data: any) => {
        const newItem: TimelineItem = {
            year: data.year,
            title: data.title,
            text: data.text
            // image omitted
        }

        let newItems = [...timelineItems]
        if (editingIndex !== null) {
            newItems[editingIndex] = newItem
        } else {
            newItems.push(newItem)
        }

        saveData(newItems)
        setDrawerOpen(false)
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='Timeline History'
                    subheader='Manage timeline items (Year, Title, Text, Image)'
                    action={
                        <Button
                            variant='contained'
                            onClick={handleAdd}
                            startIcon={<i className="ri-add-line" />}
                        >
                            Add New Item
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    {timelineItems.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Year</TableCell>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Text</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {timelineItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Chip label={item.year} color="primary" size="small" variant="outlined" />
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
                                No timeline items added yet.
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            <HistoryTimelineDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? timelineItems[editingIndex] : undefined}
            />
        </>
    )
}

export default HistoryTimeline
