import { useState } from 'react';

const PLACE_TYPES = [
    { value: 'restaurant',    label: 'Restaurant',        emoji: '🍽️' },
    { value: 'cafe',          label: 'Café',              emoji: '☕' },
    { value: 'bar',           label: 'Bar',               emoji: '🍺' },
    { value: 'bakery',        label: 'Boulangerie',       emoji: '🥖' },
    { value: 'hospital',      label: 'Hôpital',           emoji: '🏥' },
    { value: 'pharmacy',      label: 'Pharmacie',         emoji: '💊' },
    { value: 'supermarket',   label: 'Supermarché',       emoji: '🛒' },
    { value: 'school',        label: 'École',             emoji: '🏫' },
    { value: 'park',          label: 'Parc',              emoji: '🌳' },
    { value: 'gas_station',   label: 'Station-service',   emoji: '⛽' },
    { value: 'bank',          label: 'Banque',            emoji: '🏦' },
    { value: 'gym',           label: 'Salle de sport',    emoji: '💪' },
    { value: 'hotel',         label: 'Hôtel',             emoji: '🏨' },
    { value: 'museum',        label: 'Musée',             emoji: '🏛️' },
    { value: 'movie_theater', label: 'Cinéma',            emoji: '🎬' },
    { value: 'shopping_mall', label: 'Centre commercial', emoji: '🛍️' },
    { value: 'train_station', label: 'Gare',              emoji: '🚉' },
    { value: 'airport',       label: 'Aéroport',          emoji: '✈️' },
    { value: 'night_club',    label: 'Boîte de nuit',     emoji: '🎉' },
    { value: 'spa',           label: 'Spa',               emoji: '🧖' },
    { value: 'library',       label: 'Bibliothèque',      emoji: '📚' },
    { value: 'post_office',   label: 'Bureau de poste',   emoji: '📮' },
    { value: 'parking',       label: 'Parking',           emoji: '🅿️' },
    { value: 'bicycle_store', label: 'Vélos',             emoji: '🚲' },
    { value: 'car_repair',    label: 'Garage',            emoji: '🔧' },
];

const MIN_RADIUS = 200;
const MAX_RADIUS = 30000;

const QUICK_RADII = [
    { value: 500,   label: '500 m' },
    { value: 1000,  label: '1 km' },
    { value: 2000,  label: '2 km' },
    { value: 5000,  label: '5 km' },
    { value: 10000, label: '10 km' },
    { value: 20000, label: '20 km' },
];

