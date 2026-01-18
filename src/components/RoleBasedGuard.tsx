'use client'

// React Imports
import { useEffect, useState } from 'react'

// Next Imports
import { usePathname, useRouter, useParams } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'

const RoleBasedGuard = () => {
    // Hooks
    const router = useRouter()
    const pathname = usePathname()
    const { lang: locale } = useParams()

    // State
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    useEffect(() => {
        if (!mounted) return

        const userRole = localStorage.getItem('userRole')
        const isAdmin = userRole === 'SUPER_ADMIN' || userRole === 'ADMIN'

        // Restricted Paths
        // We check if the current path includes these segments
        const isRestricted =
            pathname.includes('/dashboards') ||
            pathname.includes('/apps/user') ||
            pathname.includes('/apps/roles') ||
            pathname.includes('/apps/permissions')

        if (!isAdmin && isRestricted) {
            // Redirect to a safe page
            // Ideally this should be dynamic based on what they CAN see, but per requirements:
            // "Redirected to an allowed page"
            // We'll try /apps/home or /pages/user-profile
            // For now, let's default to /apps/home as a likely custom page, or fallback to user-profile
            const homePage = `/${locale}/apps/home`
            router.replace(homePage)
        }
    }, [pathname, mounted, router, locale])

    return null
}

export default RoleBasedGuard
