// Settings.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Settings from './Settings'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

describe("Client Settigs", () => {

  beforeEach(() => {
    global.fetch = jest.fn()
    // jest.clearAllMocks()
    DataAPI.mockResolvedValue({
      id: 1,
      name: "Canary",
      legalName: "Canelones, Uruguay",
      address: "Canelones, Uruguay",
      demoDate: null,
      dataDefinitionId: null,
      dataDefinition: null,
      settings: [
          {
              label: "dRecs Sold Porcentage",
              categoryLabel: "dRec (Category label)",
              name: "dRecsSoldPorcentage",
              category: "drec",
              type: "number",
              units: "%",
              min: "0",
              max: "100",
              value: "49",
              valueDefault: "50"
          }
      ]
    })
  })

  test('correct texts should be in the document', async () => {
    render(<HashRouter><Settings /></HashRouter>)
    const title = screen.getByText(i18n.t('Client Settings'))
    const buttonText = screen.getByText(i18n.t("Save Preferences"))
    expect(title).toBeInTheDocument()
    expect(buttonText).toBeInTheDocument()
  }, 20000)

  test('should show error alert when endpoint returns error', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    jest.clearAllMocks()
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { expect(window.alert).toBeCalledWith('Error') }, {timeout:10000})
  }, 20000)

  test("should show settings texts after load", async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { screen.getByText("dRecs Sold Porcentage") }, {timeout:10000})
    const settingLabel = screen.getByText("dRecs Sold Porcentage")
    const categoryLabel = screen.getByText("dRec (Category label)")
    expect(categoryLabel).toBeInTheDocument()
    expect(settingLabel).toBeInTheDocument()
  }, 20000)

  test("settings inputs should load coming data", async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { screen.getByText("dRecs Sold Porcentage") }, {timeout:10000})
    const settingField = screen.getByRole('input', { name: 'dRecsSoldPorcentage' })
    expect(settingField.value).toMatch("49")
    expect(settingField).toHaveAttribute('min', '0')
    expect(settingField).toHaveAttribute('max', '100')
    expect(settingField).toHaveAttribute('type', 'number')
    const labelContainer = screen.getByTestId('label-dRecsSoldPorcentage')
    expect(labelContainer).toBeInTheDocument()
    expect(labelContainer.innerHTML).toBe('dRecs Sold Porcentage')
    const unitsContainer = screen.getByTestId('units-dRecsSoldPorcentage')
    expect(unitsContainer).toBeInTheDocument()
    expect(unitsContainer.innerHTML).toBe('%')
  }, 20000)

  test("settings inputs should accept correct input type", async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { screen.getByText("dRecs Sold Porcentage") }, {timeout:10000})
    const settingField = screen.getByRole('input', { name: 'dRecsSoldPorcentage' })
    fireEvent.change(settingField, { target: {value: '34' }})
    expect(settingField.value).toMatch('34')
    fireEvent.change(settingField, { target: {value: 'text' }})
    expect(settingField.value).not.toMatch('text')
  })


  test('should call DataAPI on savePreferences button click', async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { screen.getByText("dRecs Sold Porcentage") }, {timeout:10000})
    const settingField = screen.getByRole('input', { name: 'dRecsSoldPorcentage' })
    fireEvent.change(settingField, { target: {value: '34' }})
    const saveButton = screen.getByTestId('save-button')
    fireEvent.click(saveButton)
    expect(DataAPI).toHaveBeenCalledTimes(2) 
    await waitFor(() => { screen.getByText("Saved!") }, {timeout:10000})
  }, 20000)


})