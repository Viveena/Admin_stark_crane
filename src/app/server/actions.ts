/**
 * ! The server actions below are used to fetch the static data from the fake-db. If you're using an ORM
 * ! (Object-Relational Mapping) or a database, you can swap the code below with your own database queries.
 */

'use server'

// Data Imports
import { db as eCommerceData } from '@/fake-db/apps/ecommerce'
import { db as academyData } from '@/fake-db/apps/academy'
import { db as vehicleData } from '@/fake-db/apps/logistics'
import { db as invoiceData } from '@/fake-db/apps/invoice'
import { db as userData } from '@/fake-db/apps/userList'
import { db as permissionData } from '@/fake-db/apps/permissions'
import { db as profileData } from '@/fake-db/pages/userProfile'
import { db as faqData } from '@/fake-db/pages/faq'
import { db as pricingData } from '@/fake-db/pages/pricing'
import { db as statisticsData } from '@/fake-db/pages/widgetExamples'

export const getEcommerceData = async () => {
  return eCommerceData
}

export const getAcademyData = async () => {
  return academyData
}

export const getLogisticsData = async () => {
  return vehicleData
}

export const getInvoiceData = async () => {
  return invoiceData
}

export const getUserData = async () => {
  return userData
}

export const getPermissionsData = async () => {
  return permissionData
}

export const getProfileData = async () => {
  return profileData
}

export const getFaqData = async () => {
  return faqData
}

export const getPricingData = async () => {
  return pricingData
}

export const getStatisticsData = async () => {
  return statisticsData
}

import { db as termsData } from '@/fake-db/apps/terms'

export const getTermsData = async () => {
  return termsData
}

export const getUser = async (id: number | string) => {
  const token = '' // Server side might not have token in localStorage. 
  // If this action runs on server, we should use headers() to forward cookie or rely on internal API.
  // For now, assuming public or using generic fetch. 
  // BETTER: Call DB directly if this is a server action? 
  // The user rules say: "The server actions below are used to fetch the static data... swap with your own database queries."

  // Im calling the local API.
  const url = `${process.env.API_URL || 'http://localhost:5000'}/api/users/${id}`
  console.log(`[actions.ts] Fetching user from: ${url}`)

  try {
    const res = await fetch(url, {
      cache: 'no-store'
    })

    console.log(`[actions.ts] Response status: ${res.status}`)

    if (!res.ok) {
      console.error(`[actions.ts] Fetch failed`)
      return null
    }

    const data = await res.json()
    console.log(`[actions.ts] Fetched data:`, data)
    return data.user
  } catch (error) {
    console.error(`[actions.ts] Fetch error:`, error)
    return null
  }
}
