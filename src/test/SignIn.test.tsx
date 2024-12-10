import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import SignIn from './../components/Signin';

const mockAxios = new MockAdapter(axios);

describe('SignIn Component', () => {
  beforeEach(() => {
    jest.spyOn(window.localStorage.__proto__, 'setItem');
    localStorage.clear();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('renders the SignIn form correctly', () => {
    render(
      <MemoryRouter>
        <SignIn setLoginState={jest.fn()} />
      </MemoryRouter>
    );

    // Check if all input fields and buttons are rendered
    expect(screen.getByLabelText(/username/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  it('displays an error message when required fields are missing', async () => {
    render(
      <MemoryRouter>
        <SignIn setLoginState={jest.fn()} />
      </MemoryRouter>
    );

    // Click the Sign In button without filling the form
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/all fields are required/i)).toBeInTheDocument();
    });
  });

  it('displays an error message for invalid credentials', async () => {
    mockAxios.onPost('http://localhost:5001/login').reply(401, {
      message: 'Invalid username or password',
    });

    render(
      <MemoryRouter>
        <SignIn setLoginState={jest.fn()} />
      </MemoryRouter>
    );

    // Fill in the form with invalid credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'wrongUser' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongPass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the error message to appear
    await waitFor(() => {
      expect(screen.getByText(/invalid username or password/i)).toBeInTheDocument();
    });
  });

  it('calls setLoginState on successful login', async () => {
    const mockSetLoginState = jest.fn();
    mockAxios.onPost('http://localhost:5001/login').reply(200, {
      token: 'mockToken',
      isAdmin: true,
    });

    render(
      <MemoryRouter>
        <SignIn setLoginState={mockSetLoginState} />
      </MemoryRouter>
    );

    // Fill in the form with valid credentials
    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'admin' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'adminPass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Verify setLoginState is called with correct arguments
    await waitFor(() => {
      expect(mockSetLoginState).toHaveBeenCalledWith(true, true);
    });
  });

  it('navigates to the home page on successful login', async () => {
    const mockSetLoginState = jest.fn();
    mockAxios.onPost('http://localhost:5001/login').reply(200, {
      token: 'mockToken',
      isAdmin: false,
    });

    render(
      <MemoryRouter>
        <SignIn setLoginState={mockSetLoginState} />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/username/i), { target: { value: 'user' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'userPass' } });
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));

    // Wait for the navigation to occur
    await waitFor(() => {
      expect(mockSetLoginState).toHaveBeenCalledWith(true, false);
    });
  });
});
