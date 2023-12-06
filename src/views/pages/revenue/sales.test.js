// sales.test.js
import React from 'react';
import { render, act } from '@testing-library/react';
import Sales from './sales';
import 'jest-canvas-mock';

// test('renders a greeting', () => {
//   const { getByText } = render(<Overview name="John" />);
//   const greetingElement = getByText(/Overview/i);
//   expect(greetingElement).toBeInTheDocument();
// });

test('renders Sales', () => {
  render(<Sales />);
  
});