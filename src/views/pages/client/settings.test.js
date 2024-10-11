/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// client/settings.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent, wrapper, component } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Settings from './settings'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'
import { CForm } from '@coreui/react'

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
            label: "Disponibilidad de datos menor que",
            categoryLabel: "Alertas",
            name: "alertDataAvailabilityLowerThan",
            category: "alerts",
            type: "number",
            units: "%",
            min: "0",
            max: "100",
            value: "87",
            valueDefault: "90"
          },
          {
            label: "Cambio negativo superior a",
            categoryLabel: "Alertas",
            name: "alertNegativeChangeExceeding",
            category: "alerts",
            type: "number",
            units: "%",
            min: "0",
            max: "100",
            value: "20",
            valueDefault: "6"
          },
          {
            label: "Precio del certificado",
            categoryLabel: "Certificado",
            name: "certPrice",
            category: "cert",
            type: "number",
            units: "USD",
            min: "0",
            max: null,
            value: "20",
            valueDefault: "20"
          }
      ]
    })
  })

  test('correct texts should be in the document', async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { 
      const title = screen.getByText(i18n.t('Client Settings'))
      const buttonText = screen.getByText(i18n.t("Save Preferences"))
      expect(title).toBeInTheDocument()
      expect(buttonText).toBeInTheDocument()
    })
  }, 20000)

  test('should show error alert when endpoint returns error', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    jest.clearAllMocks()
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { expect(window.alert).toHaveBeenCalledWith('Error') }, {timeout:10000})
  }, 20000)

  test('should show error message alert when endpoint returns error with message', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    jest.clearAllMocks()
    DataAPI.mockResolvedValueOnce({error: { message: "Error" }})
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { expect(window.alert).toHaveBeenCalledWith('Error') }, {timeout:10000})
  }, 20000)

  test("should show settings texts after load", async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => {  
      const setting1Label = screen.getByText("Disponibilidad de datos menor que")
      const setting2Label = screen.getByText("Cambio negativo superior a")
      const setting3Label = screen.getByText("Precio del certificado")
      const category1Label = screen.getByText("Alertas")
      const category2Label = screen.getByText("Certificado")
      expect(category1Label).toBeInTheDocument()
      expect(category2Label).toBeInTheDocument()
      expect(setting1Label).toBeInTheDocument()
      expect(setting2Label).toBeInTheDocument()
      expect(setting3Label).toBeInTheDocument()
    }, {timeout:10000})
  }, 20000)

  test("settings inputs should load coming data", async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { 
      const setting1Field = screen.getByRole('input', { name: 'alertDataAvailabilityLowerThan' })
      expect(setting1Field.value).toMatch("87")
      expect(setting1Field).toHaveAttribute('min', '0')
      expect(setting1Field).toHaveAttribute('max', '100')
      expect(setting1Field).toHaveAttribute('type', 'number')
      const labelContainer1 = screen.getByTestId('label-alertDataAvailabilityLowerThan')
      expect(labelContainer1).toBeInTheDocument()
      expect(labelContainer1.innerHTML).toBe('Disponibilidad de datos menor que')
      const unitsContainer1 = screen.getByTestId('units-alertDataAvailabilityLowerThan')
      expect(unitsContainer1).toBeInTheDocument()
      expect(unitsContainer1.innerHTML).toBe('%')

      const setting2Field = screen.getByRole('input', { name: 'alertNegativeChangeExceeding' })
      expect(setting2Field.value).toMatch("20")
      expect(setting2Field).toHaveAttribute('min', '0')
      expect(setting2Field).toHaveAttribute('max', '100')
      expect(setting2Field).toHaveAttribute('type', 'number')
      const labelContainer2 = screen.getByTestId('label-alertNegativeChangeExceeding')
      expect(labelContainer2).toBeInTheDocument()
      expect(labelContainer2.innerHTML).toBe('Cambio negativo superior a')
      const unitsContainer2 = screen.getByTestId('units-alertNegativeChangeExceeding')
      expect(unitsContainer2).toBeInTheDocument()
      expect(unitsContainer2.innerHTML).toBe('%')

      const setting3Field = screen.getByRole('input', { name: 'certPrice' })
      expect(setting3Field.value).toMatch("20")
      expect(setting3Field).toHaveAttribute('min', '0')
      expect(setting3Field).toHaveAttribute('max', '')
      expect(setting3Field).toHaveAttribute('type', 'number')
      const labelContainer3 = screen.getByTestId('label-certPrice')
      expect(labelContainer3).toBeInTheDocument()
      expect(labelContainer3.innerHTML).toBe('Precio del certificado')
      const unitsContainer3 = screen.getByTestId('units-certPrice')
      expect(unitsContainer3).toBeInTheDocument()
      expect(unitsContainer3.innerHTML).toBe('USD')

  }, {timeout:10000})
  }, 20000)

  test("settings inputs should accept correct input type", async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { 
      const settingField = screen.getByRole('input', { name: 'alertDataAvailabilityLowerThan' })
      fireEvent.change(settingField, { target: {value: '34' }})
      expect(settingField.value).toMatch('34')
      fireEvent.change(settingField, { target: {value: 'text' }})
      expect(settingField.value).not.toMatch('text')
  }, {timeout:10000})
  })


  test('should call DataAPI on savePreferences button click', async () => {
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => {  
      const settingField = screen.getByRole('input', { name: 'alertDataAvailabilityLowerThan' })
      fireEvent.change(settingField, { target: {value: '34' }})
      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)
      expect(DataAPI).toHaveBeenCalledTimes(2) 
    }, {timeout:10000})
    await waitFor(() => { 
      screen.getByText("Saved!") 
    }, {timeout:10000})
  }, 20000)

  test('should show error if DataAPI on savePreferences return error', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    jest.clearAllMocks()
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { 
      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)
    }, {timeout:10000})
    await waitFor(() => { 
      expect(window.alert).toHaveBeenCalledWith('Error')
    }, {timeout:10000})
  }, 20000)

  test('should show error message if DataAPI on savePreferences return error with message', async () => {
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    jest.clearAllMocks()
    DataAPI.mockResolvedValueOnce({error: { message: "Error" }})
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { 
      const saveButton = screen.getByTestId('save-button')
      fireEvent.click(saveButton)
    }, {timeout:10000})
    await waitFor(() => { 
      expect(window.alert).toHaveBeenCalledWith('Error')
    }, {timeout:10000})
  }, 20000)

})