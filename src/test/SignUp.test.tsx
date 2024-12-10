import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignUp from './../components/Singnup';

const mockAxios = new MockAdapter(axios);

describe('SignUp Component', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    mockAxios.reset();
  });

  it('renders the SignUp form correctly', () => {
    render(
      <MemoryRouter>
        <SignUp setLoginState={jest.fn()} />
      </MemoryRouter>
    );

    // Check if all input fields and buttons are rendered
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });
  it('displays an error message when the username already exists', async () => {
    mockAxios.onPost('http://localhost:5001/signup').reply(409, {
      message: 'Username already exists.',
    });

    render(
      <MemoryRouter>
        <SignUp setLoginState={jest.fn()} />
      </MemoryRouter>
    );

    // Fill in the form with duplicate username
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'existingUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/username already exists/i)).toBeInTheDocument();
    });
  });

  it('calls setLoginState on successful signup', async () => {
    const mockSetLoginState = jest.fn();
    mockAxios.onPost('http://localhost:5001/signup').reply(200, {
      token: 'mockToken',
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <SignUp setLoginState={mockSetLoginState} />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'John' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Verify setLoginState is called with correct arguments
    await waitFor(() => {
      expect(mockSetLoginState).toHaveBeenCalledWith(true, false);
    });
  });

  it('stores the token in localStorage on successful signup', async () => {
    mockAxios.onPost('http://localhost:5001/signup').reply(200, {
      token: 'mockToken',
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <SignUp setLoginState={jest.fn()} />
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fireEvent.change(screen.getByLabelText(/first name/i), { target: { value: 'Jane' } });
    fireEvent.change(screen.getByLabelText(/last name/i), { target: { value: 'Doe' } });
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'newUser2' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'securePassword' } });
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // Verify token is stored in localStorage
    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mockToken');
    });
  });
});
