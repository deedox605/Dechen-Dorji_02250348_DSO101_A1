import { render, screen } from '@testing-library/react';
import App from './App';

test('renders todo app header', () => {
  render(<App />);
  const headerElement = screen.getByText(/📝 Todo List/i);
  expect(headerElement).toBeInTheDocument();
});

test('renders input field', () => {
  render(<App />);
  const inputElement = screen.getByPlaceholderText(/Add a new task.../i);
  expect(inputElement).toBeInTheDocument();
});

test('renders add button', () => {
  render(<App />);
  const buttonElement = screen.getByRole('button', { name: /add/i });
  expect(buttonElement).toBeInTheDocument();
});