import React, { useState } from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MoveUp, 
  MoveDown, 
  MoveLeft, 
  MoveRight, 
  MapPin, 
  Activity, 
  TrendingUp, 
  Eye
} from 'lucide-react';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { DistrictDiagnosisDetail } from './diagnosisData.ts';

// Geographical-representative positions for West Java districts
const DISTRICT_MAP_COORDS: Record<string, { x: number; y: number; name: string }> = {
  '3201': { x: 140, y: 130, name: 'Bogor' },
  '3202': { x: 120, y: 220, name: 'Sukabumi' },
  '3203': { x: 210, y: 200, name: 'Cianjur' },
  '3204': { x: 310, y: 210, name: 'Bandung' },
  '3205': { x: 360, y: 280, name: 'Garut' },
  '3206': { x: 440, y: 270, name: 'Tasikmalaya' },
  '3207': { x: 520, y: 250, name: 'Ciamis' },
  '3208': { x: 530, y: 190, name: 'Kuningan' },
  '3209': { x: 540, y: 120, name: 'Cirebon' },
  '3210': { x: 470, y: 160, name: 'Majalengka' },
  '3211': { x: 390, y: 160, name: 'Sumedang' },
  '3212': { x: 480, y: 80, name: 'Indramayu' },
  '3213': { x: 350, y: 100, name: 'Subang' },
  '3214': { x: 280, y: 110, name: 'Purwakarta' },
  '3215': { x: 270, y: 70, name: 'Karawang' },
  '3216': { x: 200, y: 70, name: 'Bekasi' },
  '3217': { x: 290, y: 160, name: 'KBB' },
  '3218': { x: 510, y: 310, name: 'Pangandaran' },
  '3271': { x: 155, y: 150, name: 'Kota Bogor' },
  '3272': { x: 145, y: 200, name: 'Kota SBM' },
  '3273': { x: 330, y: 185, name: 'Kota BDG' },
  '3274': { x: 555, y: 135, name: 'Kota CRB' },
  '3275': { x: 180, y: 90, name: 'Kota BKS' },
  '3276': { x: 140, y: 95, name: 'Kota Depok' },
  '3277': { x: 300, y: 175, name: 'Kota Cimahi' },
  '3278': { x: 455, y: 250, name: 'Kota TSM' },
  '3279': { x: 545, y: 240, name: 'Kota Banjar' },
};

interface SpatialDiagnosisMapProps {
  districtsData: DistrictDiagnosisDetail[];
  selectedDistrictId: string;
  onSelectDistrict: (id: string) => void;
}

