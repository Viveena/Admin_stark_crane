'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormGroup from '@mui/material/FormGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'

// Style Imports
import tableStyles from '@core/styles/table.module.css'

type RoleDialogProps = {
  open: boolean
  setOpen: (open: boolean) => void
  title?: string
}

type PageType = {
  id: number
  page_key: string
  title: string
}

type PermissionType = {
  [key: string]: {
    read: boolean
    create: boolean
  }
}

const RoleDialog = ({ open, setOpen, title }: RoleDialogProps) => {
  // States
  const [roleName, setRoleName] = useState('')
  const [pages, setPages] = useState<PageType[]>([])
  const [permissions, setPermissions] = useState<PermissionType>({})
  const [isIndeterminateCheckbox, setIsIndeterminateCheckbox] = useState<boolean>(false)
  const [isSelectAll, setIsSelectAll] = useState<boolean>(false)

  // Fetch pages on mount
  useEffect(() => {
    const fetchPages = async () => {
      try {
        // Adjust API URL if needed, assuming relative path works or use process.env
        const res = await fetch('/api/pages')
        if (res.ok) {
          const data = await res.json()
          setPages(data.pages || [])

          // Initialize permissions state
          const initialPermissions: PermissionType = {}
          data.pages?.forEach((page: PageType) => {
            initialPermissions[page.page_key] = { read: false, create: false }
          })
          setPermissions(initialPermissions)
        }
      } catch (err) {
        console.error('Failed to fetch pages', err)
      }
    }

    if (open) {
      fetchPages()
      if (title) setRoleName(title)
    }
  }, [open, title])

  // Handle Select All
  useEffect(() => {
    if (pages.length === 0) return

    const allRead = pages.every(p => permissions[p.page_key]?.read)
    const allCreate = pages.every(p => permissions[p.page_key]?.create)
    const allSelected = allRead && allCreate

    const someSelected = pages.some(p => permissions[p.page_key]?.read || permissions[p.page_key]?.create)

    setIsSelectAll(allSelected)
    setIsIndeterminateCheckbox(someSelected && !allSelected)
  }, [permissions, pages])


  const handleClose = () => {
    setOpen(false)
    setRoleName('')
    setPermissions({})
  }

  const togglePermission = (pageKey: string, type: 'read' | 'create') => {
    setPermissions(prev => ({
      ...prev,
      [pageKey]: {
        ...prev[pageKey],
        [type]: !prev[pageKey][type]
      }
    }))
  }

  const handleSelectAllCheckbox = () => {
    const newStatus = !isSelectAll
    const newPermissions: PermissionType = {}

    pages.forEach(page => {
      newPermissions[page.page_key] = {
        read: newStatus,
        create: newStatus
      }
    })

    setPermissions(newPermissions)
  }

  const handleSubmit = async () => {
    try {
      const payload = {
        roleName: roleName,
        permissions: pages.map(page => ({
          page_key: page.page_key, // Send page_key (slug)
          read: permissions[page.page_key]?.read || false,
          create: permissions[page.page_key]?.create || false
        }))
      }

      console.log('Submitting role:', payload)

      const res = await fetch('/api/roles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        // Success
        console.log('Role created successfully')
        handleClose()
        // Ideally reload role list here
        window.location.reload()
      } else {
        const errData = await res.json()
        console.error('Error creating role:', errData)
        alert(`Error: ${errData.msg || 'Unknown error'}`)
      }
    } catch (error) {
      console.error('Submission error:', error)
      alert('Failed to submit role')
    }
  }

  return (
    <Dialog fullWidth maxWidth='md' scroll='body' open={open} onClose={handleClose} closeAfterTransition={false}>
      <DialogTitle variant='h4' className='flex flex-col gap-2 text-center sm:pbs-16 sm:pbe-6 sm:pli-16'>
        {title ? 'Edit Role' : 'Add Role'}
        <Typography component='span' className='flex flex-col text-center'>
          Set Role Permissions
        </Typography>
      </DialogTitle>
      <form onSubmit={e => { e.preventDefault(); handleSubmit(); }}>
        <DialogContent className='overflow-visible pbs-0 sm:pbe-6 sm:pli-16'>
          <IconButton onClick={handleClose} className='absolute block-start-4 inline-end-4'>
            <i className='ri-close-line text-textSecondary' />
          </IconButton>
          <TextField
            label='Role Name'
            variant='outlined'
            fullWidth
            placeholder='Enter Role Name'
            value={roleName}
            onChange={e => setRoleName(e.target.value)}
          />
          <Typography variant='h5' className='plb-5 sm:plb-6'>
            Role Permissions
          </Typography>
          <div className='flex flex-col overflow-x-auto'>
            <table className={tableStyles.table}>
              <tbody className='border-be'>
                <tr>
                  <th className='pis-0'>
                    <Typography className='font-medium whitespace-nowrap flex-grow min-is-[225px]' color='text.primary'>
                      Page Permissions
                    </Typography>
                  </th>
                  <th className='!text-end pie-0'>
                    <FormControlLabel
                      className='mie-0 capitalize'
                      control={
                        <Checkbox
                          onChange={handleSelectAllCheckbox}
                          indeterminate={isIndeterminateCheckbox}
                          checked={isSelectAll}
                        />
                      }
                      label='Select All'
                    />
                  </th>
                </tr>
                {pages.map((page, index) => {
                  return (
                    <tr key={page.id || index}>
                      <td className='pis-0'>
                        <Typography
                          className='font-medium whitespace-nowrap flex-grow min-is-[225px]'
                          color='text.primary'
                        >
                          {page.title}
                        </Typography>
                      </td>
                      <td className='!text-end pie-0'>
                        <FormGroup className='flex-row justify-end flex-nowrap gap-6'>
                          <FormControlLabel
                            className='mie-0'
                            control={
                              <Checkbox
                                checked={permissions[page.page_key]?.read || false}
                                onChange={() => togglePermission(page.page_key, 'read')}
                              />
                            }
                            label='Read'
                          />
                          <FormControlLabel
                            className='mie-0'
                            control={
                              <Checkbox
                                checked={permissions[page.page_key]?.create || false}
                                onChange={() => togglePermission(page.page_key, 'create')}
                              />
                            }
                            label='Create'
                          />
                        </FormGroup>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </DialogContent>
        <DialogActions className='justify-center pbs-0 sm:pbe-16 sm:pli-16'>
          <Button variant='contained' type='submit'>
            Submit
          </Button>
          <Button variant='outlined' type='button' color='secondary' onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

export default RoleDialog
