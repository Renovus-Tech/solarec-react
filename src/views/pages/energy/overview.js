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
  CTitle,
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
  const [dataLoaded2, setDataLoaded2] = useState(false)
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

  const [co2Emissons, setCo2Emissons] = useState('')
  const [co2Avoided, setCo2Avoided] = useState('')

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

      const responseData = response.data && response.data[0]

      if (responseData) {
        const timeAvailability = round(responseData.timeBasedAvailability)
        const performanceRatio = round(responseData.performanceRatio)
        const totalACProductionMwh = round(responseData.productionMwh)
        const irradiationKwhM2 = round(responseData.irradiationKwhM2)
        const avgAmbientTemp = round(responseData.avgAmbientTemp)

        const timeAvailabilityDataset = {
          clip: true,
          labels: [t('Time-based Availability')],
          datasets: [
            {
              borderWidth: 0,
              data: [timeAvailability, 100 - timeAvailability],
              backgroundColor: ['#ba4ba2', '#80246c'],
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

        setDataLoaded(true)
      }
    })

    DataAPI({
      endpoint: 'solar/overview/co2',
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

      if (response) {
        const co2Emissons = round(response.co2Emissons,3)
        const co2Avoided = round(response.co2Avoided*1000,1)

        setCo2Emissons(co2Emissons)
        setCo2Avoided(co2Avoided)

        setDataLoaded2(true)
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
              <CCol sm="6" lg="4" className="px-2 pb-3">
                <CCard
                  color={'gradient-yellow'}
                  textColor={'white'}
                  className={'mb-0 h-100'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody>
                    <CCardTitle component="h3">{t('PLANT CHARACTERISTICS')}</CCardTitle>
                    <CListGroup flush className='bg-transparent'>
                      <CListGroupItem className='d-inline-flex flex-wrap'>{t('User') + ':'} <h5 data-testid="user" className='m-0 mx-1'>{user !== undefined ? user : ''}</h5></CListGroupItem>
                      <CListGroupItem className='d-inline-flex flex-wrap'>{t('Region') + ':'} <h5 data-testid="region" className='m-0 mx-1'>{region !== undefined ? region : ''}</h5></CListGroupItem>
                      <CListGroupItem className='d-inline-flex flex-wrap'>{t('Country') + ':'} <h5 data-testid="country" className='m-0 mx-1'>{country !== undefined ? country : ''}</h5></CListGroupItem>
                      <CListGroupItem className='d-inline-flex flex-wrap'>{t('Grid CO2 emissions per MWh') + ':'} <h5 data-testid="co2-emissions" className='m-0 mx-1'>{co2Emissons !== undefined ? co2Emissons + ' tons' : ''}</h5></CListGroupItem>
                      <CListGroupItem className='d-inline-flex flex-wrap'>{t('Capacity') + ':'} <h5 data-testid="capacity" className='m-0 mx-1'>{capacity !== undefined ? round(capacity) + ' KW' : ''}</h5></CListGroupItem>
                      <CListGroupItem className='d-inline-flex flex-wrap'>{t('Location') + ': '} <h5 data-testid="location" className='m-0 mx-1'>
                        {userDataLoaded && (
                          <span
                            className={'link cursor-pointer btn-link'}
                            onClick={() => setViewMap(true)}
                          >
                            {t('View map')}
                          </span>
                        )}</h5></CListGroupItem>
                      <CModal
                        visible={viewMap}
                        onClose={() => setViewMap(false)}
                        className={'modal-google-map'}
                      >
                        <CModalBody>
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

              <CCol sm="6" lg="4" className="px-2 pb-3">
                <CCard
                  color={'gradient-blue'}
                  textColor={'white'}
                  className={'mb-3 h-100'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody>
                    <CCardTitle component="h3">{t('PRODUCTION AND CLIMATE')}</CCardTitle>
                    <CListGroup flush>
                      <CListGroupItem data-testid="production" className='d-inline-flex flex-wrap'>{t('Production') + ':'}
                        <h5 className='m-0 mx-1'>{totalACProductionMwh !== undefined ? round(totalACProductionMwh) + ' MWh' : ''}</h5>
                      </CListGroupItem>
                      <CListGroupItem data-testid="irradiation" className='d-inline-flex flex-wrap'>{t('Irradiation') + ':'}{' '}
                        <h5 className='m-0 mx-1'>{irradiationKwhM2 !== undefined ? round(irradiationKwhM2) + ' Kwh/m2' : ''}</h5>
                      </CListGroupItem>
                      <CListGroupItem data-testid="temperature" className='d-inline-flex flex-wrap'>{t('Average Ambient Temperature') + ':'}{' '}
                        <h5 className='m-0 mx-1'>{avgAmbientTemp !== undefined ? round(avgAmbientTemp) + ' °C' : ''}</h5>
                      </CListGroupItem>
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="4" className="px-2 pb-3">
                <CCard color={'gradient-green'} textColor={'white'} className={'mb-3 h-100'}>
                  <CCardBody>
                    <CCardTitle component="h3">{t('CO2 AVOIDED')}</CCardTitle>
                    <div className='large-number-container d-inline-flex justify-content-center align-items-end w-100 flex-wrap'>
                      <div data-testid="co2-avoided" className='large-number color-white-transparent mt-3'>{co2Avoided}</div>
                      <div className='large-number-units color-white-transparent font-weight-bold mt-3'>kg</div>
                    </div>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="4" className="px-2 pb-3">
                <CCard color={'gradient-red'} textColor={'white'} className={'mb-3 h-100'}>
                  <CCardBody>
                    <CCardTitle component="h3">{t('ALERTS')}</CCardTitle>
                    <CListGroup data-testid="alerts" >
                      { alerts.map((alert, index) => (  
                        <h5 data-testid={"alert-"+index} className="color-white-transparent" key={alert.type + ' ' + index}>{alert.message}</h5>
                      )) }
                    </CListGroup>
                  </CCardBody>
                </CCard>
              </CCol>
            
              <CCol sm="6" lg="4" className="px-2 pb-3">
                <CCard
                  color={'gradient-pink'}
                  textColor={'white'}
                  className={'mb-3 h-100'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody className={'d-flex flex-column justify-content-between'}>
                    <CContainer className='p-0'>
                      <CCardTitle component='h3' >
                        {t('TIME-BASED AVAILABILITY') + '(%)'}
                      </CCardTitle>
                      <CCardSubtitle component='h4' className='mb-0 color-white-transparent' style={{  }}>
                          {timeAvailability}
                      </CCardSubtitle>
                    </CContainer>
                    <CContainer className='p-0 text-center'>
                      { dataLoaded &&
                        <div className="d-inline-block w-100" style={{ maxWidth: '300px' }}>
                          <Doughnut data={timeAvailabilityChartData} options={optionsDoughnut} />
                        </div>
                      }
                    </CContainer>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="4" className="px-2 pb-3">
                <CCard
                  color={'gradient-purple'}
                  textColor={'white'}
                  className={'mb-3 h-100'}
                  style={{ opacity: loading ? 0.7 : 1 }}
                >
                  <CCardBody className={'d-flex flex-column justify-content-between'}>
                    <CContainer className='p-0'>
                      <CCardTitle component='h3'>
                        {t('PERFORMANCE RATIO') + '(%)'}
                      </CCardTitle>
                      <CCardSubtitle component='h4' className='mb-0 color-white-transparent' style={{  }}>
                          {performanceRatio}
                      </CCardSubtitle>
                    </CContainer>
                    <CContainer className='p-0 text-center'>
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
          </div>
        </CCardBody>
      </CCard>
  )
}

export default Overview
