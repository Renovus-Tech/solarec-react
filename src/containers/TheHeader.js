import React, { useState, useEffect } from 'react'
import { useHistory, useLocation } from "react-router-dom";
// import { useTranslation } from 'react-i18next'
import i18n from '../helpers/i18n'
import { useSelector, useDispatch } from 'react-redux'
import {setCookie, getCookie} from '../helpers/sessionCookie.js'
import {
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CSubheader,
  CBreadcrumbRouter,
  CLink,
  CSelect,
  CRow,
  CCol,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CModal,
  CModalBody,
  CModalFooter,
  CButton,


} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { freeSet } from '@coreui/icons';

import DataAPI from '../helpers/DataAPI.js'
// import i18next from 'i18next'

// routes config
import routes from '../routes'

import {
  TheHeaderDropdown,
  TheHeaderDropdownMssg,
  TheHeaderDropdownNotif,
  TheHeaderDropdownTasks
}  from './index'

const TheHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector(state => state.sidebarShow)
  // i18next.changeLanguage(getCookie('language'))
  // const { t } = useTranslation()
  const [clients, setClients] = useState([]);
  const [clientsLoaded, setClientsLoaded] = useState(false);
  const [parks, setParks] = useState([]);
  const [parksLoaded, setParksLoaded] = useState(false);
  const [modalContact, setModalContact] = useState(false);
  const [clientSettingPermission, setClientSettingPermission] = useState(false);
  const [userSettingPermission, setUserSettingPermission] = useState(false);
  const [dashboard, setDashboard] = useState('/overview');

  let history = useHistory();
  const location = useLocation();
  const noParkPages = [];

  // const getLanguage = () => i18next.language || window.localStorage.i18nextLng
  

  useEffect(() => {
    userPermissions()
    fetchClients()
    if(!noParkPages.includes(location.pathname))
      fetchParks()
  },[]);
 

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
        
        window.location.reload();

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
        
        window.location.reload();

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

  const toggleContact = ()=>{
    setModalContact(!modalContact);
  }

  const toggleSidebar = () => {
    const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  const toggleSidebarMobile = () => {
    const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
    dispatch({type: 'set', sidebarShow: val})
  }

  

  return (
    <CHeader withSubheader>
      <CToggler
        inHeader
        className="ml-md-3 d-lg-none"
        onClick={toggleSidebarMobile}
      />
      <CToggler
        inHeader
        className="ml-3 d-md-down-none"
        onClick={toggleSidebar}
      />
      <CHeaderBrand className="mx-auto d-lg-none" to="/"></CHeaderBrand>



      {true && <CHeaderNav className="d-md-down-none mr-auto">
        <CHeaderNavItem className="px-3" >
          {false && <CHeaderNavLink to={dashboard}>Dashboard</CHeaderNavLink>}
        </CHeaderNavItem>
        <CHeaderNavItem className="px-3">
        </CHeaderNavItem>
      </CHeaderNav>}

      <CHeaderNav className="px-md-3">



      {/* { getCookie('name') }&nbsp;<a onClick={(ev) => { setCookie('name', ''); ev.preventDefault(); ev.stopPropagation(); window.location.reload(); return false;   }} href="#">Logout</a> */}

        <CSelect value={getCookie('client')} onChange={(ev) => { updateClient(ev.target.value); }} custom name="client" id="client" className="w-auto mx-2 mr-3">
          {clients && clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </CSelect>

        <CDropdown>
          <CDropdownToggle className={'btn-light'}>
            <CIcon name={'cilUser'} className={'mb-1 mr-1'}/> {getCookie('name')}&nbsp;
          </CDropdownToggle>
          <CDropdownMenu className="p-0" placement="bottom-end">
            { clientSettingPermission &&
              <CDropdownItem onClick={() => history.push("/client/settings")}>
                <CIcon name={'cilSettings'} className={'mr-2'}/>
                {i18n.t('Settings')}
              </CDropdownItem>
            }
            { userSettingPermission &&
              <CDropdownItem onClick={() => history.push("/user/settings")}>
                <CIcon name={'cilUser'} className={'mr-2'}/>
                {i18n.t('User')}
              </CDropdownItem>
            }
            <CDropdownItem onClick={toggleContact}>
              <CIcon content={freeSet.cilContact} className={'mr-2'}/>
              {i18n.t('Contact us')}
            </CDropdownItem>
            <CDropdownItem onClick={(ev) => { setCookie('name', ''); ev.preventDefault(); ev.stopPropagation(); window.location.reload(); return false;  }}>
              <CIcon content={freeSet.cilAccountLogout} className={'mr-2'}/>
              {i18n.t('Logout')}
            </CDropdownItem>
          
          </CDropdownMenu>
        </CDropdown>

        <CModal
          show={modalContact}
          onClose={toggleContact}
          size='sm'
        >
          {/* <CModalHeader closeButton>Contact us</CModalHeader> */}
          <CModalBody>
            Contact us at <a href='mailto:support@renovus.tech'>support@renovus.tech</a>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={toggleContact}>{i18n.t('Close')}</CButton>
          </CModalFooter>
        </CModal>


        {false && <><TheHeaderDropdownNotif/>
        <TheHeaderDropdownTasks/>
        <TheHeaderDropdownMssg/></>}
        <TheHeaderDropdown/>
      </CHeaderNav>

    {/* { location.pathname != '/modules/solar-battery' &&   */}
      <CSubheader className="px-3 justify-content-between">
        <CBreadcrumbRouter
          className="border-0 c-subheader-nav m-0 px-0 px-md-3"
          routes={routes}
        />
          {false && <div className="d-md-down-none mfe-2 c-subheader-nav">
                    <CLink className="c-subheader-nav-link"href="#">
                      <CIcon name="cil-speech" alt={i18n.t('Settings')} />
                    </CLink>
                    <CLink
                      className="c-subheader-nav-link"
                      aria-current="page"
                      to={dashboard}
                    >
                      <CIcon name="cil-graph" alt={i18n.t('Dashboard')} />&nbsp;{i18n.t('Dashboard')}
                    </CLink>
                    <CLink className="c-subheader-nav-link" href="#">
                      <CIcon name="cil-settings" alt={i18n.t('Settings')} />&nbsp;{i18n.t('Settings')}
                    </CLink>
                    </div>
                  }



        { !noParkPages.includes(location.pathname) &&
          <CRow className="flex-center">
            <CCol style={{whiteSpace: 'nowrap'}}>{i18n.t('Park')}&nbsp;
            <CSelect value={getCookie('location')} onChange={(ev) => { updateLocation(ev.target.value); }} custom name="park" id="park" className="w-auto ml-1 ml-sm-2 mr-md-3">
              {parks && parks.map((park) => (
                <option key={park.id} value={park.id}>
                  {park.name}
                </option>
              ))}
            </CSelect>
            </CCol>
          </CRow>
        }

      </CSubheader>
    {/* } */}

    </CHeader>
  )
}

export default TheHeader
