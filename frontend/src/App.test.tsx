import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the components to isolate App testing
jest.mock('./components/Header', () => () => <div data-testid="header">Header</div>);
jest.mock('./components/Hero', () => () => <div data-testid="hero">Hero</div>);
jest.mock('./components/ReefHealthDashboard', () => () => <div data-testid="dashboard">Dashboard</div>);
jest.mock('./components/NFTMinting', () => () => <div data-testid="nft">NFT</div>);
jest.mock('./components/ConservationActions', () => () => <div data-testid="actions">Actions</div>);
jest.mock('./components/GuardianProfile', () => () => <div data-testid="profile">Profile</div>);
jest.mock('./components/Footer', () => () => <div data-testid="footer">Footer</div>);
jest.mock('./components/Bubbles', () => () => <div data-testid="bubbles">Bubbles</div>);

describe('CoralGuard App', () => {
  it('renders all main components', () => {
    render(<App />);
    
    // Check that all main components are rendered
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('dashboard')).toBeInTheDocument();
    expect(screen.getByTestId('nft')).toBeInTheDocument();
    expect(screen.getByTestId('actions')).toBeInTheDocument();
    expect(screen.getByTestId('profile')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByTestId('bubbles')).toBeInTheDocument();
  });

  it('has correct structure with animated background', () => {
    const { container } = render(<App />);
    
    // Check for the main container structure
    const mainDiv = container.querySelector('.min-h-screen');
    expect(mainDiv).toBeInTheDocument();
    
    // Check for bubbles background
    expect(screen.getByTestId('bubbles')).toBeInTheDocument();
  });
});
