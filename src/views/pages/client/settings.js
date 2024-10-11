import React, { useState, useEffect } from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import { useTranslation } from 'react-i18next'
import DataAPI from '../../../helpers/DataAPI.js'

const Settings = () => {
  const { t } = useTranslation()
  const [clientPreferencesChanged, setClientPreferencesChanged] = useState(false)
  const [clientPreferencesSaved, setClientPreferencesSaved] = useState(false)

  const [settingsLoaded, setSettingsLoaded] = useState(false)
  const [categories, setCategories] = useState([])
  const [settings, setSettings] = useState([])
  const [count, setCount] = useState(0)

  useEffect(() => {
    loadUser()
  }, [])

  const loadUser = () => {
    DataAPI({
      endpoint: 'admin/clients/current',
      method: 'GET',
    }).then((response) => {
      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      }

      const settings = []

      const categories = response.settings.map((setting, index) => {
        var cat = { category: setting.category, categoryLabel: setting.categoryLabel }
        settings[setting.category] = []
        return cat
      }).filter((elem, index, self) => 
        self.findIndex(obj => obj.category === elem.category) === index
      )

      response.settings.forEach((setting) => {
        settings[setting.category].push(setting)
      })

      setCategories(categories)
      setSettings(settings)
      setSettingsLoaded(true)
    })
  }

  const saveClientPreferences = () => {
    if (clientPreferencesChanged) savePreferences()
  }

  const savePreferences = () => {
    setClientPreferencesChanged(false)
    const body = {}
    let sett = []
    categories.forEach((cat) => {
      settings[cat.category].forEach((setting) => {
        sett.push({name:setting['name'],value:setting['value']})
      })
    })
    body.settings = sett
    DataAPI({
      endpoint: 'admin/clients/current',
      method: 'POST',
      body: body,
    }).then((response) => {
      if (response.error) {
        if (response.error.message) {
          return alert(response.error.message)
        } else {
          return alert(response.error)
        }
      }

      setClientPreferencesSaved(true)
    })
  }

  const handleSettingChange = (category, setting_name, new_value) => {
    let new_settings = settings
    new_settings[category] = new_settings[category].map((setting) => {
      if (setting.name === setting_name) {
        setting.value = new_value;
      }
      return setting
    })
    setSettings(new_settings)
    setClientPreferencesChanged(true)
    setCount(count + 1);
  }


  return (
    <div>
      <CRow>
        <CCol>
          <CCard sm="7" className="mb-4">
            <CCardHeader>
              <CRow>
                <CCol>
                  <h3 id="settings" className="card-title mb-0">
                    {t('Client Settings')}
                  </h3>
                </CCol>
              </CRow>
            </CCardHeader>

            <CCardBody className={'px-md-5 pb-md-5 pt-md-4'}>
              <CRow className="mb-3">
                <CCol >
                  { settingsLoaded && (
                    <CForm data-testid={"form"}>
                      
                      {categories.map((category, index) => (

                        <div key={category.category} className="mb-3">
                          <h4 className="pb-2 mb-4 border-bottom w-100">{category.categoryLabel}</h4>

                          <CRow>

                          {settings[category.category].map((setting, index) => (
                              <CCol md="6" key={setting.name}>
                            <CInputGroup className={'mb-3'} key={setting.name}>
                              <CInputGroupText data-testid={"label-"+setting.name}>
                                {setting.label}
                              </CInputGroupText>
                              <CFormInput
                                role="input"
                                aria-label={setting.name}
                                type={setting.type}
                                min={setting.min ? setting.min : ''}
                                max={setting.max ? setting.max : ''}
                                value={setting.value?setting.value:setting.valueDefault}
                                onChange={(ev) => {
                                  handleSettingChange(category.category, setting.name, ev.target.value)
                                }}
                                name={setting.name}
                                id={setting.name}
                                className={'input-sm'}
                              ></CFormInput>
                              <CInputGroupText className={'bg-white text-dark'} data-testid={"units-"+setting.name} >
                                {setting.units}
                              </CInputGroupText>
                            </CInputGroup>
                            </CCol>
                          ))}
                          </CRow>
                        </div>

                      ))}

                    </CForm>
                  )}
                </CCol>
              </CRow>

              <CRow className="mt-4">
                <CCol>
                  <CForm>
                    <CButton
                      onClick={() => {
                        saveClientPreferences()
                      }}
                      color="primary"
                      className="px-4 mr-3"
                      disabled={!clientPreferencesChanged}
                      data-testid="save-button"
                    >
                      {t('Save Preferences')}
                    </CButton>
                    {clientPreferencesSaved && !clientPreferencesChanged && (
                      <div className="text-success d-inline-block mx-3" style={{ fontWeight: '500' }}>
                        Saved!
                      </div>
                    )}
                  </CForm>
                </CCol>
              </CRow>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </div>
  )
}

export default Settings
