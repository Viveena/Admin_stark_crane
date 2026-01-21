'use client'

import { useState, useEffect } from 'react'

import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
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
import Avatar from '@mui/material/Avatar'
import CircularProgress from '@mui/material/CircularProgress'
import Alert from '@mui/material/Alert'

import CaseStudyEditor, { CaseStudyPost } from '../CaseStudyEditor'
import CaseStudyLandingSettings from '../CaseStudyLandingSettings'
import usePermission from '@/hooks/usePermission'
import { usePageSection } from '@/hooks/usePageSection'

const CaseStudyList = () => {
    // Hook Integration
    const { data: sectionData, loading, error, saveSection } = usePageSection({
        pageKey: 'case_study',
        sectionKey: 'items'
    });

    const [posts, setPosts] = useState<CaseStudyPost[]>([])
    const [editorOpen, setEditorOpen] = useState(false)
    const [landingOpen, setLandingOpen] = useState(false)
    const [selectedPost, setSelectedPost] = useState<CaseStudyPost | undefined>(undefined)
    const { canCreate } = usePermission('case_study')

    // Pagination and Search State
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(10)
    const [searchTerm, setSearchTerm] = useState('')

    // Sync from hook
    useEffect(() => {
        if (sectionData) {
            if (Array.isArray(sectionData.items)) {
                setPosts(sectionData.items);
            } else if (Array.isArray(sectionData)) {
                setPosts(sectionData);
            } else {
                setPosts([]);
            }
        }
    }, [sectionData])

    const handleEdit = (post: CaseStudyPost) => {
        setSelectedPost(post)
        setEditorOpen(true)
    }

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this case study?')) {
            const updatedPosts = posts.filter(item => item.id !== id)
            setPosts(updatedPosts); // Optimistic
            try {
                await saveSection({ items: updatedPosts });
            } catch (e) {
                console.error("Failed to delete case study", e);
            }
        }
    }

    const handleSave = async (itemData: CaseStudyPost) => {
        let newData;
        if (selectedPost) {
            // Update
            newData = posts.map(item => item.id === itemData.id ? itemData : item);
        } else {
            // Add
            newData = [...posts, itemData];
        }

        setPosts(newData);
        setEditorOpen(false);
        setSelectedPost(undefined);
        await saveSection({ items: newData });
    }

    const handleSuccess = () => {
        // managed by onSave now
        setEditorOpen(false)
        setSelectedPost(undefined)
    }

    const handleClose = () => {
        setEditorOpen(false)
        setSelectedPost(undefined)
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
    const filteredPosts = posts.filter((item) => {
        const term = searchTerm.toLowerCase()
        return (
            item.heading.toLowerCase().includes(term) ||
            (item.slug && item.slug.toLowerCase().includes(term))
        )
    })

    const displayedPosts = filteredPosts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)

    return (
        <Card>
            <CardHeader
                title='Case Studies'
                action={
                    <div className='flex gap-2 items-center'>
                        {loading && <CircularProgress size={20} />}
                        <TextField
                            size='small'
                            placeholder='Search Heading or Slug...'
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
                        <Button variant='outlined' onClick={() => setLandingOpen(true)}>
                            Page Config
                        </Button>
                        {canCreate && (
                            <Button variant='contained' onClick={() => { setSelectedPost(undefined); setEditorOpen(true); }}>
                                Add Case Study
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
                                <TableCell>Hero Image</TableCell>
                                <TableCell>Heading</TableCell>
                                <TableCell>Slug</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {displayedPosts.length > 0 ? (
                                displayedPosts.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Avatar src={item.heroImage} variant='rounded' />
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='subtitle1' className='font-medium'>{item.heading}</Typography>
                                            <Typography variant='body2' color='text.secondary' className='line-clamp-1'>
                                                {item.startSectionShortDescription}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant='body2'>{item.slug}</Typography>
                                        </TableCell>
                                        <TableCell>
                                            {item.updatedAt ? new Date(item.updatedAt).toLocaleDateString() : '-'}
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
                                        <Typography className='p-5'>No case studies found.</Typography>
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={filteredPosts.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </CardContent>

            {/* Editor Drawer */}
            <Drawer
                open={editorOpen}
                anchor='right'
                onClose={handleClose}
                ModalProps={{ keepMounted: false }}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '800px', lg: '1000px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>{selectedPost ? 'Edit Case Study' : 'Add New Case Study'}</Typography>
                    <IconButton size='small' onClick={handleClose}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <CaseStudyEditor
                        isDrawer={true}
                        handleClose={handleClose}
                        onSave={handleSave}
                        dataToEdit={selectedPost}
                    />
                </div>
            </Drawer>

            {/* Landing Settings Drawer */}
            <Drawer
                open={landingOpen}
                anchor='right'
                onClose={() => setLandingOpen(false)}
                sx={{ '& .MuiDrawer-paper': { width: { xs: '100%', md: '800px', lg: '1000px' } } }}
            >
                <div className='flex items-center justify-between pli-5 plb-4 border-b'>
                    <Typography variant='h5'>Configure Landing Page</Typography>
                    <IconButton size='small' onClick={() => setLandingOpen(false)}>
                        <i className='ri-close-line text-2xl' />
                    </IconButton>
                </div>
                <div className='p-5 overflow-y-auto'>
                    <CaseStudyLandingSettings handleClose={() => setLandingOpen(false)} />
                </div>
            </Drawer>
        </Card>
    )
}

export default CaseStudyList
