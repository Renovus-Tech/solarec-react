// Overview.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import Overview from './Overview';
import 'jest-canvas-mock';

// test('renders a greeting', () => {
//   const { getByText } = render(<Overview name="John" />);
//   const greetingElement = getByText(/Overview/i);
//   expect(greetingElement).toBeInTheDocument();
// });

test('renders Overview', () => {
  render(<Overview />);
  
});