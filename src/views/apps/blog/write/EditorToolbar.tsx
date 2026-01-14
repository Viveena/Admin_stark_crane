'use client'

// React Imports
// import { useState } from 'react'

// MUI Imports
// import Box from '@mui/material/Box'
// import ToggleButton from '@mui/material/ToggleButton'
// import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'

// Third-party Imports
import classnames from 'classnames'
import type { Editor } from '@tiptap/core'

// Components Imports
import CustomIconButton from '@core/components/mui/IconButton'

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

export default EditorToolbar
