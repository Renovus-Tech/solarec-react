import React from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CSpinner
} from '@coreui/react'

const ChartLoading = () => {
  return (
    <CCard>
        <CCardHeader></CCardHeader>
        <CCardBody style={{textAlign:'center'}}>
          <CSpinner 
            className="loading-spinner"
            color='#321fdb'
          />
        </CCardBody>
    </CCard>
  )
}

export default ChartLoading
