// ResetPassword.test.js
import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { render } from '@testing-library/react'
import ResetPassword from './ResetPassword'
import 'jest-canvas-mock'

describe("Reset Password", () => {

  test('renders ResetPassword', () => {
    render(
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<ResetPassword />}></Route>
        </Routes>
      </BrowserRouter>)
  }) 

})