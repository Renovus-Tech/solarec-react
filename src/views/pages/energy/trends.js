import React, { useEffect, useState } from 'react'
import DataAPI from '../../../helpers/DataAPI.js'
import { getDateLabel, round, colors } from '../../../helpers/utils.js'
import { DateFilter } from '../../../components/custom/DateFilter.js'
import { setCookie, getCookie } from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'
import { CCard, CCardBody, CCardHeader, CRow, CCol, CButton, CSpinner } from '@coreui/react'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const Trends = () => {
  const { t } = useTranslation()
  const [dateRange, setDateRange] = useState('y')
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataLoadError, setDataLoadError] = useState(false)
  const [loading, setLoading] = useState(false)
  const [generatorsLoaded, setGeneratorsLoaded] = useState(false)
  const [selectedGenerators, setSelectedGenerators] = useState([])
  const [filterSubmitted, setFilterSubmitted] = useState(false)
  const [generators, setGenerators] = useState([])
  const [generatorColors, setGeneratorColors] = useState([])
  const [generatorsSelected, setGeneratorsSelected] = useState(false)
  const [allSelected, setAllSelected] = useState(true)

  const [lineChartOneData, setLineChartOneData] = useState({
    labels: [],
    datasets: [],
  })

  useEffect(() => {
    loadGenerators()
  }, [])

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
    body.groupBy = 'hour' //groupBy
    body.generators = selectedGenerators

    DataAPI({
      endpoint: 'solar/climate',
      method: 'POST',
      body: body,
    }).then(function (responseData) {
      if (responseData.error && responseData.error.message) {
        setDataLoadError(true)
        alert(responseData.error.message)
      }

      setLoading(false)

      const labels = responseData.data.map((rD, index) => {
        const label = `${rD.from}`
        return label
      })

      const graphData1 = {
        labels: labels,
        datasets: [],
      }

      if (allSelected) {
        const datasetTotalACProductionMwh = {
          label: 'Total AC Production',
          yAxisID: 'yACProduction',
          borderColor: '#0400ff',
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          backgroundColor: 'transparent',
          order: 0,
          type: 'line',
          data: responseData.data.map((x, i) => {
            return x.totalACProductionMwh
          }),
        }
        graphData1.datasets.push(datasetTotalACProductionMwh)
      }

      responseData.data[0].genData.forEach((gen) => {
        const datasetACProduction = {
          label: gen.code,
          borderColor: generatorColors[gen.code],
          pointBackgroundColor: 'transparent',
          pointBorderColor: 'transparent',
          backgroundColor: 'transparent',
          yAxisID: 'yACProduction',
          data: responseData.data.map((rD, index) => {
            return rD.genData
              .filter((rGen) => rGen.code === gen.code)
              .map((rGen, index2) => rGen.acProductionMwh)[0]
          }),
        }
        graphData1.datasets.push(datasetACProduction)
      })

      const datasetIrradiance = {
        label: 'Irradiance',
        yAxisID: 'yIrradiance',
        borderColor: 'red',
        pointBackgroundColor: 'transparent',
        pointBorderColor: 'transparent',
        backgroundColor: 'transparent',
        data: responseData.data.map((x, i) => {
          return x.totalIrradiationKwhM2
        }),
      }
      graphData1.datasets.push(datasetIrradiance)

      setLineChartOneData(graphData1)
    })
  }

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
        if (response.generators != null) {
          setGenerators(response.generators)
          // setSelectedGenerators(response.generators.map((gen) => (gen.id)));
          let colorIndex = 0
          response.generators.forEach((gen) => {
            generatorColors[gen.code] = colors[colorIndex % colors.length]
            setGeneratorColors(generatorColors)
            colorIndex++
          })
        }

        setGeneratorsLoaded(true)
      }
    })
  }

  const selectGenerator = (id) => {
    let newSelected = selectedGenerators
    newSelected = newSelected.includes(id)
      ? newSelected.filter((i) => i !== id) // remove item
      : [...newSelected, id] // add item
    setSelectedGenerators(newSelected.sort())
  }

  const filterGenerators = () => {
    setDataLoaded(false)
    setGeneratorsSelected(false)
    setFilterSubmitted(true)
    if (selectedGenerators.length > 0) {
      setLoading(true)
      setGeneratorsSelected(true)
      fetchData(dateRange)
    }
  }

  const options = {
    responsive: true,
    animation: { duration: loading ? 0 : 1000 },
    tooltips: {
      enabled: true,
    },
    elements: {
      line: {
        tension: 0.4,
      },
    },
  }

  const options1 = {
    ...options,
    scales: {
      yACProduction: {
        type: 'linear',
        display: true,
        position: 'left',
        beginAtZero: false,
      },
      yIrradiance: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            let decimals = 3
            let unit = ' MWh'
            if (tooltipItem.dataset.label === 'Irradiance') {
              decimals = 2
              unit = ' Kwh/m2'
            }
            return tooltipItem.dataset.label + ': ' + round(tooltipItem.raw, decimals) + unit
          },
        },
      },
    },
  }

  return (
    <CCard>
      <CCardHeader>
        <CRow className={'justify-content-between'}>
          <CCol sm="auto">
            <h3 id="traffic" className="card-title mb-0">
              {t('Climate - Trends')}
            </h3>
            <div className="small text-medium-emphasis">{getDateLabel(dateRange)}</div>
          </CCol>

          <CCol sm="auto" className="text-end d-flex flex-center flex-justify-end flex-wrap">
            <div className="d-flex py-1">
              <h6 className="mx-2 m-0 align-self-center">{t('Period')}</h6>
              <DateFilter
                options={['y', 'cm', 'cy', 'x', 'xx']}
                disabled={loading}
                onChange={(value) => {
                  setDateRange(value)
                }}
              />
            </div>
          </CCol>
        </CRow>
      </CCardHeader>

      <CCardBody>
        <CRow className={'py-3 mb-4 mx-0 bg-light'} style={{ borderRadius: '3px' }}>
          <CCol sm="10" className={'d-flex '}>
            <h6 className="mx-2 my-2 pt-1" style={{ lineHeight: 1.2, minWidth: '110px' }}>
              {t('Select inverters')}:
            </h6>
            {generatorsLoaded ? (
              <div>
                <CButton
                  style={{ backgroundColor: '#0400ff', color: 'white' }}
                  className={(allSelected ? 'selected' : '') + ' btn-generator mx-1 my-1'}
                  onClick={() => setAllSelected(!allSelected)}
                >
                  {t('ALL')}
                </CButton>
                {generators.map((gen, index) => (
                  <CButton
                    key={gen.id}
                    style={{ backgroundColor: generatorColors[gen.code], color: 'white' }}
                    className={
                      (selectedGenerators.includes(gen.id) ? 'selected' : '') +
                      ' btn-generator mx-1 my-1'
                    }
                    onClick={() => selectGenerator(gen.id)}
                    id={gen.id}
                  >
                    {gen.code}
                  </CButton>
                ))}
              </div>
            ) : (
              <CSpinner size="sm" className="loading-spinner" color="#321fdb" />
            )}
          </CCol>
          <CCol sm="2" className="text-end d-flex flex-end flex-justify-end ">
            <CButton color="primary" className="mx-2 mb-1" onClick={() => filterGenerators()}>
              {t('Submit')}
            </CButton>
          </CCol>
        </CRow>

        {generatorsSelected ? (
          <div>
            {!loading || dataLoadError ? (
              <div>
                <CRow className={'mb-5'}>
                  <CCol>
                    <h4 className="pb-2 mb-4 border-bottom">{t('Production and Irradiance')}</h4>
                    <div className="d-flex">
                      <div className="text-left" style={{ width: '50%' }}>
                        MWh
                      </div>
                      <div className="text-end" style={{ width: '50%' }}>
                        Kwh/m2
                      </div>
                    </div>
                    <Line data={lineChartOneData} options={options1} />
                  </CCol>
                </CRow>
              </div>
            ) : (
              <div className="text-center">
                <CSpinner className="loading-spinner" color="#321fdb" />
              </div>
            )}
          </div>
        ) : (
          <div>
            {filterSubmitted && (
              <CRow>
                <CCol className="text-center">{t('Select one or more inverters')}</CCol>
              </CRow>
            )}
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Trends
