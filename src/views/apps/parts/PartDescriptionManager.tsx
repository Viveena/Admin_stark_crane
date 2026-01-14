'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import IconButton from '@mui/material/IconButton'
import Paper from '@mui/material/Paper'

// Local Imports
import PartDescriptionEditor, { PartDescriptionType } from './PartDescriptionEditor'

const PartDescriptionManager = () => {
    // State
    const [partsList, setPartsList] = useState<PartDescriptionType[]>([])
    const [view, setView] = useState<'list' | 'editor'>('list')
    const [editingPart, setEditingPart] = useState<PartDescriptionType | undefined>(undefined)

    // Load parts from localStorage
    useEffect(() => {
        const savedParts = localStorage.getItem('part-descriptions')
        if (savedParts) {
            setPartsList(JSON.parse(savedParts))
        }
    }, [])

    const handleSavePart = (data: PartDescriptionType) => {
        let updatedList = [...partsList]
        if (data.id) {
            // Update existing
            updatedList = updatedList.map(part => part.id === data.id ? { ...data, updatedAt: new Date().toISOString() } : part)
        } else {
            // Add new
            const newPart = { ...data, id: Date.now().toString(), updatedAt: new Date().toISOString() }
            updatedList.push(newPart)
        }

        setPartsList(updatedList)
        localStorage.setItem('part-descriptions', JSON.stringify(updatedList))
        setView('list')
        setEditingPart(undefined)
    }

    const handleDeletePart = (id: string) => {
        if (confirm('Are you sure you want to delete this part?')) {
            const updatedList = partsList.filter(part => part.id !== id)
            setPartsList(updatedList)
            localStorage.setItem('part-descriptions', JSON.stringify(updatedList))
        }
    }

    const handleEditPart = (part: PartDescriptionType) => {
        setEditingPart(part)
        setView('editor')
    }

    const handleAddNew = () => {
        setEditingPart(undefined)
        setView('editor')
    }

    const handleCancel = () => {
        setView('list')
        setEditingPart(undefined)
    }

    if (view === 'editor') {
        return (
            <PartDescriptionEditor
                dataToEdit={editingPart}
                onSave={handleSavePart}
                onCancel={handleCancel}
            />
        )
    }

    return (
        <Card>
            <CardHeader
                title='Parts Library'
                action={
                    <Button variant='contained' startIcon={<i className='ri-add-line' />} onClick={handleAddNew}>
                        Add New Part
                    </Button>
                }
            />
            <CardContent>
                <TableContainer component={Paper} className='shadow-none border'>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Part Name</TableCell>
                                <TableCell>Brand</TableCell>
                                <TableCell>Last Updated</TableCell>
                                <TableCell align='right'>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {partsList.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align='center' className='p-8'>
                                        <Typography color='text.secondary'>No parts found. Add one to get started.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                partsList.map(part => (
                                    <TableRow key={part.id}>
                                        <TableCell>
                                            <Typography variant='subtitle2'>{part.partName}</Typography>
                                        </TableCell>
                                        <TableCell>{part.partBrand}</TableCell>
                                        <TableCell>{part.updatedAt ? new Date(part.updatedAt).toLocaleDateString() : 'N/A'}</TableCell>
                                        <TableCell align='right'>
                                            <IconButton size='small' color='primary' onClick={() => handleEditPart(part)}>
                                                <i className='ri-pencil-line' />
                                            </IconButton>
                                            <IconButton size='small' color='error' onClick={() => handleDeletePart(part.id)}>
                                                <i className='ri-delete-bin-line' />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </CardContent>
        </Card>
    )
}

export default PartDescriptionManager
