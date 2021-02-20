import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

test('redirects to the sign in page', () => {
  render(<App />);
  const button = screen.getByText(/Sign in with you RCDS google account\./i);
  expect(button).toBeInTheDocument();
});