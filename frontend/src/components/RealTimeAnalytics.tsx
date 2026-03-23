import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  TrendingDown,
  Globe, 
  Users, 
  TreePine,
  Droplets,
  Thermometer,
  Wind,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  BarChart3,
  PieChart,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';

interface Metric {
  label: string;
  value: number;
  unit: string;
  change: number;
  trend: 'up' | 'down' | 'stable';
}

interface ReefAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  reef: string;
  message: string;
  timestamp: number;
}

interface RegionalData {
  region: string;
  health: number;
  reefs: number;
  protected: number;
  trend: number;
}

const METRICS: Metric[] = [
  { label: 'Global Reef Health', value: 67, unit: '%', change: 2.3, trend: 'up' },
  { label: 'Active Sensors', value: 1247, unit: '', change: 12, trend: 'up' },
  { label: 'Data Points/Day', value: 2.4, unit: 'M', change: 0.8, trend: 'up' },
  { label: 'Bleaching Events', value: 23, unit: '', change: -5, trend: 'down' },
];

const ALERTS: ReefAlert[] = [
  { id: '1', type: 'critical', reef: 'Great Barrier Reef - Sector 4', message: 'Temperature spike detected: 31.5°C', timestamp: Date.now() - 1800000 },
  { id: '2', type: 'warning', reef: 'Caribbean - Belize', message: 'pH level declining: 7.9', timestamp: Date.now() - 3600000 },
  { id: '3', type: 'info', reef: 'Red Sea - Egypt', message: 'New species identified: Acropora sp.', timestamp: Date.now() - 7200000 },
  { id: '4', type: 'warning', reef: 'Maldives - North Atoll', message: 'Crown-of-thorns outbreak detected', timestamp: Date.now() - 10800000 },
];

const REGIONAL_DATA: RegionalData[] = [
  { region: 'Pacific', health: 72, reefs: 284, protected: 145, trend: 3.2 },
  { region: 'Caribbean', health: 58, reefs: 156, protected: 89, trend: -1.5 },
  { region: 'Indian Ocean', health: 64, reefs: 198, protected: 112, trend: 1.8 },
  { region: 'Red Sea', health: 81, reefs: 67, protected: 54, trend: 2.1 },
  { region: 'Southeast Asia', health: 55, reefs: 234, protected: 98, trend: -2.3 },
];

