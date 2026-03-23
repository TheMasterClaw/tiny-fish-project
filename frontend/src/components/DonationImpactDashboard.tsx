import React, { useState, useEffect } from 'react';
import { 
  Heart, 
  TrendingUp, 
  Users, 
  TreePine, 
  Globe,
  ArrowRight,
  CheckCircle,
  Clock,
  Target,
  Award,
  Leaf,
  Fish,
  Shield
} from 'lucide-react';

interface ImpactMetric {
  label: string;
  value: number;
  unit: string;
  change: number;
  icon: React.ElementType;
}

interface RecentDonation {
  id: string;
  amount: number;
  donor: string;
  project: string;
  timestamp: number;
  impact: string;
}

interface ActiveProject {
  id: string;
  name: string;
  location: string;
  funded: number;
  goal: number;
  donors: number;
  image: string;
  category: 'restoration' | 'protection' | 'research';
  milestones: { label: string; completed: boolean }[];
}

const IMPACT_METRICS: ImpactMetric[] = [
  { label: 'Coral Fragments Planted', value: 12450, unit: '', change: 23, icon: TreePine },
  { label: 'Sq Meters Restored', value: 890, unit: 'm²', change: 15, icon: Globe },
  { label: 'Marine Species Protected', value: 234, unit: '', change: 8, icon: Fish },
  { label: 'CO₂ Sequestered', value: 456, unit: 'tons', change: 12, icon: Leaf },
];

const RECENT_DONATIONS: RecentDonation[] = [
  { id: '1', amount: 0.5, donor: '0x7a2f...9b4c', project: 'Great Barrier Reef Nursery', timestamp: Date.now() - 120000, impact: '25 coral fragments' },
  { id: '2', amount: 1.2, donor: '0x3e8d...2f1a', project: 'Caribbean Restoration', timestamp: Date.now() - 300000, impact: '60 coral fragments' },
  { id: '3', amount: 0.25, donor: '0x9c4b...7e2d', project: 'AI Monitoring System', timestamp: Date.now() - 600000, impact: 'Sensor maintenance' },
  { id: '4', amount: 2.0, donor: '0x1f5a...8c3e', project: 'Red Sea Protection', timestamp: Date.now() - 900000, impact: '100 coral fragments' },
];

const ACTIVE_PROJECTS: ActiveProject[] = [
  {
    id: '1',
    name: 'Great Barrier Reef Coral Nursery',
    location: 'Queensland, Australia',
    funded: 145.5,
    goal: 200,
    donors: 342,
    image: 'reef1',
    category: 'restoration',
    milestones: [
      { label: 'Site Preparation', completed: true },
      { label: 'Nursery Setup', completed: true },
      { label: 'Fragment Collection', completed: true },
      { label: 'Outplanting Phase', completed: false },
    ]
  },
  {
    id: '2',
    name: 'Caribbean Reef Restoration',
    location: 'Belize Barrier Reef',
    funded: 89.2,
    goal: 150,
    donors: 198,
    image: 'reef2',
    category: 'restoration',
    milestones: [
      { label: 'Baseline Survey', completed: true },
      { label: 'Coral Garden Setup', completed: true },
      { label: 'Community Training', completed: false },
      { label: 'Expansion Phase', completed: false },
    ]
  },
  {
    id: '3',
    name: 'AI-Powered Reef Monitoring',
    location: 'Global Deployment',
    funded: 67.8,
    goal: 100,
    donors: 156,
    image: 'tech',
    category: 'research',
    milestones: [
      { label: 'Model Training', completed: true },
      { label: 'Sensor Deployment', completed: false },
      { label: 'Data Pipeline', completed: false },
      { label: 'Global Rollout', completed: false },
    ]
  },
  {
    id: '4',
    name: 'Marine Protected Area Expansion',
    location: 'Palau',
    funded: 234.1,
    goal: 300,
    donors: 567,
    image: 'mpa',
    category: 'protection',
    milestones: [
      { label: 'Legal Framework', completed: true },
      { label: 'Local Partnerships', completed: true },
      { label: 'Boundary Marking', completed: true },
      { label: 'Enforcement Setup', completed: false },
    ]
  },
];

