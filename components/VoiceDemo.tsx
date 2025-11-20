import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { VoiceMode } from '../types';
import { createBlob, decode, decodeAudioData } from '../utils/audioUtils';
import { Mic, MicOff, Phone, AlertCircle, UserCheck, Activity } from 'lucide-react';

const SYSTEM_INSTRUCTIONS = {
  [VoiceMode.RECEPTION]: `You are Sarah, the friendly and professional receptionist for Watson's Plumbing, Heating & Building Services in New York City.
  
  KEY INFORMATION:
  - Established 1996, serving Manhattan and Bronx for over 20 years.
  - Phone: (212) 368-3434.
  - Hours: Mon-Sat 8am-5pm.
  - Locations: St. Nicholas Ave and Edgecombe Ave.
  
  SERVICES:
  - Residential & Commercial Plumbing.
  - Heating services, Boiler services.
  - Local Law 152 Inspections.
  - Renovations and New Construction.
  
  TONE: Warm, helpful, polite, organized.
  GOAL: Answer questions about services, hours, and schedule appointments. "We fix it right the first time."`,

  [VoiceMode.EMERGENCY]: `You are Mike, the Emergency Dispatch Coordinator for Watson's Plumbing. 
  
  KEY INFORMATION:
  - We offer 24/7 Emergency Services.
  - Serving Manhattan and Bronx.
  - Phone: (212) 368-3434.
  
  TONE: Calm, urgent, reassuring, direct.
  GOAL: Quickly identify the emergency (burst pipe, no heat, gas leak), get the customer's address immediately, and reassure them a truck is on the way.
  
  PROTOCOL:
  1. Ask for the nature of the emergency.
  2. Ask for the address.
  3. Tell them to turn off the water main (if leak) or open windows (if gas).
  4. Dispatch a technician.`
};

interface VoiceDemoProps {
  initialMode?: VoiceMode;
}

