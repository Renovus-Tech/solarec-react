import React, { useState, useEffect } from 'react'
import { useHistory, useLocation, Redirect } from "react-router-dom";
import {setCookie, getCookie} from '../../../helpers/sessionCookie.js'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CSelect,
  CDataTable,
  CBadge,
  CSpinner,
  CImg,
  CModal,
  CModalBody,
} from '@coreui/react'

import img from '../../../assets/img-solar.jpg'


const SolarBattery = () => {


  return (

    (getCookie('parkType') == 'wind') ?

      <Redirect to={'/'} />
      
    :

    <div className="position-relative">
        <CImg
            width={'100%'}
            src={img}
            alt=""
            className={'img-placeholder-full'}
            style={{marginLeft:'-30px',marginTop:'-2rem',marginBottom:'-50px',width:'106%'}}
        />
        <CCard
            className="show d-block position-absolute box-shadow px-3"
            style={{top:'15%',left:'20%',boxShadow:'1px 1px 15px 2px #3737419c'}}
            >
            <CCardBody>
                <h3 className='text-center'
                    style={{fontWeight: '400'}}
                    >Solar + Battery</h3>
                <h1 className='text-center my-1'
                    style={{textTransform:'uppercase'}}
                    >Coming June 2022</h1>
            </CCardBody>
        </CCard>
    </div>


    //   <CCard className="mb-4">

    //   <CCardHeader>
    //       <CRow>
    //         <CCol sm="6">
    //           <h3 id="diagnostics" className="card-title mb-0">
    //             AI Analytics - Energy Generation
    //           </h3>
    //           {/* <div className="small text-medium-emphasis">{getDateLabel(dateRange)}</div> */}
    //         </CCol>            
    //       </CRow>

    //     </CCardHeader>

    //     <CCardBody>

              
    //     <CRow className="mb-4">
    //       <CCol>
    //         <h4 className='text-center'>Wind Turbines for investigation/resolution: 3</h4>
    //         <CImg
    //           width={'100%'}
    //           src={img}
    //           alt=""
    //           className={'mt-3'}
    //         />

    //       </CCol>
    //     </CRow>

          
    //     </CCardBody>

    //   </CCard>



  )
}

export default SolarBattery
