import React, { useState, useEffect } from 'react';
import { 
  MapPin, 
  Eye
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, Polyline, GeoJSON } from 'react-leaflet';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useThemeStore } from '../../store/themeStore.ts';
import { DistrictDiagnosisDetail } from './diagnosisData.ts';

// Real Latitude & Longitude for West Java districts
const REAL_MAP_COORDS: Record<string, { lat: number; lng: number }> = {
  '3201': { lat: -6.5518, lng: 106.6291 }, 
  '3202': { lat: -7.1666, lng: 106.7027 }, 
  '3203': { lat: -7.2140, lng: 107.1396 }, 
  '3204': { lat: -7.0984, lng: 107.5683 }, 
  '3205': { lat: -7.4206, lng: 107.7816 }, 
  '3206': { lat: -7.5029, lng: 108.0818 }, 
  '3207': { lat: -7.3117, lng: 108.3664 }, 
  '3208': { lat: -6.9944, lng: 108.4878 }, 
  '3209': { lat: -6.7820, lng: 108.4613 }, 
  '3210': { lat: -6.7937, lng: 108.1887 }, 
  '3211': { lat: -6.8378, lng: 107.9626 }, 
  '3212': { lat: -6.4422, lng: 108.1979 }, 
  '3213': { lat: -6.4862, lng: 107.7663 }, 
  '3214': { lat: -6.5960, lng: 107.4475 }, 
  '3215': { lat: -6.2166, lng: 107.3986 }, 
  '3216': { lat: -6.2081, lng: 107.1118 }, 
  '3217': { lat: -6.8228, lng: 107.4568 }, 
  '3218': { lat: -7.6685, lng: 108.5298 }, 
  '3271': { lat: -6.5971, lng: 106.7996 }, 
  '3272': { lat: -6.9237, lng: 106.9272 }, 
  '3273': { lat: -6.9147, lng: 107.6098 }, 
  '3274': { lat: -6.7320, lng: 108.5523 }, 
  '3275': { lat: -6.2383, lng: 106.9756 }, 
  '3276': { lat: -6.4025, lng: 106.7942 }, 
  '3277': { lat: -6.8797, lng: 107.5458 }, 
  '3278': { lat: -7.3274, lng: 108.2232 }, 
  '3279': { lat: -7.3756, lng: 108.5342 }, 
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
  const { mode } = useThemeStore();
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/jawa_barat.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

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

  const getPriorityColorHex = (score: number) => {
    if (score >= 80) return '#f43f5e'; // rose-500
    if (score >= 50) return '#f59e0b'; // amber-500
    return '#10b981'; // emerald-500
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

  const tileLayerUrl = mode === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="spatial-diagnosis-map-root">
      {/* Map visualization on the left */}
      <div className="lg:col-span-8 flex flex-col h-full min-h-[460px] border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 relative shadow-2xs overflow-hidden">
        
        {/* Header HUD */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-50 dark:border-slate-900 pb-3.5 mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider">
              GIS Choropleth: Koordinat Skor Prioritas Regional
            </h4>
            <p className="text-[10px] text-slate-400 mt-0.5">
              Distrik diwarnai secara dinamis berdasarkan Skor Prioritas multi-dimensi (Skor tinggi memerlukan target intervensi intensif).
            </p>
          </div>

          <div className="flex items-center gap-4 text-[10px] bg-slate-50 dark:bg-slate-900 px-3 py-1.5 rounded-xs border border-slate-100 dark:border-slate-800/80 font-mono">
            <span className="text-slate-400">Legenda:</span>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-rose-100 border border-rose-300 dark:bg-rose-950/40"></span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">Prioritas Tinggi (&ge;80)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-100 border border-amber-300 dark:bg-amber-950/40"></span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">Menengah (50-79)</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-100 border border-emerald-300 dark:bg-emerald-950/40"></span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">Rendah (&lt;50)</span>
            </div>
          </div>
        </div>

        {/* Leaflet Map Viewport Container */}
        <div className="flex-1 w-full relative min-h-[400px] flex items-center justify-center bg-slate-50/50 dark:bg-slate-900/10 rounded-xs border border-slate-50 dark:border-slate-900 overflow-hidden z-0">
          <MapContainer 
            center={[-6.9204, 107.6046]} 
            zoom={8} 
            scrollWheelZoom={true} 
            style={{ height: '100%', width: '100%', zIndex: 0 }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              url={tileLayerUrl}
            />
            {geoData && (
              <GeoJSON 
                data={geoData} 
                style={{
                  color: mode === 'dark' ? '#475569' : '#cbd5e1',
                  weight: 1.5,
                  fillOpacity: mode === 'dark' ? 0.05 : 0.1,
                  fillColor: mode === 'dark' ? '#0f172a' : '#f8fafc',
                }} 
              />
            )}
            
            {/* Draw topological neighbor links first */}
            {districtsData.map((d) => {
              const coord = REAL_MAP_COORDS[d.id];
              if (!coord) return null;

              return districtsData.map((other) => {
                const otherCoord = REAL_MAP_COORDS[other.id];
                if (!otherCoord || other.id <= d.id) return null;

                const isSameRegion = d.region === other.region;
                if (!isSameRegion) return null;

                // Only draw links if within close geographic distance (~ 40-50 km equivalent in degrees)
                // roughly 0.4 degrees
                const distance = Math.hypot(coord.lat - otherCoord.lat, coord.lng - otherCoord.lng);
                if (distance > 0.45) return null;

                return (
                  <Polyline
                    key={`${d.id}-${other.id}`}
                    positions={[
                      [coord.lat, coord.lng],
                      [otherCoord.lat, otherCoord.lng]
                    ]}
                    pathOptions={{
                      color: mode === 'dark' ? '#334155' : '#cbd5e1',
                      weight: 1.5,
                      dashArray: '4, 4'
                    }}
                  />
                );
              });
            })}

            {/* Render District Nodes */}
            {districtsData.map((d) => {
              const coord = REAL_MAP_COORDS[d.id];
              if (!coord) return null;

              const isSelected = selectedDistrictId === d.id;
              const isHovered = hoveredId === d.id;
              const isCapital = d.name.includes('Kota');
              
              const baseRadius = isCapital ? 10 : 15;
              const radius = isSelected ? baseRadius + 4 : isHovered ? baseRadius + 2 : baseRadius;

              return (
                <CircleMarker
                  key={d.id}
                  center={[coord.lat, coord.lng]}
                  radius={radius}
                  fillOpacity={isSelected ? 0.9 : 0.7}
                  fillColor={getPriorityColorHex(d.priorityScore)}
                  color={isSelected ? '#3b82f6' : '#ffffff'}
                  weight={isSelected ? 3 : 1}
                  eventHandlers={{
                    click: () => onSelectDistrict(d.id),
                    mouseover: () => setHoveredId(d.id),
                    mouseout: () => setHoveredId(null),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1}>
                    <div className="bg-slate-950 text-white p-1 -m-1 rounded shadow-lg text-[11px] font-mono">
                      <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-xs text-blue-400">{d.name}</p>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Skor Prioritas:</span>
                        <span className="font-bold text-white">{d.priorityScore} / 100</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Kemiskinan P0:</span>
                        <span className="font-bold text-slate-200">{d.p0.toFixed(2)}%</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-slate-400">Tipologi:</span>
                        <span className="font-bold text-slate-300">Kuadran {d.typology}</span>
                      </div>
                    </div>
                  </Tooltip>
                </CircleMarker>
              );
            })}
          </MapContainer>
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
              <span className="text-[9px] font-mono tracking-widest text-slate-400 block uppercase font-bold">Titik Geografis Terpilih</span>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">{selectedDistrict.name}</h3>
            </div>
          </div>

          {/* Priority Score Indicator */}
          <div className="p-4 rounded bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-850 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wide">Skor Prioritas Terintegrasi</span>
              <span className={`px-2 py-0.5 rounded-sm text-[9px] font-bold border uppercase tracking-wider ${getPriorityBadgeClass(selectedDistrict.priorityScore)}`}>
                {selectedDistrict.priorityScore >= 80 ? 'TARGET KRITIS' : selectedDistrict.priorityScore >= 50 ? 'KEBIJAKAN MENENGAH' : 'PANTAUAN STABIL'}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{selectedDistrict.priorityScore}</span>
              <span className="text-xs text-slate-400">/ 100 indeks maks</span>
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
            <span className="text-[9px] font-mono font-bold text-slate-400 block uppercase tracking-widest">Dasbor Statistik</span>
            
            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Indeks Kemiskinan (P0)</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.p0.toFixed(2)}%</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Kesenjangan (P1)</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.p1.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Keparahan (P2)</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.p2.toFixed(2)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Rasio Gini Lokal</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.gini.toFixed(3)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Komponen Disparitas Theil</span>
              <span className="font-bold font-mono text-slate-800 dark:text-slate-200">{selectedDistrict.theil.toFixed(3)}</span>
            </div>

            <div className="flex justify-between items-center py-1 border-b border-slate-100/50 dark:border-slate-900/50">
              <span className="text-slate-500">Tipologi Pertumbuhan Klassen</span>
              <span className="font-mono text-blue-500 font-bold uppercase">Kuadran {selectedDistrict.typology}</span>
            </div>
          </div>
        </div>

        <div className="pt-6 space-y-2">
          <button
            onClick={handleOpenProfile}
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:hover:bg-slate-200 dark:text-slate-950 text-xs font-bold transition-all rounded-sm cursor-pointer"
          >
            <Eye className="h-4 w-4" />
            <span>Luncurkan Profil Wilayah Lengkap</span>
          </button>
          <p className="text-[9px] font-mono text-center text-slate-400">
            Sesuai dengan rencana induk pembangunan regional Jawa Barat.
          </p>
        </div>
      </div>
    </div>
  );
}
