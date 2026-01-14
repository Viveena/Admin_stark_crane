'use client'

// React Imports
import { useState, useEffect } from 'react'

// Next Imports
import { useRouter } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import InputAdornment from '@mui/material/InputAdornment'
import TablePagination from '@mui/material/TablePagination'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'

type BlogPost = {
    id: string
    blogTitle: string
    category: string
    mainImage: string
    publishedAt: string
}

// Local Imports
import EditBlogDrawer from './EditBlogDrawer'

const BlogList = () => {
    const [posts, setPosts] = useState<BlogPost[]>([])
    const [searchTerm, setSearchTerm] = useState('')
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    // Edit Drawer State
    const [editDrawerOpen, setEditDrawerOpen] = useState(false)
    const [selectedBlog, setSelectedBlog] = useState<BlogPost | null>(null)

    const router = useRouter()

    const fetchPosts = () => {
        const savedPosts = localStorage.getItem('blog-posts')
        if (savedPosts) {
            setPosts(JSON.parse(savedPosts))
        }
    }

    useEffect(() => {
        fetchPosts()
    }, [])

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this post?')) {
            const updatedPosts = posts.filter(post => post.id !== id)
            setPosts(updatedPosts)
            localStorage.setItem('blog-posts', JSON.stringify(updatedPosts))
        }
    }

    const handleEdit = (blog: BlogPost) => {
        setSelectedBlog(blog)
        setEditDrawerOpen(true)
    }

    const handleCloseDrawer = () => {
        setEditDrawerOpen(false)
        setSelectedBlog(null)
    }

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage)
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    // Filter posts based on search term
    const filteredPosts = posts.filter(post =>
        post.blogTitle.toLowerCase().includes(searchTerm.toLowerCase())
    )

    // Paginate filtered posts
    const displayedPosts = filteredPosts.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    )

    return (
        <Card>
            <CardHeader
                title='Blog Posts List'
                action={
                    <div className='flex gap-4 items-center'>
                        <TextField
                            size='small'
                            placeholder='Search Blogs...'
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
                        <Button
                            variant='contained'
                            startIcon={<i className='ri-add-line' />}
                            onClick={() => router.push('/apps/blog/write')}
                        >
                            Add Blog
                        </Button>
                    </div>
                }
            />
            <TableContainer component={Paper} className='shadow-none border rounded'>
                <Table aria-label='blog posts table'>
                    <TableHead>
                        <TableRow>
                            <TableCell>S.No</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Published Date & Time</TableCell>
                            <TableCell align='right'>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedPosts.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} align='center'>
                                    {searchTerm ? 'No blogs match your search' : 'No blog posts found'}
                                </TableCell>
                            </TableRow>
                        ) : (
                            displayedPosts.map((row, index) => (
                                <TableRow key={row.id}>
                                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                                    <TableCell component='th' scope='row'>
                                        <Typography variant='body1' className='font-medium'>{row.blogTitle}</Typography>
                                    </TableCell>
                                    <TableCell>
                                        <Chip label={row.category} size='small' color='primary' variant='tonal' />
                                    </TableCell>
                                    <TableCell>
                                        {new Date(row.publishedAt).toLocaleString()}
                                    </TableCell>
                                    <TableCell align='right'>
                                        <IconButton onClick={() => handleEdit(row)} color='primary' size='small'>
                                            <i className='ri-edit-box-line' />
                                        </IconButton>
                                        <IconButton onClick={() => handleDelete(row.id)} color='error' size='small'>
                                            <i className='ri-delete-bin-7-line' />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))
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

            <EditBlogDrawer
                open={editDrawerOpen}
                handleClose={handleCloseDrawer}
                blogData={selectedBlog}
                onUpdate={fetchPosts}
            />
        </Card>
    )
}

export default BlogList