export default function RealTimeAnalytics() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [animatedMetrics, setAnimatedMetrics] = useState(METRICS.map(() => 0));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedMetrics(METRICS.map(m => {
        if (m.unit === '%') return Math.floor(m.value * easeOut);
        if (m.unit === 'M') return parseFloat((m.value * easeOut).toFixed(1));
        return Math.floor(m.value * easeOut);
      }));

      if (step >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-400" />;
      default: return <Activity className="w-4 h-4 text-yellow-400" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-teal-500/30">
      {/* Header */}
      <div className="p-6 border-b border-teal-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-xl">
              <Activity className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Real-Time Analytics</h2>
              <p className="text-teal-300 text-sm">Live ocean monitoring dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-500/20 rounded-full">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-sm">Live</span>
            </div>
            <div className="text-teal-300 font-mono">
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Main Content */}
        <div className="lg:col-span-2 p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {METRICS.map((metric, idx) => (
              <div key={metric.label} className="p-4 bg-slate-800/30 rounded-xl border border-teal-500/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-teal-300/60 text-xs">{metric.label}</span>
                  {getTrendIcon(metric.trend)}
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-bold text-white">
                    {metric.unit === 'M' ? animatedMetrics[idx] : Math.floor(animatedMetrics[idx])}
                    {metric.unit}
                  </span>
                  <span className={`text-xs mb-1 ${metric.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {metric.change > 0 ? '+' : ''}{metric.change}%
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Regional Map */}
          <div className="p-4 bg-slate-800/30 rounded-xl border border-teal-500/10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-semibold flex items-center gap-2">
                <Globe className="w-5 h-5 text-teal-400" />
                Regional Health Overview
              </h3>
              <button className="text-teal-400 text-sm hover:text-teal-300">
                View Full Map
              </button>
            </div>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {REGIONAL_DATA.map(region => (
                <div
                  key={region.region}
                  onClick={() => setSelectedRegion(region.region)}
                  className={`p-3 rounded-lg border cursor-pointer transition-all ${
                    selectedRegion === region.region
                      ? 'bg-teal-600/20 border-teal-500'
                      : 'bg-slate-800/30 border-teal-500/10 hover:border-teal-500/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">{region.region}</span>
                    <span className={`text-sm ${region.trend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {region.trend > 0 ? '+' : ''}{region.trend}%
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <div 
                        className="w-2 h-2 rounded-full"
                        style={{ 
                          backgroundColor: region.health >= 70 ? '#4ade80' : 
                                         region.health >= 50 ? '#fbbf24' : '#f87171' 
                        }}
                      />
                      <span className="text-teal-300">{region.health}%</span>
                    </div>
                    <span className="text-teal-300/60">{region.reefs} reefs</span>
                  </div>
                  
                  <div className="mt-2 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div 
                      className="h-full rounded-full transition-all"
                      style={{ 
                        width: `${region.health}%`,
                        backgroundColor: region.health >= 70 ? '#4ade80' : 
                                       region.health >= 50 ? '#fbbf24' : '#f87171'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Environmental Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Thermometer, label: 'Avg Temp', value: '26.5°C', change: '+0.3°C', status: 'warning' },
              { icon: Droplets, label: 'Avg pH', value: '8.1', change: '-0.1', status: 'stable' },
              { icon: Wind, label: 'Currents', value: 'Normal', change: 'Steady', status: 'good' },
              { icon: TreePine, label: 'Coverage', value: '45%', change: '+2.1%', status: 'good' },
            ].map((item, idx) => (
              <div key={idx} className="p-3 bg-slate-800/20 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <item.icon className="w-4 h-4 text-teal-400" />
                  <span className="text-teal-300/60 text-xs">{item.label}</span>
                </div>
                <div className="text-white font-semibold">{item.value}</div>
                <div className={`text-xs ${
                  item.status === 'good' ? 'text-green-400' : 
                  item.status === 'warning' ? 'text-yellow-400' : 'text-teal-400'
                }`}>
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar - Alerts */}
        <div className="p-6 bg-black/20 border-l border-teal-500/20">
          <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-yellow-400" />
            Recent Alerts
          </h3>
          
          <div className="space-y-3">
            {ALERTS.map(alert => (
              <div 
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.type === 'critical' ? 'bg-red-900/20 border-red-500/30' :
                  alert.type === 'warning' ? 'bg-yellow-900/20 border-yellow-500/30' :
                  'bg-blue-900/20 border-blue-500/30'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <div className={`w-2 h-2 rounded-full ${
                    alert.type === 'critical' ? 'bg-red-400' :
                    alert.type === 'warning' ? 'bg-yellow-400' :
                    'bg-blue-400'
                  }`} />
                  <span className={`text-xs font-medium capitalize ${
                    alert.type === 'critical' ? 'text-red-400' :
                    alert.type === 'warning' ? 'text-yellow-400' :
                    'text-blue-400'
                  }`}>
                    {alert.type}
                  </span>
                  <span className="text-teal-300/60 text-xs ml-auto">{formatTime(alert.timestamp)}</span>
                </div>
                <p className="text-white text-sm font-medium">{alert.reef}</p>
                <p className="text-teal-300/80 text-xs">{alert.message}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <h4 className="text-white font-medium mb-3">Quick Stats</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-teal-300/60">Monitored Reefs</span>
                <span className="text-white">939</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-teal-300/60">Active Sensors</span>
                <span className="text-white">1,247</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-teal-300/60">Data Points (24h)</span>
                <span className="text-white">2.4M</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-teal-300/60">AI Predictions</span>
                <span className="text-white">89.4% accuracy</span>
              </div>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gradient-to-r from-teal-600/20 to-cyan-600/20 rounded-lg border border-teal-500/30">
            <h4 className="text-white font-medium mb-2">AI Insights</h4>
            <p className="text-teal-300 text-sm">
              Based on current trends, Caribbean reefs show signs of recovery. 
              Recommend increased monitoring in Southeast Asian regions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