const SearchPanel = ({ onSearch, isLoading, onRadiusChange }) => {
    const [query, setQuery]           = useState('');
    const [placeTypes, setPlaceTypes] = useState(['restaurant']);
    const [radius, setRadius]         = useState(2000);

    const toggleType = (value) => {
        setPlaceTypes((prev) =>
            prev.includes(value)
                ? prev.length === 1 ? prev : prev.filter((v) => v !== value)
                : [...prev, value]
        );
    };

    const updateRadius = (val) => { setRadius(val); onRadiusChange?.(val); };

    const handleSubmit = (e) => { e.preventDefault(); onSearch({ query, placeTypes, radius }); };

    const formatRadius = (val) => {
        if (val >= 1000) { const km = val / 1000; return km % 1 === 0 ? `${km} km` : `${km.toFixed(1)} km`; }
        return `${val} m`;
    };

    const pct = ((radius - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS)) * 100;

    return (
        <div className="bg-bleu-sombre border border-orange-employe/20 rounded-2xl p-4 md:p-5 text-bleu">
            <h2 className="text-orange-employe font-bold text-sm tracking-wide mb-4">🔍 Recherche à proximité</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

                {/* Mot-clé */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold text-orange-employe uppercase tracking-widest">
                        Mot-clé (optionnel)
                    </label>
                    <input
                        className="bg-bleu-sombre border border-orange-employe/25 rounded-lg text-bleu px-2.5 py-2
                       text-sm outline-none focus:border-orange-employe transition-colors placeholder-bleu/40"
                        type="text"
                        placeholder="Ex: pizza, sushi, parc…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>

                {/* Types de lieux */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold text-orange-employe uppercase tracking-widest flex items-center gap-2">
                        Types de lieux
                        <span className="bg-orange-employe/20 border border-orange-employe/60 rounded-full px-2 py-0.5
                             text-[0.68rem] text-orange-employe font-bold normal-case tracking-normal">
              {placeTypes.length} sélectionné{placeTypes.length > 1 ? 's' : ''}
            </span>
                    </label>
                    <div className="flex flex-wrap gap-1.5 max-h-40 md:max-h-32 overflow-y-auto py-0.5
                          [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]">
                        {PLACE_TYPES.map((t) => {
                            const active = placeTypes.includes(t.value);
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => toggleType(t.value)}
                                    title={t.label}
                                    className={`flex items-center gap-1.5 rounded-full text-[0.75rem] font-medium
                              px-2.5 py-1.5 cursor-pointer whitespace-nowrap select-none
                              transition-all duration-150 border
                              ${active
                                        ? 'bg-orange-employe border-orange-employe text-white font-bold shadow-[0_0_0_2px_rgba(231,111,81,0.25)]'
                                        : 'bg-bleu-sombre border-orange-employe/25 text-bleu hover:border-orange-employe hover:bg-bleu-mid'}`}
                                >
                                    <span className="text-[0.95rem] leading-none">{t.emoji}</span>
                                    <span>{t.label}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Rayon */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold text-orange-employe uppercase tracking-widest">
                        Rayon de recherche
                    </label>
                    <div className="flex items-baseline gap-2 bg-bleu-sombre border border-orange-employe/25 rounded-xl px-3.5 py-2 mb-1">
            <span className="text-2xl font-black text-orange-employe leading-none tracking-tight">
              {formatRadius(radius)}
            </span>
                        <span className="text-[0.75rem] text-bleu">autour de vous</span>
                    </div>
                    <input
                        type="range"
                        min={MIN_RADIUS} max={MAX_RADIUS} step={100} value={radius}
                        style={{'--pct': `${pct}%`}}
                        onChange={(e) => updateRadius(Number(e.target.value))}
                        className="w-full h-1.5 rounded-full outline-none cursor-pointer appearance-none
                       bg-[linear-gradient(to_right,var(--color-orange-employe)_var(--pct,0%),var(--color-bleu-mid)_var(--pct,0%))]
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5
                       [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full
                       [&::-webkit-slider-thumb]:bg-orange-employe [&::-webkit-slider-thumb]:border-[3px]
                       [&::-webkit-slider-thumb]:border-bleu-sombre [&::-webkit-slider-thumb]:cursor-pointer
                       [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(231,111,81,0.6)]"
                    />
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_RADII.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => updateRadius(r.value)}
                                className={`flex-1 min-w-14.5 rounded-lg text-[0.72rem] font-semibold py-1.5 px-1
                            text-center transition-all duration-150 border cursor-pointer
                            ${radius === r.value
                                    ? 'bg-orange-employe border-orange-employe text-white font-bold'
                                    : 'bg-bleu-sombre border-orange-employe/25 text-bleu hover:border-orange-employe hover:text-bleu'}`}
                            >
                                {r.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Bouton submit */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 bg-orange-employe hover:bg-orange-employe/85 disabled:opacity-55 disabled:cursor-not-allowed
                     text-white rounded-xl py-2.5 text-sm font-bold transition-all duration-200
                     hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-none
                     shadow-[0_4px_16px_rgba(231,111,81,0.35)]"
                >
                    {isLoading ? '⏳ Recherche en cours…' : `📍 Rechercher dans ${formatRadius(radius)}`}
                </button>
            </form>
        </div>
    );
};

export default SearchPanel;
