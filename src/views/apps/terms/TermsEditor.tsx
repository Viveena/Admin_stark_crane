'use client'

// React Imports
import { useState } from 'react'

// MUI Imports
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import Button from '@mui/material/Button'
import { toast } from 'react-toastify'

// Component Imports
import TextEditor from '@/components/TextEditor'

const TermsEditor = ({ data }: { data: { content: string } }) => {
    // States
    const [content, setContent] = useState(data.content || '')

    const handleSave = () => {
        // In a real app, this would be an API call
        toast.success('Terms and Conditions updated successfully!')
    }

    return (
        <Card>
            <CardHeader title='Terms and Conditions' />
            <CardContent className='flex flex-col gap-4'>
                <TextEditor
                    value={content}
                    onChange={setContent}
                    label='Enter Terms and Conditions'
                />
                <div className='flex justify-end'>
                    <Button variant='contained' onClick={handleSave}>
                        Save Changes
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

export default TermsEditor
