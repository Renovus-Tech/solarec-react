import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CRow,
  CCol,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CImage,
  CFormSelect,
  CButton,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilMenu } from '@coreui/icons'
import { setCookie, getCookie } from '../helpers/sessionCookie.js'
import { getDateCodes } from '../helpers/utils.js'
import { AppBreadcrumb } from './index'
import { AppHeaderDropdown } from './header/index'
import logo from '../assets/logo.png'
import DataAPI from '../helpers/DataAPI.js'
import { useTranslation } from 'react-i18next'

const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)

  const { t } = useTranslation()
  const [clients, setClients] = useState([])
  const [clientsLoaded, setClientsLoaded] = useState(false)
  const [parks, setParks] = useState([])
  const [noParkPages, setNoParkPages] = useState([])
  const [parksLoaded, setParksLoaded] = useState(false)
  // const [clientSettingPermission, setClientSettingPermission] = useState(false)
  // const [userSettingPermission, setUserSettingPermission] = useState(false)
  const [dashboard, setDashboard] = useState('/overview')

  const location = useLocation()
  // const noParkPages = [];

  useEffect(() => {
    // userPermissions()
    fetchClients()
    setNoParkPages([])
    if(!noParkPages.includes(location.pathname))
      fetchParks()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
 
  // const userPermissions = () => {
  //   const functionalities = JSON.parse(getCookie('functionalities'));
  //   if(functionalities.indexOf('/client/settings') > -1){
  //     setClientSettingPermission(true)
  //   }
  //   if(functionalities.indexOf('/user/settings') > -1){
  //     setUserSettingPermission(true)
  //   }
  // }

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
        setCookie('groupby', JSON.stringify(Object.keys(response.location.frequency.groupby).filter((gb) => response.location.frequency.groupby[gb] === true)))
        setCookie('periods', JSON.stringify(getDateCodes(Object.keys(response.location.frequency.periods).filter((p) => response.location.frequency.periods[p] === true))))
        setDashboard(response.functionalities[0].url)
        window.location.reload()
      }
    ).catch(
      response => {
        console.error(response)
      }
    );
  }

  const updateLocation = (locationId) => {
    console.log(`Updating location to: security/authenticate/location/${locationId}`)
    DataAPI({
      'endpoint': `security/authenticate/location/${locationId}`,
      'method': 'GET'
    }).then(
      response => {
        console.log(response)
        setCookie('location', locationId)
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

  const fetchClients = () => {
    DataAPI({
      'endpoint': 'security/authenticate',
      'method': 'GET'
    }).then(
      response => {
        if (!response.error && !clientsLoaded) {
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
        if (!response.error && !parksLoaded) {
          setParks(response);
          setParksLoaded(true);
          if( getCookie('parkType') === '')
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
        <div className="d-flex">
          <CHeaderToggler
            className="ps-1"
            onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          >
            <CIcon icon={cilMenu} size="lg" />
          </CHeaderToggler>
          <CHeaderBrand className="mx-auto d-md-none" to="/">
            <CImage src={logo} height={38} alt="Logo" />
          </CHeaderBrand>
        </div>
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

          { clients.length > 1 &&
            <CFormSelect value={getCookie('client')} onChange={(ev) => { updateClient(ev.target.value); }} name="client" id="client" className="w-auto mx-2 mr-1 mr-sm-3">
              {clientsLoaded && clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </CFormSelect>
          }

          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
      {/* <CContainer fluid>
        <AppBreadcrumb />
      </CContainer> */}

      <CContainer fluid className="px-3 justify-content-between">
        {/* <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        /> */}
        <AppBreadcrumb />
          {false && <div className="d-md-down-none mfe-2 c-subheader-nav">
                    <CButton color="link" className="c-subheader-nav-link" href="#">
                      <CIcon name="cil-speech" alt={t('Settings')} />
                    </CButton>
                    <CButton
                      color="link"
                      className="c-subheader-nav-link"
                      aria-current="page"
                      to={dashboard}
                    >
                      <CIcon name="cil-graph" alt={t('Dashboard')} />&nbsp;{t('Dashboard')}
                    </CButton>
                    <CButton className="c-subheader-nav-link" href="#">
                      <CIcon name="cil-settings" alt={t('Settings')} />&nbsp;{t('Settings')}
                    </CButton>
                    </div>
                  }



        { !noParkPages.includes(location.pathname) && parks.length > 1 &&
          <CRow className="flex-center">
            <CCol style={{whiteSpace: 'nowrap'}} className='d-flex'>
              <div className='align-self-center mx-2'>{t('Park')}</div>
              <CFormSelect value={getCookie('location')} onChange={(ev) => { updateLocation(ev.target.value); }} name="park" id="park" className="w-auto mx-sm-2 mr-md-3">
                {parksLoaded && parks.map((park) => (
                  <option key={park.id} value={park.id}>
                    {park.name}
                  </option>
                ))}
              </CFormSelect>
            </CCol>
          </CRow>
        }

       </CContainer>

    </CHeader>
  )
}

export default AppHeader



        
        
