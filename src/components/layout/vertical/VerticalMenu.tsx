// Next Imports
import { useParams } from 'next/navigation'

// MUI Imports
import { useTheme } from '@mui/material/styles'


// Third-party Imports
import PerfectScrollbar from 'react-perfect-scrollbar'

// Type Imports
import type { getDictionary } from '@/utils/getDictionary'
import type { VerticalMenuContextProps } from '@menu/components/vertical-menu/Menu'

// Component Imports
import { Menu, SubMenu, MenuItem, MenuSection } from '@menu/vertical-menu'

// import { GenerateVerticalMenu } from '@components/GenerateMenu'

// Hook Imports
import useVerticalNav from '@menu/hooks/useVerticalNav'

// Styled Component Imports
import StyledVerticalNavExpandIcon from '@menu/styles/vertical/StyledVerticalNavExpandIcon'

// Style Imports
import menuItemStyles from '@core/styles/vertical/menuItemStyles'
import menuSectionStyles from '@core/styles/vertical/menuSectionStyles'

// Menu Data Imports
// import menuData from '@/data/navigation/verticalMenuData'

type RenderExpandIconProps = {
  open?: boolean
  transitionDuration?: VerticalMenuContextProps['transitionDuration']
}

type Props = {
  dictionary: Awaited<ReturnType<typeof getDictionary>>
  scrollMenu: (container: any, isPerfectScrollbar: boolean) => void
}

const RenderExpandIcon = ({ open, transitionDuration }: RenderExpandIconProps) => (
  <StyledVerticalNavExpandIcon open={open} transitionDuration={transitionDuration}>
    <i className='ri-arrow-right-s-line' />
  </StyledVerticalNavExpandIcon>
)

