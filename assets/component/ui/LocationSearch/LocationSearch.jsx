import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Composant LocationSearch
 * Barre de recherche d'adresse avec autocomplétion Google Places.
 * Permet aussi de se géolocaliser via le GPS du navigateur.
 *
 * Props :
 *  - onLocate : fonction appelée quand une position est trouvée → reçoit { lat, lng, label }
 */
const LocationSearch = ({ onLocate }) => {
    // Référence directe à l'élément <input> pour pouvoir le focus programmatiquement
    const inputRef    = useRef(null);
    // Référence au conteneur global pour détecter les clics extérieurs et fermer le dropdown
    const wrapperRef  = useRef(null);
    // Référence au timer du debounce (évite de lancer une requête à chaque frappe)
    const debounceRef = useRef(null);

    const [value, setValue]             = useState('');        // Texte tapé dans l'input
    const [suggestions, setSuggestions] = useState([]);        // Liste des suggestions Google Places
    const [isOpen, setIsOpen]           = useState(false);     // Dropdown ouvert ou fermé
    const [cursor, setCursor]           = useState(-1);        // Index de la suggestion survolée au clavier (-1 = aucune)
    const [isReady, setIsReady]         = useState(false);     // L'API Google Maps est-elle chargée ?
    const [located, setLocated]         = useState(null);      // Lieu actuellement localisé (badge affiché)
    const [geoLoading, setGeoLoading]   = useState(false);     // Géolocalisation GPS en cours
    const [geoError, setGeoError]       = useState(null);      // Message d'erreur géolocalisation

    // ─── Attente du chargement de l'API Google Maps ───────────────────────────
    // L'API est injectée en asynchrone dans la page. On vérifie toutes les 200ms
    // si window.google.maps.places est disponible avant d'activer l'input.
    useEffect(() => {
        const check = () => !!window.google?.maps?.places;
        if (check()) { setIsReady(true); return; }
        const id = setInterval(() => { if (check()) { clearInterval(id); setIsReady(true); } }, 200);
        return () => clearInterval(id); // nettoyage : stoppe l'intervalle au démontage
    }, []);

    // ─── Fermeture du dropdown si clic en dehors du composant ─────────────────
    useEffect(() => {
        const handler = (e) => {
            // Si le clic n'est pas dans le wrapper, on ferme le dropdown
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false); setCursor(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler); // nettoyage
    }, []);

    // ─── Récupération des suggestions d'autocomplétion ────────────────────────
    // Appelle l'API Google Places AutocompleteSuggestion avec le texte saisi.
    // useCallback évite de recréer la fonction à chaque rendu.
    const fetchSuggestions = useCallback(async (input) => {
        // Pas de requête si moins de 2 caractères
        if (!input || input.trim().length < 2) { setSuggestions([]); setIsOpen(false); return; }
        try {
            // Chargement dynamique de la librairie Places de Google
            const { AutocompleteSessionToken, AutocompleteSuggestion } =
                await window.google.maps.importLibrary('places');
            // Le token de session regroupe les requêtes autocomplete + détail pour la facturation
            const token = new AutocompleteSessionToken();
            const { suggestions: preds } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input: input.trim(), sessionToken: token,
            });
            setSuggestions(preds ?? []); setIsOpen((preds ?? []).length > 0); setCursor(-1);
        } catch { setSuggestions([]); setIsOpen(false); }
    }, []);

    // ─── Gestion de la saisie dans l'input ────────────────────────────────────
    // On applique un debounce de 200ms : la requête ne part qu'après 200ms sans frappe
    // pour éviter de spammer l'API Google à chaque lettre tapée.
    const handleInputChange = (e) => {
        const v = e.target.value; setValue(v);
        clearTimeout(debounceRef.current); // annule le timer précédent
        debounceRef.current = setTimeout(() => fetchSuggestions(v), 200); // repart à 0
    };

    // ─── Sélection d'une suggestion dans le dropdown ──────────────────────────
    // Récupère les coordonnées GPS du lieu choisi via l'API Places,
    // puis remonte les infos au parent via onLocate.
    const selectSuggestion = useCallback(async (suggestion) => {
        try {
            // Convertit la prédiction en objet Place pour pouvoir appeler fetchFields
            const place = suggestion.placePrediction.toPlace();
            // Récupère uniquement les champs nécessaires (optimise la facturation API)
            await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] });
            const lat = place.location.lat(), lng = place.location.lng();
            const label = place.formattedAddress || place.displayName || '';
            setValue(label); setSuggestions([]); setIsOpen(false); setCursor(-1);
            setLocated({ label }); setGeoError(null);
            onLocate({ lat, lng, label }); // remonte la position au composant parent
        } catch { setGeoError('Erreur lors de la sélection du lieu.'); }
    }, [onLocate]);

    // ─── Soumission manuelle (bouton 🔍 ou touche Entrée) ─────────────────────
    // Utilise le Geocoder Google pour convertir un texte libre en coordonnées GPS.
    // Fallback quand l'utilisateur ne choisit pas une suggestion du dropdown.
    const handleSearchSubmit = useCallback(() => {
        if (!value.trim() || !window.google?.maps) return;
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: value.trim() }, (results, status) => {
            if (status !== 'OK' || !results?.[0]) { setGeoError('Aucun résultat trouvé.'); return; }
            const loc = results[0].geometry.location;
            const label = results[0].formatted_address || value.trim();
            setValue(label); setSuggestions([]); setIsOpen(false);
            setLocated({ label }); setGeoError(null);
            onLocate({ lat: loc.lat(), lng: loc.lng(), label });
        });
    }, [value, onLocate]);

    // ─── Navigation clavier dans le dropdown ──────────────────────────────────
    // ↓ / ↑ : déplace le curseur dans les suggestions
    // Entrée : sélectionne la suggestion active ou soumet la recherche
    // Échap  : ferme le dropdown
    const handleKeyDown = (e) => {
        if (!isOpen || !suggestions.length) { if (e.key === 'Enter') handleSearchSubmit(); return; }
        if (e.key === 'ArrowDown')      { e.preventDefault(); setCursor((c) => Math.min(c + 1, suggestions.length - 1)); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
        else if (e.key === 'Enter')     { e.preventDefault(); if (cursor >= 0) selectSuggestion(suggestions[cursor]); else handleSearchSubmit(); }
        else if (e.key === 'Escape')    { setIsOpen(false); setCursor(-1); }
    };

    // ─── Géolocalisation GPS du navigateur ────────────────────────────────────
    // Demande la position GPS via l'API native du navigateur (navigator.geolocation).
    // Ensuite, fait un reverse geocoding (coordonnées → adresse lisible) via l'API Google.
    const handleGeolocate = useCallback(() => {
        if (!navigator.geolocation) { setGeoError('Géolocalisation non supportée.'); return; }
        setGeoLoading(true); setGeoError(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude, lng = pos.coords.longitude;
                // Coordonnées brutes en fallback si le reverse geocoding échoue
                let label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                try {
                    // Reverse geocoding : convertit lat/lng en adresse lisible
                    const res  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&language=fr`);
                    const data = await res.json();
                    if (data.results?.[0]) label = data.results[0].formatted_address;
                } catch { /* on garde les coordonnées brutes */ }
                setValue(label); setLocated({ label }); setGeoLoading(false);
                setSuggestions([]); setIsOpen(false);
                onLocate({ lat, lng, label }); // remonte la position au parent
            },
            () => { setGeoError('Accès à la position refusé.'); setGeoLoading(false); },
            { timeout: 8000 } // abandonne après 8 secondes sans réponse GPS
        );
    }, [onLocate]);

    // ─── Réinitialisation du champ ────────────────────────────────────────────
    // Vide tout et remet le focus sur l'input
    const handleClear = () => {
        setValue(''); setLocated(null); setGeoError(null);
        setSuggestions([]); setIsOpen(false); inputRef.current?.focus();
    };

    return (
        // wrapperRef permet de détecter les clics extérieurs pour fermer le dropdown
        <div ref={wrapperRef} className="mb-3.5 pb-4 border-b border-orange-employe/20 flex flex-col gap-2">

            {/* En-tête : titre + bouton de géolocalisation GPS */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-[0.78rem] font-semibold text-orange-employe uppercase tracking-widest">
                    📍 Localisation
                </span>
                {/* Bouton GPS — spinner animé pendant le chargement */}
                <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={geoLoading}
                    title="Utiliser ma position GPS"
                    className={`flex items-center gap-1.5 bg-bleu-sombre border rounded-lg text-bleu
                                text-[0.72rem] font-semibold px-2.5 py-1 cursor-pointer whitespace-nowrap
                                transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                                ${geoLoading
                        ? 'border-orange-employe text-orange-employe'
                        : 'border-orange-employe/30 hover:border-orange-employe hover:text-orange-employe hover:bg-bleu-mid'}`}
                >
                    {/* Affiche un spinner rotatif pendant la géolocalisation, sinon le label */}
                    {geoLoading
                        ? <span className="inline-block w-3 h-3 border-2 border-orange-employe/30 border-t-orange-employe rounded-full animate-spin"/>
                        : '🎯 Ma position'
                    }
                </button>
            </div>

            {/* Barre de recherche : input + bouton effacer + bouton rechercher */}
            <div className="flex items-center bg-bleu-sombre border border-orange-employe/25 rounded-xl
                            px-2.5 gap-1 transition-all duration-200
                            focus-within:border-orange-employe focus-within:shadow-[0_0_0_3px_rgba(231,111,81,0.12)]">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={isReady ? 'Ville, adresse, lieu…' : 'Chargement…'}
                    value={value}
                    onChange={handleInputChange}   // debounce → fetchSuggestions
                    onKeyDown={handleKeyDown}       // navigation clavier
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)} // rouvre le dropdown si suggestions dispo
                    disabled={!isReady}             // désactivé tant que l'API Google n'est pas prête
                    autoComplete="off"              // désactive l'autocomplétion native du navigateur
                    className="flex-1 bg-transparent border-none outline-none text-bleu text-sm
                               py-2.5 placeholder-bleu/40 disabled:opacity-40 disabled:cursor-not-allowed"
                />
                {/* Bouton ✕ affiché uniquement si l'input contient du texte */}
                {value && (
                    <button onClick={handleClear} type="button" title="Effacer"
                            className="text-bleu/30 hover:text-orange-employe text-xs px-1 leading-none transition-colors cursor-pointer border-none bg-transparent">
                        ✕
                    </button>
                )}
                {/* Bouton de recherche — désactivé si l'API n'est pas prête ou le champ vide */}
                <button
                    type="button"
                    onClick={handleSearchSubmit}
                    disabled={!isReady || !value.trim()}
                    title="Rechercher"
                    className="bg-orange-employe hover:bg-orange-employe/85 disabled:opacity-35 disabled:cursor-not-allowed
                               rounded-lg px-2 py-1.5 text-sm leading-none cursor-pointer border-none
                               transition-all duration-150 hover:scale-105 shrink-0"
                >
                    🔍
                </button>
            </div>

            {/* Dropdown des suggestions Google Places */}
            {isOpen && suggestions.length > 0 && (
                <ul className="list-none m-0 py-1 bg-bleu-sombre border border-orange-employe/25 rounded-xl
                               shadow-[0_8px_24px_rgba(14,35,48,0.7)] overflow-hidden
                               animate-[loc-fadein_0.15s_ease]">
                    {suggestions.map((s, i) => {
                        const p = s.placePrediction;
                        return (
                            <li
                                key={p.placeId}
                                onMouseDown={() => selectSuggestion(s)} // mouseDown plutôt que onClick pour éviter que onBlur se déclenche avant
                                onMouseEnter={() => setCursor(i)}        // synchronise le curseur clavier avec la souris
                                className={`flex items-start gap-2 px-3 py-2.5 cursor-pointer
                                            border-b border-orange-employe/10 last:border-b-0 transition-colors duration-100
                                            ${i === cursor ? 'bg-bleu-mid' : 'hover:bg-bleu-mid'}`}
                            >
                                <span className="text-sm shrink-0 mt-0.5 opacity-70">📌</span>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    {/* Nom principal du lieu (ex: "Tour Eiffel") */}
                                    <span className="text-sm text-bleu font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                                        {p.mainText?.toString() || p.text?.toString()}
                                    </span>
                                    {/* Texte secondaire : ville, pays (ex: "Paris, France") */}
                                    {p.secondaryText && (
                                        <span className="text-[0.72rem] text-bleu/70 whitespace-nowrap overflow-hidden text-ellipsis">
                                            {p.secondaryText.toString()}
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Badge affiché quand une localisation est active (sans erreur) */}
            {located && !geoError && (
                <div className="flex items-center gap-2 bg-bleu-sombre border border-orange-employe/30 rounded-lg px-2.5 py-1.5
                                animate-[loc-fadein_0.25s_ease]">
                    {/* Point pulsant pour indiquer que la position est active */}
                    <span className="shrink-0 w-2 h-2 rounded-full bg-orange-employe
                                     animate-[loc-pulse_1.8s_ease-in-out_infinite]"/>
                    <span className="text-[0.72rem] text-orange-employe whitespace-nowrap overflow-hidden text-ellipsis max-w-55">
                        {located.label}
                    </span>
                </div>
            )}

            {/* Message d'erreur (position refusée, aucun résultat…) */}
            {geoError && (
                <div className="text-xs text-orange-employe bg-orange-employe/10 border border-orange-employe/40 rounded-lg px-2.5 py-1.5
                                animate-[loc-fadein_0.2s_ease]">
                    ⚠️ {geoError}
                </div>
            )}
        </div>
    );
};

export default LocationSearch;

