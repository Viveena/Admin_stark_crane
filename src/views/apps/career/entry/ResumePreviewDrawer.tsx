// MUI Imports
import Drawer from '@mui/material/Drawer'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'

type Props = {
    open: boolean
    handleClose: () => void
    fileName: string | undefined
}

const ResumePreviewDrawer = ({ open, handleClose, fileName }: Props) => {
    if (!fileName) return null

    return (
        <Drawer
            open={open}
            anchor='right'
            variant='temporary'
            onClose={handleClose}
            ModalProps={{ keepMounted: true }}
            sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 500 } } }}
        >
            <div className='flex items-center justify-between pli-5 plb-4'>
                <Typography variant='h5'>Resume Preview</Typography>
                <IconButton size='small' onClick={handleClose}>
                    <i className='ri-close-line text-2xl' />
                </IconButton>
            </div>
            <Divider />
            <div className='p-5 flex flex-col gap-6 h-full'>
                <div className='flex items-center justify-between bg-actionHover p-4 rounded'>
                    <div className='flex items-center gap-3'>
                        <i className='ri-file-text-line text-3xl text-primary' />
                        <div>
                            <Typography variant='subtitle1' className='font-medium'>{fileName}</Typography>
                            <Typography variant='caption'>PDF Document</Typography>
                        </div>
                    </div>

                    <Button
                        variant='contained'
                        startIcon={<i className='ri-download-line' />}
                        href={`#`} // Mock download link
                        download={fileName}
                    >
                        Download
                    </Button>
                </div>

                <div className='flex-grow border rounded bg-backgroundPaper flex items-center justify-center text-textDisabled'>
                    {/* Mock Preview Area */}
                    <div className='text-center'>
                        <i className='ri-file-pdf-line text-6xl mb-2' />
                        <Typography>Preview not available for mock file.</Typography>
                    </div>
                </div>
            </div>
        </Drawer>
    )
}

export default ResumePreviewDrawer
