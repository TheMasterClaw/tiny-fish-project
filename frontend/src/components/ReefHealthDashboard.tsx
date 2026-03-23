import React from 'react';
import { useAccount } from 'wagmi';

interface ReefHealthDashboardProps {
  connectedAddress?: string;
  chainId?: number;
}

export default function ReefHealthDashboard({ connectedAddress, chainId }: ReefHealthDashboardProps) {
  const { isConnected } = useAccount();

  const reefs = [
    { id: 1, name: 'Great Barrier Reef', health: 65, location: 'Australia', status: 'At Risk' },
    { id: 2, name: 'Caribbean Reef', health: 45, location: 'Caribbean', status: 'Critical' },
    { id: 3, name: 'Red Sea Reef', health: 82, location: 'Egypt', status: 'Healthy' },
  ];

  return (
    <div style={{ padding: '2rem' }}>
      <h2 style={{ color: '#00d4ff', marginBottom: '1.5rem' }}>🌊 Coral Reef Monitoring</h2>
      
      <div style={{ 
        background: 'rgba(0,0,0,0.3)', 
        padding: '1.5rem', 
        borderRadius: '12px',
        marginBottom: '2rem'
      }}>
        <p style={{ color: '#e2e8f0', lineHeight: '1.6' }}>
          Using blockchain and community reports to track coral reef health worldwide.
          Connect your wallet to submit reef health reports and earn Guardian NFTs.
        </p>
        
        {!isConnected && (
          <div style={{ 
            padding: '1rem', 
            background: 'rgba(251, 191, 36, 0.1)', 
            borderRadius: '8px',
            marginTop: '1rem',
            color: '#fbbf24'
          }}>
            ⚠️ Connect wallet to submit reports and mint NFTs
          </div>
        )}
      </div>

      <h3 style={{ color: '#00d4ff', marginBottom: '1rem' }}>Monitored Reefs</h3>
      
      <div style={{ display: 'grid', gap: '1rem' }}>
        {reefs.map(reef => (
          <div 
            key={reef.id}
            style={{
              background: 'rgba(0,0,0,0.3)',
              padding: '1.5rem',
              borderRadius: '12px',
              border: '1px solid rgba(0,212,255,0.2)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h4 style={{ color: '#f8fafc', marginBottom: '0.5rem' }}>{reef.name}</h4>
                <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>📍 {reef.location}</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ 
                  fontSize: '2rem', 
                  fontWeight: 'bold',
                  color: reef.health >= 70 ? '#00ff88' : reef.health >= 50 ? '#fbbf24' : '#ff6b6b'
                }}>
                  {reef.health}%
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: reef.health >= 70 ? '#00ff88' : reef.health >= 50 ? '#fbbf24' : '#ff6b6b',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {reef.status}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
              <div style={{ 
                height: '8px', 
                background: 'rgba(255,255,255,0.1)', 
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${reef.health}%`,
                  height: '100%',
                  background: reef.health >= 70 ? '#00ff88' : reef.health >= 50 ? '#fbbf24' : '#ff6b6b',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>

            {isConnected && (
              <button
                style={{
                  width: '100%',
                  marginTop: '1rem',
                  padding: '0.75rem',
                  background: 'linear-gradient(90deg, #00d4ff, #0099cc)',
                  border: 'none',
                  borderRadius: '8px',
                  color: '#000',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                📊 Submit Health Report
              </button>
            )}
          </div>
        ))}
      </div>

      <div style={{ 
        marginTop: '2rem', 
        padding: '1.5rem', 
        background: 'linear-gradient(90deg, rgba(0,212,255,0.1), rgba(0,153,204,0.1))',
        borderRadius: '12px',
        border: '1px solid rgba(0,212,255,0.3)',
      }}>
        <h4 style={{ color: '#00d4ff', marginBottom: '0.5rem' }}>🎯 Become a Coral Guardian</h4>
        <p style={{ color: '#94a3b8', fontSize: '0.875rem' }}>
          Submit reef health reports, verify other guardians' data, and earn NFT rewards 
          for helping protect our oceans.
        </p>
      </div>
    </div>
  );
}
