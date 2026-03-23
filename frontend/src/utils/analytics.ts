/**
 * CoralGuard Analytics Module
 * Tracks user engagement, NFT mints, reef health checks, and conservation actions
 */

import { useCallback } from 'react';

// Simple analytics queue that can be extended to use Google Analytics, Mixpanel, etc.
class CoralGuardAnalytics {
  private queue: Array<{ event: string; data: any; timestamp: number }> = [];
  private userId: string | null = null;
  private sessionId: string;
  private isEnabled: boolean = true;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadFromStorage();
    this.trackPageView();
    this.startHeartbeat();
  }

  private generateSessionId(): string {
    return 'cg_' + Math.random().toString(36).substring(2, 15);
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem('coralguard_analytics');
      if (stored) {
        const data = JSON.parse(stored);
        this.userId = data.userId || null;
      }
    } catch (e) {
      console.warn('Analytics storage error:', e);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('coralguard_analytics', JSON.stringify({
        userId: this.userId,
        sessionId: this.sessionId
      }));
    } catch (e) {
      console.warn('Analytics storage error:', e);
    }
  }

  setUserId(address: string): void {
    this.userId = address.toLowerCase();
    this.saveToStorage();
    this.track('user_connected', { address: this.maskAddress(address) });
  }

  private maskAddress(address: string): string {
    return address.slice(0, 6) + '...' + address.slice(-4);
  }

  track(event: string, data: Record<string, any> = {}): void {
    if (!this.isEnabled) return;

    const eventData = {
      event,
      data: {
        ...data,
        sessionId: this.sessionId,
        userId: this.userId,
        url: window.location.href,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        timestamp: Date.now()
      },
      timestamp: Date.now()
    };

    this.queue.push(eventData);
    
    // Send immediately for important events
    if (['nft_minted', 'donation_made', 'reef_analyzed'].includes(event)) {
      this.flush();
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Analytics:', event, data);
    }

    // Send to Google Analytics if available
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', event, {
        event_category: 'coralguard',
        event_label: data.label || event,
        value: data.value || 1
      });
    }
  }

  trackPageView(page?: string): void {
    const pageName = page || window.location.pathname;
    this.track('page_view', { page: pageName });
  }

  // Specific event tracking methods
  trackReefAnalysis(imageHash: string, healthScore: number): void {
    this.track('reef_analyzed', {
      imageHash: imageHash.slice(0, 16),
      healthScore,
      category: healthScore >= 80 ? 'healthy' : healthScore >= 50 ? 'moderate' : 'critical'
    });
  }

  trackNFTMint(tokenId: string, tier: string, amount: number): void {
    this.track('nft_minted', {
      tokenId,
      tier,
      amount,
      currency: 'ETH'
    });
  }

  trackDonation(amount: number, currency: string = 'ETH', project: string): void {
    this.track('donation_made', {
      amount,
      currency,
      project,
      usdValue: amount * 3500 // Approximate ETH price
    });
  }

  trackGuardianSignup(level: string): void {
    this.track('guardian_signup', { level });
  }

  trackConservationAction(actionType: string, impact: string): void {
    this.track('conservation_action', { actionType, impact });
  }

  trackWalletConnect(walletType: string): void {
    this.track('wallet_connect', { walletType });
  }

  trackError(errorType: string, message: string): void {
    this.track('error', { errorType, message: message.slice(0, 100) });
  }

  trackFeatureUsage(feature: string, action: string): void {
    this.track('feature_usage', { feature, action });
  }

  private startHeartbeat(): void {
    // Send heartbeat every 30 seconds
    setInterval(() => {
      this.track('heartbeat', { 
        timeOnSite: Math.floor((Date.now() - parseInt(this.sessionId.split('_')[1] || '0')) / 1000) 
      });
      this.flush();
    }, 30000);
  }

  flush(): void {
    if (this.queue.length === 0) return;

    const events = [...this.queue];
    this.queue = [];

    // Send to your analytics endpoint
    this.sendToServer(events);

    // Also save to localStorage as backup
    try {
      const existing = JSON.parse(localStorage.getItem('coralguard_events_backup') || '[]');
      localStorage.setItem('coralguard_events_backup', JSON.stringify([...existing, ...events].slice(-100)));
    } catch (e) {
      console.warn('Analytics backup error:', e);
    }
  }

  private async sendToServer(events: Array<{ event: string; data: any; timestamp: number }>): Promise<void> {
    try {
      // Replace with your actual analytics endpoint
      const ANALYTICS_ENDPOINT = process.env.REACT_APP_ANALYTICS_URL || 'https://api.coralguard.io/analytics';
      
      await fetch(ANALYTICS_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events, sessionId: this.sessionId }),
        keepalive: true
      });
    } catch (e) {
      // Silently fail - analytics should never break the app
      console.warn('Analytics send failed:', e);
    }
  }

  getStats(): {
    eventsInQueue: number;
    sessionId: string;
    userId: string | null;
  } {
    return {
      eventsInQueue: this.queue.length,
      sessionId: this.sessionId,
      userId: this.userId
    };
  }

  disable(): void {
    this.isEnabled = false;
  }

  enable(): void {
    this.isEnabled = true;
  }
}

// Export singleton instance
export const analytics = new CoralGuardAnalytics();

// React hook for using analytics
export function useAnalytics() {
  const trackReefAnalysis = useCallback((imageHash: string, healthScore: number) => {
    analytics.trackReefAnalysis(imageHash, healthScore);
  }, []);

  const trackNFTMint = useCallback((tokenId: string, tier: string, amount: number) => {
    analytics.trackNFTMint(tokenId, tier, amount);
  }, []);

  const trackDonation = useCallback((amount: number, currency: string, project: string) => {
    analytics.trackDonation(amount, currency, project);
  }, []);

  const trackGuardianSignup = useCallback((level: string) => {
    analytics.trackGuardianSignup(level);
  }, []);

  const trackConservationAction = useCallback((actionType: string, impact: string) => {
    analytics.trackConservationAction(actionType, impact);
  }, []);

  const trackFeatureUsage = useCallback((feature: string, action: string) => {
    analytics.trackFeatureUsage(feature, action);
  }, []);

  const setUser = useCallback((address: string) => {
    analytics.setUserId(address);
  }, []);

  return {
    trackReefAnalysis,
    trackNFTMint,
    trackDonation,
    trackGuardianSignup,
    trackConservationAction,
    trackFeatureUsage,
    setUser,
    analytics
  };
}

export default analytics;
