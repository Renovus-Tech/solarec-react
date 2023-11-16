import React, { useState, useEffect } from 'react'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CDataTable,
  CRow,
  CCol,
  CSpinner,
  CBadge
} from '@coreui/react'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

import { freeSet } from '@coreui/icons'
import DataAPI from '../../helpers/DataAPI.js'
import { formatDateWithSeconds, round, formatNumber } from '../../helpers/utils.js'
import CIcon from '@coreui/icons-react';
import {setCookie,getCookie} from '../../helpers/sessionCookie.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {

  const [lastUpdated, setLastUpdated] = useState('');

  const [loading, setLoading] = useState(false);
  const [dataLoadError, setDataLoadError] = useState(false);

  const [hasSolarParks, setHasSolarParks] = useState(false);

  const [solarGeneratorsTableData, setSolarGeneratorsTableData] = useState([]);
  const [tableDataSolarCurrentStatus, setTableDataSolarCurrentStatus] = useState(false);

  const fetchData = () => {

    DataAPI(
      {
      'method': 'GET',
      'endpoint': 'solar/dashboard/now',
      // 'body': body
    }).then(function (responseData) {

      setLoading(false);
      if (responseData.error) {
        setDataLoadError(true);
          if (responseData.error.message) {
          return(alert(responseData.error.message))
          } else {
          return(alert(responseData.error)) 
          }
      }

      if (responseData.dateData != undefined)
        setLastUpdated(formatDateWithSeconds(responseData.dateData));

      if (responseData.locations.length > 0)
        setHasSolarParks(true);

      const tableDataSolarCurrentStatus = {
        items: [{
                  item:"Production:",
                  now:formatNumber(round(responseData.dataNow.production,1))+" MWh",
                },
                {
                  item:"Irradiance average:",
                  now:round(responseData.dataNow.irradiance,2)+" kW/m2",
                },
                {
                  item:"Inverters in operation:",
                  now:responseData.amountGeneratorsOk+"/"+responseData.amountGenerators,
                },
              ],
        fields:  [
          { key: 'item', label: '' },
          'now'
        ]
      }
      setTableDataSolarCurrentStatus(tableDataSolarCurrentStatus)

      const solarGeneratorsTableData = [];
      responseData.locations.forEach((rL,index) => {
        if(rL.generators.length > 0) {
          const park = rL.name;
          const generatorStatus = rL.generators.map((d) => {
            let line = {}
            line.inverter = d.code
            line.production = (d.dataNow.production!=undefined?formatNumber(round(d.dataNow.production,3)):"")
            line.irradiance = ""
            return line
          });

          const total =  {
            inverter: "Total",
            production: formatNumber(round(rL.dataNow.production,3)),
            irradiance: formatNumber(round(rL.dataNow.irradiance,3))
          };
      
          const tableData = {
            park: park,
            items: [total].concat(generatorStatus),
            fields:  [
              'inverter',
              { key: 'production', label: 'Production (MWh)'},
              { key: 'irradiance', label: 'Irradiance (kw/m2)' }
            ]
          }
    
          solarGeneratorsTableData.push(tableData);
        }
        
      });

      setSolarGeneratorsTableData(solarGeneratorsTableData);

    })




  }

  useEffect(() => {
    loadGenerators();
    const interval = setInterval(() => fetchData(), 5000)
    return () => clearInterval(interval) // cleanup
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
        else if (response  && !response.error) {
          // setGenerators(response.generators);
          setLoading(true);
          fetchData();
        }
      }
    );
  }

  const getBadge = status => {
    switch (status) {
      case 'green': return 'success'
      case 'red': return 'danger'
      default: return ''
    }
  }


  return (
    <CCard>
      <CCardHeader>
          <CRow>
            <CCol xs="10">
              <h3 id="traffic" className="card-title mb-0">
                Current Status
              </h3>
              <div className="text-medium-emphasis">Last updated on: {lastUpdated}</div>
            </CCol>
            <CCol xs="2" className="text-right d-flex flex-center flex-justify-end">
              <CIcon content={freeSet.cilReload} className={"cursor-pointer animate-rotate"} size={'lg'} title={'Refresh'}
                onClick={() => fetchData()}/>
            </CCol>
            
          </CRow>


        </CCardHeader>
        {!loading || dataLoadError
                    ? 
          <CCardBody>

            <CRow>

              { hasSolarParks &&
                <CCol xl={"12"} className="col-solar px-sm-4 mb-4">

                <div style={{marginBottom:'30px'}}>
                      <CRow>
                      
                        { tableDataSolarCurrentStatus &&
                          <CCol xl={"6"} className="px-sm-4 mb-4">
                            <h4>Solar Portfolio</h4>
                            <CDataTable
                                addTableClasses="current-status-table"
                                striped
                                items={tableDataSolarCurrentStatus.items}
                                fields={tableDataSolarCurrentStatus.fields}
                              />
                          </CCol>
                        }

                      </CRow>
                    </div>

                </CCol>
              }

            </CRow>

            <CRow>

              { hasSolarParks &&

                <CCol xl={"12"} className="col-solar px-sm-4 mb-4">
                  <div style={{marginBottom:'50px'}}>
                    <CRow>
                    
                      { solarGeneratorsTableData.length > 0 &&
                        solarGeneratorsTableData.map(park => (  
                        <CCol xl={"6"} className="px-sm-4 mb-4" key={'col-'+park.park}>
                          <h5>{park.park}</h5>
                          <CDataTable
                              key={park.park}
                              addTableClasses="monitor-park-table table-header-center"
                              striped
                              items={park.items}
                              fields={park.fields}
                              // itemsPerPage={15}
                              // pagination
                              sorter
                              scopedSlots = {{
                                'indicator':
                                  (item)=>(
                                    <td>
                                      <CBadge color={getBadge(item.indicator)}>
                                      </CBadge>
                                    </td>
                                  ),
                                  'production':
                                  (item)=>(
                                    <td className="text-right">
                                      {item.production}
                                    </td>
                                  ),
                                  'irradiance':
                                  (item)=>(
                                    <td className="text-right">
                                      {item.irradiance}
                                    </td>
                                  )
                              }}
                            />
                        </CCol>
                        ))
                      }

                    </CRow>
                  </div>
                  
                </CCol>
              }

            </CRow>


          </CCardBody>
          :
          <CCardBody style={{textAlign:'center'}}>
            <CSpinner 
              className="loading-spinner"
              color='#321fdb'
            />
          </CCardBody>
        }
    </CCard>
  )
}

export default Dashboard
