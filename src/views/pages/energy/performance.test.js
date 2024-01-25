// performance.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, wait, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import { getCookie } from '../../../helpers/sessionCookie.js'
import Performance from './performance'
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

    // jest.clearAllMocks()
    // DataAPI.mockResolvedValue(DataApiResponseOk)
  })

  test('correct texts should be in the document', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<HashRouter><Performance /></HashRouter>)
    const title = screen.getByText(i18n.t('Performance'))
    const groupByLabel= screen.getByText(i18n.t('Group by'))
    const periodLabel = screen.getByText(i18n.t('Period'))
    const selectInverterLabel = screen.getByText(i18n.t('Select inverter')+':')
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    const groupBySelect = screen.getByTestId('groupby')
    const periodSelect = screen.getByTestId('period')
    expect(title).toBeInTheDocument()
    expect(groupByLabel).toBeInTheDocument()
    expect(periodLabel).toBeInTheDocument()
    expect(selectInverterLabel).toBeInTheDocument()
    expect(filtersSubmit).toBeInTheDocument()
    expect(filtersSubmit).toBeDisabled()
    expect(groupBySelect).toBeInTheDocument()
    expect(periodSelect).toBeInTheDocument()

    expect(groupBySelect).toHaveValue("week")
    expect(screen.getByRole("option", { name: "Week" }).selected).toBe(true)

    expect(periodSelect).toHaveValue("y")
    expect(screen.getByRole("option", { name: "Yesterday" }).selected).toBe(true)
  })

  test('submit button should be enabled after select inverter', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<HashRouter><Performance /></HashRouter>)
    await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
    const buttonGen1 = screen.getByTestId('btn-gen-1')
    fireEvent.click(buttonGen1)
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    expect(filtersSubmit).toBeEnabled()
  }, 20000)

  test('should change selects options', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<HashRouter><Performance /></HashRouter>)
    const groupBySelect = screen.getByTestId('groupby')
    fireEvent.change(groupBySelect, { target: {value: 'day' }})
    expect(groupBySelect).toHaveValue("day")
    expect(screen.getByRole("option", { name: "Day" }).selected).toBe(true)

    const periodSelect = screen.getByTestId('period')
    fireEvent.change(periodSelect, { target: {value: 'cm' }})
    expect(periodSelect).toHaveValue("cm")
    expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)
  }, 20000)

  test('should unset cookies and reload when endpoint returns error', async () => {
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Performance /></HashRouter>)

    const { location } = window
    delete window.location
    window.location = { reload: jest.fn() }
    await waitFor(() => { expect(window.location.reload).toHaveBeenCalled() }, {timeout:10000})

    expect(getCookie('name')).toEqual('')
    expect(getCookie('lastTimeStamp')).toEqual('')
  }, 20000)

  test('should call DataAPI and display graphs on submit button click', async () => {
    DataAPI.mockResolvedValue(LocationResponseOk)
    render(<Performance />)

    await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
    const buttonGen1 = screen.getByTestId('btn-gen-1')
    fireEvent.click(buttonGen1)

    DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
    const submitButton = screen.getByTestId('submit-button')
    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)
    
    await waitFor(() => { screen.getByText(i18n.t('Performance Ratio')) }, {timeout:10000})
    expect(screen.getByText(i18n.t('Performance Ratio'))).toBeInTheDocument()
    expect(screen.getByText(i18n.t('Production and Irradiance'))).toBeInTheDocument()
  }, 20000)

  test('should show error message when endpint answers with error', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<Performance />)

    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: "Error"})

    await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
    const buttonGen1 = screen.getByTestId('btn-gen-1')
    fireEvent.click(buttonGen1)

    DataAPI.mockResolvedValueOnce(performanceRatioResponseOk)
    const submitButton = screen.getByTestId('submit-button')
    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)

    await waitFor(() => { expect(window.alert).toBeCalledWith('Error') }, {timeout:10000})
  }, 20000)

})