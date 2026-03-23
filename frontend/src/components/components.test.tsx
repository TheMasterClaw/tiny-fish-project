import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Header from './Header';
import Hero from './Hero';
import Footer from './Footer';

// Mock the useContract hook
jest.mock('../hooks/useContract', () => ({
  useContract: () => ({
    connectWallet: jest.fn().mockResolvedValue({ address: '0x1234567890abcdef', chainId: 84532 }),
    isConnecting: false,
    error: null,
  }),
}));

describe('Header Component', () => {
  const mockOnConnect = jest.fn();

  beforeEach(() => {
    mockOnConnect.mockClear();
  });

  it('renders CoralGuard logo and branding', () => {
    render(<Header onConnect={mockOnConnect} />);
    
    expect(screen.getByText('Coral')).toBeInTheDocument();
    expect(screen.getByText('Guard')).toBeInTheDocument();
    expect(screen.getByText('AI + Blockchain for Ocean Conservation')).toBeInTheDocument();
  });

  it('shows connect wallet button when not connected', () => {
    render(<Header onConnect={mockOnConnect} />);
    
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows wallet info when connected', () => {
    render(
      <Header 
        onConnect={mockOnConnect} 
        connectedAddress="0x1234567890abcdef1234567890abcdef12345678"
        chainId={84532}
      />
    );
    
    expect(screen.getByText('0x1234...5678')).toBeInTheDocument();
    expect(screen.getByText('Base Sepolia')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    render(<Header onConnect={mockOnConnect} />);
    
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Take Action')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});

describe('Hero Component', () => {
  it('renders main headline', () => {
    render(<Hero />);
    
    expect(screen.getByText(/Protecting Our/i)).toBeInTheDocument();
    expect(screen.getByText(/Blue Planet/i)).toBeInTheDocument();
    expect(screen.getByText(/Together/i)).toBeInTheDocument();
  });

  it('renders feature cards', () => {
    render(<Hero />);
    
    expect(screen.getByText('Real-time Monitoring')).toBeInTheDocument();
    expect(screen.getByText('NFT Fundraising')).toBeInTheDocument();
    expect(screen.getByText('Earn Rewards')).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<Hero />);
    
    expect(screen.getByText('Explore Reefs')).toBeInTheDocument();
  });

  it('renders hackathon badge', () => {
    render(<Hero />);
    
    expect(screen.getByText('Tiny Fish Hackathon Submission')).toBeInTheDocument();
  });

  it('renders tech stack', () => {
    render(<Hero />);
    
    expect(screen.getByText('Built with:')).toBeInTheDocument();
    expect(screen.getByText('Ethereum')).toBeInTheDocument();
    expect(screen.getByText('Base')).toBeInTheDocument();
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
  });
});

describe('Footer Component', () => {
  it('renders copyright with current year', () => {
    render(<Footer />);
    
    const currentYear = new Date().getFullYear();
    expect(screen.getByText(new RegExp(currentYear.toString()))).toBeInTheDocument();
    expect(screen.getByText(/CoralGuard/i)).toBeInTheDocument();
  });

  it('renders footer links', () => {
    render(<Footer />);
    
    expect(screen.getByText('Privacy')).toBeInTheDocument();
    expect(screen.getByText('Terms')).toBeInTheDocument();
    expect(screen.getByText('Tiny Fish Hackathon Submission')).toBeInTheDocument();
  });

  it('renders company description', () => {
    render(<Footer />);
    
    expect(screen.getByText(/Combining AI and blockchain/i)).toBeInTheDocument();
  });
});
