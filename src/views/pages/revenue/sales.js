import React, { useState, useEffect } from 'react'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CSpinner, CButton } from '@coreui/react'
import DataAPI from '../../../helpers/DataAPI.js'
import { useTranslation } from 'react-i18next'
import { formatNumber, round } from '../../../helpers/utils.js'
import { DateFilter } from '../../../components/custom/DateFilter.js'
import { getCookie } from 'src/helpers/sessionCookie.js'
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

const Sales = () => {
  const { t } = useTranslation()
  const [period, setPeriod] = useState('cy')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataLoadError, setDataLoadError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [graphData, setGraphData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = () => {
    setLoading(true)
    setDataLoaded(false)

    const body = {}
    body.location = getCookie('location')
    body.period = period

    DataAPI({
      endpoint: 'chart/revenue/sales',
      method: 'POST',
      body: body,
    }).then((response) => {
      setLoading(false)

      if (response.error) {
        setDataLoadError(true)
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      }

      setDataLoaded(true)
      if (response.months.length === 0) return
      const months = response.months

      const graphData = {
        labels: months.map((x, i) => {
          return x.label
        }),
        datasets: [
          {
            label: t('Income'),
            data: months.map((x, i) => {
              return x.dRecIncome
            }),
            borderColor: '#7a5195',
            backgroundColor: '#7a5195',
            type: 'line',
            yAxisID: 'yIncome',
            order: 0,
          },
          {
            label: t('D-RECs sold'),
            data: months.map((x, i) => {
              return x.dRecSold
            }),
            borderColor: '#bc5090',
            backgroundColor: '#bc5090',
            yAxisID: 'yProduction',
            order: 1,
          },
        ],
      }

      setGraphData(graphData)
    })
  }

  const options = {
    responsive: true,
    animation: { duration: loading ? 0 : 1000 },
    tooltips: {
      enabled: true,
    },
  }

  const optionsGraph = {
    ...options,
    scales: {
      yIncome: {
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
          label: function (tooltipItem, data) {
            if (tooltipItem.dataset.label === 'Income')
              return (
                tooltipItem.dataset.label + ': ' + formatNumber(round(tooltipItem.raw, 1)) + ' USD'
              )
            else return tooltipItem.dataset.label + ': ' + round(tooltipItem.raw, 2) + ' MWh'
          },
        },
      },
    },
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <CRow className={'justify-content-between row-gap-3'}>
          <CCol sm="auto">
            <h3 id="sales" className="card-title mb-0">
              {t('Sales')}
            </h3>
          </CCol>

          <CCol sm="auto" className="text-end d-flex flex-center flex-justify-end flex-wrap column-gap-1">
            <div className="d-flex py-1">
              <h6 className="mx-2 m-0 align-self-center">{t('Period')}</h6>
              <DateFilter
                value={period}
                options={['cy', 'cy-1', 'cy-2', 'cy-3']}
                disabled={loading}
                onChange={(value) => {
                  setPeriod(value)
                }}
              />
              <CButton
                color="primary"
                disabled={loading}
                className="mx-2"
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
        {(loading || dataLoaded) && (
          <div>
            <CRow>
              <CCol>
                {!loading || dataLoadError ? (
                  <div style={{ marginBottom: '50px' }}>
                    <div className="d-flex">
                      <div className="text-left" style={{ width: '50%' }}>
                        MWh
                      </div>
                      <div className="text-end" style={{ width: '50%' }}>
                        USD
                      </div>
                    </div>
                    <Bar data={graphData} options={optionsGraph} />
                    <div className="text-center" style={{ width: '100%' }}>
                      Months
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <CSpinner className="loading-spinner" color="#321fdb" />
                  </div>
                )}
              </CCol>
            </CRow>
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Sales
