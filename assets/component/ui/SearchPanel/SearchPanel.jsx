import { useState } from 'react';

/**
 * Liste de tous les types de lieux supportés par l'API Google Places.
 * Chaque entrée contient :
 *  - value : identifiant technique envoyé à l'API
 *  - label : nom affiché à l'utilisateur
 *  - emoji : icône associée au type de lieu
 */
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

// Valeurs min/max du slider de rayon (en mètres)
const MIN_RADIUS = 200;
const MAX_RADIUS = 30000;

/**
 * Raccourcis de rayon prédéfinis affichés sous le slider
 * pour permettre une sélection rapide sans manipuler le curseur.
 */
const QUICK_RADII = [
    { value: 500,   label: '500 m' },
    { value: 1000,  label: '1 km' },
    { value: 2000,  label: '2 km' },
    { value: 5000,  label: '5 km' },
    { value: 10000, label: '10 km' },
    { value: 20000, label: '20 km' },
];

/**
 * Composant SearchPanel
 * Panneau de configuration de la recherche de lieux à proximité.
 * Permet de choisir un mot-clé, des types de lieux et un rayon.
 *
 * Props :
 *  - onSearch      : fonction appelée à la soumission → reçoit { query, placeTypes, radius }
 *  - isLoading     : booléen pour désactiver le bouton pendant la recherche
 *  - onRadiusChange: fonction appelée en temps réel quand le rayon change (pour mettre à jour le cercle sur la carte)
 */
const SearchPanel = ({ onSearch, isLoading, onRadiusChange }) => {
    const [query, setQuery]           = useState('');              // Mot-clé de recherche libre (ex: "pizza")
    const [placeTypes, setPlaceTypes] = useState(['restaurant']);  // Types de lieux sélectionnés (au moins 1)
    const [radius, setRadius]         = useState(2000);            // Rayon en mètres (2km par défaut)

    // ─── Bascule d'un type de lieu ────────────────────────────────────────────
    // Ajoute le type s'il n'est pas sélectionné, le retire sinon.
    // Garde au moins 1 type sélectionné en permanence (empêche de tout décocher).
    const toggleType = (value) => {
        setPlaceTypes((prev) =>
            prev.includes(value)
                ? prev.length === 1 ? prev : prev.filter((v) => v !== value) // empêche la liste vide
                : [...prev, value]
        );
    };

    // ─── Mise à jour du rayon ─────────────────────────────────────────────────
    // Stocke la nouvelle valeur ET notifie le parent pour mettre à jour
    // le cercle de rayon affiché sur la carte en temps réel.
    const updateRadius = (val) => { setRadius(val); onRadiusChange?.(val); };

    // ─── Soumission du formulaire ─────────────────────────────────────────────
    // e.preventDefault() empêche le rechargement de page (comportement HTML par défaut).
    const handleSubmit = (e) => { e.preventDefault(); onSearch({ query, placeTypes, radius }); };

    // ─── Formatage du rayon pour l'affichage ──────────────────────────────────
    // Convertit les mètres en "500 m", "1 km", "1.5 km" etc.
    const formatRadius = (val) => {
        if (val >= 1000) { const km = val / 1000; return km % 1 === 0 ? `${km} km` : `${km.toFixed(1)} km`; }
        return `${val} m`;
    };

    // Calcule le pourcentage de remplissage du slider pour la couleur dégradée (CSS custom property --pct)
    const pct = ((radius - MIN_RADIUS) / (MAX_RADIUS - MIN_RADIUS)) * 100;

    return (
        <div className="bg-bleu-sombre border border-orange-employe/20 rounded-2xl p-4 md:p-5 text-bleu">
            <h2 className="text-orange-employe font-bold text-sm tracking-wide mb-4">🔍 Recherche à proximité</h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

                {/* Champ mot-clé libre — optionnel, affine la recherche (ex: "sushi" dans les restaurants) */}
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

                {/* Sélection des types de lieux — badges cliquables avec compteur */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold text-orange-employe uppercase tracking-widest flex items-center gap-2">
                        Types de lieux
                        {/* Badge indiquant combien de types sont sélectionnés */}
                        <span className="bg-orange-employe/20 border border-orange-employe/60 rounded-full px-2 py-0.5
                             text-[0.68rem] text-orange-employe font-bold normal-case tracking-normal">
                            {placeTypes.length} sélectionné{placeTypes.length > 1 ? 's' : ''}
                        </span>
                    </label>
                    {/* Zone scrollable pour afficher tous les types sans prendre trop de place */}
                    <div className="flex flex-wrap gap-1.5 max-h-40 md:max-h-32 overflow-y-auto py-0.5
                          [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]">
                        {PLACE_TYPES.map((t) => {
                            const active = placeTypes.includes(t.value); // ce type est-il sélectionné ?
                            return (
                                <button
                                    key={t.value}
                                    type="button"
                                    onClick={() => toggleType(t.value)}
                                    title={t.label}
                                    // Style actif (plein orange) vs inactif (contour discret)
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

                {/* Slider de rayon de recherche */}
                <div className="flex flex-col gap-1.5">
                    <label className="text-[0.78rem] font-semibold text-orange-employe uppercase tracking-widest">
                        Rayon de recherche
                    </label>
                    {/* Affichage de la valeur actuelle du rayon en grand */}
                    <div className="flex items-baseline gap-2 bg-bleu-sombre border border-orange-employe/25 rounded-xl px-3.5 py-2 mb-1">
                        <span className="text-2xl font-black text-orange-employe leading-none tracking-tight">
                          {formatRadius(radius)}
                        </span>
                        <span className="text-[0.75rem] text-bleu">autour de vous</span>
                    </div>
                    {/*
                      Slider HTML natif stylisé via Tailwind.
                      --pct : variable CSS calculée pour remplir la barre à gauche du pouce en orange.
                    */}
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
                    {/* Boutons de sélection rapide du rayon — cliquables en plus du slider */}
                    <div className="flex flex-wrap gap-1.5 mt-2">
                        {QUICK_RADII.map((r) => (
                            <button
                                key={r.value}
                                type="button"
                                onClick={() => updateRadius(r.value)}
                                // Surbrillance si c'est la valeur actuellement sélectionnée
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

                {/* Bouton de lancement de la recherche — désactivé pendant le chargement */}
                <button
                    type="submit"
                    disabled={isLoading}
                    className="mt-1 bg-orange-employe hover:bg-orange-employe/85 disabled:opacity-55 disabled:cursor-not-allowed
                     text-white rounded-xl py-2.5 text-sm font-bold transition-all duration-200
                     hover:-translate-y-0.5 active:translate-y-0 cursor-pointer border-none
                     shadow-[0_4px_16px_rgba(231,111,81,0.35)]"
                >
                    {/* Texte dynamique selon l'état de chargement */}
                    {isLoading ? '⏳ Recherche en cours…' : `📍 Rechercher dans ${formatRadius(radius)}`}
                </button>
            </form>
        </div>
    );
};

export default SearchPanel;
