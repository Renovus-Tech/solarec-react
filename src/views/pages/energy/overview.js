import React, { useEffect, useState } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CSpinner,
  CWidgetDropdown,
  CCardTitle,
  CCardText
} from '@coreui/react'

import DataAPI from '../../../helpers/DataAPI.js'
import {DateFilter, round, getDateLabel } from '../../../helpers/utils.js'
import {setCookie,getCookie} from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'
import { Doughnut } from 'react-chartjs-2';
import i18n from '../../../helpers/i18n'

const Overview = () => {
  const { t, i18n } = useTranslation()
  const [loading, setLoading] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoaded2, setDataLoaded2] = useState(false);
  const [generators, setGenerators] = useState([]);
  
  const [period, setPeriod] = useState('y');

  const [user, setUser] = useState();
  const [region, setRegion] = useState();
  const [country, setCountry] = useState();
  const [capacity, setCapacity] = useState();

  const [totalACProductionMwh, setTotalACProductionMwh] = useState();
  const [irradiationKwhM2, setIrradiationKwhM2] = useState();
  const [avgAmbientTemp, setAvgAmbientTemp] = useState();

  const [timeAvailability, setTimeAvailability] = useState('');
  const [performanceRatio, setPerformanceRatio] = useState('');

  const [timeAvailabilityChartData, setTimeAvailabilityChartData] = useState(
    {
      datasets: [],
      labels: []
    }
  );
  const [performanceChartData, setPerformanceChartData] = useState(
    {
      datasets: [],
      labels: []
    }
  );


  useEffect(() => {
    loadGenerators();
    refreshChart(period);
  }, []);

const loadGenerators = () => {

  DataAPI({
    'endpoint': 'admin/locations/current',
    'method': 'GET'
  }).then(
    response => {
      
      if (response && response.error) {
        setCookie('lastTimeStamp', '');
        setCookie('name', '');
        window.location.reload();
      }
      else if ((!dataLoaded || !dataLoaded2) && response && !response.error) {
        let gen = [];
        if (response.generators != null) {
          response.generators.forEach(
            generator => { 
              gen.push(generator.id)
            })
          setGenerators(gen);
        }
      }
    }
  );


}

