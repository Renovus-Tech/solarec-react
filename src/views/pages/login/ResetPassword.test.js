// ResetPassword.test.js
import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { render, act } from '@testing-library/react';
import ResetPassword from './ResetPassword';
import 'jest-canvas-mock';

// test('renders a greeting', () => {
//   const { getByText } = render(<Overview name="John" />);
//   const greetingElement = getByText(/Overview/i);
//   expect(greetingElement).toBeInTheDocument();
// });

test('renders ResetPassword', () => {
  render(
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<ResetPassword />}></Route>
      </Routes>
    </BrowserRouter>);
});