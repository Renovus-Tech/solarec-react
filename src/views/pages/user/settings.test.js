// settings.test.js
import React from 'react'
import { HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import i18n from '../../../helpers/i18n'
import Settings from './settings'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

const DataApiResponseOk = {
  id: 1,
  name: "SolaREC",
  email: "solarec@renovus.tech",
  authenticated: true,
  error: null,
  client: {
      id: 1,
      name: "Canary",
      legalName: "Canelones, Uruguay",
      address: "Canelones, Uruguay",
      demoDate: null,
      dataDefinitionId: null,
      dataDefinition: null,
  },
  functionalities: [
      {
          id: 3,
          type: null,
          title: "Overview",
          description: "",
          url: "/modules/overview"
      }
  ],
  settings: [
      {
          label: "Language",
          categoryLabel: "Other settings",
          name: "language",
          category: "otherSettings",
          type: "language",
          units: "language",
          min: null,
          max: null,
          value: null,
          valueDefault: "EN"
      }
  ]
}

describe("User Settigs", () => {

  beforeEach(() => {
    global.fetch = jest.fn()
    // jest.clearAllMocks()
    // DataAPI.mockResolvedValue(DataApiResponseOk)
  })

  test('correct texts should be in the document', async () => {
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    const title = screen.getByText(i18n.t('User Settings'))
    const profileTitle = screen.getByText(i18n.t('Profile'))
    const nameInputLabel = screen.getByTestId('name-input')
    const emailInputLabel = screen.getByTestId('email-input')
    const settingsTitle = screen.getByText(i18n.t('Settings'))
    const changePasswordButtonText = screen.getByText(i18n.t("Change Password"))
    const saveButtonText = screen.getByText(i18n.t("Save Preferences"))
    const languageInput = screen.getByTestId('language-input')
    expect(title).toBeInTheDocument()
    expect(profileTitle).toBeInTheDocument()
    expect(nameInputLabel).toBeInTheDocument()
    expect(nameInputLabel).toBeDisabled()
    expect(emailInputLabel).toBeInTheDocument()
    expect(emailInputLabel).toBeDisabled()
    expect(settingsTitle).toBeInTheDocument()
    expect(changePasswordButtonText).toBeInTheDocument()
    expect(saveButtonText).toBeInTheDocument()
    expect(languageInput).toBeInTheDocument()
  }, 20000)

  test('correct button should be disabled and enabled', async () => {
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    const saveButton = screen.getByTestId('save-preferences-button')
    expect(saveButton).toBeDisabled()
    const languageField = screen.getByTestId('language-input')
    fireEvent.change(languageField, { target: {value: 'ES' }})
    expect(saveButton).toBeEnabled()
  }, 20000)

  test('correct texts when changing password should be in the document', async () => {
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    const changePasswordButton = screen.getByTestId('change-password-button')
    fireEvent.click(changePasswordButton)
    const passwordField = screen.getByRole('input', { name: 'password' })
    expect(passwordField).toBeInTheDocument()
    const confirmPasswordField = screen.getByRole('input', { name: 'confirm-password' })
    expect(confirmPasswordField).toBeInTheDocument()
    const savePasswordButtonText = screen.getByTestId('save-password-button')
    expect(savePasswordButtonText).toBeInTheDocument()
    expect(savePasswordButtonText.innerHTML).toBe(i18n.t("Save new password"))
    const cancelPasswordButtonText = screen.getByTestId('cancel-change-password-button')
    expect(cancelPasswordButtonText).toBeInTheDocument()
    expect(cancelPasswordButtonText.innerHTML).toBe(i18n.t("Cancel"))
  }, 20000)

  test('correct texts when canceling after changing password should be in the document', async () => {
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    const changePasswordButton = screen.getByTestId('change-password-button')
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    fireEvent.click(changePasswordButton)
    const cancelPasswordButton = screen.getByTestId('cancel-change-password-button')
    fireEvent.click(cancelPasswordButton)
    await waitFor(() => expect(() => screen.getByTestId('password')).toThrow())
    await waitFor(() => expect(() => screen.getByTestId('confirm-password')).toThrow())
  }, 20000)

  test('correct setting inputs loaded', async () => {
    DataAPI.mockResolvedValue(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    const nameInputLabel = screen.getByTestId('name-input')
    const emailInputLabel = screen.getByTestId('email-input')
    await waitFor(() => { expect(nameInputLabel.value).toMatch('SolaREC') }, {timeout:10000})
    expect(emailInputLabel.value).toMatch('solarec@renovus.tech')
  }, 20000)

  test('should show error alert when endpoint falis', async () => {
    // DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    jest.spyOn(window, 'alert').mockImplementation(() => {})
    // jest.clearAllMocks()
    DataAPI.mockResolvedValueOnce({error: "Error"})
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { expect(window.alert).toBeCalledWith('Error') }, {timeout:10000})
  }, 20000)

  test('should call DataAPI on savePreferences button click', async () => {
    DataAPI.mockResolvedValue(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { expect(screen.getByTestId('name-input').value).toMatch('SolaREC') }, {timeout:10000})
    const saveButton = screen.getByTestId('save-preferences-button')
    const languageField = screen.getByTestId('language-input')
    fireEvent.change(languageField, { target: {value: 'ES' }})
    fireEvent.click(saveButton)
    await waitFor(() => { expect(DataAPI).toHaveBeenCalledTimes(2) }, {timeout:8000})
    await waitFor(() => { screen.getByText('Your settings were updated.') }, {timeout:10000})
  }, 20000)

  test('should show error message when endpint answers with error', async () => {
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    DataAPI.mockResolvedValueOnce({error: "Error"})
    const saveButton = screen.getByTestId('save-preferences-button')
    const languageField = screen.getByTestId('language-input')
    fireEvent.change(languageField, { target: {value: 'ES' }})
    fireEvent.click(saveButton)
    expect(DataAPI).toHaveBeenCalled()
    await waitFor(() => { screen.getByText(i18n.t('Error saving settings')) }, {timeout:10000})
    const errorMessage = screen.getByText(i18n.t('Error saving settings'))
    expect(errorMessage).toBeInTheDocument()
  }, 20000)

  test('should call DataAPI and display correct message on save new password button click', async () => {
    DataAPI.mockResolvedValueOnce(DataApiResponseOk)
    render(<HashRouter><Settings /></HashRouter>)
    await waitFor(() => { expect(screen.getByTestId('name-input').value).toMatch('SolaREC') }, {timeout:10000})
    const changePasswordButton = screen.getByTestId('change-password-button')
    fireEvent.click(changePasswordButton)
    const saveButton = screen.getByTestId('save-password-button')
    const passwordField = screen.getByTestId('password')
    fireEvent.change(passwordField, { target: {value: 'qwerty' }})
    DataAPI.mockResolvedValueOnce({changed:true})
    fireEvent.click(saveButton)
    await waitFor(() => { screen.getByText('Please make sure your passwords match.') }, {timeout:10000})
    const confirmPasswordField = screen.getByTestId('confirm-password')
    fireEvent.change(confirmPasswordField, { target: {value: 'qwerty' }})
    DataAPI.mockResolvedValueOnce({changed:true})
    fireEvent.click(saveButton)
    await waitFor(() => { screen.getByText('Your password was updated.') }, {timeout:10000})
  }, 20000)

})