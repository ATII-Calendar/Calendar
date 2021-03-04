
import React from 'react';
import { render, screen } from '@testing-library/react';
import Header from '../components/Header';

test('renders sign in button', () => {
  render(<Header />);
  const button = screen.getByText(/RCDS Calendar/i);
  expect(button).toBeInTheDocument();
});