import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  TrendingUp, 
  AlertTriangle, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  MoveUp, 
  MoveDown, 
  MoveLeft, 
  MoveRight, 
  ExternalLink,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { formatPercentage, formatRupiah } from '../../utils/format.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';

// Geographical-representative positions for West Java districts
const DISTRICT_MAP_COORDS: Record<string, { x: number; y: number; name: string; neighbors: string[] }> = {
  '3201': { x: 140, y: 130, name: 'Bogor', neighbors: ['3216', '3271', '3202', '3203'] },
  '3202': { x: 120, y: 220, name: 'Sukabumi', neighbors: ['3201', '3272', '3203'] },
  '3203': { x: 210, y: 200, name: 'Cianjur', neighbors: ['3201', '3202', '3217', '3204', '3205'] },
  '3204': { x: 310, y: 210, name: 'Bandung', neighbors: ['3217', '3273', '3211', '3205'] },
  '3205': { x: 360, y: 280, name: 'Garut', neighbors: ['3204', '3203', '3206', '3211'] },
  '3206': { x: 440, y: 270, name: 'Tasikmalaya', neighbors: ['3205', '3278', '3207', '3218'] },
  '3207': { x: 520, y: 250, name: 'Ciamis', neighbors: ['3206', '3279', '3218', '3208'] },
  '3208': { x: 530, y: 190, name: 'Kuningan', neighbors: ['3207', '3209', '3210'] },
  '3209': { x: 540, y: 120, name: 'Cirebon', neighbors: ['3208', '3212', '3210', '3274'] },
  '3210': { x: 470, y: 160, name: 'Majalengka', neighbors: ['3209', '3208', '3211', '3212'] },
  '3211': { x: 390, y: 160, name: 'Sumedang', neighbors: ['3204', '3210', '3217', '3213'] },
  '3212': { x: 480, y: 80, name: 'Indramayu', neighbors: ['3209', '3210', '3213'] },
  '3213': { x: 350, y: 100, name: 'Subang', neighbors: ['3214', '3215', '3211', '3212'] },
  '3214': { x: 280, y: 110, name: 'Purwakarta', neighbors: ['3213', '3215', '3217'] },
  '3215': { x: 270, y: 70, name: 'Karawang', neighbors: ['3214', '3213', '3216'] },
  '3216': { x: 200, y: 70, name: 'Bekasi', neighbors: ['3215', '3201', '3275'] },
  '3217': { x: 290, y: 160, name: 'KBB', neighbors: ['3203', '3204', '3214', '3211', '3277'] },
  '3218': { x: 510, y: 310, name: 'Pangandaran', neighbors: ['3206', '3207'] },
  '3271': { x: 155, y: 150, name: 'Kota Bogor', neighbors: ['3201'] },
  '3272': { x: 145, y: 200, name: 'Kota SBM', neighbors: ['3202'] },
  '3273': { x: 330, y: 185, name: 'Kota BDG', neighbors: ['3204'] },
  '3274': { x: 555, y: 135, name: 'Kota CRB', neighbors: ['3209'] },
  '3275': { x: 180, y: 90, name: 'Kota BKS', neighbors: ['3216', '3276'] },
  '3276': { x: 140, y: 95, name: 'Kota Depok', neighbors: ['3275'] },
  '3277': { x: 300, y: 175, name: 'Kota Cimahi', neighbors: ['3217'] },
  '3278': { x: 455, y: 250, name: 'Kota TSM', neighbors: ['3206'] },
  '3279': { x: 545, y: 240, name: 'Kota Banjar', neighbors: ['3207'] },
};

