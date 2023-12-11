import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CImage,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { setCookie, getCookie } from '../helpers/sessionCookie.js'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import logo from '../assets/logo-solarec.png'
import DataAPI from '../helpers/DataAPI.js'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const [clients, setClients] = useState([])
  const [clientsLoaded, setClientsLoaded] = useState(false)
  const [parks, setParks] = useState([])
  const [parksLoaded, setParksLoaded] = useState(false)
  const [clientSettingPermission, setClientSettingPermission] = useState(false)
  const [userSettingPermission, setUserSettingPermission] = useState(false)
  const [dashboard, setDashboard] = useState('/overview')

  const location = useLocation()
  const noParkPages = [];

  useEffect(() => {
    userPermissions()
    fetchClients()
    if(!noParkPages.includes(location.pathname))
      fetchParks()
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

  const updateClient = (clientId) => {
    DataAPI({
      'endpoint': `security/authenticate/${clientId}`,
      'method': 'GET'
    }).then(
      response => {
        console.log(response)
        setCookie('client', clientId)
        setCookie('clientName', response.client.name)
        setCookie('location', response.location.id)
        setCookie('parkType', response.location.type)
        setCookie('parkName', response.location.name)
        // let functionalities = [...response.functionalities, {'url':'/modules/power-curve/benchmark'}, {'url':'/modules/power-curve/analysis'}];
        // setCookie('functionalities', JSON.stringify(functionalities.map((f) => f.url)))
        setCookie('functionalities', JSON.stringify(response.functionalities.map((f) => f.url)))
        setCookie('dashboard', response.functionalities[0].url)
        setDashboard(response.functionalities[0].url)
        window.location.reload()
      }
    ).catch(
      response => {
        console.error(response)
      }
    );
  }

  // const updateLocation = (locationId) => {
  //   console.log(`Updating location to: security/authenticate/location/${locationId}`)
  //   DataAPI({
  //     'endpoint': `security/authenticate/location/${locationId}`,
  //     'method': 'GET'
  //   }).then(
  //     response => {
  //       console.log(response)
  //       setCookie('location', locationId)
  //       setCookie('parkType', response.location.type)
  //       setCookie('parkName', response.location.name)
  //       // let functionalities = [...response.functionalities, {'url':'/modules/power-curve/benchmark'}, {'url':'/modules/power-curve/analysis'}];
  //       // setCookie('functionalities', JSON.stringify(functionalities.map((f) => f.url)))
  //       setCookie('functionalities', JSON.stringify(response.functionalities.map((f) => f.url)))
  //       setCookie('dashboard', response.functionalities[0].url)
  //       setDashboard(response.functionalities[0].url)
  //       window.location.reload()
  //     }
  //   ).catch(
  //     response => {
  //       console.error(response)
  //     }
  //   );
  // }

  const fetchClients = () => {
    DataAPI({
      'endpoint': 'security/authenticate',
      'method': 'GET'
    }).then(
      response => {
        if (!clientsLoaded) {
          setClients(response);
          setClientsLoaded(true);
        }
      }
    );
  }

  const fetchParks = () => {

    DataAPI({
      'endpoint': 'security/authenticate/location',
      'method': 'GET'
    }).then(
      response => {
        if (!parksLoaded) {
          setParks(response);
          setParksLoaded(true);
          if( getCookie('parkType') == '')
            setCookie('parkType',response[0].type)
          setCookie('parkName', response[0].name);
        }
      }
    );
  }

  // const toggleSidebar = () => {
  //   const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
  //   dispatch({type: 'set', sidebarShow: val})
  // }

  // const toggleSidebarMobile = () => {
  //   const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
  //   dispatch({type: 'set', sidebarShow: val})
  // }

  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CImage src={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        {/* <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            <CNavLink to="/dashboard" component={NavLink}>
              Dashboard
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}

        {/* <CHeaderNav>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilBell} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilList} size="lg" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink href="#">
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav> */}

        <CHeaderNav className="px-md-3">

          <CFormSelect value={getCookie('client')} onChange={(ev) => { updateClient(ev.target.value); }} name="client" id="client" className="w-auto mx-2 mr-1 mr-sm-3">
            {clients && clients.map((client) => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </CFormSelect>

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      <CContainer fluid>
        <AppBreadcrumb />
      </CContainer>

      {/* <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
          {false && <div className="d-md-down-none mfe-2 c-subheader-nav">
                    <CButton color="link" className="c-subheader-nav-link" href="#">
                      <CIcon name="cil-speech" alt={i18n.t('Settings')} />
                    </CButton>
                    <CButton
                      color="link"
                      className="c-subheader-nav-link"
                      aria-current="page"
                      to={dashboard}
                    >
                      <CIcon name="cil-graph" alt={i18n.t('Dashboard')} />&nbsp;{i18n.t('Dashboard')}
                    </CButton>
                    <CButton className="c-subheader-nav-link" href="#">
                      <CIcon name="cil-settings" alt={i18n.t('Settings')} />&nbsp;{i18n.t('Settings')}
                    </CButton>
                    </div>
                  }



        { !noParkPages.includes(location.pathname) &&
          <CRow className="flex-center">
            <CCol style={{whiteSpace: 'nowrap'}}>{i18n.t('Park')}&nbsp;
            <CSelect value={getCookie('location')} onChange={(ev) => { updateLocation(ev.target.value); }} name="park" id="park" className="w-auto mx-sm-2 mr-md-3">
              {parks && parks.map((park) => (
                <option key={park.id} value={park.id}>
                  {park.name}
                </option>
              ))}
            </CSelect>
            </CCol>
          </CRow>
        }

       </CSubheader> */}

    </CHeader>
  )
}

export default AppHeader



        
        
