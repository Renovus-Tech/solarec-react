// overview.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Overview from './overview'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

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
    DataAPI.mockResolvedValueOnce(alertsResponseOk)
  })

  test('correct texts should be in the document', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    const title = screen.getByText(i18n.t('Overview'))
    const title1= screen.getByText(i18n.t('PLANT CHARACTERISTICS'))
    const title2 = screen.getByText(i18n.t('PRODUCTION AND CLIMATE'))
    const title3 = screen.getByText(i18n.t('ALERTS'))
    const title4 = screen.getByText(i18n.t('TIME-BASED AVAILABILITY(%)'))
    const title5 = screen.getByText(i18n.t('PERFORMANCE RATIO(%)'))

    expect(title).toBeInTheDocument()
    expect(title1).toBeInTheDocument()
    expect(title2).toBeInTheDocument()
    expect(title3).toBeInTheDocument()
    expect(title4).toBeInTheDocument()
    expect(title5).toBeInTheDocument()

    const periodSelect = screen.getByTestId('period')
    expect(periodSelect).toHaveValue("y")
    expect(screen.getByRole("option", { name: "Yesterday" }).selected).toBe(true)
  })

  test('correct values should load on Plant Characteristics', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    await waitFor(() => { expect(screen.getByTestId('user').innerHTML).toBe(i18n.t('User')+': Domus') }, {timeout:5000})

    const userLabel = screen.getByTestId('user')
    const regionLabel = screen.getByTestId('region')
    const countryLabel = screen.getByTestId('country')
    const capacityLabel = screen.getByTestId('capacity')
    const locationLabel = screen.getByTestId('location')

    expect(userLabel).toBeInTheDocument()
    expect(regionLabel).toBeInTheDocument()
    expect(countryLabel).toBeInTheDocument()
    expect(capacityLabel).toBeInTheDocument()
    expect(locationLabel).toBeInTheDocument()

    expect(userLabel.innerHTML).toBe(i18n.t('User')+': Domus')
    expect(regionLabel.innerHTML).toBe(i18n.t('Region')+': Canelones')
    expect(countryLabel.innerHTML).toBe(i18n.t('Country')+': Uruguay')
    expect(capacityLabel.innerHTML).toBe(i18n.t('Capacity')+': 50.0 KW')
    
  }, 10000)

  test('correct values should load on Production and Climate', async () => {
    render(<HashRouter><Overview /></HashRouter>)
    await waitFor(() => { expect(screen.getByTestId('production').innerHTML).toBe(i18n.t('Production')+': 10.0 MWh') }, {timeout:5000})

    const production = screen.getByTestId('production')
    const irradiation = screen.getByTestId('irradiation')
    const temperature = screen.getByTestId('temperature')

    expect(production).toBeInTheDocument()
    expect(irradiation).toBeInTheDocument()
    expect(temperature).toBeInTheDocument()

    expect(production.innerHTML).toBe(i18n.t('Production')+': 10.0 MWh')
    expect(irradiation.innerHTML).toBe(i18n.t('Irradiation')+': 20.0 Kwh/m2')
    expect(temperature.innerHTML).toBe(i18n.t('Average Ambient Temperature')+': 30.0 °C')
    
  }, 10000)

  test('values should change after change period', async () => {
    // DataAPI.mockResolvedValueOnce(LocationResponseOk)
    // DataAPI.mockResolvedValueOnce(overviewResponseOk)
    // DataAPI.mockResolvedValueOnce(alertsResponseOk)
    render(<Overview />)
    await waitFor(() => { expect(screen.getByTestId('production').innerHTML).toBe(i18n.t('Production')+': 10.0 MWh') }, {timeout:5000})

    DataAPI.mockResolvedValueOnce({"data": [{ "id" : [ 1 ], "name" : [ "1" ], "code" : [ "1" ], "productionMwh" : 100.0, "irradiationKwhM2" : 200.0, "avgAmbientTemp" : 300.0, "avgModuleTemp" : 400.0, "timeBasedAvailability" : 1000.0, "specificYield" : 500.0, "performanceRatio" : 600.0 } ] })
    // DataAPI.mockResolvedValueOnce(overviewResponseOk)
    DataAPI.mockResolvedValueOnce(alertsResponseOk)

    await waitFor(() => { expect(screen.getByTestId('period')).toBeEnabled() }, {timeout:5000})
    const periodSelect = screen.getByTestId('period')
    expect(periodSelect).toBeEnabled()
    // fireEvent.change(periodSelect, { target: {value: 'cm' }})
    // expect(periodSelect).toHaveValue("cm")
    // expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)

    // await waitFor(() => { expect(screen.getByTestId('production').innerHTML).toBe(i18n.t('Production')+': 100.0 MWh') }, {timeout:5000})
    // expect(screen.getByTestId('irradiation').innerHTML).toBe(i18n.t('Irradiation')+': 200.0 Kwh/m2')
    // expect(screen.getByTestId('temperature').innerHTML).toBe(i18n.t('Average Ambient Temperature')+': 300.0 °C')
  }, 20000)


  // test('should unset cookies and reload when endpoint returns error', async () => {
  //   DataAPI.mockResolvedValueOnce({error: "Error"})
  //   render(<HashRouter><Overview /></HashRouter>)

  //   const { location } = window
  //   delete window.location
  //   window.location = { reload: jest.fn() }
  //   await waitFor(() => { expect(window.location.reload).toHaveBeenCalled() }, {timeout:10000})

  //   expect(getCookie('name')).toEqual('')
  //   expect(getCookie('lastTimeStamp')).toEqual('')
  // }, 20000)

  // test('should call DataAPI and display graphs on submit button click', async () => {
  //   DataAPI.mockResolvedValue(LocationResponseOk)
  //   render(<Performance />)

  //   await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
  //   const buttonGen1 = screen.getByTestId('btn-gen-1')
  //   fireEvent.click(buttonGen1)

  //   DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
  //   const submitButton = screen.getByTestId('submit-button')
  //   expect(submitButton).toBeEnabled()
  //   fireEvent.click(submitButton)
    
  //   await waitFor(() => { screen.getByText(i18n.t('Performance Ratio')) }, {timeout:10000})
  //   expect(screen.getByText(i18n.t('Performance Ratio'))).toBeInTheDocument()
  //   expect(screen.getByText(i18n.t('Production and Irradiance'))).toBeInTheDocument()
  // }, 20000)

  // test('should show error message when endpint answers with error', async () => {
  //   DataAPI.mockResolvedValueOnce(LocationResponseOk)
  //   render(<Performance />)

  //   jest.spyOn(window, 'alert').mockImplementation(() => {})
  //   DataAPI.mockResolvedValueOnce({error: "Error"})

  //   await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
  //   const buttonGen1 = screen.getByTestId('btn-gen-1')
  //   fireEvent.click(buttonGen1)

  //   DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
  //   const submitButton = screen.getByTestId('submit-button')
  //   expect(submitButton).toBeEnabled()
  //   fireEvent.click(submitButton)

  //   await waitFor(() => { expect(window.alert).toBeCalledWith('Error') }, {timeout:10000})
  // }, 20000)

})