'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Chip from '@mui/material/Chip'
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

import NewsEditor, { NewsPost } from '../NewsEditor'
import AddCategoryDrawer from './AddCategoryDrawer'
import usePermission from '@/hooks/usePermission'
import { usePageSection } from '@/hooks/usePageSection'

const NewsList = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'news',
        sectionKey: 'items'
    });

    const [news, setNews] = useState<NewsPost[]>([])
    const [categoryDrawerOpen, setCategoryDrawerOpen] = useState(false)
    const [newsDrawerOpen, setNewsDrawerOpen] = useState(false)
    const [selectedNews, setSelectedNews] = useState<NewsPost | undefined>(undefined)
    const { canCreate } = usePermission('news')

    // Pagination and Search State
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')

    // Sync from hook
    useEffect(() => {
        if (sectionData) {
            if (Array.isArray(sectionData.items)) {
                setNews(sectionData.items);
            } else if (Array.isArray(sectionData)) {
                setNews(sectionData);
            } else {
                setNews([]);
            }
        }
    }, [sectionData])

    const handleEdit = (post: NewsPost) => {
        setSelectedNews(post)
        setNewsDrawerOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this news?')) {
            const updatedNews = news.filter(item => item.id !== id)
            setNews(updatedNews); // Optimistic
            try {
                await saveSection({ items: updatedNews });
            } catch (e) {
                console.error("Failed to delete news", e);
            }
        }
    }

    const handleNewsSave = async (itemData: NewsPost) => {
        let newData;
        if (selectedNews) {
            // Update
            newData = news.map(item => item.id === itemData.id ? itemData : item);
        } else {
            // Add
            newData = [...news, itemData];
        }

        setNews(newData);
        setNewsDrawerOpen(false);
        setSelectedNews(undefined);
        await saveSection({ items: newData });
    }

    const handleNewsSuccess = () => {
        // managed by onSave now generally
        setNewsDrawerOpen(false)
        setSelectedNews(undefined)
    }

    const handleNewsDrawerClose = () => {
        setNewsDrawerOpen(false)
        setSelectedNews(undefined)
    }

    // Pagination Handlers
    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Filter and Pagination Logic
    const filteredNews = news.filter((item) => {
        const term = searchTerm.toLowerCase()
        return (
            item.newsHeadline.toLowerCase().includes(term) ||
            item.category.toLowerCase().includes(term)
        )
    })

    const displayedNews = filteredNews.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Card>
            <CardHeader
                title='News List'
                action={
                    <div className='flex gap-2 items-center'>
                        {loading && <CircularProgress size={20} />}
                        <TextField
                            size='small'
                            placeholder='Search News...'
                            variant='outlined'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position='start'>
                                        <i className='ri-search-line' />
                                    </InputAdornment>
                                )
                            }}
                        />
                        <Button variant='outlined' onClick={() => setCategoryDrawerOpen(true)}>
                            Manage Categories
                        </Button>
                        {canCreate && (
                            <Button variant='contained' onClick={() => { setSelectedNews(undefined); setNewsDrawerOpen(true); }}>
                                Add News
                            </Button>
                        )}
                    </div>
                }
            />
            {error && <Alert severity='error' className='m-4'>{error}</Alert>}

            <CardContent>
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Headline</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Published Date</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedNews.length > 0 ? (
                                displayedNews.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Typography variant='subtitle1' className='font-medium'>{item.newsHeadline}</Typography>
                                            <Typography variant='caption' color='text.secondary'>ID: {item.id}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Chip label={item.category} size='small' color='primary' variant='outlined' />
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={item.status || 'Draft'}
                                                size='small'
                                                color={item.status === 'published' ? 'success' : item.status === 'scheduled' ? 'warning' : 'default'}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            {item.publishedDate ? new Date(item.publishedDate).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell align='right'>
                                            <div className='flex justify-end gap-2'>
                                                <Tooltip title='Edit'>
                                                    <IconButton color='primary' size='small' onClick={() => handleEdit(item)}>
                                                        <i className='ri-pencil-line' />
                                                    </IconButton>
                                                </Tooltip>
                                                <Tooltip title='Delete'>
                                                    <IconButton color='error' size='small' onClick={() => handleDelete(item.id)}>
                                                        <i className='ri-delete-bin-line' />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} align='center'>
                                        <Typography className='p-5'>No news found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredNews.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>

            <AddCategoryDrawer
                open={categoryDrawerOpen}
                handleClose={() => setCategoryDrawerOpen(false)}
            />

            <Drawer
                open={newsDrawerOpen}
                anchor='right'
                onClose={handleNewsDrawerClose}
                ModalProps={{ keepMounted: false }} // Unmount to reset form state completely
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '800px', lg: '1000px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>{selectedNews ? 'Edit News' : 'Add News'}</Typography>
                    <IconButton size='small' onClick={handleNewsDrawerClose}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <NewsEditor
                        isDrawer={true}
                        handleClose={handleNewsDrawerClose}
                        onSave={handleNewsSave}
                        dataToEdit={selectedNews}
                        allNews={news}
                    />
                </div>
            </Drawer>
        </Card>
    )
}

export default NewsList
