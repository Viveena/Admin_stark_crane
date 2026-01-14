'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

// Third-party Imports
import classnames from 'classnames'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    useReactTable,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef } from '@tanstack/react-table'

// Type Imports
import type { FaqType } from '@/types/apps/ecommerceTypes'

// Component Imports
import FaqDrawer from './FaqDrawer'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

// Column Definitions
const columnHelper = createColumnHelper<FaqType>()

const FaqListTable = ({ faqData }: { faqData?: FaqType[] }) => {
    // States
    const [data, setData] = useState(faqData || [])
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [editData, setEditData] = useState<FaqType | null>(null)
    const [viewData, setViewData] = useState<FaqType | null>(null)
    const [detailsOpen, setDetailsOpen] = useState(false)

    const handleEdit = (faq: FaqType) => {
        setEditData(faq)
        setDrawerOpen(true)
    }

    const handleAdd = () => {
        setEditData(null)
        setDrawerOpen(true)
    }

    const handleView = (faq: FaqType) => {
        setViewData(faq)
        setDetailsOpen(true)
    }

    const handleDelete = (id: number) => {
        setData(data.filter(item => item.id !== id))
    }

    const columns = useMemo<ColumnDef<FaqType, any>[]>(
        () => [
            {
                id: 'serialNumber',
                header: '#',
                cell: ({ row }) => <Typography>{row.index + 1}</Typography>
            },
            columnHelper.accessor('title', {
                header: 'Title',
                cell: ({ row }) => <Typography className='font-medium' color='text.primary'>{row.original.title}</Typography>
            }),
            columnHelper.accessor('description', {
                header: 'Description',
                cell: ({ row }) => {
                    const plainText = row.original.description.replace(/<[^>]+>/g, '')

                    return (
                        <Typography>
                            {plainText.length > 50
                                ? `${plainText.substring(0, 50)}...`
                                : plainText}
                        </Typography>
                    )
                }
            }),
            columnHelper.display({
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => (
                    <div className='flex items-center'>
                        <IconButton size='small' onClick={() => handleView(row.original)} title="View Complete">
                            <i className='ri-eye-line text-[22px] text-textSecondary' />
                        </IconButton>
                        <IconButton size='small' onClick={() => handleEdit(row.original)} title="Edit">
                            <i className='ri-edit-box-line text-[22px] text-textSecondary' />
                        </IconButton>
                        <IconButton size='small' onClick={() => handleDelete(row.original.id)} title="Delete">
                            <i className='ri-delete-bin-line text-[22px] text-error' />
                        </IconButton>
                    </div>
                )
            })
        ],
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [data]
    )

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: 10
            }
        }
    })

    return (
        <>
            <Card>
                <CardHeader
                    title='FAQ List'
                    action={
                        <Button
                            variant='contained'
                            startIcon={<i className='ri-add-line' />}
                            onClick={handleAdd}
                        >
                            Add FAQ
                        </Button>
                    }
                />
                <div className='overflow-x-auto'>
                    <table className={tableStyles.table}>
                        <thead>
                            {table.getHeaderGroups().map(headerGroup => (
                                <tr key={headerGroup.id}>
                                    {headerGroup.headers.map(header => (
                                        <th key={header.id}>
                                            {header.isPlaceholder ? null : (
                                                <div
                                                    className={classnames({
                                                        'flex items-center': header.column.getIsSorted(),
                                                        'cursor-pointer select-none': header.column.getCanSort()
                                                    })}
                                                    onClick={header.column.getToggleSortingHandler()}
                                                >
                                                    {flexRender(header.column.columnDef.header, header.getContext())}
                                                    {{
                                                        asc: <i className='ri-arrow-up-s-line text-xl' />,
                                                        desc: <i className='ri-arrow-down-s-line text-xl' />
                                                    }[header.column.getIsSorted() as 'asc' | 'desc'] ?? null}
                                                </div>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        {table.getRowModel().rows.length === 0 ? (
                            <tbody>
                                <tr>
                                    <td colSpan={table.getVisibleFlatColumns().length} className='text-center'>
                                        No data available
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <tbody>
                                {table
                                    .getRowModel()
                                    .rows.slice(0, table.getState().pagination.pageSize)
                                    .map(row => {
                                        return (
                                            <tr key={row.id}>
                                                {row.getVisibleCells().map(cell => (
                                                    <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                                                ))}
                                            </tr>
                                        )
                                    })}
                            </tbody>
                        )}
                    </table>
                </div>
                <TablePagination
                    rowsPerPageOptions={[10, 25, 50]}
                    component='div'
                    className='border-bs'
                    count={table.getFilteredRowModel().rows.length}
                    rowsPerPage={table.getState().pagination.pageSize}
                    page={table.getState().pagination.pageIndex}
                    onPageChange={(_, page) => {
                        table.setPageIndex(page)
                    }}
                    onRowsPerPageChange={e => table.setPageSize(Number(e.target.value))}
                />
            </Card>

            <FaqDrawer
                open={drawerOpen}
                handleClose={() => setDrawerOpen(false)}
                faqData={editData}
                setData={setData}
                data={data}
            />

            <Dialog
                open={detailsOpen}
                onClose={() => setDetailsOpen(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {viewData?.title}
                </DialogTitle>
                <DialogContent>
                    <div
                        id="alert-dialog-description"
                        dangerouslySetInnerHTML={{ __html: viewData?.description || '' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDetailsOpen(false)} autoFocus>
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default FaqListTable
