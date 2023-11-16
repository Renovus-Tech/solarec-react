import React from 'react'
import {setCookie} from '../helpers/sessionCookie.js'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

const TheHeaderDropdown = () => {
  return (
    <CDropdown
      inNav
      className="c-header-nav-items mx-2"
      direction="down"
    >
      {/* <CDropdownToggle className="c-header-nav-link" caret={false}>
        <div className="c-avatar">
          {false && <CImg
            src={'https://media-exp1.licdn.com/dms/image/C5103AQEL459XCxKAzg/profile-displayphoto-shrink_400_400/0/1516351015629?e=1625702400&v=beta&t=TqaODZsSZm5jAuCl1JSYDwBMgzp1nG2RX2R8s2I4cLY'}
            className="c-avatar-img"
            alt="admin@bootstrapmaster.com"
          />}
        </div>
      </CDropdownToggle> */}
      <CDropdownMenu className="pt-0" placement="bottom-end">

      <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
          onClick={() => { setCookie('name', ''); setCookie('parkType', ''); setCookie('parkName', ''); window.location.reload(); }}
        >
          <a href="#">Logout</a>
        </CDropdownItem>

        {
          false && <><CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Account</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-bell" className="mfe-2" />
          Updates
          <CBadge color="info" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-envelope-open" className="mfe-2" />
          Messages
          <CBadge color="success" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-task" className="mfe-2" />
          Tasks
          <CBadge color="danger" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-comment-square" className="mfe-2" />
          Comments
          <CBadge color="warning" className="mfs-auto">42</CBadge>
        </CDropdownItem>
        <CDropdownItem
          header
          tag="div"
          color="light"
          className="text-center"
        >
          <strong>Settings</strong>
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-user" className="mfe-2" />Profile
        </CDropdownItem>
        <CDropdownItem>
          <CIcon name="cil-settings" className="mfe-2" />
          Settings
        </CDropdownItem>
        <CDropdownItem divider />
        <CDropdownItem>
          <CIcon name="cil-lock-locked" className="mfe-2" />
          Lock Account
        </CDropdownItem></>}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default TheHeaderDropdown
