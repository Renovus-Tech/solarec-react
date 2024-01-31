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
      "irradiationKwhM2" : 0.0
    } ],
    "totalProductionMwh" : 0.0,
    "totalACProductionMwh" : 0.0,
    "totalIrradiationKwhM2" : 0.0,
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
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<HashRouter><Trends /></HashRouter>)
    const title = screen.getByText(i18n.t('Climate - Trends'))
    const periodLabel = screen.getByText(i18n.t('Period'))
    const selectInverterLabel = screen.getByText(i18n.t('Select inverters')+':')
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    const periodSelect = screen.getByTestId('period')
    expect(title).toBeInTheDocument()
    expect(periodLabel).toBeInTheDocument()
    expect(selectInverterLabel).toBeInTheDocument()
    expect(filtersSubmit).toBeInTheDocument()
    expect(periodSelect).toBeInTheDocument()

    expect(periodSelect).toHaveValue("y")
    expect(screen.getByRole("option", { name: "Yesterday" }).selected).toBe(true)
  })

  test('submit button should be enabled after select inverter', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<HashRouter><Trends /></HashRouter>)
    await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
    const buttonGen1 = screen.getByTestId('btn-gen-1')
    fireEvent.click(buttonGen1)
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    expect(filtersSubmit).toBeEnabled()
  }, 20000)

  test('should change selects options', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<HashRouter><Trends /></HashRouter>)

    const periodSelect = screen.getByTestId('period')
    fireEvent.change(periodSelect, { target: {value: 'cm' }})
    expect(periodSelect).toHaveValue("cm")
    expect(screen.getByRole("option", { name: "Current month" }).selected).toBe(true)
  }, 20000)

  test('should unset cookies and reload when endpoint returns error', async () => {
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Trends /></HashRouter>)

    const { location } = window
    delete window.location
    window.location = { reload: jest.fn() }
    await waitFor(() => { expect(window.location.reload).toHaveBeenCalled() }, {timeout:10000})

    expect(getCookie('name')).toEqual('')
    expect(getCookie('lastTimeStamp')).toEqual('')
  }, 20000)

  test('should call DataAPI and display graphs on submit button click', async () => {
    DataAPI.mockResolvedValue(LocationResponseOk)
    render(<Trends />)

    await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
    const buttonGen1 = screen.getByTestId('btn-gen-1')
    fireEvent.click(buttonGen1)

    DataAPI.mockResolvedValueOnce(trendsResponseOk)
    const submitButton = screen.getByTestId('submit-button')
    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)
    
    await waitFor(() => { screen.getByText(i18n.t('Production and Irradiance')) }, {timeout:10000})
    expect(screen.getByText(i18n.t('Production and Irradiance'))).toBeInTheDocument()
  }, 20000)

  test('should show error message when endpint answers with error', async () => {
    DataAPI.mockResolvedValueOnce(LocationResponseOk)
    render(<Trends />)

    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: "Error"})

    await waitFor(() => { screen.getByTestId('btn-gen-1') }, {timeout:5000})
    const buttonGen1 = screen.getByTestId('btn-gen-1')
    fireEvent.click(buttonGen1)

    DataAPI.mockResolvedValueOnce(trendsResponseOk)
    const submitButton = screen.getByTestId('submit-button')
    expect(submitButton).toBeEnabled()
    fireEvent.click(submitButton)

    await waitFor(() => { expect(window.alert).toBeCalledWith('Error') }, {timeout:10000})
  }, 20000)

})