const VoiceDemo: React.FC<VoiceDemoProps> = ({ initialMode = VoiceMode.RECEPTION }) => {
  const [mode, setMode] = useState<VoiceMode>(initialMode);
  const [isActive, setIsActive] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [volume, setVolume] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Audio Context Refs
  const inputAudioContextRef = useRef<AudioContext | null>(null);
  const outputAudioContextRef = useRef<AudioContext | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const audioSourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  
  // Playback State
  const nextStartTimeRef = useRef<number>(0);
  const activeSourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);

  const cleanupAudio = useCallback(() => {
    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }
    if (audioSourceRef.current) {
      audioSourceRef.current.disconnect();
      audioSourceRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (inputAudioContextRef.current) {
      inputAudioContextRef.current.close();
      inputAudioContextRef.current = null;
    }
    if (outputAudioContextRef.current) {
      outputAudioContextRef.current.close();
      outputAudioContextRef.current = null;
    }
    
    // Stop all playing sources
    activeSourcesRef.current.forEach(source => {
      try { source.stop(); } catch (e) { /* ignore */ }
    });
    activeSourcesRef.current.clear();
    nextStartTimeRef.current = 0;
    sessionRef.current = null;
  }, []);

  const stopSession = useCallback(() => {
    if (sessionRef.current) {
       // There is no specific close method on the session object itself in the example provided,
       // but we can close the resources. The SDK manages connection state via the promise chain essentially.
       // However, keeping clean state is key.
       sessionRef.current = null;
    }
    cleanupAudio();
    setIsActive(false);
    setIsConnecting(false);
    setVolume(0);
  }, [cleanupAudio]);

  const startSession = async () => {
    if (!process.env.API_KEY) {
      setError("API Key missing in environment.");
      return;
    }

    setIsConnecting(true);
    setError(null);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      // Initialize Audio Contexts
      inputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      outputAudioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      const inputCtx = inputAudioContextRef.current;
      const outputCtx = outputAudioContextRef.current;
      const outputNode = outputCtx.createGain();
      outputNode.connect(outputCtx.destination);

      // Get Mic Stream
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;

      // Config for Live API
      const config = {
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        config: {
          responseModalities: [Modality.AUDIO],
          systemInstruction: SYSTEM_INSTRUCTIONS[mode],
          speechConfig: {
            voiceConfig: { 
              prebuiltVoiceConfig: { 
                voiceName: mode === VoiceMode.EMERGENCY ? 'Kore' : 'Fenrir' 
              } 
            },
          },
        },
      };

      const sessionPromise = ai.live.connect({
        ...config,
        callbacks: {
          onopen: () => {
            setIsConnecting(false);
            setIsActive(true);

            // Setup Input Processing
            const source = inputCtx.createMediaStreamSource(stream);
            audioSourceRef.current = source;
            
            const processor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = processor;

            processor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              
              // Simple volume meter
              let sum = 0;
              for(let i = 0; i < inputData.length; i++) sum += inputData[i] * inputData[i];
              const rms = Math.sqrt(sum / inputData.length);
              setVolume(Math.min(rms * 5, 1)); // Amplify for visual

              const pcmBlob = createBlob(inputData);
              
              sessionPromise.then((session) => {
                 session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(processor);
            processor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64Audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            
            if (base64Audio) {
              // Ensure we don't play in the past
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outputCtx.currentTime);
              
              const audioBuffer = await decodeAudioData(
                decode(base64Audio),
                outputCtx,
                24000,
                1
              );

              const source = outputCtx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(outputNode);
              
              source.addEventListener('ended', () => {
                activeSourcesRef.current.delete(source);
              });

              source.start(nextStartTimeRef.current);
              activeSourcesRef.current.add(source);
              nextStartTimeRef.current += audioBuffer.duration;
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
                activeSourcesRef.current.forEach(src => {
                    try { src.stop(); } catch(e) {}
                });
                activeSourcesRef.current.clear();
                nextStartTimeRef.current = 0;
            }
          },
          onclose: () => {
            stopSession();
          },
          onerror: (e) => {
            console.error(e);
            setError("Connection error occurred.");
            stopSession();
          }
        }
      });
      
      sessionRef.current = sessionPromise;

    } catch (err) {
      console.error("Failed to start session", err);
      setError("Could not access microphone or connect to AI.");
      setIsConnecting(false);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupAudio();
    };
  }, [cleanupAudio]);

  // Switch mode handler (disconnects if active)
  const handleModeChange = (newMode: VoiceMode) => {
    if (isActive) stopSession();
    setMode(newMode);
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden relative">
      {/* Header / Mode Selection */}
      <div className="p-4 bg-watson-blue text-white flex justify-between items-center">
        <div className="flex items-center space-x-2">
            <Activity className={`w-5 h-5 ${isActive ? 'text-green-400 animate-pulse' : 'text-gray-400'}`} />
            <span className="font-bold tracking-wide">AI ASSISTANT</span>
        </div>
        <div className="text-xs bg-blue-800 px-2 py-1 rounded text-blue-200">
            {isActive ? 'LIVE CALL' : 'DISCONNECTED'}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="flex border-b border-gray-200">
        <button 
          onClick={() => handleModeChange(VoiceMode.RECEPTION)}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === VoiceMode.RECEPTION ? 'bg-blue-50 text-watson-blue border-b-2 border-watson-blue' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <UserCheck className="w-4 h-4" />
          Front Desk
        </button>
        <button 
          onClick={() => handleModeChange(VoiceMode.EMERGENCY)}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${mode === VoiceMode.EMERGENCY ? 'bg-red-50 text-watson-red border-b-2 border-watson-red' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <AlertCircle className="w-4 h-4" />
          Emergency
        </button>
      </div>

      {/* Main Visual Area */}
      <div className={`h-64 flex flex-col items-center justify-center relative transition-colors duration-500 ${mode === VoiceMode.EMERGENCY ? 'bg-gradient-to-b from-white to-red-50' : 'bg-gradient-to-b from-white to-blue-50'}`}>
        
        {/* Status Text */}
        <div className="absolute top-6 text-center px-4">
           <h3 className="text-lg font-bold text-gray-800">
             {mode === VoiceMode.RECEPTION ? 'Sarah (Reception)' : 'Mike (Dispatch)'}
           </h3>
           <p className="text-sm text-gray-500 mt-1">
             {mode === VoiceMode.RECEPTION ? 'Scheduling & General Inquiries' : 'Priority Emergency Response'}
           </p>
        </div>

        {/* Visualizer / Avatar */}
        <div className="relative">
           {isActive && (
             <div className="absolute inset-0 bg-current opacity-20 rounded-full animate-ping" style={{ color: mode === VoiceMode.EMERGENCY ? '#cc0000' : '#003366' }}></div>
           )}
           <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg z-10 relative transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'} ${mode === VoiceMode.EMERGENCY ? 'bg-watson-red' : 'bg-watson-blue'}`}>
              <Phone className="w-10 h-10 text-white" />
           </div>
        </div>

        {/* Audio Wave (Simulated) */}
        {isActive && (
            <div className="absolute bottom-8 flex items-center justify-center space-x-1 h-8">
                {[...Array(5)].map((_, i) => (
                    <div 
                        key={i}
                        className={`w-1 rounded-full transition-all duration-75 ${mode === VoiceMode.EMERGENCY ? 'bg-red-400' : 'bg-blue-400'}`}
                        style={{ 
                            height: `${Math.max(20, Math.random() * 100 * (volume + 0.2))}%`,
                            opacity: 0.7
                        }}
                    />
                ))}
            </div>
        )}
        
        {error && (
            <div className="absolute bottom-4 text-xs text-red-600 bg-red-100 px-3 py-1 rounded-full">
                {error}
            </div>
        )}
      </div>

      {/* Controls */}
      <div className="p-6 bg-white border-t border-gray-100">
        {!isActive ? (
          <button
            onClick={startSession}
            disabled={isConnecting}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transform transition hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-3 ${isConnecting ? 'opacity-75 cursor-wait' : ''} ${mode === VoiceMode.EMERGENCY ? 'bg-watson-red hover:bg-red-700 shadow-red-200' : 'bg-watson-blue hover:bg-blue-800 shadow-blue-200'}`}
          >
             {isConnecting ? (
                 <span>Connecting...</span>
             ) : (
                 <>
                    <Mic className="w-5 h-5" />
                    <span>Start Call</span>
                 </>
             )}
          </button>
        ) : (
          <button
            onClick={stopSession}
            className="w-full py-4 rounded-xl font-bold text-gray-700 bg-gray-100 hover:bg-gray-200 shadow-inner transform transition active:scale-[0.98] flex items-center justify-center gap-3"
          >
            <MicOff className="w-5 h-5" />
            <span>End Call</span>
          </button>
        )}
        
        <p className="text-center text-xs text-gray-400 mt-4">
           Powered by Gemini 2.5 Flash Live API
        </p>
      </div>
    </div>
  );
};

export default VoiceDemo;