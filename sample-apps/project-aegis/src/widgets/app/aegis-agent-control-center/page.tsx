'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Shield, Activity, Cpu, Database, AlertTriangle, AlertOctagon,
  Terminal, Lock, Radio, Play, TrendingUp, Layers, CheckCircle2,
  RefreshCw, FileText, Pause
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  description: string;
  status: 'ACTIVE' | 'IDLE' | 'REMEDIATING';
  health: number;
  requests: number;
  latency: number;
  shields: string;
  uptime: string;
}

interface LogEvent {
  id: string;
  time: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  agent: string;
}

const INITIAL_AGENTS: Agent[] = [
  { id: 'AGENT-001', name: '🔄 SingleFlight Deduplicator', description: 'Epoch-based write fence for balance checks', status: 'ACTIVE', health: 98, requests: 2847, latency: 2.3, shields: 'SingleFlight', uptime: '15h 42m' },
  { id: 'AGENT-002', name: '🔐 Idempotency Guardian', description: '15-second transaction hash deduplication', status: 'ACTIVE', health: 99, requests: 1923, latency: 1.8, shields: 'Idempotency', uptime: '15h 42m' },
  { id: 'AGENT-003', name: '⚡ QoS Traffic Shaper', description: 'EOD batch throttling and priority routing', status: 'ACTIVE', health: 96, requests: 3421, latency: 3.1, shields: 'QoS', uptime: '15h 42m' },
  { id: 'AGENT-004', name: '🛡️ Multi-Agent Orchestrator', description: 'Cascading shield activation and coordination', status: 'REMEDIATING', health: 85, requests: 156, latency: 45.2, shields: 'Cascade', uptime: '15h 42m' },
  { id: 'AGENT-005', name: '🔍 SVD Anomaly Detector', description: 'PRIME protocol subspace telemetry analysis', status: 'ACTIVE', health: 94, requests: 892, latency: 5.6, shields: 'SVD', uptime: '15h 42m' },
  { id: 'AGENT-006', name: '🚨 Emergency Failsafe', description: 'Hardcoded resilience shield activation', status: 'IDLE', health: 100, requests: 1, latency: 0.1, shields: 'Hardcoded', uptime: '15h 42m' },
  { id: 'AGENT-007', name: '💼 Ledger Guardian', description: 'Transaction validation and balance integrity', status: 'ACTIVE', health: 99, requests: 5634, latency: 1.2, shields: 'Ledger', uptime: '15h 42m' },
  { id: 'AGENT-008', name: '📢 Teller Communicator', description: 'Human-facing alert broadcasting', status: 'ACTIVE', health: 97, requests: 234, latency: 8.9, shields: 'Broadcast', uptime: '15h 42m' },
  { id: 'AGENT-009', name: '📋 Compliance RCA Engine', description: 'SOC2 audit trail and root cause analysis', status: 'ACTIVE', health: 95, requests: 45, latency: 12.3, shields: 'RCA', uptime: '15h 42m' },
  { id: 'AGENT-010', name: '🎭 Simulation Orchestrator', description: 'Salary storm, P2P surge, EOD collision tests', status: 'IDLE', health: 100, requests: 0, latency: 0, shields: 'Simulator', uptime: '15h 42m' }
];

const INITIAL_EVENTS: LogEvent[] = [
  { id: 'evt-001', time: '10:41:40 am', message: 'EMERGENCY FAIL-SAFE: All shields force-activated — bypassed agent cascade due to timeout or failure.', type: 'error', agent: 'PRIME' },
  { id: 'evt-002', time: '10:41:55 am', message: 'Simulation mode switched to LIVE', type: 'info', agent: 'PRIME' },
  { id: 'evt-003', time: '10:42:10 am', message: 'System recovered to NOMINAL status', type: 'success', agent: 'SVD_ANOMALY_DETECTOR' },
  { id: 'evt-004', time: '10:42:15 am', message: 'Multi-Agent Orchestrator entering remediation cycle', type: 'warning', agent: 'AGENT-004' }
];

