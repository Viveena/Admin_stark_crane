'use client'

// React Imports
import { useEffect, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
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
import SocialLinksDrawer from './SocialLinksDrawer'

type SocialLinkItem = {
    icon: string
    name: string
    url: string
}

const SocialLinksList = () => {
    const [items, setItems] = useState<SocialLinkItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('social_links_data')
        if (savedData) {
            setItems(JSON.parse(savedData))
        }
    }, [])

    const saveData = (newItems: SocialLinkItem[]) => {
        setItems(newItems)
        localStorage.setItem('social_links_data', JSON.stringify(newItems))
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
        const newItems = items.filter((_, i) => i !== index)
        saveData(newItems)
    }

    const handleDrawerSave = (data: SocialLinkItem) => {
        let newItems = [...items]
        if (editingIndex !== null) {
            newItems[editingIndex] = data
        } else {
            newItems.push(data)
        }

        saveData(newItems)
        setDrawerOpen(false)
    }

    return (
        <>
            <Card>
                <CardHeader
                    title='Social Media Links'
                    subheader='Manage your social media profiles'
                    action={
                        <Button
                            variant='contained'
                            onClick={handleAdd}
                            startIcon={<i className="ri-add-line" />}
                        >
                            Add New Link
                        </Button>
                    }
                />
                <CardContent>
                    {items.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Platform</TableCell>
                                        <TableCell>URL</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <div className="flex items-center gap-3">
                                                    <div className="flex items-center justify-center bg-action-hover rounded p-2">
                                                        <i className={`${item.icon} text-xl`} />
                                                    </div>
                                                    <Typography variant="subtitle2">{item.name}</Typography>
                                                </div>
                                            </TableCell>
                                            <TableCell>
                                                <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
                                                    {item.url}
                                                    <i className="ri-external-link-line text-xs" />
                                                </a>
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
                        <div className="text-center p-12 border-dashed border-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="mb-4 text-gray-400">
                                <i className="ri-share-line text-5xl" />
                            </div>
                            <Typography variant='h6' color='text.secondary'>No links added yet</Typography>
                            <Typography variant='body2' color='text.secondary' className='mb-4'>
                                Add your social media profiles to display them on your site.
                            </Typography>
                            <Button
                                variant='outlined'
                                onClick={handleAdd}
                                startIcon={<i className="ri-add-line" />}
                            >
                                Add First Link
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <SocialLinksDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? items[editingIndex] : undefined}
            />
        </>
    )
}

export default SocialLinksList
