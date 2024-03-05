/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// performance.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import { getCookie } from '../../../helpers/sessionCookie.js'
import Performance from './performance'
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

const performanceRatioResponseOk = {
  "chart" : {
    "from" : "2024/01/23 00:00:00",
    "to" : "2024/01/23 23:59:59",
    "resultCode" : 200,
    "resultText" : "",
    "groupBy" : "week"
  },
  "data" : [ {
    "from" : "2024/01/23 00:00:00",
    "to" : "2024/01/23 23:59:59",
    "genData" : [ {
      "id" : 1,
      "name" : "1",
      "code" : "1",
      "productionMwh" : 0.0,
      "acProductionMwh" : 0.0,
      "irradiationKwhM2" : 0.0,
      "performanceRatio" : 0.0,
      "timeBasedAvailability" : 1.0
    } ],
    "totalProductionMwh" : 0.0,
    "totalACProductionMwh" : 0.0,
    "totalIrradiationKwhM2" : 0.0,
    "performanceRatio" : 0.0,
    "timeBasedAvailability" : 1.0
  } ]
}

describe("Performance", () => {

  beforeEach(() => {
    global.fetch = jest.fn()
  })

  test('correct texts should be in the document', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOneGenOk)
    DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
    render(<HashRouter><Performance /></HashRouter>)
    await waitFor(() => { 
      const title = screen.getByText(i18n.t('Performance'))
      const groupByLabel= screen.getByText(i18n.t('Group by'))
      const periodLabel = screen.getByText(i18n.t('Period'))
      const groupBySelect = screen.getByTestId('groupby')
      const periodSelect = screen.getByTestId('period')
      expect(title).toBeInTheDocument()
      expect(groupByLabel).toBeInTheDocument()
      expect(periodLabel).toBeInTheDocument()
      expect(groupBySelect).toBeInTheDocument()
      expect(periodSelect).toBeInTheDocument()

      expect(groupBySelect).toHaveValue("day")
      expect(screen.getByRole("option", { name: "Day" }).selected).toBe(true)

      expect(periodSelect).toHaveValue("cm")
      expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)
    }, {timeout:5000})
  }, 20000)

  test('correct texts should be in the document with one gen', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOneGenOk)
    DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
    render(<HashRouter><Performance /></HashRouter>)
    await waitFor(() => { 
      const filtersSubmit = screen.getByTestId('submit-button-top')
      expect(filtersSubmit).toBeInTheDocument()
      // expect(filtersSubmit).toBeDisabled()
    }, {timeout:5000})
  }, 20000)

  test('correct texts should be in the document with more than one gen', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<HashRouter><Performance /></HashRouter>)
    await waitFor(() => { 
      const selectInverterLabel = screen.getByText(i18n.t('Select inverter')+':')
      const filtersSubmit = screen.getByTestId('submit-button')
      expect(selectInverterLabel).toBeInTheDocument()
      expect(filtersSubmit).toBeInTheDocument()
      expect(filtersSubmit).toBeDisabled()
    }, {timeout:5000})
  }, 20000)

  test('submit button should be enabled after select inverter', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<HashRouter><Performance /></HashRouter>)
    await waitFor(() => {  
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)
      const filtersSubmit = screen.getByText(i18n.t('Submit'))
      expect(filtersSubmit).toBeEnabled()
    }, {timeout:5000})
  }, 20000)

  test('should change selects options', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<HashRouter><Performance /></HashRouter>)
    await waitFor(() => {  
      const groupBySelect = screen.getByTestId('groupby')
      fireEvent.change(groupBySelect, { target: {value: 'day' }})
      expect(groupBySelect).toHaveValue("day")
      expect(screen.getByRole("option", { name: "Day" }).selected).toBe(true)

      const periodSelect = screen.getByTestId('period')
      fireEvent.change(periodSelect, { target: {value: 'cm' }})
      expect(periodSelect).toHaveValue("cm")
      expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)
    })
  }, 20000)

  test('should unset cookies and reload when endpoint returns error', async () => {
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Performance /></HashRouter>)

    // const { location } = window
    delete window.location
    window.location = { reload: jest.fn() }
    await waitFor(() => { expect(window.location.reload).toHaveBeenCalled() }, {timeout:10000})

    await waitFor(() => {  
      expect(getCookie('name')).toEqual('')
      expect(getCookie('lastTimeStamp')).toEqual('')
    })
  }, 20000)

  test('should call DataAPI and display graphs on submit button click', async () => {
    DataAPI.mockResolvedValue(LocationResponseTwoGenOk)
    render(<Performance />)

    await waitFor(() => {  
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)

      DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)

    }, {timeout:5000})
    
    await waitFor(() => { 
      expect(screen.getByText(i18n.t('Performance Ratio'))).toBeInTheDocument()
      expect(screen.getByText(i18n.t('Production and Irradiance'))).toBeInTheDocument()
    }, {timeout:10000})
    
  }, 20000)

  test('should show error message when endpint answers with error', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseTwoGenOk)
    render(<Performance />)

    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: "Error"})

    await waitFor(() => { 
      const buttonGen1 = screen.getByTestId('btn-gen-1')
      fireEvent.click(buttonGen1)
      DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    }, {timeout:5000})

    await waitFor(() => { 
      expect(window.alert).toBeCalledWith('Error') 
    }, {timeout:10000})
  }, 20000)

})