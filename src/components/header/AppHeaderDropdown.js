import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CModal,
  CModalBody,
  CModalFooter,
  CButton,
} from '@coreui/react'
import {
  cilAccountLogout,
  cilContact,
  cilSettings,
  cilUser,
} from '@coreui/icons'
import { getCookie, setCookie } from '../../helpers/sessionCookie'
import CIcon from '@coreui/icons-react'
import i18n from '../../helpers/i18n'

const AppHeaderDropdown = () => {

  const [modalContact, setModalContact] = useState(false)
  const [clientSettingPermission, setClientSettingPermission] = useState(false)
  const [userSettingPermission, setUserSettingPermission] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    userPermissions()
  }, []);
 
  const userPermissions = () => {
    const functionalities = JSON.parse(getCookie('functionalities'));
    if(functionalities.indexOf('/client/settings') > -1){
      setClientSettingPermission(true)
    }
    if(functionalities.indexOf('/user/settings') > -1){
      setUserSettingPermission(true)
    }
  }

  return (
    <>
    <CDropdown variant="nav-item" className="btn btn-light px-0" >
      <CDropdownToggle placement="bottom-end" className="py-0 px-3" caret={false}>
        <CIcon icon={cilUser} className="me-2" />
        {getCookie('name')}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 mt-2" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">{i18n.t('Settings')}</CDropdownHeader>
        { userSettingPermission &&
          <CDropdownItem  onClick={() => navigate("/user/settings")}>
            <CIcon icon={cilUser} className="me-2" />
            {i18n.t('Profile')}
          </CDropdownItem>
        }
        { clientSettingPermission &&
          <CDropdownItem onClick={() => navigate("/client/settings")}>
            <CIcon icon={cilSettings} className="me-2" />
            {i18n.t('Settings')}
          </CDropdownItem>
        }
        <CDropdownDivider />
        <CDropdownItem onClick={() => setModalContact(true)}>
          <CIcon icon={cilContact} className="me-2" />
          {i18n.t('Contact us')}
        </CDropdownItem>
        <CDropdownDivider />
        <CDropdownItem onClick={(ev) => { setCookie('name', ''); ev.preventDefault(); ev.stopPropagation(); window.location.reload(); return false;  }}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          {i18n.t('Logout')}
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>

    <CModal
      visible={modalContact}
      onClose={() => setModalContact(false)}
      size='sm'
      >
      <CModalBody>
        Contact us at <a href='mailto:support@renovus.tech'>support@renovus.tech</a>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={() => setModalContact(false)}>{i18n.t('Close')}</CButton>
      </CModalFooter>
    </CModal>
    </>
  )
}

export default AppHeaderDropdown
