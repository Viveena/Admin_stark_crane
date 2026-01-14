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
import HistoryDrawer from './HistoryDrawer'

type HistoryItem = {
    heading: string
    text: string
    link: string
    image?: any
}

const AboutHistory = () => {
    const [historyItems, setHistoryItems] = useState<HistoryItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('about_history_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            setHistoryItems(parsed.historyValues || [])
        }
    }, [])

    const saveData = (newItems: HistoryItem[]) => {
        setHistoryItems(newItems)
        const dataToSave = { historyValues: newItems }
        localStorage.setItem('about_history_data', JSON.stringify(dataToSave))
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
        const newItems = historyItems.filter((_, i) => i !== index)
        saveData(newItems)
    }

    const handleDrawerSave = (data: any) => {
        const newItem: HistoryItem = {
            heading: data.heading,
            text: data.text,
            link: data.link
            // image omitted
        }

        let newItems = [...historyItems]
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
                    title='History & Business Vertical'
                    action={
                        <Button
                            variant='contained'
                            onClick={handleAdd}
                            disabled={historyItems.length >= 4}
                            startIcon={<i className="ri-add-line" />}
                        >
                            Add New Item
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    {historyItems.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Heading</TableCell>
                                        <TableCell>Text</TableCell>
                                        <TableCell>Link</TableCell>
                                        <TableCell align="right">Actions</TableCell>
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
