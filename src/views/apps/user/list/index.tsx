'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Type Imports
import type { UsersType } from '@/types/apps/userTypes'

// Component Imports
import UserListTable from './UserListTable'
import UserListCards from './UserListCards'

const UserList = ({ userData }: { userData?: UsersType[] }) => {
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
            // Filter out SUPER_ADMIN and ADMIN
            const filteredUsers = responseData.users.filter((user: UsersType) => {
              const roleName = user.role ? user.role.toUpperCase() : ''
              return roleName !== 'SUPER_ADMIN' && roleName !== 'ADMIN'
            })
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
        <UserListCards userData={data} />
      </Grid>
      <Grid size={{ xs: 12 }}>
        <UserListTable tableData={data} setData={setData} onDelete={handleDeleteUser} />
      </Grid>
    </Grid>
  )
}

export default UserList
