import React, { useState, useEffect, useRef } from 'react'
import {
  CCard,
  CCardBody,
  CCardGroup,
  CCardHeader,
  CRow,
  CCol,
  CAlert,
  CLabel,
  CButton,
  CDataTable,
  CInputCheckbox
} from '@coreui/react'

import DataAPI from '../../../helpers/DataAPI.js'
import {getCookie} from '../../../helpers/sessionCookie.js'


const Reports = () => {

  const [tableData, setTableData] = useState([]);
  const [configData, _setConfigData] = useState([]);
  const configDataRef = useRef(configData);
  const setConfigData = data => {
    configDataRef.current = data;
    _setConfigData(data);
  };
  const [tableFields, setTableFields] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [scopedSlots, setScopedSlots] = useState(false);
  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);

  const [saving, setSaving] = useState(false);
  const [changesMade, setChangesMade] = useState(false);
  const [saved, setSaved] = useState(false);
  const [message, setMessage] = useState('');


  useEffect(() => {
    loadConfiguration();
  }, []);

  

  const loadConfiguration = () => {
    
    DataAPI({
      'endpoint': 'report/configure',
      'method': 'GET'
    }).then(
      response => {

        if (response.error) {
          if (response.error.message) {
            return(alert(response.error.message))
          } else {
            return(alert(response.error)) 
          }
        }

        if (response.loaded) {
          
          setReports(response.reports)

          let locations = [];
          let rows = [];
          response.locations.forEach((location,index) => {
              locations[location.id] = location.name;
              rows[location.id] = [];
          });
          setLocations(locations)

          response.settings.forEach((setting,index) => {
            if (rows[setting.locId] != undefined)
              rows[setting.locId][setting.repId] = setting.selected;
          });

          let data = []


          let tableData = [];
          rows.map((row, locId) => {
            let rowData = [];
            row.map((setting, repId) => {
              rowData[repId] = setting;
            });
            rowData['park'] = locations[locId];
            tableData.push(rowData);
            data[locId] = rowData;
          });


          setConfigData(data);
          

          let sSlots = {};
          let reports = [];
          response.reports.forEach((report,index) => {
            reports[report.id] = report.title;
            sSlots[report.id] = (item,x) => {
              if (item[report.id]) {
                return (
                <td className={'align-top'}>
                  <CInputCheckbox  name={"check-"+response.locations[x].id+"-"+report.id} className={'mx-0 mt-1'} defaultChecked onChange={(ev)=>updateData(ev)}/>
                </td>)
              } else {
                return (
                <td className={'align-top'}>
                  <CInputCheckbox  name={"check-"+response.locations[x].id+"-"+report.id} className={'mx-0 mt-1'} onChange={(ev)=>updateData(ev)}/>
                </td>)
              }
            }
          });
          setScopedSlots(sSlots);

          const tableFields = reports.map((title, id) => ({
              key: id,
              label: title
            }
          ));
          tableFields.unshift({
            key: 'park',
            label: 'Park'
          });

          setTableData(tableData);
          setTableFields(tableFields);

          setLoaded(true);

        }

      }
    );


  }

const updateData = (ev) => {
  let name = ev.target.name;
  let nameSplit = name.split('-');
  let locId = nameSplit[1];
  let repId = nameSplit[2];
  let data = configDataRef.current;
  data[locId][repId] = ev.target.checked;
  setConfigData(data);
  setChangesMade(true);
}

const saveChanges = () => {

  setSaving(true);

  const body = {}
  let settings = [];
  configDataRef.current.map((row,locId) => (
    row.map((setting,repId) => {
      settings.push(
      {
        "locId": locId,
        "repId": repId,
        "selected": setting
      })}
    )
  ))
  body.settings = settings;
  
    
  DataAPI({
    'endpoint': 'report/configure',
    'method': 'POST',
    'body': body
  }).then(
    response => {

      setSaving(false)
      setChangesMade(false)

      if (response.error) {
        if (response.error.message) {
          return(alert(response.error.message))
        } else {
          return(alert(response.error)) 
        }
      }

      if (response.saved) {
        setSaved(true);
        setMessage('Your preferences were successfully updated')
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
            <div className="text-medium-emphasis">E-mail settings</div>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>
        <CRow>
          <CCol sm="6">
            { saved &&
              <CAlert color="success" >{message}</CAlert>
            }
            <h5 className={'mb-4'} >Please select reports you wish to receive by e-mail</h5>
            {loaded &&
              <div>
                <CDataTable
                      items={tableData}
                      fields={tableFields}
                      striped
                      scopedSlots = {scopedSlots}
                    />

                
              </div>
            }

          </CCol>
        </CRow>

        {changesMade &&
          <CRow>
            <CCol xs="12">
              <div className={'border-top mt-2 pt-4'}>
                <CButton onClick={saveChanges} color="primary" disabled={saving} className="px-4 mr-3">Save Preferences</CButton>
              </div>
            </CCol>
          </CRow>
        }

      </CCardBody>
    </CCard>
  )
}

export default Reports