export default function AegisAgentControlCenter() {
  const [systemStatus, setSystemStatus] = useState<'NOMINAL' | 'REMEDIATING' | 'ERROR'>('NOMINAL');
  const [svdResidual, setSvdResidual] = useState<number>(0.096);
  const [isWarmup, setIsWarmup] = useState<boolean>(true);
  const [normalizedVector, setNormalizedVector] = useState<string>("0.248, 17.873, 17.799, 0.949");
  const [accountCount, setAccountCount] = useState<number>(11);
  const [totalBalance, setTotalBalance] = useState<string>("815978.89");
  const [currentTime, setCurrentTime] = useState<string>("10:41:55 am");
  
  const [showAgents, setShowAgents] = useState<boolean>(true);
  const [selectedAgent, setSelectedAgent] = useState<string>("");
  
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [eventLog, setEventLog] = useState<LogEvent[]>(INITIAL_EVENTS);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [eventLog]);

  const addEvent = (message: string, type: 'info' | 'warning' | 'error' | 'success', agent: string) => {
    setEventLog(prev => [...prev, {
      id: `evt-${Date.now()}`,
      time: new Date().toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit', second: '2-digit' }),
      message,
      type,
      agent
    }].slice(-50)); // Keep last 50 events
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NOMINAL':
      case 'ACTIVE': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50';
      case 'REMEDIATING': return 'bg-amber-500/20 text-amber-400 border-amber-500/50';
      case 'ERROR': return 'bg-rose-500/20 text-rose-400 border-rose-500/50';
      case 'IDLE': return 'bg-slate-800 text-slate-400 border-slate-700';
      default: return 'bg-slate-800 text-slate-400 border-slate-700';
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'info': return 'text-cyan-400';
      case 'warning': return 'text-amber-400';
      case 'error': return 'text-rose-400';
      case 'success': return 'text-emerald-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-[#070A12] text-slate-100 font-sans p-4 lg:p-8 space-y-6 select-none">
      
      {/* Header Section */}
      <header className="bg-[#111827] border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-2xl">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 border border-purple-500/30 rounded-xl shadow-inner">
            <Shield className="w-8 h-8 text-purple-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-white">🛡️ Aegis Agent Control Center</h1>
            <p className="text-sm text-slate-400 mt-1">Real-time monitoring and control of resilience agents</p>
          </div>
        </div>
        
        <div className="flex flex-col items-end space-y-2">
          <div className={`px-4 py-1.5 rounded-lg border font-bold text-sm tracking-widest uppercase flex items-center space-x-2 ${getStatusColor(systemStatus)}`}>
            {systemStatus === 'NOMINAL' && <CheckCircle2 className="w-4 h-4" />}
            {systemStatus === 'REMEDIATING' && <RefreshCw className="w-4 h-4 animate-spin" />}
            {systemStatus === 'ERROR' && <AlertTriangle className="w-4 h-4" />}
            <span>{systemStatus}</span>
          </div>
          <div className="text-xs font-mono text-slate-500 text-right">
            System Status: {systemStatus} | SVD Residual: {svdResidual} | Warmup: {isWarmup ? 'true' : 'false'}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Left Column: Agents Grid */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                  <span>📊 Agent Status Grid</span>
                </h2>
                <p className="text-sm text-slate-400 mt-1">Monitor each agent's operational state</p>
              </div>
              <button 
                onClick={() => setShowAgents(!showAgents)}
                className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg transition-colors border border-slate-700"
              >
                {showAgents ? 'Hide Agents' : 'Show Agents'}
              </button>
            </div>

            {showAgents && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 overflow-y-auto pr-2 max-h-[800px] scrollbar-thin scrollbar-thumb-slate-800">
                {agents.map(agent => (
                  <div key={agent.id} className={`bg-[#0B101A] border ${selectedAgent === agent.id ? 'border-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.2)]' : 'border-slate-800'} rounded-xl p-4 flex flex-col space-y-4 hover:border-slate-600 transition-all`}>
                    
                    {/* Agent Header */}
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-200 text-sm">{agent.name}</h3>
                        <p className="text-xs text-slate-500 mt-1">{agent.description}</p>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${getStatusColor(agent.status)}`}>
                        {agent.status}
                      </span>
                    </div>

                    {/* Metrics */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-slate-800/60">
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase">Health</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">❤️ {agent.health}%</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase">Requests</span>
                        <span className="text-xs font-mono font-bold text-cyan-400">📨 {agent.requests}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] text-slate-500 uppercase">Latency</span>
                        <span className="text-xs font-mono font-bold text-amber-400">⏱️ {agent.latency}ms</span>
                      </div>
                    </div>

                    {/* Bottom Info & Controls */}
                    <div className="flex flex-col space-y-3 pt-1">
                      <div className="flex justify-between items-center text-xs">
                        <div className="flex items-center space-x-2">
                          <span className="text-slate-500">Shields:</span>
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">{agent.shields}</span>
                        </div>
                        <span className="text-slate-500 font-mono text-[10px]">Uptime: {agent.uptime}</span>
                      </div>

                      {/* Controls */}
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => addEvent(`Testing agent ${agent.id}`, 'info', agent.id)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1 border border-slate-700"
                        >
                          <Play className="w-3 h-3" />
                          <span>Test</span>
                        </button>
                        <button 
                          onClick={() => setSelectedAgent(agent.id)}
                          className={`flex-1 ${selectedAgent === agent.id ? 'bg-purple-900/40 text-purple-300 border-purple-500/50' : 'bg-transparent text-slate-400 hover:text-white border-slate-700 hover:bg-slate-800'} text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1 border`}
                        >
                          <Pause className="w-3 h-3" />
                          <span>Pause</span>
                        </button>
                        <button 
                          onClick={() => addEvent(`Reset agent ${agent.id}`, 'warning', agent.id)}
                          className="flex-1 bg-slate-800 hover:bg-slate-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition-colors flex items-center justify-center space-x-1 border border-slate-700"
                        >
                          <RefreshCw className="w-3 h-3" />
                          <span>Reset</span>
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Telemetry, Actions, Logs */}
        <div className="space-y-6">
          
          {/* System Telemetry */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1">📈 System Telemetry</h2>
            <p className="text-xs text-slate-400 mb-4">Real-time SVD and performance metrics</p>
            
            <div className="space-y-3 font-mono text-xs">
              <div className="flex justify-between p-2 rounded bg-[#0B101A] border border-slate-800/60">
                <span className="text-slate-500">SVD Residual Norm</span>
                <span className="text-rose-400 font-bold">{svdResidual}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0B101A] border border-slate-800/60">
                <span className="text-slate-500">Normalized Vector</span>
                <span className="text-cyan-400">[{normalizedVector}]</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0B101A] border border-slate-800/60">
                <span className="text-slate-500">Active Accounts</span>
                <span className="text-emerald-400">{accountCount}</span>
              </div>
              <div className="flex justify-between p-2 rounded bg-[#0B101A] border border-slate-800/60">
                <span className="text-slate-500">Total Balance</span>
                <span className="text-amber-400">${totalBalance}</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${isWarmup ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                  {isWarmup ? 'Warmup Period Active' : 'Warmup Complete'}
                </div>
                <div className="text-[10px] text-slate-400">
                  ✅ Forensic: Within healthy bounds
                </div>
              </div>
            </div>
          </div>

          {/* Control Actions */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-1">⚙️ Control Actions</h2>
            <p className="text-xs text-slate-400 mb-4">Trigger simulations and shield activations</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Simulations</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addEvent('Simulating Salary Day Storm (thundering herd)', 'warning', 'SIMULATOR')} className="bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-[11px] font-semibold py-2 px-2 rounded-lg border border-rose-900/50 transition-colors">🌩️ Salary Storm</button>
                  <button onClick={() => addEvent('Simulating P2P Transfer Surge', 'warning', 'SIMULATOR')} className="bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 text-[11px] font-semibold py-2 px-2 rounded-lg border border-amber-900/50 transition-colors">📱 P2P Surge</button>
                  <button onClick={() => addEvent('Simulating EOD Batch Collision', 'warning', 'SIMULATOR')} className="col-span-2 bg-yellow-950/40 hover:bg-yellow-900/60 text-yellow-300 text-[11px] font-semibold py-2 px-2 rounded-lg border border-yellow-900/50 transition-colors">💥 EOD Batch Collision</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Active Shields</div>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => addEvent('Activating SingleFlight Shield on balance checks', 'info', 'SHIELD_MANAGER')} className="bg-[#0B101A] hover:bg-slate-800 text-slate-300 text-[11px] font-semibold py-2 px-2 rounded-lg border border-slate-700 transition-colors">🛡️ SingleFlight</button>
                  <button onClick={() => addEvent('Activating Idempotency Shield (15s window)', 'info', 'SHIELD_MANAGER')} className="bg-[#0B101A] hover:bg-slate-800 text-slate-300 text-[11px] font-semibold py-2 px-2 rounded-lg border border-slate-700 transition-colors">🔐 Idempotency</button>
                  <button onClick={() => addEvent('Enforcing QoS Shunting (EOD_BATCH to 10% CPU)', 'info', 'QOS_MANAGER')} className="col-span-2 bg-[#0B101A] hover:bg-slate-800 text-slate-300 text-[11px] font-semibold py-2 px-2 rounded-lg border border-slate-700 transition-colors">⚡ QoS Shunting</button>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Emergency & Comms</div>
                <div className="flex flex-col space-y-2">
                  <button onClick={() => addEvent('EMERGENCY: Force-activating all resilience shields (cascade bypass)', 'error', 'EMERGENCY_FAILSAFE')} className="bg-red-600 hover:bg-red-500 text-white text-[11px] font-bold py-2 px-3 rounded-lg shadow-lg flex justify-center items-center space-x-2 transition-all">
                    <AlertOctagon className="w-3.5 h-3.5" />
                    <span>🚨 Emergency Hardcoded Shields</span>
                  </button>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => addEvent('Broadcasting alert to teller APIs', 'info', 'COMMS_MANAGER')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold py-2 px-2 rounded-lg transition-colors border border-slate-700">📢 Teller Broadcast</button>
                    <button onClick={() => addEvent('Generating SOC2-compliant RCA filing', 'info', 'COMPLIANCE_ENGINE')} className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] font-semibold py-2 px-2 rounded-lg transition-colors border border-slate-700">📋 Generate RCA</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Log */}
          <div className="bg-[#111827] border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col h-[380px]">
            <h2 className="text-lg font-bold text-white mb-1">📜 Live Event Log</h2>
            <p className="text-xs text-slate-400 mb-4">Real-time agent activity and system events</p>
            
            <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-thin scrollbar-thumb-slate-800">
              {eventLog.map(evt => (
                <div key={evt.id} className="bg-[#0B101A] border border-slate-800/60 rounded-lg p-2.5 space-y-1">
                  <div className="flex justify-between items-start">
                    <span className={`text-[10px] font-bold ${getLogColor(evt.type)}`}>[{evt.time}]</span>
                    <span className="text-[9px] font-mono font-bold bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                      {evt.agent}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 leading-snug">{evt.message}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
