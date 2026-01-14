'use client'

// React Imports
import { useEffect, useMemo, useState } from 'react'

// Next Imports
import Link from 'next/link'
import { useParams } from 'next/navigation'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Button from '@mui/material/Button'
import Chip from '@mui/material/Chip'
import Checkbox from '@mui/material/Checkbox'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import TablePagination from '@mui/material/TablePagination'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import type { TextFieldProps } from '@mui/material/TextField'

// Third-party Imports
import classnames from 'classnames'
import { rankItem } from '@tanstack/match-sorter-utils'
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
  getPaginationRowModel,
  getSortedRowModel
} from '@tanstack/react-table'
import type { ColumnDef, FilterFn } from '@tanstack/react-table'
import type { RankingInfo } from '@tanstack/match-sorter-utils'

// Type Imports
import type { EntryType } from '@/types/apps/ecommerceTypes'

// Component Imports
import EntryTableFilters from './EntryTableFilters'
import EntryDetailsDrawer from './EntryDetailsDrawer'
import ResumePreviewDrawer from './ResumePreviewDrawer'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

declare module '@tanstack/table-core' {
  interface FilterFns {
    fuzzy: FilterFn<unknown>
  }
  interface FilterMeta {
    itemRank: RankingInfo
  }
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
  // Rank the item
  const itemRank = rankItem(row.getValue(columnId), value)

  // Store the itemRank info
  addMeta({
    itemRank
  })

  // Return if the item should be filtered in/out
  return itemRank.passed
}

const DebouncedInput = ({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}: {
  value: string | number
  onChange: (value: string | number) => void
  debounce?: number
} & Omit<TextFieldProps, 'onChange'>) => {
  // States
  const [value, setValue] = useState(initialValue)

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value)
    }, debounce)

    return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value])

  return <TextField {...props} value={value} onChange={e => setValue(e.target.value)} size='small' />
}

// Column Definitions
const columnHelper = createColumnHelper<EntryType>()

const EntryListTable = ({ entryData }: { entryData?: EntryType[] }) => {
  // States
  const [rowSelection, setRowSelection] = useState({})
  const [data, setData] = useState(entryData || [])
  const [filteredData, setFilteredData] = useState(data)
  const [globalFilter, setGlobalFilter] = useState('')
  const [detailsDrawerOpen, setDetailsDrawerOpen] = useState(false)
  const [resumeDrawerOpen, setResumeDrawerOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<EntryType | null>(null)
  const [selectedResume, setSelectedResume] = useState<string | undefined>(undefined)

  // Hooks
  const { lang: locale } = useParams()

  const handleViewDetails = (entry: EntryType) => {
    setSelectedEntry(entry)
    setDetailsDrawerOpen(true)
  }

  const handleViewResume = (resume: string) => {
    setSelectedResume(resume)
    setResumeDrawerOpen(true)
  }

  const columns = useMemo<ColumnDef<EntryType, any>[]>(
    () => [
      {
        id: 'serialNumber',
        header: '#',
        cell: ({ row }) => <Typography>{row.index + 1}</Typography>
      },
      columnHelper.accessor('firstName', {
        header: 'Name',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>
              {row.original.firstName} {row.original.lastName}
            </Typography>
          </div>
        )
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: ({ row }) => <Typography>{row.original.email}</Typography>
      }),
      columnHelper.accessor('phone', {
        header: 'Phone',
        cell: ({ row }) => <Typography>{row.original.phone}</Typography>
      }),
      columnHelper.accessor('jobTitle', {
        header: 'Job Title',
        cell: ({ row }) => (
          <div className='flex flex-col'>
            <Typography className='font-medium' color='text.primary'>{row.original.jobTitle}</Typography>
            <Typography variant='caption'>{row.original.category}</Typography>
          </div>
        )
      }),
      columnHelper.accessor('resume', {
        header: 'Resume',
        cell: ({ row }) => (
          <Typography
            className='cursor-pointer text-primary hover:underline'
            onClick={() => handleViewResume(row.original.resume)}
          >
            {row.original.resume}
          </Typography>
        )
      }),
      columnHelper.accessor('referral', {
        header: 'Referral',
        cell: ({ row }) => <Typography>{row.original.referral}</Typography>
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <IconButton size='small' onClick={() => handleViewDetails(row.original)} title="View Details">
              <i className='ri-eye-line text-[22px] text-textSecondary' />
            </IconButton>
            <IconButton size='small' onClick={() => setData(data.filter(item => item.id !== row.original.id))} title="Delete">
              <i className='ri-delete-bin-line text-[22px] text-error' />
            </IconButton>
          </div>
        ),
        enableSorting: false
      })
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data, filteredData]
  )

  const table = useReactTable({
    data: filteredData as EntryType[],
    columns,
    filterFns: {
      fuzzy: fuzzyFilter
    },
    state: {
      rowSelection,
      globalFilter
    },
    initialState: {
      pagination: {
        pageSize: 10
      }
    },
    enableRowSelection: true,
    globalFilterFn: fuzzyFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    onGlobalFilterChange: setGlobalFilter,
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues()
  })

  return (
    <>
      <Card>
        <CardHeader title='Entries Filters' />
        <EntryTableFilters setData={setFilteredData} entryData={data} />
        <Divider />
        <div className='flex justify-between flex-col items-start sm:flex-row sm:items-center gap-y-4 p-5'>
          <DebouncedInput
            value={globalFilter ?? ''}
            onChange={value => setGlobalFilter(String(value))}
            placeholder='Search Entry'
            className='max-sm:is-full'
          />
          <div className='flex items-center max-sm:flex-col gap-4 max-sm:is-full is-auto'>
            <Button
              color='secondary'
              variant='outlined'
              className='max-sm:is-full is-auto'
              startIcon={<i className='ri-upload-2-line' />}
            >
              Export
            </Button>
          </div>
        </div>
        <div className='overflow-x-auto'>
          <table className={tableStyles.table}>
            <thead>
              {table.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map(header => (
                    <th key={header.id}>
                      {header.isPlaceholder ? null : (
                        <>
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
                        </>
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            {table.getFilteredRowModel().rows.length === 0 ? (
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
                      <tr key={row.id} className={classnames({ selected: row.getIsSelected() })}>
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
      <EntryDetailsDrawer open={detailsDrawerOpen} handleClose={() => setDetailsDrawerOpen(false)} data={selectedEntry} />
      <ResumePreviewDrawer open={resumeDrawerOpen} handleClose={() => setResumeDrawerOpen(false)} fileName={selectedResume} />
    </>
  )
}

export default EntryListTable
