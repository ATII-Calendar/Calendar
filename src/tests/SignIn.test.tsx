import React from 'react';
import { render, screen } from '@testing-library/react';
import SignIn from '../components/SignIn';

test('renders sign in button', () => {
  render(<SignIn />);
  const button = screen.getByText(/with Google/i);
  expect(button).toBeInTheDocument();
});