/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// sales.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Sales from './sales'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

jest.mock('react-chartjs-2', () => ({ Bar: () => null }))

const revenueResponseOk = {
  "chart" : {
    "from" : "2024/03/01 00:00:00",
    "to" : "2024/04/18 23:59:59",
    "resultCode" : 200,
    "resultText" : "",
    "groupBy" : "month"
  },
  "data" : [ {
    "from" : "2024/03/01 00:00:00",
    "to" : "2024/03/31 23:59:59", 
    "co2Avoided" : 30,
    "certGenerated" : 25,
    "certPrice" : 509,
    "certSold" : 12,
    "certIncome" : 254
  },
  {
    "from" : "2024/04/01 00:00:00",
    "to" : "2024/04/18 23:59:59",
    "co2Avoided" : 23,
    "certGenerated" : 21,
    "certPrice" : 359,
    "certSold" : 9,
    "certIncome" : 140
  } ]
}

describe("Sales", () => {

  beforeEach(() => {
    global.fetch = jest.fn()
    DataAPI.mockResolvedValueOnce(revenueResponseOk)
  })

  test('correct texts should be in the document', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    await waitFor(() => { 
      const title = screen.getByText(i18n.t('Sales'))
      const groupByLabel = screen.getByText(i18n.t('Group by'))
      const periodLabel = screen.getByText(i18n.t('Period'))
      const filtersSubmit = screen.getByText(i18n.t('Submit'))
      expect(title).toBeInTheDocument()
      expect(groupByLabel).toBeInTheDocument()
      expect(periodLabel).toBeInTheDocument()
      expect(filtersSubmit).toBeInTheDocument()
    })
  })

  test('select should have correct option selected', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    await waitFor(() => { 
      const periodSelect = screen.getByTestId('period')
      expect(periodSelect).toBeInTheDocument()
      expect(periodSelect).toHaveValue("cy")
      expect(screen.getByRole("option", { name: i18n.t("Current year") }).selected).toBe(true)
      const groupBySelect = screen.getByTestId('groupby')
      expect(groupBySelect).toBeInTheDocument()
      expect(groupBySelect).toHaveValue("month")
      expect(screen.getByRole("option", { name: i18n.t("month") }).selected).toBe(true)
    })
  })

  test('submit button should be enabled after load', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    expect(filtersSubmit).toBeDisabled()
    await waitFor(() => { expect(filtersSubmit).toBeEnabled() }, {timeout:5000})
  }, 20000)

  test('should change selects options', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    await waitFor(() => { 
      const periodSelect = screen.getByTestId('period')
      fireEvent.change(periodSelect, { target: {value: 'cm' }})
      expect(periodSelect).toHaveValue("cm")
      const groupBySelect = screen.getByTestId('groupby')
      expect(groupBySelect).toBeInTheDocument()
      expect(groupBySelect).toHaveValue("month")
      expect(screen.getByRole("option", { name: "month" }).selected).toBe(true)
      // const d = new Date()
      // const lastYear = d.getFullYear() - 1
      // expect(screen.getByRole("option", { name: lastYear }).selected).toBe(true)
    })
  }, 20000)

  test('should call DataAPI and display graphs on submit button click', async () => {
    render(<Sales />)
    DataAPI.mockResolvedValueOnce(revenueResponseOk)
    await waitFor(() => { 
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    })
    await waitFor(() => { 
      expect(screen.getByTestId('graph-container')).toBeInTheDocument() 
      expect(screen.getByTestId('graph-container').innerHTML).not.toBe('')
      expect (screen.getByTestId('left-units').innerHTML).toBe(i18n.t('MWh'))
      expect (screen.getByTestId('right-units').innerHTML).toBe(i18n.t('USD'))
      // expect (screen.getByTestId('groupByLabel').innerHTML).toBe(i18n.t('month'))
    }, {timeout:10000})
    

  }, 20000)

  test('should show error when endpoint answers with error', async () => {
    render(<Sales />)
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: "Error"})
    await waitFor(() => { 
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    })
    await waitFor(() => { 
      expect(window.alert).toHaveBeenCalledWith('Error') 
    }, {timeout:10000})
  }, 20000)

  test('should show error message when endpoint answers with error message', async () => {
    render(<Sales />)
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: { message: "Error"}})
    await waitFor(() => { 
      const submitButton = screen.getByTestId('submit-button')
      expect(submitButton).toBeEnabled()
      fireEvent.click(submitButton)
    })
    await waitFor(() => { 
      expect(window.alert).toHaveBeenCalledWith('Error') 
    }, {timeout:10000})
  }, 20000)

})