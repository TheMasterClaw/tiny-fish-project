import React, { useEffect, useRef, useState } from 'react';
import { Fish, Shell, Star, Info, Maximize2, Minimize2, Waves } from 'lucide-react';

interface ReefZone {
  id: string;
  name: string;
  health: number;
  species: number;
  depth: string;
  temperature: number;
  status: 'thriving' | 'stable' | 'declining' | 'critical';
  description: string;
  threats: string[];
  actions: string[];
}

const reefZones: ReefZone[] = [
  {
    id: 'shallow',
    name: 'Shallow Reef',
    health: 78,
    species: 145,
    depth: '0-5m',
    temperature: 26.5,
    status: 'thriving',
    description: 'Sunlit zone with abundant coral growth and diverse marine life.',
    threats: ['Coral bleaching', 'Tourism pressure'],
    actions: ['Coral nurseries active', 'Visitor education programs']
  },
  {
    id: 'mid',
    name: 'Mid Reef',
    health: 62,
    species: 89,
    depth: '5-15m',
    temperature: 25.8,
    status: 'stable',
    description: 'Moderate depth with mix of hard and soft corals.',
    threats: ['Overfishing', 'Pollution runoff'],
    actions: ['Fishing restrictions', 'Water quality monitoring']
  },
  {
    id: 'deep',
    name: 'Deep Reef',
    health: 45,
    species: 34,
    depth: '15-30m',
    temperature: 24.2,
    status: 'declining',
    description: 'Mesophotic zone with specialized low-light corals.',
    threats: ['Ocean acidification', 'Climate change'],
    actions: ['Research expeditions', 'Protected area expansion']
  },
  {
    id: 'seagrass',
    name: 'Seagrass Meadows',
    health: 82,
    species: 67,
    depth: '2-8m',
    temperature: 26.8,
    status: 'thriving',
    description: 'Underwater meadows providing nursery habitats.',
    threats: ['Anchor damage', 'Coastal development'],
    actions: ['Mooring buoys installed', 'Restoration planting']
  }
];