const fetchData = (period) => {

  setLoading(true);
  
  const body = {}
  body.location = getCookie('location')
  if (period && period.split('--').length==2) {
    body.from = period.split('--')[0]
    body.to = period.split('--')[1]
  } else {
    body.period = period
  }

  DataAPI({
    'endpoint': 'solar/overview',
    'method': 'POST',
    'body': body
  }).then(
    response => {


      setLoading(false);

      if (response.error) {
          if (response.error.message) {
          return(alert(response.error.message))
          } else {
          return(alert(response.error)) 
          }
      }

      let chartData = response.data && response.data[0];

      if (chartData) {

        const timeAvailability = round(chartData.timeBasedAvailability);
        const performanceRatio = round(chartData.performanceRatio)
        const totalACProductionMwh = round(chartData.productionMwh);
        const irradiationKwhM2 = round(chartData.irradiationKwhM2);
        const avgAmbientTemp = round(chartData.avgAmbientTemp);

        const timeAvailabilityDataset = {
          clip:true,
          labels: [i18n.t('Time-based Availability')],
          datasets: [{
            borderWidth: 0,
            data: [timeAvailability,100-timeAvailability],
            backgroundColor: ['#0a58ca', '#052c65']
          }
        ]}

        const performanceDataset = {
          clip:true,
          labels: [i18n.t('Performance Ratio')],
          datasets: [{
            borderWidth: 0,
            data: [performanceRatio,100-performanceRatio],
            backgroundColor: ['#722595', '#380a4e']
          }
        ]}
      
        setTimeAvailability(`${timeAvailability}%`)
        setPerformanceRatio(`${performanceRatio}%`)

        setTotalACProductionMwh(totalACProductionMwh)
        setIrradiationKwhM2(irradiationKwhM2)
        setAvgAmbientTemp(avgAmbientTemp)
        
        setTimeAvailabilityChartData(timeAvailabilityDataset)
        setPerformanceChartData(performanceDataset)
        
        setDataLoaded(true)

      }
    }
  );
}

  const refreshChart = (period) => {
    fetchData(period);
  }

  const filterData = (date) => {
    setPeriod(date);
    fetchData(date);
  }

  const options = {
    animation: { duration: loading ? 0 : 1000 },
  };

  const optionsBar = {
    ...options,
    responsive: true,
    aspectRatio: 1,
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
          beginAtZero: true,
        },
        grid: {
          display: false,
        },
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: '#ffffff'
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return round(tooltipItem.raw,1) + ' MWh/MW'
          }
        }
      },
    },
  };

  const optionsDoughnut = {
    ...options,
    plugins: {
      legend: {
        labels: {
          color: '#ffffff'
        }
      },
      tooltip: {
        callbacks: {
          label: function(tooltipItem) {
            return round(tooltipItem.raw,1) + ' %'
          }
        }
      },
    },
  };

  const bodyOpacity = loading?.7:1

  return (
    <>
      
      <CCard>
        <CCardHeader>
          <CRow>
            <CCol sm="9">
              <h3 id="traffic" className="card-title mb-0">
                {i18n.t('Overview')}
              </h3>
              <div className="small text-medium-emphasis">{getDateLabel(period)}</div>
            </CCol>
            <CCol sm="3" className="text-right">
              <DateFilter warning={"Seleccionar un rango máximo de 31 días"} options={['y','cm','cy','x','xx']} disabled={loading} onChange={(value) => { filterData(value); }} />
            </CCol>
          </CRow>
        </CCardHeader>
        
        <CCardBody>
          <div style={{opacity:{bodyOpacity}}} >

            {false && <div style={{zIndex: 999, position: 'absolute', width: '100%', height: '100%', backgroundColor:'rgba(255,255,255,.7)'}}><CSpinner style={{position: 'absolute'}} /></div>}
          
            <CRow>

              
            <CCol sm="6" lg="3" className="px-2 pb-3">
                <CCard
                  color={"gradient-warning"}
                  textColor={"white"}
                  style={{opacity: loading ? 0.7 : 1}}
                >
                  <CCardBody>
                    <CCardTitle>{t('PLANT CHARACTERISTICS')}</CCardTitle>
                    <CCardText>
                      <p class="h6">{t('User')+':'} {user!=undefined?user:''}</p>
                      <p class="h6">{t('Region')+':'} {region!=undefined?region:''}</p>
                      <p class="h6">{t('Country')+':'} {country!=undefined?country:''}</p>
                      <p class="h6">{t('Capacity')+':'} {capacity!=undefined?round(capacity)+' KW':''}</p>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>

              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CCard
                  color={"success"}
                  textColor={"white"}
                  style={{opacity: loading ? 0.7 : 1}}
                >
                  <CCardBody>
                    <CCardTitle>{t('PRODUCTION AND CLIMATE')}</CCardTitle>
                    <CCardText>
                      <p class="h6">{t('Production')+':'} {totalACProductionMwh!=undefined?round(totalACProductionMwh )+' MWh':''}</p>
                      <p class="h6">{t('Irradiation')+':'}  {irradiationKwhM2!=undefined?round(irradiationKwhM2)+' Kwh/m2':''}</p>
                      <p class="h6">{t('Average Ambient Temperature')+':'} {avgAmbientTemp!=undefined?round(avgAmbientTemp)+' °C':''}</p>
                    </CCardText>
                  </CCardBody>
                </CCard>
              </CCol>


              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CWidgetDropdown
                  color="gradient-info"
                  header={t('TIME-BASED AVAILABILITY')+"(%)"}
                  text={timeAvailability}
                  className="h-100 overview-box"
                  style={{opacity: loading ? 0.7 : 1}}
                  footerSlot={
                    <div className="px-lg-3 pb-lg-3 text-center">
                      <div className="d-inline-block w-100" style={{maxWidth:'300px'}}>
                        <Doughnut
                          data={timeAvailabilityChartData}
                          options={optionsDoughnut}
                        />
                      </div>
                    </div>
                  }
                >
                </CWidgetDropdown>
              </CCol>

              <CCol sm="6" lg="3" className="px-2 pb-3">
                <CWidgetDropdown
                  color="gradient-purple"
                  header={t('PERFORMANCE RATIO') + '(%)'}
                  text={performanceRatio}
                  className="h-100 overview-box"
                  style={{opacity: loading ? 0.7 : 1}}
                  footerSlot={
                    <div className="px-lg-3 pb-lg-3 text-center">
                      <div className="d-inline-block w-100" style={{maxWidth:'300px'}}>
                        <Doughnut
                          data={performanceChartData}
                          options={optionsDoughnut}
                        />
                      </div>
                    </div>
                  }
                >
                </CWidgetDropdown>
              </CCol>

            </CRow>
          </div>
          
        </CCardBody>

      </CCard>

    </>
  )
}

export default Overview
