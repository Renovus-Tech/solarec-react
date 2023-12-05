import React, { useEffect, useState } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CCardTitle,
  CCardText,
  CModal,
  CModalFooter,
  CModalBody,
  CButton,
  CImage,
} from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import DataAPI from '../../../helpers/DataAPI.js'
import { GOOGLE_MAPS_API_KEY } from '../../../constants.js'
import { DateFilter, round, formatNumber, getDateLabel } from '../../../helpers/utils.js'
import { setCookie, getCookie } from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'

ChartJS.register(ArcElement, Legend, Tooltip, Title)

const Overview = () => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [userDataLoaded, setUserDataLoaded] = useState(false)
  const [viewMap, setViewMap] = useState(false)

  const [period, setPeriod] = useState('y')

  const [user, setUser] = useState()
  const [region, setRegion] = useState()
  const [country, setCountry] = useState()
  const [capacity, setCapacity] = useState()
  const [latitude, setLatitude] = useState()
  const [longitude, setLongitude] = useState()

  const [totalACProductionMwh, setTotalACProductionMwh] = useState()
  const [irradiationKwhM2, setIrradiationKwhM2] = useState()
  const [avgAmbientTemp, setAvgAmbientTemp] = useState()

  const [timeAvailability, setTimeAvailability] = useState('')
  const [performanceRatio, setPerformanceRatio] = useState('')

  const [alerts, setAlerts] = useState([])

  const [timeAvailabilityChartData, setTimeAvailabilityChartData] = useState({
    datasets: [],
    labels: [],
  })
  const [performanceChartData, setPerformanceChartData] = useState({
    datasets: [],
    labels: [],
  })

  useEffect(() => {
    loadGenerators()
    refreshChart(period)
  }, [])

  const loadGenerators = () => {
    DataAPI({
      endpoint: 'admin/locations/current',
      method: 'GET',
    }).then((response) => {
      if (response && response.error) {
        setCookie('lastTimeStamp', '')
        setCookie('name', '')
        window.location.reload()
      } else if (!dataLoaded && response && !response.error) {
        let gen = []
        if (response.generators != null) {
          response.generators.forEach((generator) => {
            gen.push(generator.id)
          })
        }
        setUserDataLoaded(true)
        setUser(response.name)
        setRegion(response.state)
        setCountry(response.country)
        setCapacity(formatNumber(response.outputCapacity))
        setLatitude(response.latitude)
        setLongitude(response.longitude)
      }
    })
  }

  const fetchData = (period) => {
    setLoading(true)

    const body = {}
    body.location = getCookie('location')
    if (period && period.split('--').length === 2) {
      body.from = period.split('--')[0]
      body.to = period.split('--')[1]
    } else {
      body.period = period
    }

    DataAPI({
      endpoint: 'solar/overview',
      method: 'POST',
      body: body,
    }).then((response) => {
      setLoading(false)

      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      }

      let responseData = response.data && response.data[0]

      if (responseData) {
        const timeAvailability = round(responseData.timeBasedAvailability)
        const performanceRatio = round(responseData.performanceRatio)
        const totalACProductionMwh = round(responseData.productionMwh)
        const irradiationKwhM2 = round(responseData.irradiationKwhM2)
        const avgAmbientTemp = round(responseData.avgAmbientTemp)
        // const alerts = responseData.alerts;

        const timeAvailabilityDataset = {
          clip: true,
          labels: [t('Time-based Availability')],
          datasets: [
            {
              borderWidth: 0,
              data: [timeAvailability, 100 - timeAvailability],
              backgroundColor: ['#0a58ca', '#052c65'],
            },
          ],
        }

        const performanceDataset = {
          clip: true,
          labels: [t('Performance Ratio')],
          datasets: [
            {
              borderWidth: 0,
              data: [performanceRatio, 100 - performanceRatio],
              backgroundColor: ['#722595', '#380a4e'],
            },
          ],
        }

        setTimeAvailability(`${timeAvailability}%`)
        setPerformanceRatio(`${performanceRatio}%`)

        setTotalACProductionMwh(totalACProductionMwh)
        setIrradiationKwhM2(irradiationKwhM2)
        setAvgAmbientTemp(avgAmbientTemp)

        setTimeAvailabilityChartData(timeAvailabilityDataset)
        setPerformanceChartData(performanceDataset)

        setAlerts(alerts)

        setDataLoaded(true)
      }
    })
  }

  const refreshChart = (period) => {
    fetchData(period)
  }

  const filterData = (date) => {
    setPeriod(date)
    fetchData(date)
  }

  const options = {
    animation: { duration: loading ? 0 : 1000 },
  }

  const optionsDoughnut = {
    ...options,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return round(tooltipItem.raw, 1) + ' %'
          },
          title: function () {
            return ''
          },
        },
      },
    },
  }

  const bodyOpacity = loading ? 0.7 : 1

  return (
    <>
      <CCard>
        <CCardHeader>
          <CRow className={'justify-content-between'}>
            <CCol sm="auto">
              <h3 id="traffic" className="card-title mb-0">
                {i18n.t('Overview')}
              </h3>
              <div className="small text-medium-emphasis">{getDateLabel(period)}</div>
            </CCol>
            <CCol sm="auto" className="text-end d-flex flex-center flex-justify-end flex-wrap">
              <div className="d-flex py-1">
                <DateFilter
                  warning={'Seleccionar un rango máximo de 31 días'}
                  options={['y', 'cm', 'cy', 'x', 'xx']}
                  disabled={loading}
                  onChange={(value) => {
                    filterData(value)
                  }}
                />
              </div>
            </CCol>
          </CRow>
        </CCardHeader>

        <CCardBody>
          <div style={{ opacity: { bodyOpacity } }}>
            {false && (
              <div
                style={{
                  zIndex: 999,
                  position: 'absolute',
                  width: '100%',
                  height: '100%',
                  backgroundColor: 'rgba(255,255,255,.7)',
                }}
              >
                <CSpinner style={{ position: 'absolute' }} />
              </div>
            )}

            <CRow>
              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CCard
                  color={'gradient-warning'}
                  textColor={'white'}
                  className={'mb-0 mb-sm-3'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody>
                    <CCardTitle component="h4">{t('PLANT CHARACTERISTICS')}</CCardTitle>
                    <CCardText>
                      <p className="h6">
                        {t('User') + ':'} {user !== undefined ? user : ''}
                      </p>
                      <p className="h6">
                        {t('Region') + ':'} {region !== undefined ? region : ''}
                      </p>
                      <p className="h6">
                        {t('Country') + ':'} {country !== undefined ? country : ''}
                      </p>
                      <p className="h6">
                        {t('Capacity') + ':'}{' '}
                        {capacity !== undefined ? round(capacity) + ' KW' : ''}
                      </p>
                      <p className="h6">
                        {t('Location') + ': '}
                        {userDataLoaded && (
                          <span
                            className={'link cursor-pointer btn-link'}
                            onClick={() => setViewMap(true)}
                          >
                            {t('View map')}
                          </span>
                        )}
                      </p>
                      <CModal
                        visible={viewMap}
                        onClose={() => setViewMap(false)}
                        className={'modal-google-map'}
                      >
                        <CModalBody>
                          <CImage
                            className="mw-100"
                            src={
                              'https://maps.googleapis.com/maps/api/staticmap?center=' +
                              latitude +
                              ',' +
                              longitude +
                              '&zoom=11&size=640x450&maptype=terrain&markers=size:medium%7Ccolor:0xf7cf27|' +
                              latitude +
                              ',' +
                              longitude +
                              '&key=' +
                              GOOGLE_MAPS_API_KEY
                            }
                          />
                        </CModalBody>
                        <CModalFooter>
                          <CButton color="secondary" onClick={() => setViewMap(false)}>
                            {i18n.t('Close')}
                          </CButton>
                        </CModalFooter>
                      </CModal>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CCard
                  color={'success'}
                  textColor={'white'}
                  className={'mb-3'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody>
                    <CCardTitle component="h4">{t('PRODUCTION AND CLIMATE')}</CCardTitle>
                    <CCardText>
                      <p className="h6">
                        {t('Production') + ':'}{' '}
                        {totalACProductionMwh !== undefined
                          ? round(totalACProductionMwh) + ' MWh'
                          : ''}
                      </p>
                      <p className="h6">
                        {t('Irradiation') + ':'}{' '}
                        {irradiationKwhM2 !== undefined ? round(irradiationKwhM2) + ' Kwh/m2' : ''}
                      </p>
                      <p className="h6">
                        {t('Average Ambient Temperature') + ':'}{' '}
                        {avgAmbientTemp !== undefined ? round(avgAmbientTemp) + ' °C' : ''}
                      </p>
                    </CCardText>
                  </CCardBody>
                </CCard>

                <CCard color={'danger'} textColor={'white'} className={'mb-0'}>
                  <CCardBody>
                    <CCardTitle component="h4">{t('ALERTS')}</CCardTitle>
                    <CCardText>
                      {/* { alerts.map((alert, index) => (  
                      <p class="">{alert.title}: 
                        { alert.generators.map((gen, index) => (  
                          <h5>{index > 1 ? gen : " - " + gen}</h5>
                        )) }
                      </p>
                      )) } */}

                      {
                        // <p class="">Wind turbines with negative change exceeding -6% in performance (yesterday):
                        //   <h5>{alert2.length > 0 ? alert2.join(' - ') : " - "}</h5>
                        // </p>
                        // <p class="">Wind turbines with long stops (yesterday):
                        //   <h5>{alert3.length > 0 ? alert3.join(' - ') : " - "}</h5>
                        // </p>
                      }
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CCard
                  color={'gradient-info'}
                  textColor={'white'}
                  className={'mb-3 h-100'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody className={'d-flex flex-column justify-content-between'}>
                    <CCardTitle className="mb-0">
                      <h4 className="mb-1">{t('TIME-BASED AVAILABILITY') + '(%)'}</h4>
                      <h5 className="mb-0" style={{ fontWeight: '400' }}>
                        {timeAvailability}
                      </h5>
                    </CCardTitle>
                    <CCardText>
                      <div className="d-inline-block w-100" style={{ maxWidth: '300px' }}>
                        <Doughnut data={timeAvailabilityChartData} options={optionsDoughnut} />
                      </div>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CCard
                  color={'gradient-purple'}
                  textColor={'white'}
                  className={'mb-3 h-100'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody className={'d-flex flex-column justify-content-between'}>
                    <CCardTitle className="mb-0">
                      <h4 className="mb-1">{t('PERFORMANCE RATIO') + '(%)'}</h4>
                      <h5 className="mb-0" style={{ fontWeight: '400' }}>
                        {performanceRatio}
                      </h5>
                    </CCardTitle>
                    <CCardText>
                      <div className="d-inline-block w-100" style={{ maxWidth: '300px' }}>
                        <Doughnut data={performanceChartData} options={optionsDoughnut} />
                      </div>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>
    </>
  )
}

export default Overview
