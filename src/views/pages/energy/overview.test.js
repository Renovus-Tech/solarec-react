/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// overview.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Overview from './overview'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

jest.mock('react-chartjs-2', () => ({ Doughnut: () => null }))

const LocationResponseOk = {
  "id": 1,
  "code": "Domus",
  "name": "Domus",
  "address": "Canelones, Uruguay",
  "state": "Canelones",
  "country": "Uruguay",
  "countryAlpha2": "UY",
  "latitude": -34.7833,
  "longitude": -56.0112,
  "outputCapacity": 50.0,
  "outputTotalCapacity": 50.0,
  "referenceDensity": 1.0,
  "type": "solar",
  "demoDate": null,
  "dataDefinitionId": 1,
  "dataDefinition": {
      "id": 1,
      "name": "Canary Excel Initial Load",
      "description": null
  },
  "generators": [
      {
          "id": 1,
          "locationId": 1,
          "code": "1",
          "name": "1",
          "description": null,
          "latitude": -34.7833,
          "longitude": -56.0112,
          "brand": "ABB",
          "model": "ABB Trio 50.0",
          "serialNumber": "19384220",
          "ratePower": 50.0,
          "dataDefinitionId": null,
          "dataDefinition": null,
          "powerCurve": [],
          "neighbors": null
      }
  ]
}

const overviewResponseOk = {
  "chart" : {
    "from" : "2024/01/28 00:00:00",
    "to" : "2024/01/28 23:59:59",
    "resultCode" : 200,
    "resultText" : ""
  },
  "data" : [ {
    "id" : [ 1 ],
    "name" : [ "1" ],
    "code" : [ "1" ],
    "productionMwh" : 10.0,
    "irradiationKwhM2" : 20.0,
    "avgAmbientTemp" : 30.0,
    "avgModuleTemp" : 40.0,
    "timeBasedAvailability" : 100.0,
    "specificYield" : 50.0,
    "performanceRatio" : 60.0
  } ]
}

const overviewCO2ResponseOk = {
  "co2Emissons" : 0.354,
  "co2Avoided" : 0.0249
}

const alertsResponseOk = [
  {
      "date": "2024-01-11 18:31:45",
      "type": 1,
      "firstView": false,
      "message": "Performance ratio on 2022-09-17 for generator 1 was 81.648%, which is 9.071% lower than the previous day (89.794%)",
      "extraInfo": null
  },
  {
      "date": "2024-01-11 18:31:45",
      "type": 1,
      "firstView": false,
      "message": "Performance ratio on 2022-11-02 for generator 1 was 53.069%, which is 50.986% lower than the previous day (108.273%)",
      "extraInfo": null
  }
]

describe("Performance", () => {

  beforeEach(() => {
    global.fetch = jest.fn()
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    DataAPI.mockResolvedValueOnce(overviewResponseOk)
    DataAPI.mockResolvedValueOnce(overviewCO2ResponseOk)
    DataAPI.mockResolvedValueOnce(alertsResponseOk)
  })

  test('correct texts should be in the document', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    await waitFor(() => {  
      const title = screen.getByText(i18n.t('Overview'))
      const title1= screen.getByText(i18n.t('PLANT CHARACTERISTICS'))
      const title2 = screen.getByText(i18n.t('PRODUCTION AND CLIMATE'))
      const title3 = screen.getByText(i18n.t('ALERTS'))
      const title4 = screen.getByText(i18n.t('TIME-BASED AVAILABILITY(%)'))
      const title5 = screen.getByText(i18n.t('PERFORMANCE RATIO(%)'))
      const title6 = screen.getByText(i18n.t('CO2 AVOIDED'))

      expect(title).toBeInTheDocument()
      expect(title1).toBeInTheDocument()
      expect(title2).toBeInTheDocument()
      expect(title3).toBeInTheDocument()
      expect(title4).toBeInTheDocument()
      expect(title5).toBeInTheDocument()
      expect(title6).toBeInTheDocument()

      const periodSelect = screen.getByTestId('period')
      expect(periodSelect).toHaveValue("y")
      expect(screen.getByRole("option", { name: "Yesterday" }).selected).toBe(true)
    })
  })

  test('correct values should load on Plant Characteristics', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    await waitFor(() => { 
      expect(screen.getByTestId('user').innerHTML).toBe('Domus') 
      expect(screen.getByTestId('region').innerHTML).toBe('Canelones')
      expect(screen.getByTestId('country').innerHTML).toBe('Uruguay')
      expect(screen.getByTestId('capacity').innerHTML).toBe('50.0 KW')
      expect(screen.getByTestId('co2-emissions').innerHTML).toBe('0.354 tons')
    }, {timeout:5000})
  }, 10000)

  test('correct value should load on CO2 Avoided', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    await waitFor(() => { 
      expect(screen.getByTestId('co2-avoided').innerHTML).toBe('24.9')
    }, {timeout:5000})
  }, 10000)

  test('correct values should load on Production and Climate', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    await waitFor(() => { 
      expect(screen.getByTestId('production').innerHTML).toBe(i18n.t('Production')+': 10.0 MWh') 

      const production = screen.getByTestId('production')
      const irradiation = screen.getByTestId('irradiation')
      const temperature = screen.getByTestId('temperature')

      expect(production).toBeInTheDocument()
      expect(irradiation).toBeInTheDocument()
      expect(temperature).toBeInTheDocument()

      expect(production.innerHTML).toBe(i18n.t('Production')+': 10.0 MWh')
      expect(irradiation.innerHTML).toBe(i18n.t('Irradiation')+': 20.0 Kwh/m2')
      expect(temperature.innerHTML).toBe(i18n.t('Average Ambient Temperature')+': 30.0 °C')
    }, {timeout:5000})
    
  }, 10000)

  test('values should change after change period', async () => {
    render(<Overview />)
    await waitFor(() => { 
      expect(screen.getByTestId('production').innerHTML).toBe(i18n.t('Production')+': 10.0 MWh') 
      DataAPI.mockResolvedValueOnce({"data": [{ "id" : [ 1 ], "name" : [ "1" ], "code" : [ "1" ], "productionMwh" : 100.0, "irradiationKwhM2" : 200.0, "avgAmbientTemp" : 300.0, "avgModuleTemp" : 400.0, "timeBasedAvailability" : 1000.0, "specificYield" : 500.0, "performanceRatio" : 600.0 } ] })
      DataAPI.mockResolvedValueOnce(alertsResponseOk)
    }, {timeout:5000})

    await waitFor(() => { 
      expect(screen.getByTestId('period')).toBeEnabled() 
      const periodSelect = screen.getByTestId('period')
      expect(periodSelect).toBeEnabled()
    }, {timeout:5000})
  }, 20000)


})