export function SpatialDiagnosisMap({
  districtsData,
  selectedDistrictId,
  onSelectDistrict,
}: SpatialDiagnosisMapProps) {
  const { navigateTo, setSelectedDistrictId } = useNavigationStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const FALLBACK_DISTRICT: DistrictDiagnosisDetail = {
    id: '3206',
    name: 'Kabupaten Tasikmalaya',
    theil: 0.1245,
    within: 0.1012,
    p0: 12.11,
    p1: 2.15,
    p2: 0.58,
    gini: 0.385,
    priorityScore: 94,
    trend: 'down',
    typology: 'IV',
    urbanRural: 'Rural',
    region: 'PRIANGAN',
    population: 1800000
  };

  const selectedDistrict = districtsData.find((d) => d.id === selectedDistrictId) || districtsData[0] || FALLBACK_DISTRICT;
  const hoveredDistrict = hoveredId ? districtsData.find((d) => d.id === hoveredId) : null;

  // Zoom / Pan Actions
  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3.0));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 0.8));
  const handleResetZoom = () => {
    setZoom(1.0);
    setPanOffset({ x: 0, y: 0 });
  };
  const handlePan = (direction: 'up' | 'down' | 'left' | 'right') => {
    const step = 20 / zoom;
    setPanOffset((prev) => {
      switch (direction) {
        case 'up': return { ...prev, y: prev.y - step };
        case 'down': return { ...prev, y: prev.y + step };
        case 'left': return { ...prev, x: prev.x - step };
        case 'right': return { ...prev, x: prev.x + step };
      }
    });
  };

  // SVG ViewBox Dynamic Calculation
  const baseViewBox = { x: 50, y: 30, w: 550, h: 310 };
  const dynamicW = baseViewBox.w / zoom;
  const dynamicH = baseViewBox.h / zoom;
  const dynamicX = baseViewBox.x + panOffset.x + (baseViewBox.w - dynamicW) / 2;
  const dynamicY = baseViewBox.y + panOffset.y + (baseViewBox.h - dynamicH) / 2;
  const viewBoxString = `${dynamicX} ${dynamicY} ${dynamicW} ${dynamicH}`;

  // Priority color scaling for Priority Score (representative of multi-deprivations)
  const getPriorityColorClass = (score: number, isSelected: boolean, isHovered: boolean) => {
    if (score >= 80) {
      return isSelected 
        ? 'fill-rose-500 stroke-rose-600' 
        : isHovered 
          ? 'fill-rose-400 stroke-rose-500' 
          : 'fill-rose-50/90 dark:fill-rose-950/20 stroke-rose-200 dark:stroke-rose-900';
    } else if (score >= 50) {
      return isSelected 
        ? 'fill-amber-500 stroke-amber-600' 
        : isHovered 
          ? 'fill-amber-400 stroke-amber-500' 
          : 'fill-amber-50/90 dark:fill-amber-950/20 stroke-amber-200 dark:stroke-amber-900';
    } else {
      return isSelected 
        ? 'fill-emerald-500 stroke-emerald-600' 
        : isHovered 
          ? 'fill-emerald-400 stroke-emerald-500' 
          : 'fill-emerald-50/90 dark:fill-emerald-950/20 stroke-emerald-200 dark:stroke-emerald-900';
    }
  };

  const getPriorityBorderColorClass = (score: number) => {
    if (score >= 80) return 'stroke-rose-300 dark:stroke-rose-800';
    if (score >= 50) return 'stroke-amber-300 dark:stroke-amber-800';
    return 'stroke-emerald-300 dark:stroke-emerald-800';
  };

  const getPriorityBadgeClass = (score: number) => {
    if (score >= 80) return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900';
    if (score >= 50) return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900';
    return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900';
  };

  const handleOpenProfile = () => {
    localStorage.setItem('selectedDistrictId', selectedDistrictId);
    setSelectedDistrictId(selectedDistrictId);
    navigateTo('regional-profile');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="spatial-diagnosis-map-root">
      {/* Map visualization on the left */}
      <div className="lg:col-span-8 flex flex-col h-full min-h-[460px] border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 relative shadow-2xs overflow-hidden">
        
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900 pb-3.5 mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              GIS Choropleth: Regional Priority Score Coordinates
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Districts colored dynamically by integrated multi-dimensional Priority Score (High score implies intensive targeting requirements).
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xs border border-slate-100 dark:border-slate-800/80 font-mono">
            <span className="text-slate-400">Legend:</span>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-100 border border-rose-300 dark:bg-rose-950/40"></span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">High Priority (&ge;80)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-100 border border-amber-300 dark:bg-amber-950/40"></span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">Medium (50-79)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/40"></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Low (&lt;50)</span>
            </div>
          </div>
        </div>

        {/* Dynamic Canvas Container */}
        <div className="relative flex-1 bg-slate-50/50 dark:bg-slate-900/10 border border-slate-100/50 dark:border-slate-900/50 rounded-xs flex items-center justify-center overflow-hidden min-h-[300px]">
          
          <svg
            viewBox={viewBoxString}
            className="w-full h-full max-h-[360px] select-none transition-transform duration-75"
          >
            {/* Draw topological neighbor links first */}
            {districtsData.map((d) => {
              const coord = DISTRICT_MAP_COORDS[d.id];
              if (!coord) return null;

              // Draw connection lines to show spatial regional topology (e.g. Priangan Belt, Northern Corridor)
              return districtsData.map((other) => {
                const otherCoord = DISTRICT_MAP_COORDS[other.id];
                if (!otherCoord || other.id <= d.id) return null;

                // Only draw links if within the same geographic administrative region
                const isSameRegion = d.region === other.region;
                if (!isSameRegion) return null;

                const distance = Math.hypot(coord.x - otherCoord.x, coord.y - otherCoord.y);
                if (distance > 90) return null; // Only connect adjacent districts

                return (
                  <line
                    key={`${d.id}-${other.id}`}
                    x1={coord.x}
                    y1={coord.y}
                    x2={otherCoord.x}
                    y2={otherCoord.y}
                    className="stroke-slate-200 dark:stroke-slate-800/80 stroke-1"
                    strokeDasharray="2 2"
                  />
                );
              });
            })}

            {/* Render District Nodes */}
            {districtsData.map((d) => {
              const coord = DISTRICT_MAP_COORDS[d.id];
              if (!coord) return null;

              const isSelected = selectedDistrictId === d.id;
              const isHovered = hoveredId === d.id;

              const colorClass = getPriorityColorClass(d.priorityScore, isSelected, isHovered);
              const borderClass = getPriorityBorderColorClass(d.priorityScore);
              const isCapital = d.id === '3273'; // Kota Bandung
              const radius = isCapital ? 14 : 19;

              return (
                <g
                  key={d.id}
                  onClick={() => onSelectDistrict(d.id)}
                  onMouseEnter={() => setHoveredId(d.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="cursor-pointer group"
                >
                  {/* Selection Indicator Ring */}
                  {isSelected && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={radius + 6}
                      className="fill-none stroke-blue-500 dark:stroke-blue-400 animate-spin"
                      strokeWidth="1.5"
                      strokeDasharray="4 4"
                      style={{ transformOrigin: `${coord.x}px ${coord.y}px`, animationDuration: '8s' }}
                    />
                  )}

                  {/* Standard Node Tile (Slightly larger for visibility) */}
                  {isCapital ? (
                    <rect
                      x={coord.x - radius}
                      y={coord.y - radius}
                      width={radius * 2}
                      height={radius * 2}
                      rx="3"
                      className={`${colorClass} transition-all duration-150 stroke-2 ${
                        isSelected 
                          ? 'stroke-blue-500 dark:stroke-blue-400' 
                          : isHovered 
                            ? 'stroke-slate-400' 
                            : borderClass
                      }`}
                    />
                  ) : (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r={radius}
                      className={`${colorClass} transition-all duration-150 stroke-2 ${
                        isSelected 
                          ? 'stroke-blue-500 dark:stroke-blue-400' 
                          : isHovered 
                            ? 'stroke-slate-400' 
                            : borderClass
                      }`}
                    />
                  )}

                  {/* Node short identity label */}
                  <text
                    x={coord.x}
                    y={coord.y + 3.5}
                    className={`text-[9px] font-bold font-mono transition-all text-center pointer-events-none ${
                      isSelected
                        ? 'fill-white font-black'
                        : 'fill-slate-700 dark:fill-slate-300 group-hover:fill-slate-900'
                    }`}
                    textAnchor="middle"
                  >
                    {coord.name.substring(0, 3).toUpperCase()}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Floating Pan-Zoom Control HUD Overlay */}
          <div className="absolute bottom-4 left-4 p-2 bg-slate-950/90 text-white rounded-sm border border-slate-800 flex flex-col gap-2 shadow-lg backdrop-blur-xs">
            <div className="flex gap-1">
              <button 
                onClick={handleZoomIn} 
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom In"
              >
                <ZoomIn className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={handleZoomOut} 
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Zoom Out"
              >
                <ZoomOut className="h-3.5 w-3.5" />
              </button>
              <button 
                onClick={handleResetZoom} 
                className="p-1 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors"
                title="Reset View"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-0.5 justify-items-center bg-slate-900/50 p-1.5 rounded-sm">
              <div></div>
              <button onClick={() => handlePan('up')} className="p-0.5 text-slate-400 hover:text-white"><MoveUp className="h-3 w-3" /></button>
              <div></div>
              <button onClick={() => handlePan('left')} className="p-0.5 text-slate-400 hover:text-white"><MoveLeft className="h-3 w-3" /></button>
              <div className="text-[8px] font-mono font-bold text-slate-500 self-center">PAN</div>
              <button onClick={() => handlePan('right')} className="p-0.5 text-slate-400 hover:text-white"><MoveRight className="h-3 w-3" /></button>
              <div></div>
              <button onClick={() => handlePan('down')} className="p-0.5 text-slate-400 hover:text-white"><MoveDown className="h-3 w-3" /></button>
              <div></div>
            </div>
          </div>

          {/* Micro Hover Tooltip */}
          {hoveredDistrict && (
            <div
              className="absolute pointer-events-none bg-slate-950 text-white p-3 rounded shadow-lg text-[11px] space-y-1 animate-in fade-in duration-100 border border-slate-800/80 z-30 font-mono"
              style={{
                left: `${Math.min((DISTRICT_MAP_COORDS[hoveredDistrict.id]?.x || 100) * 0.9, 450)}px`,
                top: `${Math.min((DISTRICT_MAP_COORDS[hoveredDistrict.id]?.y || 100) * 0.8, 250)}px`,
              }}
            >
              <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-xs text-blue-400">{hoveredDistrict.name}</p>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Priority Score:</span>
                <span className="font-bold text-white">{hoveredDistrict.priorityScore} / 100</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Headcount P0:</span>
                <span className="font-bold text-slate-200">{hoveredDistrict.p0.toFixed(2)}%</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Typology:</span>
                <span className="font-bold text-slate-300">Quadrant {hoveredDistrict.typology}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Selected Node Details HUD Card on the right */}
      <div className="lg:col-span-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 rounded-sm p-5 shadow-2xs">
        <div className="space-y-4">
          <div className="flex items-center gap-2.5 border-b border-slate-50 dark:border-slate-900 pb-3">
            <div className="p-2 rounded bg-blue-500/10 text-blue-500">
              <MapPin className="h-4.5 w-4.5" />
            </div>
            <div>
              <span className="text-[9px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Selected Geographic Node</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedDistrict.name}</h3>
            </div>
          </div>

          {/* Priority Score Indicator */}
          <div className="p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Integrated Priority Score</span>
              <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border uppercase tracking-wider ${getPriorityBadgeClass(selectedDistrict.priorityScore)}`}>
                {selectedDistrict.priorityScore >= 80 ? 'CRITICAL TARGET' : selectedDistrict.priorityScore >= 50 ? 'MEDIUM POLICY' : 'STABLE WATCH'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedDistrict.priorityScore}</span>
              <span className="text-xs text-slate-400">/ 100 max index</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-300 ${
                  selectedDistrict.priorityScore >= 80 ? 'bg-rose-500' : selectedDistrict.priorityScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
                }`}
                style={{ width: `${selectedDistrict.priorityScore}%` }}
              ></div>
            </div>
          </div>

          {/* Multi-metrics list */}
          <div className="space-y-2.5 pt-1 text-xs">
            <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-widest">Statistical Dashboard</span>
            
            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Headcount Index (P0)</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.p0.toFixed(2)}%</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Poverty Gap (P1)</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.p1.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Poverty Severity (P2)</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.p2.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Local Gini Ratio</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.gini.toFixed(3)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Theil Disparity Component</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.theil.toFixed(3)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Klassen Growth Typology</span>
              <span className="font-mono text-blue-500 font-bold uppercase">Quadrant {selectedDistrict.typology}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-2">
          <button
            onClick={handleOpenProfile}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-bold transition-all rounded-sm cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span>Launch Complete Regional Profile</span>
          </button>
          <p className="text-[9px] font-mono text-center text-slate-400">
            Conforms to West Java regional development master plan.
          </p>
        </div>
      </div>
    </div>
  );
}
