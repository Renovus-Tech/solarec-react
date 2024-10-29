/* eslint-disable testing-library/no-wait-for-side-effects */
/* eslint-disable testing-library/no-wait-for-multiple-assertions */
/* eslint-disable testing-library/no-unnecessary-act */
// Login.test.js
import React from 'react'
import { Route, Routes, HashRouter } from 'react-router-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { getCookie } from '../../../helpers/sessionCookie.js'
import i18n from '../../../helpers/i18n'
import Login from './Login'
import RequestPasswordReset from './RequestPasswordReset'
import 'jest-canvas-mock'
import DataAPI from '../../../helpers/DataAPI.js'

jest.mock('../../../helpers/DataAPI')

describe("Login", () => {
 
  beforeEach(() => {
    global.fetch = jest.fn()
  })

  test('Renders Login', () => {
    render(<HashRouter><Login /></HashRouter>)
  })

  test("correct texts should be in the document", () => {
    render(<HashRouter><Login /></HashRouter>)
      const subtitle = screen.getByText(i18n.t("Sign In to your account"))
      const rightText = screen.getByText(i18n.t("Please login with your e-mail and password."))
      const resetPass = screen.getByText(i18n.t("Reset password?"))
      expect(subtitle).toBeInTheDocument()
      expect(rightText).toBeInTheDocument()
      expect(resetPass).toBeInTheDocument()
  })

  test('should have username and password fields and submit button', () => {
    render(<HashRouter><Login /></HashRouter>)
      const usernameField = screen.getByTestId('username')
      const passwordField = screen.getByTestId('password')
      const loginButton = screen.getByTestId('login-button')
      expect(usernameField).toBeInTheDocument()
      expect(passwordField).toBeInTheDocument()
      expect(loginButton).toBeInTheDocument()
  })

  test('should display logo correctly', () => {
    render(<HashRouter><Login /></HashRouter>)
      const image = screen.getByAltText('Grinplus')
      expect(image.src).toContain('/logo.png')
})
  

  test("username and password inputs should accept text", () => {
    render(<HashRouter><Login /></HashRouter>)
      const usernameField = screen.getByTestId('username')
      expect(usernameField.value).toMatch("")
      fireEvent.change(usernameField, { target: {value: 'testing' }})
      expect(usernameField.value).toMatch('testing')

      const passwordField = screen.getByTestId('password')
      expect(passwordField.value).toMatch("")
      fireEvent.change(passwordField, { target: {value: 'testing' }})
      expect(passwordField.value).toMatch('testing')
  })

  test("should redirect to /requestPasswordReset when reset password is clicked", async () => {
    render(<HashRouter>
            <Routes>
              <Route path="/requestPasswordReset" name="Request password reset" element={<RequestPasswordReset />} />
              <Route path="*" name="Home" element={<Login />} />
            </Routes>
          </HashRouter>)
    await waitFor(() => { 
      const resetButton = screen.getByTestId('password-reset')
      fireEvent.click(resetButton)
      expect(screen.getByTestId('username-reset')).toBeInTheDocument()
    })
  }, 70000)

  test('should show wrong user/password on login attempt', async () => {
    // jest.spyOn(window, 'alert').mockImplementation(() => {})
    DataAPI.mockResolvedValueOnce({authenticated: false,error: "Not authenticated, bad combination of email, password and client."})
    render(<HashRouter><Login /></HashRouter>)
    await waitFor(() => { 
      const loginButton = screen.getByTestId('login-button')
      fireEvent.click(loginButton)
      expect(DataAPI).toHaveBeenCalled()
    })

    await waitFor(() => { 
      const errorText = screen.getByTestId('error')
      expect(errorText).toBeInTheDocument()
      expect(errorText.innerHTML).toBe('Not authenticated, bad combination of email, password and client.')
    })
  }, 20000)

  test('should show error when endpoint fails', async () => {
    const mError = new Error('network')
    DataAPI.mockRejectedValueOnce(mError)
    render(<HashRouter><Login /></HashRouter>)
    await waitFor(() => { 
      const loginButton = screen.getByTestId('login-button')
      fireEvent.click(loginButton)
      expect(DataAPI).toHaveBeenCalled()
    })
    await waitFor(() => { 
      const errorText = screen.getByTestId('error')
      expect(errorText).toBeInTheDocument()
      expect(errorText.innerHTML).toBe('Error establishing connection.')
    })
  }, 20000)

  test('should reload on user login with correct user/password', async () => {
    DataAPI.mockResolvedValue({authenticated: true, id: 1, client: {id: 1}, name:'Test Name', location: {id:1, type:'solar'}, functionalities: [{url: '/overview'}], settings: [{ name: 'language', value: 'EN'}]})
    render(<HashRouter><Login /></HashRouter>)

    // const { location } = window
    delete window.location
    window.location = { reload: jest.fn() }

    await waitFor(() => { 
      const loginButton = screen.getByTestId('login-button')
      fireEvent.click(loginButton)
      expect(DataAPI).toHaveBeenCalled() 
    })

    await waitFor(() => { 
      expect(window.location.reload).toHaveBeenCalled() 
    }, {timeout:20000})

    await waitFor(() => { 
      expect(getCookie('name')).toEqual('Test Name')
      expect(getCookie('user')).toEqual("1")
      expect(getCookie('client')).toEqual("1")
      expect(getCookie('location')).toEqual("1")
      expect(getCookie('parkType')).toEqual('solar')
      expect(getCookie('functionalities')).toEqual('["/overview"]') 
      expect(getCookie('dashboard')).toEqual('/overview') 
    })

  }, 60000)


})