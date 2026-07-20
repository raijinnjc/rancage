import React, { useState, useEffect } from 'react';
import { 
  AlertTriangle, 
  ExternalLink,
  Layers,
  Map as MapIcon
} from 'lucide-react';
import { MapContainer, TileLayer, CircleMarker, Tooltip, GeoJSON } from 'react-leaflet';
import { WEST_JAVA_DISTRICTS } from '../../constants/index.ts';
import { formatPercentage } from '../../utils/format.ts';
import { useNavigationStore } from '../../store/navigationStore.ts';
import { useThemeStore } from '../../store/themeStore.ts';

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

export function InteractiveMap() {
  const { navigateTo, setSelectedDistrictId } = useNavigationStore();
  const { mode } = useThemeStore();
  const [selectedId, setSelectedId] = useState<string>(() => localStorage.getItem('selectedDistrictId') || '3202');
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [geoData, setGeoData] = useState<any>(null);

  useEffect(() => {
    fetch('/jawa_barat.geojson')
      .then(res => res.json())
      .then(data => setGeoData(data))
      .catch(err => console.error('Failed to load GeoJSON:', err));
  }, []);

  const selectedDistrict = WEST_JAVA_DISTRICTS.find((d) => d.id === selectedId) || WEST_JAVA_DISTRICTS[0];

  const getPovertyColorHex = (p0: number) => {
    if (p0 < 5.0) return '#10b981'; // emerald-500
    if (p0 < 8.0) return '#14b8a6'; // teal-500
    if (p0 < 11.0) return '#f59e0b'; // amber-500
    return '#f43f5e'; // rose-500
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

  const tileLayerUrl = mode === 'dark'
    ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
    : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';

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
              Peta Keputusan Choropleth Interaktif Jawa Barat
            </h4>
          </div>
        </div>

        {/* GIS Layer Controls & Legend */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex flex-wrap gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800"></div>
              <span>&lt; 5% Rendah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-teal-50 dark:bg-teal-950/40 border border-teal-300 dark:border-teal-800"></div>
              <span>5% - 8% Menengah</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800"></div>
              <span>8% - 11% Tinggi</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-xs bg-rose-100 dark:bg-rose-950/50 border border-rose-300 dark:border-rose-800"></div>
              <span>&ge; 11% Parah</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[9px] font-mono text-slate-400 bg-slate-50 dark:bg-slate-900 px-2 py-1 rounded">
            <Layers className="h-3 w-3 text-slate-400" />
            <span>LAPISAN: PETA DASAR KOTA-KAB</span>
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
            {geoData && geoData.features.map((feature: any, idx: number) => {
              const d = WEST_JAVA_DISTRICTS.find(dist => dist.name === feature.properties.name);
              if (!d) return null;

              const isSelected = selectedId === d.id;
              const isHovered = hoveredId === d.id;
              
              // Instead of CircleMarker, we make the entire Polygon interactive
              return (
                <GeoJSON
                  key={d.id}
                  data={feature}
                  style={{
                    color: isSelected ? '#3b82f6' : (mode === 'dark' ? '#334155' : '#cbd5e1'),
                    weight: isSelected ? 2.5 : (isHovered ? 2 : 1),
                    fillOpacity: isSelected ? 0.8 : (isHovered ? 0.6 : 0.4),
                    fillColor: getPovertyColorHex(d.p0),
                    className: 'transition-all duration-300'
                  }}
                  eventHandlers={{
                    click: () => handleDistrictClick(d.id),
                    mouseover: () => setHoveredId(d.id),
                    mouseout: () => setHoveredId(null),
                  }}
                >
                  <Tooltip direction="top" offset={[0, -10]} opacity={1} className="custom-leaflet-tooltip" sticky>
                    <div className="bg-slate-950 text-white p-1 -m-1 rounded shadow-lg text-[11px]">
                      <p className="font-bold border-b border-slate-800 pb-1 mb-1 text-xs text-blue-400">{d.name}</p>
                      <div className="font-mono space-y-0.5">
                        <p className="flex justify-between gap-4 text-slate-300">
                          Kemiskinan: <span className="text-white font-bold">{formatPercentage(d.p0)}</span>
                        </p>
                        <p className="flex justify-between gap-4 text-slate-300">
                          Populasi: <span className="text-white">{d.population.toLocaleString('id-ID')}</span>
                        </p>
                      </div>
                    </div>
                  </Tooltip>
                </GeoJSON>
              );
            })}
          </MapContainer>
        </div>
      </div>

      {/* Profile summary on the right */}
      <div className="lg:col-span-4 flex flex-col justify-between border border-slate-100 dark:border-slate-800 rounded-sm bg-white dark:bg-slate-950 p-5 shadow-2xs">
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-2 border-b border-slate-50 dark:border-slate-900 pb-3.5">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest font-mono block">
                Area Administratif Terpilih
              </span>
              <h4 className="text-sm font-bold text-slate-900 dark:text-slate-50 tracking-tight mt-0.5">
                {selectedDistrict.name}
              </h4>
            </div>
            <span className={`px-2 py-0.5 border rounded text-[9px] font-bold uppercase tracking-wider font-mono ${getPovertyBadgeClass(selectedDistrict.p0)}`}>
              {selectedDistrict.p0 >= 11.0 ? 'prioritas parah' : selectedDistrict.p0 >= 8.0 ? 'prioritas tinggi' : 'dipantau'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs border border-slate-100/40 dark:border-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Tingkat Kemiskinan P0</span>
              <span className={`text-base font-bold font-mono tracking-tight mt-1 block ${getPovertyTextColorClass(selectedDistrict.p0)}`}>
                {formatPercentage(selectedDistrict.p0)}
              </span>
            </div>
            <div className="p-3 bg-slate-50/50 dark:bg-slate-900/30 rounded-xs border border-slate-100/40 dark:border-slate-900">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Penduduk</span>
              <span className="text-base font-bold font-mono tracking-tight text-slate-800 dark:text-slate-100 mt-1 block">
                {selectedDistrict.population >= 1000000 
                  ? `${(selectedDistrict.population / 1000000).toFixed(2)}M`
                  : selectedDistrict.population.toLocaleString('id-ID')}
              </span>
            </div>
          </div>

          <div className="space-y-2.5 pt-2 text-xs">
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-50 dark:border-slate-900 pb-1">
              <span>Analisis Indikator Kesejahteraan</span>
            </div>
            <div className="space-y-2 font-medium">
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Skor Ketimpangan:</span>
                <span className="font-mono">Gini {(0.32 + (selectedDistrict.p0 / 100)).toFixed(3)}</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Kuadran Pembangunan:</span>
                <span className="font-mono text-slate-800 dark:text-slate-100">
                  {selectedDistrict.p0 >= 11.0 ? 'Kuadran IV (Tertinggal)' : selectedDistrict.p0 >= 8.0 ? 'Kuadran III' : 'Kuadran I/II'}
                </span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-slate-300">
                <span className="text-slate-400">Intervensi Utama:</span>
                <span className="font-bold text-blue-600 dark:text-blue-400">
                  {selectedDistrict.p0 >= 11.0 
                    ? 'Realokasi BLT + Sanitasi' 
                    : selectedDistrict.p0 >= 8.0 
                      ? 'Kredit Mikro + Air Bersih' 
                      : 'Pelatihan Kerja / Layanan'}
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
              <p className="font-bold uppercase tracking-wider text-[9px] mb-0.5 text-amber-700 dark:text-amber-500">Status Peringatan Dini</p>
              {selectedDistrict.p0 >= 11.0 ? (
                <span>Indeks kesejahteraan di atas ambang batas. Simulasi intervensi target dipicu secara otomatis.</span>
              ) : (
                <span>Indikator target stabil dalam parameter aman RPJMD. Tidak ada peringatan kritis yang aktif.</span>
              )}
            </div>
          </div>

          <button
            onClick={handleOpenProfile}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-4 rounded-sm bg-slate-950 hover:bg-slate-800 dark:bg-slate-50 dark:text-slate-950 dark:hover:bg-slate-200 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Jelajahi Profil Wilayah Lengkap
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
