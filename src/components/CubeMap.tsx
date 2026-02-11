import React from 'react';

interface CubeMapProps {
  faces: Record<string, string[]>;
  onColorChange: (face: string, index: number, color: string) => void;
}

const colors: Record<string, string> = {
  U: 'bg-white', R: 'bg-red-600', F: 'bg-green-600',
  D: 'bg-yellow-400', L: 'bg-orange-500', B: 'bg-blue-600'
};

export default function CubeMap({ faces, onColorChange }: CubeMapProps) {
  return (
    <div className="grid grid-cols-4 gap-2 p-4 bg-gray-900 rounded-xl">
      {Object.entries(faces).map(([faceName, stickers]) => (
        <div key={faceName} className="flex flex-col items-center">
          <span className="text-xs text-gray-400 mb-1">{faceName} Face</span>
          <div className="grid grid-cols-3 gap-1 bg-black p-1">
            {stickers.map((colorCode, i) => (
              <div
                key={i}
                className={`w-6 h-6 border border-gray-700 ${colors[colorCode] || 'bg-gray-800'}`}
                onClick={() => {
                   // Cycle through colors logic can go here
                }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}