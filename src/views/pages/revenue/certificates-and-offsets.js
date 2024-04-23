import React, { useState, useEffect } from 'react'

import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CSpinner,
  CButton,
} from '@coreui/react'

import DataAPI from '../../../helpers/DataAPI.js'
import { formatNumber, round, months } from '../../../helpers/utils.js'
import { DateFilter } from '../../../components/custom/DateFilter.js'
import { GroupByFilter } from '../../../components/custom/GroupByFilter.js'
import { getCookie } from 'src/helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'

import {
  Chart as ChartJS,
  CategoryScale,
  BarElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
)

const Certificates = () => {

  const { t } = useTranslation()
  const [period, setPeriod] = useState('cy');
  const [groupBy, setGroupBy] = useState('month');
  const [groupByLabel, setGroupByLabel] = useState('month');
  const [dataLoaded, setDataLoaded] = useState(false);
  const [dataLoadError, setDataLoadError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [graphData, setGraphData] = useState({labels: [], datasets: []});

  

  useEffect(() => {
    fetchData();
  }, []);


  const fetchData = () => {

    setLoading(true)
    setDataLoaded(false)

    const body = {}
    body.location = getCookie('location')
    if (period && period.split('--').length === 2) {
      body.from = period.split('--')[0]
      body.to = period.split('--')[1]
    } else {
      body.period = period
    }
    body.groupBy = groupBy
    
    DataAPI({
      'endpoint': 'chart/revenue',
      'method': 'POST',
      'body': body
    }).then(
      response => {

        setLoading(false);

        if (response.error) {
          setDataLoadError(true);
          if (response.error.message) {
            return(alert(response.error.message))
          } else {
            return(alert(response.error)) 
          }
        }
        setDataLoaded(true);

        const labels = response.data.map((rD, index) => {
          let label;
          switch (groupBy) {
            case 'day':
              label = `${rD.from.split(' ')[0]}`;
              break;
            case 'month':
              label = months[parseInt(rD.from.split(' ')[0].split('/')[1])-1];
              break;
            default:
              label = `${rD.from.split(' ')[0]} - ${rD.to.split(' ')[0]}`;
              break;
          }
          return label
        })

        const graphData = {
          labels: labels, //months.map((x, i) => { return x.label }),
          datasets: [
            {
              label: t('CO2 avoided'),
              data: response.data.map((rD, index) => { return rD.co2Avoided }),
              //months.map((x, i) => { return x.coAvoided }),
              borderColor: '#9ceb01',
              backgroundColor: '#9ceb01',
              type: 'line',
              yAxisID: 'yCOAvoided',
              order: 0
            },
            {
              label: t('Certificates generated'),
              data: response.data.map((rD, index) => { return rD.certGenerated }), //months.map((x, i) => { return x.certGenerated }),
              borderColor: '#7a5195',
              backgroundColor: '#7a5195',
              yAxisID: 'yProduction',
              order: 1
            },
            {
              label: t('Certificates sold'),
              data: response.data.map((rD, index) => { return rD.certSold }), //months.map((x, i) => { return x.certSold }),
              borderColor: '#bc5090',
              backgroundColor: '#bc5090',
              yAxisID: 'yProduction',
              order: 1
            },
          ],
        }

        setGraphData(graphData);
        setGroupByLabel(groupBy);

      }
    );

  }


  const options = {
    responsive: true,
    animation: {duration: loading ? 0 : 1000},
    tooltips: {
      enabled: true
    }
  };


  const optionsGraph =  {
                  ...options,
                  scales: {
                    yCOAvoided: {
                      type: 'linear',
                      display: true,
                      position: 'right',
                      beginAtZero: false,
                    },
                    yProduction: {
                      type: 'linear',
                      display: true,
                      position: 'left',
                      grid: {
                        drawOnChartArea: false, // only want the grid lines for one axis to show up
                      },
                    },
                    
                  },
                  plugins: {
                    tooltip: {
                      mode: 'index',
                      callbacks: {
                        label: function(tooltipItem, data) {
                          if (tooltipItem.dataset.label == 'CO2 avoided')
                            return tooltipItem.dataset.label + ': ' + formatNumber(round(tooltipItem.raw,2)) + ' tons';
                          else
                            return tooltipItem.dataset.label + ': ' + round(tooltipItem.raw,2) + ' MWh';
                        }
                      }
                    }
                  }
                };


  return (
      <CCard className="mb-4">

      <CCardHeader>
        <CRow className={'justify-content-between row-gap-3'}>
          <CCol sm="auto">
            <h3 className="card-title mb-0">
              {t('Certificates')}
            </h3>
          </CCol>

          <CCol sm="auto" className="text-end d-flex flex-center flex-justify-end flex-wrap column-gap-1">
            <div className="d-flex py-1">
              <h6 className="mx-2 m-0 align-self-center">{t('Group by')}</h6>
              <GroupByFilter
                value={groupBy}
                options={['day', 'week', 'month', 'year']}
                disabled={loading}
                onChange={(value) => {
                  setGroupBy(value)
                }}
              />
            </div>
            <div className="d-flex py-1">
              <h6 className="mx-2 m-0 align-self-center">{t('Period')}</h6>
              <DateFilter
                value={period}
                options={['cy', 'cm', 'x', 'xx']}
                disabled={loading}
                onChange={(value) => {
                  setPeriod(value)
                }}
              />
            </div>
            <div className="d-flex py-1">
              <CButton
                color="primary"
                disabled={loading}
                className="mx-2"
                data-testid={"submit-button"}
                onClick={() => {
                  fetchData()
                }}
              >
                {t('Submit')}
              </CButton>
            </div>
          </CCol>
            
        </CRow>

      </CCardHeader>

      <CCardBody>

         { (loading || dataLoaded) &&
          <div>

            <CRow>
              <CCol data-testid={"graph-container"}>

                {!loading || dataLoadError ?
                  <div style={{marginBottom:'50px'}}>
                    <div className='d-flex'>
                      <div className="text-left" style={{width: '50%'}} data-testid={"left-units"}>Certificates</div>
                      <div className="text-right" style={{width: '50%', textAlign: 'right'}} data-testid={"right-units"}>{t('Tons of CO2 avoided')}</div>
                    </div>
                      <Bar 
                            data={graphData}
                            options={optionsGraph} 
                          />
                    {/* <div className="text-center text-capitalize" style={{width: '100%'}} data-testid={"groupByLabel"}>{t(groupByLabel)}</div> */}
                  </div>
                : 
                  <div className='text-center'>
                    <CSpinner 
                      className="loading-spinner"
                      color='#321fdb'
                    />
                  </div>
                }
                

              </CCol>
            </CRow>
          </div>
         }
          
        </CCardBody>

      </CCard>



  )
}

export default Certificates