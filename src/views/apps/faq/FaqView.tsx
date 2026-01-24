'use client'

// MUI Imports
import Grid from '@mui/material/Grid2'

// Component Imports
import FaqListTable from '@/views/apps/faq/FaqListTable'
import FaqCard from '@/views/apps/faq/FaqCard'
import { usePageSection } from '@/hooks/usePageSection'
import { useEffect, useState } from 'react'
import type { FaqType } from '@/types/apps/ecommerceTypes'

const FaqView = ({ initialData }: { initialData?: FaqType[] }) => {
    // Hooks
    const { data: sectionData, loading, saveSection } = usePageSection({
        pageKey: 'faq',
        sectionKey: 'list'
    });

    const [data, setData] = useState<FaqType[]>(initialData || [])

    // Sync with DB data when loaded
    useEffect(() => {
        if (sectionData && sectionData.faqs) {
            setData(sectionData.faqs)
        }
    }, [sectionData])

    // Handler to save data back to DB
    const handleSave = async (newData: any) => {
        // Optimistic update
        if (newData.faqs) {
            setData(newData.faqs)
        }
        await saveSection(newData)
    }

    return (
        <Grid container spacing={6}>
            <Grid size={{ xs: 12 }}>
                <FaqCard totalFaqs={data.length} />
            </Grid>
            <Grid size={{ xs: 12 }}>
                <FaqListTable
                    data={data}
                    saveSection={handleSave}
                />
            </Grid>
        </Grid>
    )
}

export default FaqView
