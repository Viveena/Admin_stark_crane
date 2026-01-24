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
import { useFormContext, Controller } from 'react-hook-form'

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

const CareerInformation = ({ careerData }: { careerData?: CareerType }) => {
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([])
  const [jobTypes, setJobTypes] = useState<{ id: number; name: string }[]>([])
  const [isMounted, setIsMounted] = useState(false)

  const { control, setValue } = useFormContext()

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
    setIsMounted(true)
    loadOptions()
  }, [])

  useEffect(() => {
    if (careerData) {
      setValue('job_title', careerData.jobTitle)
      setValue('location', careerData.location)
      setValue('salary', careerData.salary)
      setValue('category', careerData.category)
      setValue('job_type', careerData.jobType)
      setValue('description', careerData.description || '')
    }
  }, [careerData, setValue])

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
    // content: `
    //   <p>
    //     Keep your account secure with authentication step.
    //   </p>
    // `,
    onUpdate: ({ editor }) => {
      setValue('description', editor.getHTML())
    },
    immediatelyRender: false
  })

  // Sync initial description if editing
  useEffect(() => {
    if (careerData && careerData.description && editor) {
      // editor.commands.setContent(careerData.description) 
      // Need to handle safely to avoid loops or ssr mismatch if possible, but basic setContent works for now
    }
  }, [careerData, editor])

  return (
    <Card>
      <CardHeader title='Job Opening Information' />
      <CardContent>
        <Grid container spacing={5} className='mbe-5'>
          <Grid size={{ xs: 12 }}>
            <Controller
              name='job_title'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Job Title'
                  placeholder='Job Title'
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='location'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Location'
                  placeholder='Location'
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='salary'
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label='Salary'
                  placeholder='Salary'
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='category'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='category-select-label'>Category</InputLabel>
                  <Select
                    {...field}
                    labelId='category-select-label'
                    label='Category'
                    onOpen={loadOptions}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {categories.map((cat) => (
                      <MenuItem key={cat.id} value={cat.name}>{cat.name}</MenuItem>
                    ))}
                    {/* Fallback items if localstorage empty for demo */}
                    {categories.length === 0 && [
                      <MenuItem key="eng" value="Engineering">Engineering</MenuItem>,
                      <MenuItem key="des" value="Design">Design</MenuItem>,
                      <MenuItem key="prod" value="Product">Product</MenuItem>
                    ]}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name='job_type'
              control={control}
              render={({ field }) => (
                <FormControl fullWidth>
                  <InputLabel id='job-type-select-label'>Job Type</InputLabel>
                  <Select
                    {...field}
                    labelId='job-type-select-label'
                    label='Job Type'
                    onOpen={loadOptions}
                  >
                    <MenuItem value=""><em>None</em></MenuItem>
                    {jobTypes.map((type) => (
                      <MenuItem key={type.id} value={type.name}>{type.name}</MenuItem>
                    ))}
                    {jobTypes.length === 0 && [
                      <MenuItem key="ft" value="Full Time">Full Time</MenuItem>,
                      <MenuItem key="pt" value="Part Time">Part Time</MenuItem>,
                      <MenuItem key="ct" value="Contract">Contract</MenuItem>
                    ]}
                  </Select>
                </FormControl>
              )}
            />
          </Grid>
        </Grid>
        <Typography className='mbe-1'>Description</Typography>
        <Card className='p-0 border shadow-none'>
          <CardContent className='p-0'>
            {isMounted ? (
              <>
                <EditorToolbar editor={editor} />
                <Divider className='mli-5' />
                <EditorContent editor={editor} className='bs-[135px] overflow-y-auto flex ' />
              </>
            ) : null}
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  )
}

export default CareerInformation
