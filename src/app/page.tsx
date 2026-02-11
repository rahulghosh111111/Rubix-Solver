"use client";
import { useState } from 'react';
import Scanner from '@/components/Scanner';
import CubeMap from '@/components/CubeMap';

// Face scanning order mapping to internal notation
const FACE_ORDER = ["F", "R", "B", "L", "U", "D"];
const FACE_NAMES = ["Front", "Right", "Back", "Left", "Up", "Down"];

export default function Home() {
  const [currentStep, setCurrentStep] = useState(0); 
  const [cubeData, setCubeData] = useState<Record<string, string[]>>({});
  const [solution, setSolution] = useState<string[]>([]);
  const [isSolving, setIsSolving] = useState(false);

  const handleCapture = (colors: string[]) => {
    const faceKey = FACE_ORDER[currentStep];
    const newCubeData = { ...cubeData, [faceKey]: colors };
    setCubeData(newCubeData);

    if (currentStep < 5) {
      setCurrentStep(prev => prev + 1);
    } else {
      // All faces scanned, trigger solver
      submitToSolver(newCubeData);
    }
  };

  const submitToSolver = async (data: Record<string, string[]>) => {
    setIsSolving(true);
    try {
      // Construct the 54-character string in U R F D L B order (Kociemba standard)
      const stateString = [
        ...(data['U'] || []),
        ...(data['R'] || []),
        ...(data['F'] || []),
        ...(data['D'] || []),
        ...(data['L'] || []),
        ...(data['B'] || [])
      ].join("");

      const res = await fetch('/api/solve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cubeState: stateString }),
      });

      const result = await res.json();
      if (result.success) {
        setSolution(result.moves);
        setCurrentStep(6); // Move to "Solved" view
      } else {
        alert("Error: " + result.error);
        setCurrentStep(0); // Reset to try again
        setCubeData({});
      }
    } catch (error) {
      alert("Failed to connect to solver API");
    } finally {
      setIsSolving(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center px-4 pb-10">
      <header className="py-6 text-center">
        <h1 className="text-2xl font-black tracking-tighter uppercase italic text-blue-500">Rubix.AI</h1>
        <p className="text-xs text-gray-500 uppercase tracking-widest">Mobile AI Solver</p>
      </header>

      <div className="w-full max-w-md space-y-8">
        {/* Progress Bar */}
        <div className="flex justify-between px-2">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={`h-1.5 w-full mx-1 rounded-full transition-colors duration-500 ${i <= currentStep ? 'bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`} />
          ))}
        </div>

        {currentStep < 6 ? (
          <>
            <div className="text-center animate-pulse">
              <h2 className="text-xl font-bold">Scan the <span className="text-blue-400">{FACE_NAMES[currentStep]}</span> face</h2>
              <p className="text-gray-500 text-sm">Align the center piece with the grid</p>
            </div>

            <Scanner onCapture={handleCapture} />

            <div className="bg-gray-900/50 p-4 rounded-2xl border border-white/5 flex items-center justify-center gap-3">
              {isSolving ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-blue-400 font-medium">Crunching algorithms...</span>
                </div>
              ) : (
                <p className="text-sm text-gray-400">Step {currentStep + 1} of 6</p>
              )}
            </div>
          </>
        ) : (
          /* Solution Result View */
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-blue-600/20 border border-blue-500/50 p-6 rounded-3xl text-center">
              <h2 className="text-2xl font-black mb-2">SOLVED!</h2>
              <p className="text-blue-200">Follow these {solution.length} moves:</p>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {solution.map((move, i) => (
                <div key={i} className="bg-gray-900 border border-white/10 p-4 rounded-xl text-center font-mono text-lg font-bold">
                  {move}
                </div>
              ))}
            </div>

            <button 
              onClick={() => { setCurrentStep(0); setSolution([]); setCubeData({}); }}
              className="w-full py-4 bg-white text-black font-black rounded-2xl hover:bg-gray-200 transition"
            >
              SCAN NEW CUBE
            </button>
          </div>
        )}
      </div>
    </main>
  );
}