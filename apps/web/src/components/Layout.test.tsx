/**
 * Unit Tests for Layout Component
 * 
 * @package SimaRukun
 * @subpackage Frontend/Components
 */

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Layout from './Layout';

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock components
jest.mock('./Sidebar', () => () => <div data-testid="sidebar-mock">Sidebar</div>);
jest.mock('./Navbar', () => () => <div data-testid="navbar-mock">Navbar</div>);

describe('Layout Component', () => {
  it('should render children correctly', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div data-testid="child">Child Content</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByTestId('child')).toHaveTextContent('Child Content');
  });

  it('should render Sidebar component', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Child</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-mock')).toBeInTheDocument();
  });

  it('should render Navbar component', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Child</div>
        </Layout>
      </MemoryRouter>
    );

    expect(screen.getByTestId('navbar-mock')).toBeInTheDocument();
  });

  it('should have correct container styling', () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Child</div>
        </Layout>
      </MemoryRouter>
    );

    const main = screen.getByRole('main');
    expect(main).toHaveClass('min-h-screen');
  });

  it('should render without crashing', () => {
    const { container } = render(
      <MemoryRouter>
        <Layout>
          <div>Test</div>
        </Layout>
      </MemoryRouter>
    );

    expect(container).toBeInTheDocument();
  });
});
