import React, { useEffect, useState } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CContainer,
  CCardTitle,
  CCardSubtitle,
  CListGroup,
  CListGroupItem,
  CModal,
  CModalFooter,
  CModalBody,
  CButton,
  CImage,
} from '@coreui/react'
import 'react-datepicker/dist/react-datepicker.css'
import DataAPI from '../../../helpers/DataAPI.js'
import { round, formatNumber, getDateLabel } from '../../../helpers/utils.js'
import { DateFilter } from '../../../components/custom/DateFilter.js'
import { setCookie, getCookie } from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend } from 'chart.js'
import { Doughnut } from 'react-chartjs-2'
import Map from '../../../components/maps/Map'

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
    loadData()
    refreshChart(period)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadData = () => {
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

        // setAlerts(alerts)

        setDataLoaded(true)
      }
    })

    DataAPI({
      endpoint: 'solar/overview/alerts',
      method: 'GET',
      body: body,
    }).then((response) => {
      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      } else {
        setAlerts(response)
      }
      // let responseData = response.data && response.data[0]
      // if (response) {
      //   setAlerts(response)
      // }
    })
  }

  const refreshChart = (period) => {
    fetchData(period)
  }

  // const filterData = (date) => {
  //   setPeriod(date)
  //   fetchData(date)
  // }

  const location = {
    address: '',
    lat: latitude,
    lng: longitude,
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
      <CCard>
        <CCardHeader>
          <CRow className={'justify-content-between row-gap-3'}>
            <CCol sm="auto">
              <h3 id="traffic" className="card-title mb-0">
                {i18n.t('Overview')}
              </h3>
              <div className="small text-medium-emphasis">{getDateLabel(period)}</div>
            </CCol>
            <CCol sm="auto" className="text-end d-flex flex-center flex-justify-end flex-wrap column-gap-1">
              <div className="d-flex py-1">
                <DateFilter
                  value={period}
                  warning={'Seleccionar un rango máximo de 31 días'}
                  options={['y', 'cm', 'cy', 'x', 'xx']}
                  disabled={loading}
                  onChange={(value) => {
                    setPeriod(value)
                    fetchData(value)
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
              <CCol sm="6" lg="6" className="px-0 pb-3">
                <CRow className="m-0" >
                  <CCol sm="6" lg="6" className="px-2 pb-3">
                    <CCard
                      color={'gradient-warning'}
                      textColor={'white'}
                      className={'mb-0 h-100'}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      <CCardBody>
                        <CCardTitle component="h4">{t('PLANT CHARACTERISTICS')}</CCardTitle>
                        <CListGroup flush className='bg-transparent'>
                          <CListGroupItem data-testid="user">{t('User') + ':'} {user !== undefined ? user : ''}</CListGroupItem>
                          <CListGroupItem data-testid="region">{t('Region') + ':'} {region !== undefined ? region : ''}</CListGroupItem>
                          <CListGroupItem data-testid="country">{t('Country') + ':'} {country !== undefined ? country : ''}</CListGroupItem>
                          <CListGroupItem data-testid="capacity">{t('Capacity') + ':'}{' '}{capacity !== undefined ? round(capacity) + ' KW' : ''}</CListGroupItem>
                          <CListGroupItem data-testid="location">{t('Location') + ': '}
                            {userDataLoaded && (
                              <span
                                className={'link cursor-pointer btn-link'}
                                onClick={() => setViewMap(true)}
                              >
                                {t('View map')}
                              </span>
                            )}</CListGroupItem>
                          <CModal
                            visible={viewMap}
                            onClose={() => setViewMap(false)}
                            className={'modal-google-map'}
                          >
                            <CModalBody>
                              {/* <CImage
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
                                  process.env.GOOGLE_MAPS_API_KEY
                                }
                              /> */}
                            <Map location={location} zoomLevel={17} />

                            </CModalBody>
                            <CModalFooter>
                              <CButton color="secondary" onClick={() => setViewMap(false)} data-testid="close-map-button">
                                {i18n.t('Close')}
                              </CButton>
                            </CModalFooter>
                          </CModal>
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <CCol sm="6" lg="6" className="px-2 pb-3">
                    <CCard
                      color={'success'}
                      textColor={'white'}
                      className={'mb-3 h-100'}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      <CCardBody>
                        <CCardTitle component="h4">{t('PRODUCTION AND CLIMATE')}</CCardTitle>
                        <CListGroup flush>
                          <CListGroupItem data-testid="production">{t('Production') + ':'}{' '}
                              {totalACProductionMwh !== undefined ? round(totalACProductionMwh) + ' MWh' : ''}
                            </CListGroupItem>
                            <CListGroupItem data-testid="irradiation">{t('Irradiation') + ':'}{' '}
                              {irradiationKwhM2 !== undefined ? round(irradiationKwhM2) + ' Kwh/m2' : ''}
                            </CListGroupItem>
                            <CListGroupItem data-testid="temperature">{t('Average Ambient Temperature') + ':'}{' '}
                              {avgAmbientTemp !== undefined ? round(avgAmbientTemp) + ' °C' : ''}
                            </CListGroupItem>
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>

                <CRow className="m-0">
                  <CCol sm="12" lg="12" className="px-2 pb-3">
                    <CCard color={'danger'} textColor={'white'} className={'mb-0'}>
                      <CCardBody>
                        <CCardTitle component="h4">{t('ALERTS')}</CCardTitle>
                        <CListGroup data-testid="alerts" >
                          { alerts.map((alert, index) => (  
                            <p data-testid={"alert-"+index} className="" key={alert.type + ' ' + index}>{alert.message}</p>
                          )) }
                        </CListGroup>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CCol>
                  
              <CCol sm="6" lg="6" className="px-0 pb-3">
                <CRow className="m-0">
                  <CCol sm="6" lg="6" className="px-2 pb-3">
                    <CCard
                      color={'gradient-info'}
                      textColor={'white'}
                      className={'mb-3 h-100'}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      <CCardBody className={'d-flex flex-column justify-content-between'}>
                        <CContainer className='p-0'>
                          <CCardTitle component='h4' >
                            {t('TIME-BASED AVAILABILITY') + '(%)'}
                          </CCardTitle>
                          <CCardSubtitle component='h5' className='mb-0' style={{ fontWeight: '400' }}>
                              {timeAvailability}
                          </CCardSubtitle>
                        </CContainer>
                        <CContainer className='p-0'>
                          { dataLoaded &&
                            <div className="d-inline-block w-100" style={{ maxWidth: '300px' }}>
                              <Doughnut data={timeAvailabilityChartData} options={optionsDoughnut} />
                            </div>
                          }
                        </CContainer>
                      </CCardBody>
                    </CCard>
                  </CCol>

                  <CCol sm="6" lg="6" className="px-2 pb-3">
                    <CCard
                      color={'gradient-purple'}
                      textColor={'white'}
                      className={'mb-3 h-100'}
                      style={{ opacity: loading ? 0.7 : 1 }}
                    >
                      <CCardBody className={'d-flex flex-column justify-content-between'}>
                        <CContainer className='p-0'>
                          <CCardTitle component='h4'>
                            {t('PERFORMANCE RATIO') + '(%)'}
                          </CCardTitle>
                          <CCardSubtitle component='h5' className='mb-0' style={{ fontWeight: '400' }}>
                              {performanceRatio}
                          </CCardSubtitle>
                        </CContainer>
                        <CContainer className='p-0'>
                          { dataLoaded &&
                            <div className="d-inline-block w-100" style={{ maxWidth: '300px' }}>
                              <Doughnut data={performanceChartData} options={optionsDoughnut} />
                            </div>
                          }
                        </CContainer>
                      </CCardBody>
                    </CCard>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </div>
        </CCardBody>
      </CCard>
  )
}

export default Overview
