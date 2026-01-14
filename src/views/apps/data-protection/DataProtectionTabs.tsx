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
import DataProtectionTabsDrawer from './DataProtectionTabsDrawer'

type TabItem = {
    tabName: string
    tabDescription: string
}

const DataProtectionTabs = () => {
    const [tabItems, setTabItems] = useState<TabItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('data_protection_tabs_data')
        if (savedData) {
            const parsed = JSON.parse(savedData)
            setTabItems(parsed.tabValues || [])
        }
    }, [])

    const saveData = (newItems: TabItem[]) => {
        setTabItems(newItems)
        localStorage.setItem('data_protection_tabs_data', JSON.stringify({ tabValues: newItems }))
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
        const newItems = tabItems.filter((_, i) => i !== index)
        saveData(newItems)
    }

    const handleDrawerSave = (data: any) => {
        const newItem: TabItem = {
            tabName: data.tabName,
            tabDescription: data.tabDescription
        }

        let newItems = [...tabItems]
        if (editingIndex !== null) {
            newItems[editingIndex] = newItem
        } else {
            newItems.push(newItem)
        }

        saveData(newItems)
        setDrawerOpen(false)
    }

    // Helper to strip HTML for preview
    const stripHtml = (html: string) => {
        const tmp = document.createElement("DIV");
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || "";
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='Dynamic Policy Tabs'
                    subheader='Manage policy sections like Cookie, Customers, etc.'
                    action={
                        <Button
                            variant='contained'
                            onClick={handleAdd}
                            startIcon={<i className="ri-add-line" />}
                        >
                            Add New Tab
                        </Button>
                    }
                />
                <Divider />
                <CardContent>
                    {tabItems.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Tab Name</TableCell>
                                        <TableCell>Description Preview</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {tabItems.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Typography variant="subtitle2">{item.tabName}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="max-w-xs truncate">
                                                    {item.tabDescription ? stripHtml(item.tabDescription).substring(0, 50) + '...' : '-'}
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
                                No tabs added yet.
                            </Typography>
                        </div>
                    )}
                </CardContent>
            </Card>

            <DataProtectionTabsDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? tabItems[editingIndex] : undefined}
            />
        </>
    )
}

export default DataProtectionTabs
