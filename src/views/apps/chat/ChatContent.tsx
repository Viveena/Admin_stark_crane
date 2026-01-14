// React Imports
import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

// MUI Imports
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import CardContent from '@mui/material/CardContent'

// Type Imports
import type { AppDispatch } from '@/redux-store'
import type { ChatDataType, ContactType } from '@/types/apps/chatTypes'

// Component Imports
import OptionMenu from '@core/components/option-menu'
import AvatarWithBadge from './AvatarWithBadge'
import { statusObj } from './SidebarLeft'
import ChatLog from './ChatLog'
import SendMsgForm from './SendMsgForm'
import UserProfileRight from './UserProfileRight'
import CustomAvatar from '@core/components/mui/Avatar'

type Props = {
  chatStore: ChatDataType
  dispatch: AppDispatch
  backdropOpen: boolean
  setBackdropOpen: (open: boolean) => void
  setSidebarOpen: (open: boolean) => void
  isBelowMdScreen: boolean
  isBelowLgScreen: boolean
  isBelowSmScreen: boolean
  messageInputRef: RefObject<HTMLDivElement>
}

// Renders the user avatar with badge and user information
const UserAvatar = ({
  activeUser,
  setUserProfileLeftOpen,
  setBackdropOpen
}: {
  activeUser: ContactType
  setUserProfileLeftOpen: (open: boolean) => void
  setBackdropOpen: (open: boolean) => void
}) => (
  <div
    className='flex items-center gap-4 cursor-pointer'
    onClick={() => {
      setUserProfileLeftOpen(true)
      setBackdropOpen(true)
    }}
  >
    <AvatarWithBadge
      alt={activeUser?.fullName}
      src={activeUser?.avatar}
      color={activeUser?.avatarColor}
      badgeColor={statusObj[activeUser?.status || 'offline']}
    />
    <div>
      <Typography color='text.primary'>{activeUser?.fullName}</Typography>
      <Typography variant='body2'>{activeUser?.role}</Typography>
    </div>
  </div>
)

const ChatContent = (props: Props) => {
  // Props
  const {
    chatStore,
    dispatch,
    backdropOpen,
    setBackdropOpen,
    setSidebarOpen,
    isBelowMdScreen,
    isBelowSmScreen,
    isBelowLgScreen,
    messageInputRef
  } = props

  const { activeUser } = chatStore

  // States
  const [userProfileRightOpen, setUserProfileRightOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // Close user profile right drawer if backdrop is closed and user profile right drawer is open
  useEffect(() => {
    if (!backdropOpen && userProfileRightOpen) {
      setUserProfileRightOpen(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backdropOpen])

  return !chatStore.activeUser ? (
    <CardContent className='flex flex-col flex-auto items-center justify-center bs-full gap-[18px]'>
      <CustomAvatar variant='circular' size={98} color='primary' skin='light'>
        <i className='ri-wechat-line text-[50px]' />
      </CustomAvatar>
      <Typography className='text-center'>Select a contact to start a conversation.</Typography>
      {isBelowMdScreen && (
        <Button
          variant='contained'
          className='rounded-full'
          onClick={() => {
            setSidebarOpen(true)
            isBelowSmScreen ? setBackdropOpen(false) : setBackdropOpen(true)
          }}
        >
          Select Contact
        </Button>
      )}
    </CardContent>
  ) : (
    <>
      {activeUser && (
        <div className='flex flex-col flex-grow bs-full'>
          <div className='flex items-center justify-between border-be plb-[17px] pli-5 bg-[var(--mui-palette-customColors-chatBg)]'>
            {isBelowMdScreen ? (
              <div className='flex items-center gap-4'>
                <IconButton
                  onClick={() => {
                    setSidebarOpen(true)
                    setBackdropOpen(true)
                  }}
                >
                  <i className='ri-menu-line text-textSecondary text-xl' />
                </IconButton>
                <UserAvatar
                  activeUser={activeUser}
                  setBackdropOpen={setBackdropOpen}
                  setUserProfileLeftOpen={setUserProfileRightOpen}
                />
              </div>
            ) : isSearchOpen ? (
              <div className='flex items-center gap-2 is-full'>
                <IconButton
                  size='small'
                  onClick={() => {
                    setIsSearchOpen(false)
                    setSearchQuery('')
                  }}
                >
                  <i className='ri-close-line text-textSecondary' />
                </IconButton>
                <input
                  type='text'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search...'
                  className='is-full bg-transparent border-0 outline-none text-textPrimary'
                  autoFocus
                />
              </div>
            ) : (
              <UserAvatar
                activeUser={activeUser}
                setBackdropOpen={setBackdropOpen}
                setUserProfileLeftOpen={setUserProfileRightOpen}
              />
            )}
            {isBelowMdScreen ? (
              <div className='flex items-center gap-1'>
                <IconButton size='small' onClick={() => setIsSearchOpen(!isSearchOpen)}>
                  <i className='ri-search-line text-textSecondary' />
                </IconButton>
                <OptionMenu
                  iconClassName='text-textSecondary'
                  options={[
                    'Clear Chat',
                    'Delete Chat'
                  ]}
                />
              </div>
            ) : (
              <div className='flex items-center gap-1'>

                {!isSearchOpen && (
                  <IconButton size='small' onClick={() => setIsSearchOpen(true)}>
                    <i className='ri-search-line text-textSecondary' />
                  </IconButton>
                )}
                <OptionMenu
                  iconClassName='text-textSecondary'
                  options={[

                    'Clear Chat',
                    'Delete Chat'
                  ]}
                />
              </div>
            )}
          </div>

          <ChatLog
            chatStore={chatStore}
            isBelowMdScreen={isBelowMdScreen}
            isBelowSmScreen={isBelowSmScreen}
            isBelowLgScreen={isBelowLgScreen}
            searchQuery={searchQuery}
          />

          <SendMsgForm
            dispatch={dispatch}
            activeUser={activeUser}
            isBelowSmScreen={isBelowSmScreen}
            messageInputRef={messageInputRef}
          />
        </div>
      )}

      {activeUser && (
        <UserProfileRight
          open={userProfileRightOpen}
          handleClose={() => {
            setUserProfileRightOpen(false)
            setBackdropOpen(false)
          }}
          activeUser={activeUser}
          isBelowSmScreen={isBelowSmScreen}
          isBelowLgScreen={isBelowLgScreen}
        />
      )}
    </>
  )
}

export default ChatContent