const VerticalMenu = ({ dictionary, scrollMenu }: Props) => {
  // Hooks
  const theme = useTheme()
  const verticalNavOptions = useVerticalNav()
  const params = useParams()

  // Vars
  const { isBreakpointReached, transitionDuration } = verticalNavOptions
  const { lang: locale } = params

  const ScrollWrapper = isBreakpointReached ? 'div' : PerfectScrollbar

  return (
    // eslint-disable-next-line lines-around-comment
    /* Custom scrollbar instead of browser scroll, remove if you want browser scroll only */
    <ScrollWrapper
      {...(isBreakpointReached
        ? {
          className: 'bs-full overflow-y-auto overflow-x-hidden',
          onScroll: container => scrollMenu(container, false)
        }
        : {
          options: { wheelPropagation: false, suppressScrollX: true },
          onScrollY: container => scrollMenu(container, true)
        })}
    >
      {/* Incase you also want to scroll NavHeader to scroll with Vertical Menu, remove NavHeader from above and paste it below this comment */}
      {/* Vertical Menu */}
      <Menu
        popoutMenuOffset={{ mainAxis: 17 }}
        menuItemStyles={menuItemStyles(verticalNavOptions, theme)}
        renderExpandIcon={({ open }) => <RenderExpandIcon open={open} transitionDuration={transitionDuration} />}
        renderExpandedMenuItemIcon={{ icon: <i className='ri-circle-fill' /> }}
        menuSectionStyles={menuSectionStyles(verticalNavOptions, theme)}
      >
        <MenuItem
          href={`/${locale}/dashboards/crm`}
          icon={<i className='ri-home-smile-line' />}
          exactMatch={false}
          activeUrl='/dashboards/crm'
        >
          {dictionary['navigation'].dashboard}
        </MenuItem>


        <MenuSection label={dictionary['navigation'].appsPages}>


          <MenuItem
            href={`/${locale}/apps/user/list`}
            icon={<i className='ri-user-line' />}
            exactMatch={false}
            activeUrl='/apps/user/list'
          >
            {dictionary['navigation'].user}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/roles`}
            icon={<i className='ri-lock-2-line' />}
            exactMatch={false}
            activeUrl='/apps/roles'
          >
            {dictionary['navigation'].roles}
          </MenuItem>


        </MenuSection>
        <MenuSection label={dictionary['navigation'].customPages}>


          <MenuItem
            href={`/${locale}/apps/home`}
            icon={<i className='ri-home-4-line' />}
            exactMatch={false}
          >
            {dictionary['navigation'].homePage}
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/ecommerce/products/list`}
            icon={<i className='ri-box-3-line' />}
            exactMatch={false}
            activeUrl='/apps/ecommerce/products/list'
          >
            {dictionary['navigation'].productss}
          </MenuItem>

          <MenuItem // Service Menu
            href={`/${locale}/apps/services`}
            icon={<i className='ri-briefcase-line' />}
            activeUrl='/apps/services'
          >
            {dictionary['navigation'].service}
          </MenuItem>
          <MenuItem href={`/${locale}/apps/location/list`} icon={<i className='ri-map-pin-line' />}>
            Locations
          </MenuItem>
          <MenuItem href={`/${locale}/apps/industry/list`} icon={<i className='ri-building-4-line' />}>
            Industry
          </MenuItem>
          <MenuItem href={`/${locale}/apps/parts/list`} icon={<i className='ri-box-3-line' />}>
            {dictionary['navigation'].parts}
          </MenuItem>
          <SubMenu label={dictionary['navigation'].blogs} icon={<i className='ri-article-line' />}>
            <MenuItem href={`/${locale}/apps/blog/edit`}>{dictionary['navigation'].edit}</MenuItem>
            <MenuItem href={`/${locale}/apps/blog/create-category`}>{dictionary['navigation'].category}</MenuItem>
            <MenuItem href={`/${locale}/apps/blog/write`}>Write Blog</MenuItem>
            <MenuItem href={`/${locale}/apps/blog/list`}>Blog List</MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/news`}
            icon={<i className='ri-newspaper-line' />}
            exactMatch={false}
            activeUrl='/apps/news'
          >
            News
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/events/list`}
            icon={<i className='ri-calendar-event-line' />}
            exactMatch={false}
            activeUrl='/apps/events/list'
          >
            Events
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/casestudy/list`}
            icon={<i className='ri-file-text-line' />}
            exactMatch={false}
            activeUrl='/apps/casestudy/list'
          >
            Case Study
          </MenuItem>

          <SubMenu label='About Us' icon={<i className='ri-information-line' />}>
            <MenuItem href={`/${locale}/apps/about`}>Overview</MenuItem>
            <MenuItem href={`/${locale}/apps/about/history`}>History</MenuItem>
          </SubMenu>
          <SubMenu label={dictionary['navigation'].career} icon={<i className='ri-box-3-line' />}>
            <MenuItem href={`/${locale}/apps/career/add`}>{dictionary['navigation'].create_career}</MenuItem>
            <MenuItem href={`/${locale}/apps/career/list`}>{dictionary['navigation'].view_career}</MenuItem>
            <MenuItem href={`/${locale}/apps/career/entry`}>{dictionary['navigation'].view_career_form}</MenuItem>
          </SubMenu>
          <MenuItem
            href={`/${locale}/apps/contact`}
            icon={<i className='ri-layout-left-line' />}
            exactMatch={false}
            activeUrl='/apps/contact'
          >
            {dictionary['navigation'].contact}
          </MenuItem>

          <MenuItem
            href={`/${locale}/apps/faq`}
            icon={<i className='ri-question-answer-line' />}
            exactMatch={false}
            activeUrl='/apps/faq'
          >
            FAQ
          </MenuItem>
          <MenuItem
            href={`/${locale}/apps/chat`}
            icon={<i className='ri-wechat-line' />}
            exactMatch={false}
            activeUrl='/apps/chat'
          >
            {dictionary['navigation'].chat}
          </MenuItem>

          <MenuItem
            href={`/${locale}/apps/dashboard`}
            icon={<i className='ri-layout-left-line' />}
            exactMatch={false}
            activeUrl='/apps/dashboard'
          >
            {dictionary['navigation'].craneSelector}
          </MenuItem>



          <SubMenu label={dictionary['navigation'].otherPages} icon={<i className='ri-box-3-line' />}>

            <MenuItem
              href={`/${locale}/apps/data-protection`}
              activeUrl='/apps/data-protection'
            >
              {dictionary['navigation'].dataProtection}
            </MenuItem>
            <MenuItem
              href={`/${locale}/apps/social-links`}
              activeUrl='/apps/social-links'
            >
              Social Links
            </MenuItem>
            <MenuItem
              href={`/${locale}/apps/terms`}
              activeUrl='/apps/terms'
            >
              {dictionary['navigation'].termsandcondition}
            </MenuItem>
            <MenuItem
              href={`/${locale}/apps/seo`}
              activeUrl='/apps/seo'
            >
              SEO
            </MenuItem>

          </SubMenu>


        </MenuSection>

      </Menu>

    </ScrollWrapper >
  )
}

export default VerticalMenu
