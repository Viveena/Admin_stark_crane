import { useEffect, useState } from 'react'

type PermissionType = {
    read: boolean
    create: boolean
}

type UserPermissionsType = {
    [key: string]: PermissionType
}

export const usePermission = (pageKey: string) => {
    const [canCreate, setCanCreate] = useState<boolean>(false)
    const [canRead, setCanRead] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        // Check for Super Admin or Admin role first
        const userRole = localStorage.getItem('userRole')
        if (userRole === 'SUPER_ADMIN' || userRole === 'ADMIN') {
            setCanCreate(true)
            setCanRead(true)
            setIsLoading(false)
            return
        }

        // Check granular permissions for User role
        const storedPermissions = localStorage.getItem('userPermissions')
        if (storedPermissions) {
            try {
                const permissions: UserPermissionsType = JSON.parse(storedPermissions)
                // Slugify pageKey to ensure match
                const slug = pageKey.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '')

                const pagePermission = permissions[slug]

                setCanRead(pagePermission?.read || false)
                setCanCreate(pagePermission?.create || false)
            } catch (error) {
                console.error('Error parsing permissions:', error)
            }
        }
        setIsLoading(false)
    }, [pageKey])

    return { canCreate, canRead, isLoading }
}

export default usePermission
