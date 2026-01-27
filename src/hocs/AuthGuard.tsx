'use client'

// React Imports
import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'

// Next Imports
import { useRouter, usePathname } from 'next/navigation'

// Type Imports
import type { Locale } from '@configs/i18n'

export default function AuthGuard({ children, locale }: { children: ReactNode; locale: Locale }) {
    // Hooks
    const router = useRouter()
    const pathname = usePathname()

    // State
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Check for authentication token
        // We assume 'token' is the key used for storing the auth token
        const token = localStorage.getItem('token')

        if (!token) {
            // If unauthenticated, redirect to login page
            // Construct login URL with locale
            const loginUrl = `/${locale}/login`

            // Avoid redirect loops if already on login page (though AuthGuard is likely not used on Login page)
            if (pathname !== loginUrl) {
                router.replace(loginUrl)
            }
            // Keep loading state true while redirecting
        } else {
            // If authenticated, allow access
            setIsLoading(false)
        }
    }, [router, locale, pathname])

    // While checking authentication, render nothing (or a focused loader) to prevent content flash
    if (isLoading) {
        return null
    }

    // Once authenticated, render children
    return <>{children}</>
}
