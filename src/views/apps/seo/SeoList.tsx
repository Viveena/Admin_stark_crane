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
import SeoDrawer from './SeoDrawer'

type SeoItem = {
    page: string
    metaTitle: string
    metaDescription: string
    keywords: string
    ogImage?: any
}

const SeoList = () => {
    const [items, setItems] = useState<SeoItem[]>([])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    // Load data
    useEffect(() => {
        const savedData = localStorage.getItem('seo_data')
        if (savedData) {
            setItems(JSON.parse(savedData))
        }
    }, [])

    const saveData = (newItems: SeoItem[]) => {
        setItems(newItems)
        localStorage.setItem('seo_data', JSON.stringify(newItems))
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

    const handleDrawerSave = (data: any) => {
        const newItem: SeoItem = {
            page: data.page,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            keywords: data.keywords
        }

        let newItems = [...items]
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
                    title='SEO Management'
                    subheader='Manage Meta Tags and Open Graph settings for your pages'
                    action={
                        <Button
                            variant='contained'
                            onClick={handleAdd}
                            startIcon={<i className="ri-add-line" />}
                        >
                            Add Page SEO
                        </Button>
                    }
                />
                <CardContent>
                    {items.length > 0 ? (
                        <TableContainer component={Paper} variant="outlined">
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Page</TableCell>
                                        <TableCell>Meta Title</TableCell>
                                        <TableCell>Description Preview</TableCell>
                                        <TableCell align="right">Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>
                                                <Chip label={item.page} color="primary" variant="outlined" size="small" />
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" fontWeight="medium">{item.metaTitle || '-'}</Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Typography variant="body2" className="max-w-xs truncate" color="text.secondary">
                                                    {item.metaDescription || '-'}
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
                        <div className="text-center p-12 border-dashed border-2 rounded-lg bg-gray-50 dark:bg-gray-800/50">
                            <div className="mb-4 text-gray-400">
                                <i className="ri-search-eye-line text-5xl" />
                            </div>
                            <Typography variant='h6' color='text.secondary'>No SEO configs found</Typography>
                            <Typography variant='body2' color='text.secondary' className='mb-4'>
                                Start adding meta tags for your website pages.
                            </Typography>
                            <Button
                                variant='outlined'
                                onClick={handleAdd}
                                startIcon={<i className="ri-add-line" />}
                            >
                                Configure SEO
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>

            <SeoDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                onSave={handleDrawerSave}
                initialData={editingIndex !== null ? items[editingIndex] : undefined}
            />
        </>
    )
}

export default SeoList