export default function DonationImpactDashboard() {
  const [animatedValues, setAnimatedValues] = useState<number[]>(IMPACT_METRICS.map(() => 0));
  const [selectedProject, setSelectedProject] = useState<ActiveProject | null>(null);
  const [timeFilter, setTimeFilter] = useState<'all' | 'month' | 'week'>('all');

  // Animate metrics on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      setAnimatedValues(IMPACT_METRICS.map(m => Math.floor(m.value * easeOut)));

      if (step >= steps) {
        clearInterval(timer);
        setAnimatedValues(IMPACT_METRICS.map(m => m.value));
      }
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'restoration': return TreePine;
      case 'protection': return Shield;
      case 'research': return Target;
      default: return Fish;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'restoration': return 'from-green-500 to-emerald-600';
      case 'protection': return 'from-blue-500 to-cyan-600';
      case 'research': return 'from-purple-500 to-pink-600';
      default: return 'from-cyan-500 to-blue-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30">
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Donation Impact Dashboard</h2>
              <p className="text-cyan-300 text-sm">Real-time transparency in ocean conservation</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex bg-slate-800/50 rounded-lg p-1">
              {(['all', 'month', 'week'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTimeFilter(filter)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                    timeFilter === filter
                      ? 'bg-cyan-600 text-white'
                      : 'text-cyan-300 hover:text-white'
                  }`}
                >
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              ))}
            </div>            
            <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg text-white font-medium hover:from-pink-500 hover:to-rose-500 transition-all">
              <Heart className="w-4 h-4" />
              Donate Now
            </button>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-0">
        {/* Main Content */}
        <div className="lg:col-span-2 p-6 space-y-6">
          {/* Impact Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {IMPACT_METRICS.map((metric, idx) => (
              <div key={metric.label} className="bg-slate-800/30 rounded-xl p-4 border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <metric.icon className="w-5 h-5 text-cyan-400" />
                  <span className="text-green-400 text-xs font-medium">+{metric.change}%</span>
                </div>                
                <div className="text-2xl font-bold text-white">
                  {animatedValues[idx].toLocaleString()}{metric.unit}
                </div>                
                <div className="text-cyan-300/60 text-xs">{metric.label}</div>
              </div>
            ))}
          </div>

          {/* Active Projects */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-cyan-400" />
                Active Conservation Projects
              </h3>
              <button className="text-cyan-400 text-sm hover:text-cyan-300 flex items-center gap-1">
                View All <ArrowRight className="w-4 h-4" />
              </button>
            </div>            
            <div className="grid sm:grid-cols-2 gap-4">
              {ACTIVE_PROJECTS.map(project => {
                const progress = (project.funded / project.goal) * 100;
                const CategoryIcon = getCategoryIcon(project.category);
                
                return (
                  <div 
                    key={project.id}
                    onClick={() => setSelectedProject(project)}
                    className="bg-slate-800/30 rounded-xl p-4 border border-cyan-500/10 hover:border-cyan-500/30 cursor-pointer transition-all group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 bg-gradient-to-br ${getCategoryColor(project.category)} rounded-lg`}>
                          <CategoryIcon className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium text-sm">{project.name}</h4>
                          <p className="text-cyan-300/60 text-xs">{project.location}</p>
                        </div>
                      </div>
                      <span className="text-xs text-cyan-400 bg-cyan-400/10 px-2 py-1 rounded-full capitalize">
                        {project.category}
                      </span>
                    </div>                    
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="text-cyan-300">{project.funded} ETH raised</span>
                        <span className="text-white font-medium">{Math.round(progress)}%</span>
                      </div>                      
                      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${getCategoryColor(project.category)} rounded-full transition-all`}
                          style={{ width: `${progress}%` }}
                        />
                      </div>                    </div>                    
                    <div className="flex items-center justify-between text-xs text-cyan-300/60">
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {project.donors} donors
                      </span>
                      <span className="flex items-center gap-1">
                        Goal: {project.goal} ETH
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Total Impact Summary */}
          <div className="bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl p-6 border border-cyan-500/20">
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">536.6 ETH</div>                
                <div className="text-cyan-300/60 text-sm">Total Donated</div>              </div>              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">1,263</div>                
                <div className="text-cyan-300/60 text-sm">Global Donors</div>              </div>              
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-1">12</div>                
                <div className="text-cyan-300/60 text-sm">Active Projects</div>              </div>            </div>          </div>        </div>

        {/* Sidebar - Recent Activity */}
        <div className="p-6 bg-black/20 border-l border-cyan-500/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Recent Donations
          </h3>          
          <div className="space-y-3">
            {RECENT_DONATIONS.map(donation => (
              <div key={donation.id} className="p-3 bg-slate-800/30 rounded-lg border border-cyan-500/10">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-rose-500 rounded-full flex items-center justify-center">
                      <Heart className="w-4 h-4 text-white" />
                    </div>                    
                    <div>
                      <p className="text-white text-sm font-medium">{donation.donor}</p>                      
                      <p className="text-cyan-300/60 text-xs">{formatTime(donation.timestamp)}</p>
                    </div>                  </div>                  
                  <span className="text-green-400 font-semibold">+{donation.amount} ETH</span>                </div>                
                <p className="text-cyan-300 text-xs mb-1">{donation.project}</p>                
                <div className="flex items-center gap-1 text-green-400/80 text-xs">
                  <CheckCircle className="w-3 h-3" />                  
                  Impact: {donation.impact}
                </div>              </div>            ))}
          </div>          
          {/* Top Donors */}
          <div className="mt-6">
            <h4 className="text-white font-medium mb-3 flex items-center gap-2">
              <Award className="w-4 h-4 text-yellow-400" />              
              Top Guardians
            </h4>            
            <div className="space-y-2">
              {[
                { rank: 1, donor: '0x8f2a...4e9b', amount: 25.5, badge: '🥇' },
                { rank: 2, donor: '0x3c7d...1f8a', amount: 18.2, badge: '🥈' },
                { rank: 3, donor: '0x9e4b...6c2d', amount: 12.8, badge: '🥉' },
              ].map(donor => (
                <div key={donor.rank} className="flex items-center justify-between p-2 bg-slate-800/20 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{donor.badge}</span>                    
                    <span className="text-cyan-300 text-sm">{donor.donor}</span>                  
                  </div>                  
                  <span className="text-white font-medium text-sm">{donor.amount} ETH</span>                </div>              ))}
            </div>          </div>          
          {/* Newsletter */}
          <div className="mt-6 p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-lg border border-cyan-500/20">
            <h4 className="text-white font-medium mb-2">Get Impact Updates</h4>            
            <p className="text-cyan-300/60 text-xs mb-3">Receive monthly reports on how your donations are helping.</p>            
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 bg-slate-800/50 border border-cyan-500/30 rounded-lg text-white text-sm placeholder-cyan-300/30 focus:outline-none focus:border-cyan-500"
              />              
              <button className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg text-white text-sm font-medium transition-colors">
                Subscribe
              </button>            </div>          </div>        </div>      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-500/30">
            <div className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`p-2 bg-gradient-to-br ${getCategoryColor(selectedProject.category)} rounded-lg`}>
                      {React.createElement(getCategoryIcon(selectedProject.category), { className: 'w-5 h-5 text-white' })}
                    </div>                    
                    <h3 className="text-xl font-bold text-white">{selectedProject.name}</h3>                  
                  </div>                  
                  <p className="text-cyan-300/60">{selectedProject.location}</p>                </div>                
                <button 
                  onClick={() => setSelectedProject(null)}
                  className="p-2 hover:bg-slate-800 rounded-lg text-cyan-300"
                >
                  ✕
                </button>              </div>              
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{selectedProject.funded} ETH</div>                  
                  <div className="text-cyan-300/60 text-xs">Raised</div>                </div>                
                <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{selectedProject.donors}</div>                  
                  <div className="text-cyan-300/60 text-xs">Donors</div>                </div>                
                <div className="text-center p-4 bg-slate-800/30 rounded-lg">
                  <div className="text-2xl font-bold text-white">{Math.round((selectedProject.funded / selectedProject.goal) * 100)}%</div>                  
                  <div className="text-cyan-300/60 text-xs">Funded</div>                </div>              </div>              
              <div className="mb-6">
                <h4 className="text-white font-medium mb-3">Project Milestones</h4>                
                <div className="space-y-2">
                  {selectedProject.milestones.map((milestone, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        milestone.completed 
                          ? 'bg-green-500 text-white' 
                          : 'bg-slate-700 text-slate-400'
                      }`}>
                        {milestone.completed ? <CheckCircle className="w-4 h-4" /> : <span className="text-xs">{idx + 1}</span>}
                      </div>                      
                      <span className={`${milestone.completed ? 'text-white' : 'text-slate-400'}`}>
                        {milestone.label}
                      </span>                    </div>                  ))}
                </div>              </div>              
              <button className="w-full py-3 bg-gradient-to-r from-pink-600 to-rose-600 rounded-lg text-white font-semibold hover:from-pink-500 hover:to-rose-500 transition-all">
                Support This Project
              </button>            </div>          </div>        </div>      )}
    </div>  );
}