export function InteractiveMap() {
  const { navigateTo, setSelectedDistrictId } = useNavigationStore();
  const [selectedId, setSelectedId] = useState<string>(() => localStorage.getItem('selectedDistrictId') || '3202'); // Default to Kab. Sukabumi
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeMetric, setActiveMetric] = useState<'p0' | 'population'>('p0');

  // Zoom & Pan State
  const [zoom, setZoom] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const selectedDistrict = WEST_JAVA_DISTRICTS.find((d) => d.id === selectedId) || WEST_JAVA_DISTRICTS[1];
  const hoveredDistrict = hoveredId ? WEST_JAVA_DISTRICTS.find((d) => d.id === hoveredId) : null;

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

  // Priority color scaling for Poverty Rate (P0)
  const getPovertyColorClass = (p0: number, isHovered: boolean, isSelected: boolean) => {
    if (p0 < 5.0) {
      return isSelected 
        ? 'fill-emerald-500 stroke-emerald-600' 
        : isHovered 
          ? 'fill-emerald-400 stroke-emerald-500' 
          : 'fill-emerald-50/90 dark:fill-emerald-950/20 stroke-emerald-200 dark:stroke-emerald-900';
    } else if (p0 < 8.0) {
      return isSelected 
        ? 'fill-teal-500 stroke-teal-600' 
        : isHovered 
          ? 'fill-teal-400 stroke-teal-500' 
          : 'fill-teal-50/90 dark:fill-teal-950/20 stroke-teal-200 dark:stroke-teal-900';
    } else if (p0 < 11.0) {
      return isSelected 
        ? 'fill-amber-500 stroke-amber-600' 
        : isHovered 
          ? 'fill-amber-400 stroke-amber-500' 
          : 'fill-amber-50/90 dark:fill-amber-950/20 stroke-amber-200 dark:stroke-amber-900';
    } else {
      return isSelected 
        ? 'fill-rose-500 stroke-rose-600' 
        : isHovered 
          ? 'fill-rose-400 stroke-rose-500' 
          : 'fill-rose-100/90 dark:fill-rose-950/30 stroke-rose-300 dark:stroke-rose-900';
    }
  };

  const getPovertyBorderColorClass = (p0: number) => {
    if (p0 < 5.0) return 'stroke-emerald-300 dark:stroke-emerald-800';
    if (p0 < 8.0) return 'stroke-teal-300 dark:stroke-teal-800';
    if (p0 < 11.0) return 'stroke-amber-300 dark:stroke-amber-800';
    return 'stroke-rose-400 dark:stroke-rose-800';
  };

  const getPovertyTextColorClass = (p0: number) => {
    if (p0 < 5.0) return 'text-emerald-600 dark:text-emerald-400';
    if (p0 < 8.0) return 'text-teal-600 dark:text-teal-400';
    if (p0 < 11.0) return 'text-amber-600 dark:text-amber-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getPovertyBadgeClass = (p0: number) => {
    if (p0 < 5.0) return 'bg-emerald-50 text-emerald-700 border-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900';
    if (p0 < 8.0) return 'bg-teal-50 text-teal-700 border-teal-100 dark:bg-teal-950/30 dark:text-teal-400 dark:border-teal-900';
    if (p0 < 11.0) return 'bg-amber-50 text-amber-700 border-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900';
    return 'bg-rose-50 text-rose-700 border-rose-100 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900';
  };

  const handleDistrictClick = (id: string) => {
    setSelectedId(id);
    localStorage.setItem('selectedDistrictId', id);
    setSelectedDistrictId(id);
  };

  const handleOpenProfile = () => {
    localStorage.setItem('selectedDistrictId', selectedId);
    setSelectedDistrictId(selectedId);
    navigateTo('regional-profile');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="interactive-map-root">
      {/* Map visualization on the left */}
      <div className="lg:col-span-8 flex flex-col h-full min-h-[460px] border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 relative shadow-2xs overflow-hidden">
        
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900 pb-3.5 mb-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse"></span>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <MapIcon className="h-3.5 w-3.5 text-blue-500" />
              West Java Interactive Choropleth Decision Map
            </h4>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">
            <span>Projection Scale: {(zoom * 100).toFixed(0)}%</span>
          </div>
        </div>

        {/* GIS Layer Controls & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800"></div>
              <span>&lt; 5% Low</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800"></div>
              <span>5% - 8% Mid</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800"></div>
              <span>8% - 11% High</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800"></div>
              <span>&ge; 11% Severe</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
            <Layers className="h-3 w-3 text-slate-400" />
            <span>LAYER: BPS KOTA-KAB COORDINATES</span>
          </div>
        </div>

        {/* SVG Map Viewport Container */}
        <div className="flex-1 w-full relative min-h-[340px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/10 rounded-xs border border-slate-50 dark:border-slate-900 overflow-hidden">
          
          <svg
            viewBox={viewBoxString}
            className="w-full h-full max-h-[460px] select-none transition-all duration-300 ease-out"
            id="west-java-svg-map"
          >
            {/* Connection Network / Boundaries */}
            {Object.entries(DISTRICT_MAP_COORDS).map(([id, coord]) => {
              return coord.neighbors.map((nId) => {
                const neighborCoord = DISTRICT_MAP_COORDS[nId];
                if (!neighborCoord) return null;
                return (
                  <line
                    key={`${id}-${nId}`}
                    x1={coord.x}
                    y1={coord.y}
                    x2={neighborCoord.x}
                    y2={neighborCoord.y}
                    className="stroke-slate-200 dark:stroke-slate-800/80 transition-all"
                    strokeWidth="1.2"
                    strokeDasharray="2 3"
                  />
                );
              });
            })}

            {/* Geographical Nodes / Districts */}
            {WEST_JAVA_DISTRICTS.map((d) => {
              const coord = DISTRICT_MAP_COORDS[d.id];
              if (!coord) return null;

              const isSelected = selectedId === d.id;
              const isHovered = hoveredId === d.id;
              const isCapital = d.name.startsWith('Kota');

              const colorClass = getPovertyColorClass(d.p0, isHovered, isSelected);
              const borderClass = getPovertyBorderColorClass(d.p0);
              const radius = isCapital ? 14 : 19;

              return (
                <g
                  key={d.id}
                  onClick={() => handleDistrictClick(d.id)}
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
              className="absolute pointer-events-none bg-slate-950 text-white p-3 rounded shadow-lg text-[11px] space-y-1 animate-in fade-in duration-100 border border-slate-800 z-30"
              style={{
                left: `${Math.min((DISTRICT_MAP_COORDS[hoveredDistrict.id]?.x || 100) * 0.9, 450)}px`,
                top: `${Math.min((DISTRICT_MAP_COORDS[hoveredDistrict.id]?.y || 100) * 0.8, 250)}px`,
              }}
            >
              <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-xs text-blue-400">{hoveredDistrict.name}</p>
              <div className="font-mono space-y-0.5">
                <p className="flex justify-between gap-4 text-slate-400">
                  Poverty Rate: <span className="text-white font-bold">{formatPercentage(hoveredDistrict.p0)}</span>
                </p>
                <p className="flex justify-between gap-4 text-slate-400">
                  Population: <span className="text-white">{hoveredDistrict.population.toLocaleString('id-ID')}</span>
                </p>
                <p className="flex justify-between gap-4 text-slate-400">
                  ID: <span className="text-slate-500">{hoveredDistrict.id}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Profile summary on the right */}
      <div className="lg:col-span-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-50 dark:border-slate-900 pb-3.5">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                Selected Administrative Area
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 tracking-tight mt-0.5">
                {selectedDistrict.name}
              </h4>
            </div>
            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider font-mono ${getPovertyBadgeClass(selectedDistrict.p0)}`}>
              {selectedDistrict.p0 >= 11.0 ? 'severe priority' : selectedDistrict.p0 >= 8.0 ? 'high priority' : 'monitored'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs border border-slate-100/40 dark:border-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">P0 Poverty Rate</span>
              <span className={`text-base font-bold font-mono tracking-tight mt-1 block ${getPovertyTextColorClass(selectedDistrict.p0)}`}>
                {formatPercentage(selectedDistrict.p0)}
              </span>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs border border-slate-100/40 dark:border-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Citizens</span>
              <span className="text-base font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100 mt-1 block">
                {selectedDistrict.population >= 1000000 
                  ? `${(selectedDistrict.population / 1000000).toFixed(2)}M`
                  : selectedDistrict.population.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-900 pb-1">
              <span>Welfare Indicator Analysis</span>
            </div>
            <div className="space-y-2 font-medium">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Inequality Score:</span>
                <span className="font-mono">Gini {(0.32 + (selectedDistrict.p0 / 100)).toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Development Quadrant:</span>
                <span className="font-mono text-slate-800 dark:text-slate-100">
                  {selectedDistrict.p0 >= 11.0 ? 'Quadrant IV (Lagging)' : selectedDistrict.p0 >= 8.0 ? 'Quadrant III' : 'Quadrant I/II'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Primary Interventions:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedDistrict.p0 >= 11.0 
                    ? 'BLT Reallocation + Sanitation' 
                    : selectedDistrict.p0 >= 8.0 
                      ? 'Micro-Credit + Clean Water' 
                      : 'Job Training / Services'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions inside card */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-900 mt-4 space-y-3">
          <div className="bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-900/30 p-3 rounded flex gap-2.5 items-start">
            <AlertTriangle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-400 font-medium">
              <p className="font-bold uppercase tracking-wider text-[9px] mb-0.5 text-amber-700 dark:text-amber-500">Early Warning Status</p>
              {selectedDistrict.p0 >= 11.0 ? (
                <span>Welfare index above threshold. Target intervention simulation triggered automatically.</span>
              ) : (
                <span>Target indicators stable within RPJMD safety parameters. No critical warnings active.</span>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenProfile}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-sm bg-slate-950 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Explore Full Regional Profile
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
