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
  CTable,
  CFormCheck
} from '@coreui/react'

import DataAPI from '../../../helpers/DataAPI.js'
import {getCookie} from '../../../helpers/sessionCookie.js'
import { useTranslation } from 'react-i18next'


const ReportsSettings = () => {

  const { t, i18n } = useTranslation();

  const [tableData, setTableData] = useState([]);
  const [configData, _setConfigData] = useState([]);
  const configDataRef = useRef(configData);
  const setConfigData = data => {
    configDataRef.current = data;
    _setConfigData(data);
  };
  const [changesMade, setChangesMade] = useState(false);
  const [tableFields, setTableFields] = useState([]);
  const [loaded, setLoaded] = useState(false);

  const [saving, setSaving] = useState(false);
  
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

          let locations = [];
          let rows = [];
          response.locations.forEach((location,index) => {
              locations[location.id] = location.name;
              rows[location.id] = [];
          });

          response.settings.forEach((setting,index) => {
            if (rows[setting.locId] !== undefined)
              rows[setting.locId][setting.repId] = setting.selected;
          });

          let data = []


          let tableData = [];
          rows.map((row, locId) => {
            let rowTableData = [];
            let rowData = [];
            row.map((setting, repId) => {
              rowTableData[repId] = (<CFormCheck  name={"check-"+locId+"-"+repId} className={'mx-0 mt-1'} defaultChecked={setting} onChange={(ev)=>updateData(ev)}/>)
              rowData[repId] = setting;
            });
            rowTableData['park'] = locations[locId];
            tableData.push(rowTableData);
            data[locId] = rowData;
          });


          setConfigData(data);
          
          let reports = [];
          response.reports.forEach((report,index) => {
            reports[report.id] = report.title;
          });

          const tableFields = reports.map((title, id) => ({
              key: id,
              label: title
            }
          ));
          tableFields.unshift({
            key: 'park',
            label: i18n.t('Park')
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
  const data = configDataRef.current;
  data.map((row,locId) => (
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
        setMessage(i18n.t('Your preferences were successfully updated'))
      }
    })
}

  return (
    <CCard>
      <CCardHeader>
        <CRow>
          <CCol sm="6">
            <h3 id="traffic" className="card-title mb-0">
              {i18n.t('Reports')}
            </h3>
            <div className="text-medium-emphasis">{i18n.t('Settings')}</div>
          </CCol>
        </CRow>
      </CCardHeader>
      <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>
        <CRow>
          <CCol sm="6">
            { saved &&
              <CAlert color="success" >{message}</CAlert>
            }
            <h5 className={'mb-4'} >{i18n.t('Please select reports you wish to receive by e-mail')}</h5>
            {loaded &&
              <div>
                <CTable
                  items={tableData}
                  columns={tableFields}
                  striped
                />
              </div>
            }
          </CCol>
        </CRow>

        <CRow>
          <CCol xs="12">
            <div className={'border-top mt-2 pt-4'}>
              <CButton onClick={saveChanges} color="primary" disabled={saving || !changesMade} className="px-4 mr-3">{i18n.t('Save Preferences')}</CButton>
            </div>
          </CCol>
        </CRow>

      </CCardBody>
    </CCard>
  )
}

export default ReportsSettings
