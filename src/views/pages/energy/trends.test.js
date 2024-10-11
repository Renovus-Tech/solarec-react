/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// trends.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import { getCookie } from '../../../helpers/sessionCookie.js'
import Trends from './trends'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

jest.mock('react-chartjs-2', () => ({ Line: () => null }))

const LocationResponseOneGenOk = {
  "id": 1,
  "code": "Domus",
  "name": "Domus",
  "address": "Canelones, Uruguay",
  "state": "Canelones",
  "country": "Uruguay",
  "countryAlpha2": "UY",
  "latitude": -34.7833,
  "longitude": -56.0112,
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

const LocationResponseTwoGenOk = {
  "id": 1,
  "code": "Domus",
  "name": "Domus",
  "address": "Canelones, Uruguay",
  "state": "Canelones",
  "country": "Uruguay",
  "countryAlpha2": "UY",
  "latitude": -34.7833,
  "longitude": -56.0112,
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
      },
      {
        "id": 2,
        "locationId": 2,
        "code": "2",
        "name": "2",
        "description": null,
        "latitude": -31.7833,
        "longitude": -58.0112,
        "brand": "ABB",
        "model": "ABB Trio 50.0",
        "serialNumber": "19384221",
        "ratePower": 30.0,
        "dataDefinitionId": null,
        "dataDefinition": null,
        "powerCurve": [],
        "neighbors": null
    }
  ]
}

const trendsResponseOk = {
  "chart" : {
    "from" : "2024/01/23 00:00:00",
    "to" : "2024/01/23 23:59:59",
    "resultCode" : 200,
    "resultText" : "",
    "groupBy" : "hour"
  },
  "data" : [ {
    "from" : "2024/01/23 00:00:00",
    "to" : "2024/01/23 00:59:59",
    "genData" : [ {
      "id" : 1,
      "name" : "1",
      "code" : "1",
      "productionMwh" : 0.0,
      "acProductionMwh" : 0.0,
      "irradiationKwhM2" : 0.0,
      "predictedACProductionMwh" : 0.0
    } ],
    "totalProductionMwh" : 0.0,
    "totalACProductionMwh" : 0.0,
    "totalIrradiationKwhM2" : 0.0,
    "totalPredictedACProductionMwh" : 0.0,
    "avgAmbientTemp" : 0.0,
    "avgModuleTemp" : 0.0
  }]
}

describe("Trends", () => {

  beforeEach(() => {
    global.fetch = jest.fn()

    // jest.clearAllMocks()
    // DataAPI.mockResolvedValue(DataApiResponseOk)
  })

  test('correct texts should be in the document', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOneGenOk)
    DataAPI.mockResolvedValueOnce(trendsResponseOk)
    render(<HashRouter><Trends /></HashRouter>)
    await waitFor(() => { 
      const title = screen.getByText(i18n.t('Trends'))
      const periodLabel = screen.getByText(i18n.t('Period'))
      const periodSelect = screen.getByTestId('period')
      expect(title).toBeInTheDocument()
      expect(periodLabel).toBeInTheDocument()
      expect(periodSelect).toBeInTheDocument()

      expect(periodSelect).toHaveValue("cm")
      expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)
    }, {timeout:5000})
  }, 20000)

  test('correct texts should be in the document with one gen', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOneGenOk)
    DataAPI.mockResolvedValueOnce(trendsResponseOk)
    render(<HashRouter><Trends /></HashRouter>)
    await waitFor(() => { 
      const filtersSubmit = screen.getByTestId('submit-button-top')
      expect(filtersSubmit).toBeInTheDocument()
      // expect(filtersSubmit).toBeDisabled()
    }, {timeout:5000})
  }, 20000)

  test('correct texts should be in the document with more than one gen', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<HashRouter><Trends /></HashRouter>)
    await waitFor(() => { 
      const selectInverterLabel = screen.getByText(i18n.t('Select inverters')+':')
      const filtersSubmit = screen.getByTestId('submit-button')
      expect(selectInverterLabel).toBeInTheDocument()
      expect(filtersSubmit).toBeInTheDocument()
      expect(filtersSubmit).toBeEnabled()
    }, {timeout:5000})
  }, 20000)

  test('submit button should be enabled after select inverter', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<HashRouter><Trends /></HashRouter>)
    await waitFor(() => {  
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)
      const filtersSubmit = screen.getByText(i18n.t('Submit'))
      expect(filtersSubmit).toBeEnabled()
    }, {timeout:5000})
  }, 20000)

  test('should change selects options', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<HashRouter><Trends /></HashRouter>)
    await waitFor(() => {  
      const periodSelect = screen.getByTestId('period')
      fireEvent.change(periodSelect, { target: {value: 'cm' }})
      expect(periodSelect).toHaveValue("cm")
      expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)
    })
  }, 20000)

  test('should unset cookies and reload when endpoint returns error', async () => {
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Trends /></HashRouter>)

    // const { location } = window
    delete window.location
    window.location = { reload: jest.fn() }
    await waitFor(() => { 
      expect(window.location.reload).toHaveBeenCalled() 
    }, {timeout:10000})

    await waitFor(() => {  
      expect(getCookie('name')).toEqual('')
      expect(getCookie('lastTimeStamp')).toEqual('')
    })
  }, 20000)

  test('should call DataAPI and display graphs on submit button click', async () => {
    DataAPI.mockResolvedValue(LocationResponseTwoGenOk)
    render(<Trends />)

    await waitFor(() => {  
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)
      DataAPI.mockResolvedValueOnce(trendsResponseOk)
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    }, {timeout:5000})

    await waitFor(() => {  
      expect(screen.getByText(i18n.t('Production and Irradiance'))).toBeInTheDocument()
    }, {timeout:10000})
  }, 20000)

  test('should show error message when endpint answers with error', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<Trends />)
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: "Error"})
    await waitFor(() => {  
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)
      DataAPI.mockResolvedValueOnce(trendsResponseOk)
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    }, {timeout:5000})
    await waitFor(() => { 
      expect(window.alert).toHaveBeenCalledWith('Error') 
    }, {timeout:10000})
  }, 20000)

  test('should show error message when endpint answers with error with message', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<Trends />)
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: { message: "Error" }})
    await waitFor(() => {  
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)
      DataAPI.mockResolvedValueOnce(trendsResponseOk)
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    }, {timeout:5000})
    await waitFor(() => { 
      expect(window.alert).toHaveBeenCalledWith('Error') 
    }, {timeout:10000})
  }, 20000)

})