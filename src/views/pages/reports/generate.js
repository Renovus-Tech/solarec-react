import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CAlert,
  CButton,
  CFormSelect,
} from '@coreui/react'
import DataAPI from '../../../helpers/DataAPI.js'
import Moment from 'moment'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getCookie } from '../../../helpers/sessionCookie.js'

const Reports = () => {
  const [loaded, setLoaded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [reports, setReports] = useState([])

  const [type, setType] = useState('')
  const [requires, setRequires] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  const [canRequest, setCanRequest] = useState(false)
  const [sending, setSending] = useState(false)
  const [generated, setGenerated] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    loadOptions()
  }, [])

  const loadOptions = () => {
    DataAPI({
      endpoint: 'report/generate',
      method: 'GET',
    }).then((response) => {
      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      }

      setReports(response.reports)
      setLoaded(true)
    })
  }

  const requestReport = () => {
    setSending(true)

    const body = {}
    body.location = getCookie('location')
    const dates =
      endDate != ''
        ? [Moment(startDate).format('YYYY-MM-DD'), Moment(endDate).format('YYYY-MM-DD')]
        : [Moment(startDate).format('YYYY-MM-DD')]
    body.report = {
      id: type,
      values: dates,
    }

    DataAPI({
      endpoint: 'report/generate',
      method: 'POST',
      body: body,
    }).then((response) => {
      setSending(false)

      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      }

      if (response.generated) {
        setGenerated(true)
        setMessage('Your report has been requested. You will receive it by e-mail shortly.')
      }
    })
  }

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="6">
            <h3 id="traffic" className="card-title mb-0">
              Reports
            </h3>
            <div className="text-medium-emphasis">Generate</div>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>
        <CRow>
          <CCol>
            {generated && <CAlert color="success">{message}</CAlert>}
            <h4 className={'mb-4'}>Generate and Download Report</h4>
            <CRow className={'mb-3'}>
              <CCol className="d-flex flex-center">
                <h6 className="mr-2 mb-0" style={{ minWidth: '128px' }}>
                  Select report type
                </h6>
                <CFormSelect
                  disabled={loading}
                  onChange={(ev) => {
                    setType(ev.target.value)
                    setRequires(ev.target.selectedOptions[0].dataset.requires)
                    setCanRequest(false)
                    setStartDate('')
                    setEndDate('')
                    setGenerated(false)
                  }}
                  custom
                  name="type"
                  id="type"
                  className="input-md"
                >
                  <option value="" disabled selected>
                    -- Select --
                  </option>
                  {reports.map((report) => (
                    <option key={report.id} value={report.id} data-requires={report.requires}>
                      {report.title}
                    </option>
                  ))}
                </CFormSelect>
              </CCol>
            </CRow>
            <CRow className={'mb-3'}>
              <CCol className="d-flex flex-center">
                <h6 className="mr-2 mb-0" style={{ minWidth: '128px' }}>
                  {requires == 'range' ? 'Select report period' : 'Select report date'}
                </h6>

                {(() => {
                  switch (requires) {
                    case 'range':
                      return (
                        <DatePicker
                          className={'col-6 custom-select input-md'}
                          dateFormat="yyyy-MM-dd"
                          selectsRange={true}
                          disabled={type == ''}
                          startDate={startDate}
                          endDate={endDate}
                          maxDate={new Date()}
                          onChange={(dates) => {
                            const [start, end] = dates
                            setStartDate(start)
                            setEndDate(end)
                            setCanRequest(start !== undefined && end !== undefined)
                            setGenerated(false)
                          }}
                        />
                      )
                    case 'month':
                      return (
                        <DatePicker
                          className={'col-6 custom-select input-md'}
                          dateFormat="yyyy-MM"
                          selected={startDate}
                          maxDate={new Date()}
                          showMonthYearPicker
                          onChange={(date) => {
                            setStartDate(date)
                            setEndDate('')
                            setCanRequest(date != undefined)
                            setGenerated(false)
                          }}
                        />
                      )
                    default:
                      return (
                        <DatePicker
                          className={'col-6 custom-select input-md'}
                          dateFormat="yyyy-MM-dd"
                          selected={startDate}
                          maxDate={new Date()}
                          onChange={(date) => {
                            setStartDate(date)
                            setEndDate('')
                            setCanRequest(date != undefined)
                            setGenerated(false)
                          }}
                        />
                      )
                  }
                })()}

                {requires === 'week' && (
                  <span className="mx-2">the selected day and the previous 6 days</span>
                )}
                {/* { requires == 'month' &&
                    <span className='mx-2'>the month of the selected day</span>
                  } */}
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <div className={'border-top mt-2 pt-4'}>
                  <CButton
                    onClick={requestReport}
                    color="primary"
                    disabled={sending || !canRequest}
                    className="px-4 mr-3"
                  >
                    Submit
                  </CButton>
                </div>
              </CCol>
            </CRow>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default Reports
