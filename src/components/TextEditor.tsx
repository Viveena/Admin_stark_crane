'use client'

// React Imports
import { useEffect } from 'react'

// MUI Imports
import { useTheme } from '@mui/material/styles'

// Third-party Imports
import classnames from 'classnames'
import { useEditor, EditorContent } from '@tiptap/react'
import { StarterKit } from '@tiptap/starter-kit'
import { Underline } from '@tiptap/extension-underline'
import { Placeholder } from '@tiptap/extension-placeholder'
import { TextAlign } from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/core'

// Component Imports
import CustomIconButton from '@core/components/mui/IconButton'

// Style Imports
import '@/libs/styles/tiptapEditor.css'

const EditorToolbar = ({ editor }: { editor: Editor | null }) => {
    if (!editor) {
        return null
    }

    return (
        <div className='flex flex-wrap gap-x-3 gap-y-1 plb-2 pli-4 border-bs border-be'>
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

            {/* Alignment */}
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

            {/* Lists */}
            <CustomIconButton
                {...(editor.isActive('bulletList') && { color: 'primary' })}
                variant='outlined'
                size='small'
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <i className={classnames('ri-list-unordered', { 'text-textSecondary': !editor.isActive('bulletList') })} />
            </CustomIconButton>
            <CustomIconButton
                {...(editor.isActive('orderedList') && { color: 'primary' })}
                variant='outlined'
                size='small'
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
            >
                <i className={classnames('ri-list-ordered', { 'text-textSecondary': !editor.isActive('orderedList') })} />
            </CustomIconButton>
        </div>
    )
}

type Props = {
    value: string
    onChange: (value: string) => void
    label?: string
}

const TextEditor = ({ value, onChange, label }: Props) => {
    // Hooks
    const theme = useTheme()

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: label || 'Write something...'
            }),
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Underline
        ],
        content: value,
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML())
        }
    })

    // Sync value with editor content when value changes externally
    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value)
        }
    }, [value, editor])

    return (
        <div className='border rounded-md overflow-hidden' style={{ borderColor: theme.palette.divider }}>
            <EditorToolbar editor={editor} />
            <EditorContent editor={editor} className='bs-[200px] overflow-y-auto flex' />
        </div>
    )
}

export default TextEditor
