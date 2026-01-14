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

// Component Imports
import MissionDrawer from './MissionDrawer'

type MissionItem = {
    title: string
    description: string
    image?: any // In real app this is a URL string
}

const AboutMission = () => {
    const [missionItems, setMissionItems] = useState<MissionItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('about_mission_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            setMissionItems(parsed.missionValues || [])
        }
    }, [])

    const saveData = (newItems: MissionItem[]) => {
        setMissionItems(newItems)
        const dataToSave = { missionValues: newItems }
        localStorage.setItem('about_mission_data', JSON.stringify(dataToSave))
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
        const newItems = missionItems.filter((_, i) => i !== index)
        saveData(newItems)
    }

    const handleDrawerSave = (data: any) => {
        const newItem: MissionItem = {
            title: data.title,
            description: data.description,
            // image: data.image // Persisting image file obj is not possible in this demo
        }

        let newItems = [...missionItems]
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
                    title='Mission, Vision & Values'
                    action={
                        <Button
                            variant='contained'
                            onClick={handleAdd}
                            disabled={missionItems.length >= 3}
                            startIcon={<i className="ri-add-line" />}
                        >
                            Add New Item
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    {missionItems.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Title</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {missionItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Typography variant="subtitle2">{item.title}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="max-w-xs truncate">
                                                    {item.description}
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
                                No items added yet.
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            <MissionDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? missionItems[editingIndex] : undefined}
            />
        </>
    )
}

export default AboutMission
