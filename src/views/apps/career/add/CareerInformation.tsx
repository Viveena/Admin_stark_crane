'use client'

// MUI Imports
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Style Imports
import '@/libs/styles/tiptapEditor.css'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
  if (!editor) {
    return null
  }

  return (
    <div className='flex flex-wrap gap-x-3 gap-y-1 pbs-5 pbe-4 pli-5'>
      <CustomIconButton
        {...(editor.isActive('bold') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <i className={classnames('ri-bold', { 'text-textSecondary': !editor.isActive('bold') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('underline') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <i className={classnames('ri-underline', { 'text-textSecondary': !editor.isActive('underline') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('italic') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <i className={classnames('ri-italic', { 'text-textSecondary': !editor.isActive('italic') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive('strike') && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <i className={classnames('ri-strikethrough', { 'text-textSecondary': !editor.isActive('strike') })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'left' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
      >
        <i className={classnames('ri-align-left', { 'text-textSecondary': !editor.isActive({ textAlign: 'left' }) })} />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'center' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
      >
        <i
          className={classnames('ri-align-center', {
            'text-textSecondary': !editor.isActive({ textAlign: 'center' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'right' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
      >
        <i
          className={classnames('ri-align-right', {
            'text-textSecondary': !editor.isActive({ textAlign: 'right' })
          })}
        />
      </CustomIconButton>
      <CustomIconButton
        {...(editor.isActive({ textAlign: 'justify' }) && { color: 'primary' })}
        variant='outlined'
        size='small'
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
      >
        <i
          className={classnames('ri-align-justify', {
            'text-textSecondary': !editor.isActive({ textAlign: 'justify' })
          })}
        />
      </CustomIconButton>
    </div>
  )
}

// React Imports
import { useEffect, useState } from 'react'
import type { CareerType } from '@/types/apps/ecommerceTypes'

// ... imports remain the same

const ProductInformation = ({ careerData }: { careerData?: CareerType }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [jobTypes, setJobTypes] = useState<{ id: number; name: string }[]>([])

  const [formData, setFormData] = useState({
    jobTitle: '',
    location: '',
    salary: '',
    category: '',
    jobType: ''
  })

  const loadOptions = () => {
    const savedCategories = localStorage.getItem('career-categories')
    const savedJobTypes = localStorage.getItem('career-job-types')

    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
    if (savedJobTypes) {
      setJobTypes(JSON.parse(savedJobTypes))
    }
  }

  useEffect(() => {
    loadOptions()
  }, [])

  useEffect(() => {
    if (careerData) {
      setFormData({
        jobTitle: careerData.jobTitle,
        location: careerData.location,
        salary: careerData.salary,
        category: careerData.category,
        jobType: careerData.jobType
      })
    }
  }, [careerData])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Write something here...'
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Underline
    ],
    immediatelyRender: false,
    content: `
      <p>
        Keep your account secure with authentication step.
      </p>
    `
  })

  return (
    <Card>
      <CardHeader title='Job Opening Information' />
      <CardContent>
        <Grid container spacing={5} className='mbe-5'>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              label='Job Title'
              placeholder='Job Title'
              value={formData.jobTitle}
              onChange={e => setFormData({ ...formData, jobTitle: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Location'
              placeholder='Location'
              value={formData.location}
              onChange={e => setFormData({ ...formData, location: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label='Salary'
              placeholder='Salary'
              value={formData.salary}
              onChange={e => setFormData({ ...formData, salary: e.target.value })}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id='category-select-label'>Category</InputLabel>
              <Select
                labelId='category-select-label'
                label='Category'
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                onOpen={loadOptions}
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id='job-type-select-label'>Job Type</InputLabel>
              <Select
                labelId='job-type-select-label'
                label='Job Type'
                value={formData.jobType}
                onChange={e => setFormData({ ...formData, jobType: e.target.value })}
                onOpen={loadOptions}
              >
                {jobTypes.map((type) => (
                  <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <Typography className='mbe-1'>Description</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            <EditorToolbar editor={editor} />
            <Divider className='mli-5' />
            <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex ' />
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default ProductInformation
