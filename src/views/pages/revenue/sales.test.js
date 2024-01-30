// sales.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Sales from './sales'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

const revenueResponseOk = {
  "months" : [ {
    "label" : "January",
    "coAvoided" : 10.0,
    "dRecGenerated" : 20.0,
    "dRecSold" : 15.0
  },{
    "label" : "February",
    "coAvoided" : 20.0,
    "dRecGenerated" : 30.0,
    "dRecSold" : 25.0
  },{
    "label" : "March",
    "coAvoided" : 30.0,
    "dRecGenerated" : 50.0,
    "dRecSold" : 35.0
  },{
    "label" : "April",
    "coAvoided" : 40.0,
    "dRecGenerated" : 60.0,
    "dRecSold" : 45.0
  } ]
}

describe("Sales", () => {

  beforeEach(() => {
    global.fetch = jest.fn()
    DataAPI.mockResolvedValueOnce(revenueResponseOk)
  })

  test('correct texts should be in the document', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    const title = screen.getByText(i18n.t('Sales'))
    const periodLabel = screen.getByText(i18n.t('Period'))
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    expect(title).toBeInTheDocument()
    expect(periodLabel).toBeInTheDocument()
    expect(filtersSubmit).toBeInTheDocument()
  })

  test('select should have correct option selected', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    const periodSelect = screen.getByTestId('period')
    expect(periodSelect).toBeInTheDocument()
    expect(periodSelect).toHaveValue("cy")
    expect(screen.getByRole("option", { name: i18n.t("Current year") }).selected).toBe(true)
  })

  test('submit button should be enabled after load', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    const filtersSubmit = screen.getByText(i18n.t('Submit'))
    await waitFor(() => { expect(filtersSubmit).toBeEnabled() }, {timeout:5000})
  }, 20000)

  test('should change selects options', async () => {
    render(<HashRouter><Sales /></HashRouter>)
    const periodSelect = screen.getByTestId('period')
    fireEvent.change(periodSelect, { target: {value: 'cy-1' }})
    expect(periodSelect).toHaveValue("cy-1")
    const d = new Date()
    const lastYear = d.getFullYear() - 1
    expect(screen.getByRole("option", { name: lastYear }).selected).toBe(true)
  }, 20000)

  test('should call DataAPI and display graphs on submit button click', async () => {
    render(<Sales />)
    DataAPI.mockResolvedValueOnce(revenueResponseOk)
    const submitButton = screen.getByTestId('submit-button')
    await waitFor(() => { expect(submitButton).toBeEnabled() }, {timeout:5000})
    fireEvent.click(submitButton)
    await waitFor(() => { expect(screen.getByTestId('graph-container')).toBeInTheDocument() }, {timeout:10000})
    expect(screen.getByTestId('graph-container').innerHTML).not.toBe('')
    expect (screen.getByTestId('left-units').innerHTML).toBe(i18n.t('MWh'))
    expect (screen.getByTestId('right-units').innerHTML).toBe(i18n.t('USD'))
    expect (screen.getByTestId('months').innerHTML).toBe(i18n.t('Months'))

  }, 20000)

  test('should show error message when endpoint answers with error', async () => {
    render(<Sales />)
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({error: "Error"})
    const submitButton = screen.getByTestId('submit-button')
    await waitFor(() => { expect(submitButton).toBeEnabled() }, {timeout:5000})
    fireEvent.click(submitButton)
    await waitFor(() => { expect(window.alert).toBeCalledWith('Error') }, {timeout:10000})
  }, 20000)

})