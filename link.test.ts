// src/components/Header.test.tsx
import { render, screen } from '@testing-library/react';
import Header from './Header';
import { BrowserRouter } from 'react-router-dom';

// Mock the useAuth hook
jest.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: true,
    setIsLoggedIn: jest.fn(),
  }),
}));

describe('Header Component', () => {
  test('renders the "Home" link with correct href and text', () => {
    render(
      <BrowserRouter>
        <Header />
      </BrowserRouter>
    );

    // Find the "Home" link
    const homeLink = screen.getByRole('link', { name: /home/i });

    // Check that the "Home" link is in the document and has the correct href
    expect(homeLink).toBeInTheDocument();
    expect(homeLink).toHaveAttribute('href', '/');
  });
});
