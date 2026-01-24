'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import RoleCards from './RoleCards'
import UserListTable from '../user/list/UserListTable'

const Roles = ({ userData }: { userData?: UsersType[] }) => {
  const [data, setData] = useState<UsersType[]>(userData || [])

  // Fetch data on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('token')
        if (!token) return

        const res = await fetch('/api/users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          const responseData = await res.json()
          if (responseData.users) {
            const filteredUsers = responseData.users.filter((user: UsersType) => {
              const userRole = (user.role || '').toString().toUpperCase().trim();
              return !['SUPER_ADMIN', 'ADMIN', 'SUPER ADMIN', 'ADMINISTRATOR', 'ROOT'].includes(userRole);
            });
            setData(filteredUsers)
          }
        }
      } catch (error) {
        console.error('Failed to fetch users', error)
      }
    }
    fetchUsers()
  }, [])

  const handleDeleteUser = async (id: number) => {
    if (confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token')
        const res = await fetch(`/api/users/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (res.ok) {
          setData(current => current.filter(user => user.id !== id))
        } else {
          const errorData = await res.json()
          alert(errorData.msg || 'Failed to delete user')
        }
      } catch (error) {
        console.error('Error deleting user:', error)
        alert('Error deleting user')
      }
    }
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <Typography variant='h4' className='mbe-1'>
          Roles List
        </Typography>
        <Typography>
          A role provided access to predefined menus and features so that depending on assigned role an administrator
          can have access to what he need
        </Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <RoleCards />
      </Grid>
      <Grid size={{ xs: 12 }} className='!pbs-12'>
        <Typography variant='h4' className='mbe-1'>
          Total users with their roles
        </Typography>
        <Typography>Find all of your company&#39;s administrator accounts and their associate roles.</Typography>
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserListTable tableData={data} setData={setData} onDelete={handleDeleteUser} />
      </Grid>
    </Grid>
  )
}

export default Roles