export default function CoralReefVisualization() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const [selectedZone, setSelectedZone] = useState<ReefZone | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);

  // Animated coral reef visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;
    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      opacity: number;
      type: 'bubble' | 'plankton' | 'fish';
    }> = [];

    // Initialize particles
    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 3 + 1,
        speedY: -Math.random() * 0.5 - 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        type: Math.random() > 0.7 ? 'bubble' : Math.random() > 0.5 ? 'fish' : 'plankton'
      });
    }

    const drawCoral = (x: number, y: number, height: number, color: string, type: 'branching' | 'brain' | 'fan') => {
      ctx.save();
      ctx.translate(x, y);
      
      if (type === 'branching') {
        // Branching coral
        ctx.strokeStyle = color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(-10, -height * 0.3, -5, -height * 0.6);
        ctx.moveTo(0, 0);
        ctx.quadraticCurveTo(10, -height * 0.4, 8, -height * 0.7);
        ctx.moveTo(0, 0);
        ctx.lineTo(0, -height);
        ctx.stroke();
        
        // Coral tips
        ctx.fillStyle = color;
        [-5, 8, 0].forEach((offset, i) => {
          const tipY = -height * (0.6 + i * 0.2);
          ctx.beginPath();
          ctx.arc(offset, tipY, 4, 0, Math.PI * 2);
          ctx.fill();
        });
      } else if (type === 'brain') {
        // Brain coral
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.ellipse(0, -height * 0.3, 25, height * 0.4, 0, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 5; i++) {
          ctx.beginPath();
          ctx.moveTo(-15, -height * 0.2 + i * 8);
          ctx.quadraticCurveTo(0, -height * 0.3 + i * 8, 15, -height * 0.2 + i * 8);
          ctx.stroke();
        }
      } else {
        // Fan coral
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        for (let i = 0; i < 7; i++) {
          const angle = (Math.PI / 6) * (i - 3);
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.quadraticCurveTo(
            Math.sin(angle) * height * 0.3,
            -height * 0.3,
            Math.sin(angle) * height * 0.6,
            -height * 0.7
          );
          ctx.stroke();
        }
      }
      
      ctx.restore();
    };

    const animate = () => {
      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0c4a6e');
      gradient.addColorStop(0.5, '#075985');
      gradient.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw light rays
      ctx.save();
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 5; i++) {
        const x = (canvas.width / 6) * (i + 1) + Math.sin(time * 0.5 + i) * 30;
        const gradient = ctx.createLinearGradient(x, 0, x + 50, canvas.height);
        gradient.addColorStop(0, 'rgba(255,255,255,0.4)');
        gradient.addColorStop(1, 'rgba(255,255,255,0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(x - 20, 0);
        ctx.lineTo(x + 70, 0);
        ctx.lineTo(x + 120, canvas.height);
        ctx.lineTo(x - 70, canvas.height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Draw ocean floor
      ctx.fillStyle = '#1e3a5f';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      for (let x = 0; x <= canvas.width; x += 10) {
        ctx.lineTo(x, canvas.height - 40 + Math.sin(x * 0.02) * 10);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw corals with subtle animation
      const sway = Math.sin(time * 0.3) * 3;
      
      // Shallow zone corals (left)
      drawCoral(100, canvas.height - 40, 100 + sway, '#ff6b9d', 'branching');
      drawCoral(180, canvas.height - 35, 80 - sway, '#feca57', 'brain');
      drawCoral(260, canvas.height - 45, 120 + sway * 0.5, '#48dbfb', 'fan');
      
      // Mid zone corals (center-left)
      drawCoral(380, canvas.height - 40, 90 + sway, '#ff9ff3', 'branching');
      drawCoral(450, canvas.height - 35, 70, '#54a0ff', 'brain');
      
      // Deep zone corals (center-right)
      drawCoral(580, canvas.height - 45, 85 - sway * 0.8, '#5f27cd', 'fan');
      drawCoral(650, canvas.height - 40, 60 + sway * 0.3, '#00d2d3', 'branching');
      
      // Seagrass zone (right)
      drawCoral(780, canvas.height - 40, 95, '#1dd1a1', 'branching');
      drawCoral(850, canvas.height - 35, 75 - sway, '#10ac84', 'brain');

      // Draw and animate particles
      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        
        if (particle.type === 'bubble') {
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fill();
          
          // Bubble highlight
          ctx.fillStyle = 'rgba(255,255,255,0.9)';
          ctx.beginPath();
          ctx.arc(particle.x - particle.size * 0.3, particle.y - particle.size * 0.3, particle.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (particle.type === 'fish') {
          ctx.fillStyle = '#ffd93d';
          ctx.beginPath();
          ctx.ellipse(particle.x, particle.y, particle.size * 3, particle.size, 0, 0, Math.PI * 2);
          ctx.fill();
          // Tail
          ctx.beginPath();
          ctx.moveTo(particle.x - particle.size * 2, particle.y);
          ctx.lineTo(particle.x - particle.size * 4, particle.y - particle.size);
          ctx.lineTo(particle.x - particle.size * 4, particle.y + particle.size);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = 'rgba(255,255,255,0.3)';
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
        
        // Update position
        particle.y += particle.speedY;
        if (particle.type === 'fish') {
          particle.x += Math.sin(time + particle.y * 0.01) * 0.5;
        }
        
        // Reset if off screen
        if (particle.y < -10) {
          particle.y = canvas.height + 10;
          particle.x = Math.random() * canvas.width;
        }
      });

      // Draw zone labels
      ctx.font = 'bold 14px sans-serif';
      ctx.fillStyle = 'rgba(255,255,255,0.8)';
      ctx.textAlign = 'center';
      
      const zones = [
        { x: 180, label: 'Shallow' },
        { x: 415, label: 'Mid' },
        { x: 615, label: 'Deep' },
        { x: 815, label: 'Seagrass' }
      ];
      
      zones.forEach(zone => {
        ctx.fillText(zone.label, zone.x, canvas.height - 10);
      });

      // Draw zone selection indicators
      if (selectedZone) {
        const zoneX = selectedZone.id === 'shallow' ? 180 : 
                      selectedZone.id === 'mid' ? 415 : 
                      selectedZone.id === 'deep' ? 615 : 815;
        
        ctx.strokeStyle = '#00d4ff';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.arc(zoneX, canvas.height - 100, 80 + Math.sin(time * 2) * 5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }

      time += 0.016;
      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [selectedZone]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thriving': return 'text-green-400';
      case 'stable': return 'text-blue-400';
      case 'declining': return 'text-yellow-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getHealthGradient = (health: number) => {
    if (health >= 70) return 'from-green-500 to-emerald-400';
    if (health >= 50) return 'from-yellow-500 to-amber-400';
    if (health >= 30) return 'from-orange-500 to-red-400';
    return 'from-red-600 to-red-400';
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900 via-cyan-950 to-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-cyan-500/30 ${isFullscreen ? 'fixed inset-4 z-50' : ''}`}>
      {/* Header */}
      <div className="p-6 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl">
            <Waves className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white">3D Coral Reef Explorer</h2>
            <p className="text-cyan-300 text-sm">Interactive marine ecosystem visualization</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAIPanel(!showAIPanel)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg text-white font-medium hover:from-purple-500 hover:to-pink-500 transition-all"
          >
            <Star className="w-4 h-4" />
            AI Insights
          </button>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-cyan-500/20 rounded-lg text-cyan-300 hover:bg-cyan-500/30 transition-colors"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className={`flex ${isFullscreen ? 'h-[calc(100%-100px)]' : ''}`}>
        {/* Canvas */}
        <div className="flex-1 relative">
          <canvas
            ref={canvasRef}
            width={900}
            height={400}
            className="w-full h-full object-cover cursor-crosshair"
          />
          
          {/* Zone selection overlay */}
          <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-2">
            {reefZones.map(zone => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(selectedZone?.id === zone.id ? null : zone)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedZone?.id === zone.id
                    ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/30'
                    : 'bg-black/40 text-cyan-300 hover:bg-black/60 backdrop-blur-sm'
                }`}
              >
                {zone.name}
              </button>
            ))}
          </div>
        </div>

        {/* Side Panel */}
        <div className={`w-80 bg-black/40 backdrop-blur-md border-l border-cyan-500/20 transition-all ${selectedZone || showAIPanel ? 'block' : 'hidden lg:block'}`}>
          {selectedZone ? (
            <div className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Shell className="w-5 h-5 text-cyan-400" />
                <h3 className="text-xl font-bold text-white">{selectedZone.name}</h3>
              </div>
              
              <p className="text-cyan-200/70 text-sm mb-6">{selectedZone.description}</p>
              
              {/* Health Score */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-cyan-300 text-sm">Health Score</span>
                  <span className={`text-2xl font-bold ${getStatusColor(selectedZone.status)}`}>
                    {selectedZone.health}%
                  </span>
                </div>
                <div className="h-3 bg-slate-700 rounded-full overflow-hidden">
                  <div 
                    className={`h-full bg-gradient-to-r ${getHealthGradient(selectedZone.health)} rounded-full transition-all duration-1000`}
                    style={{ width: `${selectedZone.health}%` }}
                  />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-2 h-2 rounded-full ${selectedZone.status === 'thriving' ? 'bg-green-400 animate-pulse' : selectedZone.status === 'stable' ? 'bg-blue-400' : selectedZone.status === 'declining' ? 'bg-yellow-400' : 'bg-red-400 animate-pulse'}`} />
                  <span className={`text-sm capitalize ${getStatusColor(selectedZone.status)}`}>
                    {selectedZone.status}
                  </span>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Fish className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-xs">Species</span>
                  </div>
                  <span className="text-xl font-bold text-white">{selectedZone.species}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Waves className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-xs">Depth</span>
                  </div>
                  <span className="text-xl font-bold text-white">{selectedZone.depth}</span>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <Info className="w-4 h-4 text-cyan-400" />
                    <span className="text-cyan-300 text-xs">Temperature</span>
                  </div>
                  <span className="text-xl font-bold text-white">{selectedZone.temperature}°C</span>
                </div>
              </div>

              {/* Threats & Actions */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-red-400 text-sm font-medium mb-2">⚠️ Threats</h4>
                  <ul className="space-y-1">
                    {selectedZone.threats.map((threat, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                        {threat}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-green-400 text-sm font-medium mb-2">✅ Conservation Actions</h4>
                  <ul className="space-y-1">
                    {selectedZone.actions.map((action, i) => (
                      <li key={i} className="text-slate-300 text-sm flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                        {action}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Donate CTA */}
              <button className="w-full mt-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-lg text-white font-semibold hover:from-cyan-500 hover:to-blue-500 transition-all shadow-lg shadow-cyan-500/20">
                Support This Zone
              </button>
            </div>
          ) : showAIPanel ? (
            <div className="p-6">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-purple-400" />
                AI Analysis
              </h3>
              
              <div className="space-y-4">
                <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-purple-300 font-medium mb-2">🤖 Species Detection</h4>
                  <p className="text-slate-300 text-sm">
                    AI has identified 12 new species in the shallow reef zone this month, 
                    including 3 rare butterflyfish varieties.
                  </p>
                </div>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-blue-300 font-medium mb-2">📊 Health Predictions</h4>
                  <p className="text-slate-300 text-sm">
                    Machine learning models predict 15% improvement in mid-reef health 
                    over the next 6 months based on current conservation efforts.
                  </p>
                </div>
                
                <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-green-300 font-medium mb-2">🎯 Recommendations</h4>
                  <ul className="text-slate-300 text-sm space-y-1">
                    <li>• Increase monitoring frequency in deep reef</li>
                    <li>• Expand coral nursery capacity by 25%</li>
                    <li>• Deploy additional water quality sensors</li>
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <Shell className="w-16 h-16 text-cyan-500/30 mx-auto mb-4" />
              <p className="text-cyan-300/50">
                Select a reef zone to view detailed information
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-black/40 backdrop-blur-md border-t border-cyan-500/20 p-4">
        <div className="grid grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-white">335</div>
            <div className="text-cyan-400 text-xs">Total Species</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">67%</div>
            <div className="text-cyan-400 text-xs">Avg Health</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">4</div>
            <div className="text-cyan-400 text-xs">Zones Monitored</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-white">24/7</div>
            <div className="text-cyan-400 text-xs">AI Monitoring</div>
          </div>
        </div>
      </div>
    </div>
  );
}
