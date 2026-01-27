'use client'

// React Imports
import { useState, useEffect } from 'react'

// MUI Imports
import Grid from '@mui/material/Grid2'
import CircularProgress from '@mui/material/CircularProgress'

// Component Imports
import UserDetails from './UserDetails'

const UserLeftOverview = ({ userId, userData: initialData }: { userId?: string, userData?: any }) => {
  const [userData, setUserData] = useState(initialData || null)
  const [loading, setLoading] = useState(!initialData)

  useEffect(() => {
    if (initialData) return

    if (userId) {
      const fetchUserData = async () => {
        try {
          const token = localStorage.getItem('token')
          if (!token) {
            setLoading(false)
            return
          }
          const res = await fetch(`/api/users/${userId}`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
          if (res.ok) {
            const data = await res.json()
            setUserData(data.user)
          } else {
            console.error('Failed to fetch user data')
          }
        } catch (e) {
          console.error(e)
        } finally {
          setLoading(false)
        }
      }
      fetchUserData()
    } else {
      setLoading(false)
    }
  }, [userId, initialData])

  if (loading) {
    return <div className="flex justify-center p-5"><CircularProgress /></div>
  }

  return (
    <Grid container spacing={6}>
      <Grid size={{ xs: 12 }}>
        <UserDetails userData={userData} />
      </Grid>
    </Grid>
  )
}

export default UserLeftOverview
