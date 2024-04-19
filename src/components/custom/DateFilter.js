import React, { useState } from 'react'

import {
  CModal,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CModalBody,
  CButton,
  CFormSelect
} from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import PropTypes from 'prop-types';
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import i18n from '../../helpers/i18n'
import { getDateLabel } from '../../helpers/utils.js'

export const DateFilter = ({ value, disabled, options, onChange }) => {

  const [modal, setModal] = useState(false)
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [val, setVal] = useState(value)

  const changeListener = (ev) => {

    if (ev.target.value === 'x') {
      setModal(true);
    } else {
      onChange(ev.target.value);
      setVal(ev.target.value)
    }

  }

  const applyCustomRange = (val) => {

    if (modal) {
      let sdate = "";
      let edate = "";
      if (startDate !== null) {
        sdate =  `${startDate.getFullYear()}-${("0" + (startDate.getMonth() + 1)).slice(-2)}-${("0" + startDate.getDate()).slice(-2)}`;
      }
      if (endDate !== null) {
        edate =  `${endDate.getFullYear()}-${("0" + (endDate.getMonth() + 1)).slice(-2)}-${("0" + endDate.getDate()).slice(-2)}`;
      }
      onChange(`${sdate}--${edate}`);
      setModal(false);
      setFrom(sdate);
      setTo(edate);
      setVal('xx');

    } else {
      onChange(val);
    }

  }

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

	return (<>
            <CModal 
              visible={modal} 
              onClose={setModal}
              size="sm"
            >
              <CModalHeader closeButton>
                <CModalTitle>Select Period</CModalTitle>
              </CModalHeader>
              <CModalBody className={"text-center"}>

                <DatePicker
                  dateFormat="yyyy-MM-dd"
                  selectsRange={true}
                  startDate={startDate}
                  endDate={endDate}
                  maxDate={new Date()}
                  onChange={(dates) => {
                    // setDateRange(update);
                    const [start, end] = dates;
                    setStartDate(start)
                    setEndDate(end)
                  }}
                  inline
                />


              </CModalBody>
              <CModalFooter>
                <CButton color="primary"  onClick={applyCustomRange} >{i18n.t('Submit')}</CButton>{' '}
                <CButton 
                  color="secondary" 
                  onClick={() => setModal(false)}
                >Cancel</CButton>
              </CModalFooter>
            </CModal>

            <CFormSelect value={val} disabled={disabled} onChange={changeListener} name="period" id="period" className='input-sm' data-testid="period">{options.map((option) => {

              return <option key={option} value={option} onClick={changeListener}>
                {getDateLabel(option,from,to)}
              </option>
            })}</CFormSelect>
          </>)
}

DateFilter.propTypes = {
  value: PropTypes.string,
  disabled: PropTypes.bool,
  options: PropTypes.array,
  onChange: PropTypes.func
}


