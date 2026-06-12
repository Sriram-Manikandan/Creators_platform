import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Header from './Header.jsx';
import AuthContext from '../../context/AuthContext.jsx';

const renderHeader = (value) => {
  render(
    <AuthContext.Provider value={value}>
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    </AuthContext.Provider>
  );
};

describe('Header component', () => {
  it('renders the logo, home link, login link, and get started button when logged out', () => {
    renderHeader({ user: null, logout: jest.fn(), isAuthenticated: () => false });

    expect(screen.getByRole('link', { name: /creator's platform/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /home/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /get started/i })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument();
  });

  it('renders user initials, dashboard link, and sign out button when authenticated', () => {
    renderHeader({
      user: { name: 'Jane Doe' },
      logout: jest.fn(),
      isAuthenticated: () => true,
    });

    expect(screen.getByText(/jd/i)).toBeInTheDocument();
    expect(screen.getByText(/jane/i)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument();
  });

  it('calls logout when the sign out button is clicked', async () => {
    const logoutMock = jest.fn();
    renderHeader({
      user: { name: 'Jane Doe' },
      logout: logoutMock,
      isAuthenticated: () => true,
    });

    await userEvent.click(screen.getByRole('button', { name: /sign out/i }));

    expect(logoutMock).toHaveBeenCalledTimes(1);
  });
});
