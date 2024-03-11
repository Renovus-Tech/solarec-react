import React, { useEffect, useState } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CRow,
  CCol,
  CButton,
  CFormSelect,
  CSpinner,
} from '@coreui/react'
import DataAPI from '../../../helpers/DataAPI.js'
import { round, getDateLabel, formatNumber } from '../../../helpers/utils.js'
import { DateFilter } from '../../../components/custom/DateFilter.js'
import { setCookie, getCookie } from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'
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

const Performance = () => {
  const { t } = useTranslation()
  const [graphData, setGraphData] = useState({ labels: [], datasets: [] })
  const [graphData2, setGraphData2] = useState({ labels: [], datasets: [] })
  const [generators, setGenerators] = useState([])
  const [generatorColors, setGeneratorColors] = useState([])
  const [generatorsLoaded, setGeneratorsLoaded] = useState(false)
  const [generatorsSelected, setGeneratorsSelected] = useState(false)
  const [selectedGenerators, setSelectedGenerators] = useState([])
  const [multipleInverters, setMultipleInverters] = useState(false)
  const [period, setPeriod] = useState('cm')
  const [groupBy, setGroupBy] = useState('day')
  const [loading, setLoading] = useState(false)
  const [dataLoaded, setDataLoaded] = useState(false)
  const [dataLoadError, setDataLoadError] = useState(false)
  const colors = ['#003f5c', '#7a5195', '#bc5090', '#ef5675', '#ff764a', '#ffa600', '#9ceb01']

  useEffect(() => {
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
            let colorIndex = 0
            response.generators.forEach((gen) => {
              generatorColors[gen.code] = colors[colorIndex % colors.length]
              // generatorColors['Total'] = '#0400ff'
              setGeneratorColors(generatorColors)
              colorIndex++
            })
            setMultipleInverters(response.generators.length > 1)
            if (response.generators.length === 1) {
              selectGenerator(response.generators[0].id)
              filterGenerators()
            }
          }
  
          setGeneratorsLoaded(true)
          
        }
      })
    }
    loadGenerators()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = () => {

    setLoading(true)

    const body = {}
    body.location = getCookie('location')
    body.generators = selectedGenerators
    if (period && period.split('--').length === 2) {
      body.from = period.split('--')[0]
      body.to = period.split('--')[1]
    } else {
      body.period = period
    }
    body.groupBy = groupBy

    DataAPI({
      endpoint: 'solar/performanceIndex',
      method: 'POST',
      body: body,
    })
      .then(function (responseData) {
        setLoading(false)

        if (responseData.error) {
          setDataLoadError(true)
          if (responseData.error.message) {
            return alert(responseData.error.message)
          } else {
            return alert(responseData.error)
          }
        }

        const labels = responseData.data.map((rD, index) => {
          const label =
            groupBy === 'day'
              ? `${rD.from.split(' ')[0]}`
              : `${rD.from.split(' ')[0]} - ${rD.to.split(' ')[0]}`
          return label
        })

        const data = {
          labels: labels,
          datasets: [],
        }
        const data2 = {
          labels: labels,
          datasets: [],
        }

        const dataset2y1 = {
          label: t('Irradiance'),
          backgroundColor: '#f32e2e',
          borderColor: '#f32e2e',
          borderWidth: 1,
          pointBorderColor: '#f32e2e',
          pointBorderWidth: 2,
          yAxisID: 'y1',
          pointRadius: 4,
          pointHoverRadius: 5,
          data: responseData.data.map((rD, index) => {
            return rD.genData[0].irradiationKwhM2
          }),
        }
        data2.datasets.push(dataset2y1)

        responseData.data[0].genData.forEach((gen) => {
          const dataset = {
            label: gen.name,
            backgroundColor: generatorColors[gen.code],
            data: responseData.data.map((rD, index) => {
              return rD.genData
                .filter((rGen) => rGen.code === gen.code)
                .map((rGen, index2) => rGen.performanceRatio)[0]
            }),
          }
          const dataset2y = {
            label: t('Production') + ': ' + gen.name,
            backgroundColor: generatorColors[gen.code],
            borderColor: generatorColors[gen.code],
            borderWidth: 1,
            pointBorderColor: generatorColors[gen.code],
            pointBorderWidth: 2,
            yAxisID: 'y',
            pointRadius: 4,
            pointHoverRadius: 5,
            data: responseData.data.map((rD, index) => {
              return rD.genData
                .filter((rGen) => rGen.code === gen.code)
                .map((rGen, index2) => rGen.acProductionMwh)[0]
            }),
          }

          data.datasets.push(dataset)
          data2.datasets.push(dataset2y)
        })

        setGraphData(data)
        setGraphData2(data2)
        setDataLoaded(true)
      })
      .catch((err) => {
        console.warn(`ERROR! ${err}`)
        setLoading(false)
      })
  }

  const options = {
    responsive: true,
    animation: { duration: loading ? 0 : 1000 },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            return tooltipItem.dataset.label + ': ' + round(tooltipItem.raw, 1) + '%'
          },
        },
      },
    },
  }

  const options2 = {
    responsive: true,
    animation: { duration: loading ? 0 : 1000 },
    stacked: false,
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem, data) {
            if (tooltipItem.dataset.yAxisID === 'y')
              return (
                tooltipItem.dataset.label + ': ' + formatNumber(round(tooltipItem.raw, 3)) + ' MWh'
              )
            else
              return (
                tooltipItem.dataset.label +
                ': ' +
                formatNumber(round(tooltipItem.raw, 1)) +
                ' Kwh/m2'
              )
          },
        },
      },
      legend: {
        lineWidth: 4,
        borderRadius: 10,
        usePointStyle: true,
        pointStyle: {
          borderWidth: 5,
          pointBorderWidth: 5,
        },
      },
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        grid: {
          drawOnChartArea: false, // only want the grid lines for one axis to show up
        },
      },
    },
  }

  const selectGenerator = (id) => {
    let newSelected = selectedGenerators
    newSelected = newSelected.includes(id)
      ? newSelected.filter((i) => i !== id) // remove item
      : [...newSelected, id] // add item
    setSelectedGenerators(newSelected)
  }

  const filterGenerators = () => {
    setGeneratorsSelected(true)
    fetchData()
  }

  return (
    <CCard className="mb-4">
      <CCardHeader>
        <CRow className={'justify-content-between row-gap-3'}>
          <CCol sm="auto">
            <h3 id="traffic" className="card-title mb-0">
              {t('Performance')}
            </h3>
            <div className="small text-medium-emphasis">{getDateLabel(period)}</div>
          </CCol>

          <CCol sm="auto" className="text-end d-flex flex-center flex-justify-end flex-wrap column-gap-1">
            <div className="d-flex py-1">
              <h6 className="mx-2 m-0 align-self-center">{t('Group by')}</h6>
              <CFormSelect
                className={'input-sm'}
                value={groupBy}
                disabled={loading}
                onChange={(ev) => {
                  setGroupBy(ev.target.value)
                }}
                name="groupby"
                id="groupby"
                data-testid="groupby"
              >
                <option value="day">{t('Day')}</option>
                <option value="week">
                  {t('Week')}
                </option>
                <option value="month">{t('Month')}</option>
              </CFormSelect>
            </div>
            <div className="d-flex py-1">
              <h6 className="mx-2 m-0 align-self-center">{t('Period')}</h6>
              <DateFilter
                value={period}
                options={['y', 'cm', 'cy', 'x', 'xx']}
                disabled={loading}
                onChange={(value) => {
                  setPeriod(value)
                }}
              />
            </div>
            { !multipleInverters &&
              <div className="d-flex py-1">
                <CButton
                  color="primary"
                  disabled={loading}
                  className="mx-2"
                  data-testid={"submit-button-top"}
                  onClick={() => { filterGenerators() }}
                >
                  {t('Submit')}
                </CButton>
              </div>
            }
          </CCol>
        </CRow>
      </CCardHeader>

      <CCardBody>

      { multipleInverters &&
        <CRow className={'py-3 mb-4 mx-0 bg-light'} style={{ borderRadius: '3px' }}>
          <CCol sm="10" className={'d-flex '}>
            <h6 className="mx-2 my-2 pt-1" style={{ lineHeight: 1.2, minWidth: '110px' }}>
              {t('Select inverter')}:
            </h6>

            {generatorsLoaded && (
              <div>
                {generators.map((gen, index) => (
                  <CButton
                    key={gen.id}
                    data-testid={"btn-gen-"+gen.id}
                    style={{ backgroundColor: generatorColors[gen.code], color: 'white' }}
                    className={
                      (selectedGenerators.includes(gen.id) ? 'selected' : '') +
                      ' btn-generator mx-1 my-1'
                    }
                    onClick={() => selectGenerator(gen.id)}
                    id={gen.id}
                  >
                    {gen.name}
                  </CButton>
                ))}
              </div>
            )}
          </CCol>
          <CCol sm="2" className="text-end d-flex flex-end flex-justify-end">
            <CButton
              disabled={selectedGenerators.length === 0}
              color="primary"
              className="mx-2 mb-1"
              onClick={() => filterGenerators()}
              data-testid={"submit-button"}
            >
              {t('Submit')}
            </CButton>
          </CCol>
        </CRow>
        }

        {generatorsSelected && (
          <div>
            {!loading || dataLoadError ? (
              <div>
                <div style={{ marginBottom: '50px' }}>
                  <h4 className="pb-2 mb-4 border-bottom">{t('Performance Ratio')}</h4>
                  <div className="d-inline-block text-left float-left" style={{ width: '50%' }}>
                    %
                  </div>
                  <div className="text-left" style={{ width: '100%' }}></div>
                  <Line data={graphData} options={options} />
                  <CRow
                    className="text-center d-block mt-2"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {groupBy}
                  </CRow>
                </div>

                <div style={{ marginBottom: '50px' }}>
                  <h4 className="pb-2 mb-4 border-bottom">{t('Production and Irradiance')}</h4>
                  <div className="d-inline-block text-left float-left" style={{ width: '50%' }}>
                    MWh
                  </div>
                  <div className="d-inline-block text-end float-right" style={{ width: '50%' }}>
                    Kwh/m2
                  </div>
                  <Line data={graphData2} options={options2} />
                  <CRow
                    className="text-center d-block mt-2"
                    style={{ textTransform: 'capitalize' }}
                  >
                    {groupBy}
                  </CRow>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <CSpinner className="loading-spinner" color="#321fdb" />
              </div>
            )}
          </div>
        )}
      </CCardBody>
    </CCard>
  )
}

export default Performance
