import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '../components/Home';

test('renders instructions', () => {
  render(<Home />);
  const instructionsHeader = screen.getByText(/Instructions/i);
  expect(instructionsHeader).toBeInTheDocument();
  const instructionOne = screen.getByText(/Select dates and you will be prompted to create a new event/i);
  expect(instructionOne).toBeInTheDocument();
  const instructionTwo = screen.getByText(/Drag, drop, and resize events/i);
  expect(instructionTwo).toBeInTheDocument();
  const instructionThree = screen.getByText(/Click an event to delete it/i);
  expect(instructionThree).toBeInTheDocument();
});

test('renders event list', () => {
  render(<Home />);
  const eventListHeader = screen.getByText(/All Events/i);
  expect(eventListHeader).toBeInTheDocument();
});

test('renders calendar', () => {
  render(<Home />);
  const calendarHeader = screen.getByText(/Feburary 2021/i);
  expect(calendarHeader).toBeInTheDocument();
});