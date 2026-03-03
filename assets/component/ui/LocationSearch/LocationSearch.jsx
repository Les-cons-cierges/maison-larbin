import { useEffect, useRef, useState, useCallback } from 'react';

const LocationSearch = ({ onLocate }) => {
    const inputRef    = useRef(null);
    const wrapperRef  = useRef(null);
    const debounceRef = useRef(null);

    const [value, setValue]             = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [isOpen, setIsOpen]           = useState(false);
    const [cursor, setCursor]           = useState(-1);
    const [isReady, setIsReady]         = useState(false);
    const [located, setLocated]         = useState(null);
    const [geoLoading, setGeoLoading]   = useState(false);
    const [geoError, setGeoError]       = useState(null);

    useEffect(() => {
        const check = () => !!window.google?.maps?.places;
        if (check()) { setIsReady(true); return; }
        const id = setInterval(() => { if (check()) { clearInterval(id); setIsReady(true); } }, 200);
        return () => clearInterval(id);
    }, []);

    useEffect(() => {
        const handler = (e) => {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setIsOpen(false); setCursor(-1);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const fetchSuggestions = useCallback(async (input) => {
        if (!input || input.trim().length < 2) { setSuggestions([]); setIsOpen(false); return; }
        try {
            const { AutocompleteSessionToken, AutocompleteSuggestion } =
                await window.google.maps.importLibrary('places');
            const token = new AutocompleteSessionToken();
            const { suggestions: preds } = await AutocompleteSuggestion.fetchAutocompleteSuggestions({
                input: input.trim(), sessionToken: token,
            });
            setSuggestions(preds ?? []); setIsOpen((preds ?? []).length > 0); setCursor(-1);
        } catch { setSuggestions([]); setIsOpen(false); }
    }, []);

    const handleInputChange = (e) => {
        const v = e.target.value; setValue(v);
        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => fetchSuggestions(v), 200);
    };

    const selectSuggestion = useCallback(async (suggestion) => {
        try {
            const place = suggestion.placePrediction.toPlace();
            await place.fetchFields({ fields: ['location', 'formattedAddress', 'displayName'] });
            const lat = place.location.lat(), lng = place.location.lng();
            const label = place.formattedAddress || place.displayName || '';
            setValue(label); setSuggestions([]); setIsOpen(false); setCursor(-1);
            setLocated({ label }); setGeoError(null); onLocate({ lat, lng, label });
        } catch { setGeoError('Erreur lors de la sélection du lieu.'); }
    }, [onLocate]);

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

    const handleKeyDown = (e) => {
        if (!isOpen || !suggestions.length) { if (e.key === 'Enter') handleSearchSubmit(); return; }
        if (e.key === 'ArrowDown')      { e.preventDefault(); setCursor((c) => Math.min(c + 1, suggestions.length - 1)); }
        else if (e.key === 'ArrowUp')   { e.preventDefault(); setCursor((c) => Math.max(c - 1, 0)); }
        else if (e.key === 'Enter')     { e.preventDefault(); if (cursor >= 0) selectSuggestion(suggestions[cursor]); else handleSearchSubmit(); }
        else if (e.key === 'Escape')    { setIsOpen(false); setCursor(-1); }
    };

    const handleGeolocate = useCallback(() => {
        if (!navigator.geolocation) { setGeoError('Géolocalisation non supportée.'); return; }
        setGeoLoading(true); setGeoError(null);
        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const lat = pos.coords.latitude, lng = pos.coords.longitude;
                let label = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;
                try {
                    const res  = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&language=fr`);
                    const data = await res.json();
                    if (data.results?.[0]) label = data.results[0].formatted_address;
                } catch { /* coordonnées brutes */ }
                setValue(label); setLocated({ label }); setGeoLoading(false);
                setSuggestions([]); setIsOpen(false); onLocate({ lat, lng, label });
            },
            () => { setGeoError('Accès à la position refusé.'); setGeoLoading(false); },
            { timeout: 8000 }
        );
    }, [onLocate]);

    const handleClear = () => {
        setValue(''); setLocated(null); setGeoError(null);
        setSuggestions([]); setIsOpen(false); inputRef.current?.focus();
    };

    return (
        <div ref={wrapperRef} className="mb-3.5 pb-4 border-b border-jaune-employe/20 flex flex-col gap-2">

            {/* En-tête */}
            <div className="flex items-center justify-between gap-2">
                <span className="text-[0.78rem] font-semibold text-jaune-employe uppercase tracking-widest">
                    📍 Localisation
                </span>
                <button
                    type="button"
                    onClick={handleGeolocate}
                    disabled={geoLoading}
                    title="Utiliser ma position GPS"
                    className={`flex items-center gap-1.5 bg-bleu-sombre border rounded-lg text-white
                                text-[0.72rem] font-semibold px-2.5 py-1 cursor-pointer whitespace-nowrap
                                transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed
                                ${geoLoading
                        ? 'border-jaune-employe text-jaune-employe'
                        : 'border-jaune-employe/30 hover:border-jaune-employe hover:text-jaune-employe hover:bg-bleu-mid'}`}
                >
                    {geoLoading
                        ? <span className="inline-block w-3 h-3 border-2 border-jaune-employe/30 border-t-jaune-employe rounded-full animate-spin"/>
                        : '🎯 Ma position'
                    }
                </button>
            </div>

            {/* Barre de recherche */}
            <div className="flex items-center bg-bleu-sombre border border-jaune-employe/25 rounded-xl
                            px-2.5 gap-1 transition-all duration-200
                            focus-within:border-jaune-employe focus-within:shadow-[0_0_0_3px_rgba(250,213,100,0.12)]">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder={isReady ? 'Ville, adresse, lieu…' : 'Chargement…'}
                    value={value}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onFocus={() => suggestions.length > 0 && setIsOpen(true)}
                    disabled={!isReady}
                    autoComplete="off"
                    className="flex-1 bg-transparent border-none outline-none text-white text-sm
                               py-2.5 placeholder-white/30 disabled:opacity-40 disabled:cursor-not-allowed"
                />
                {value && (
                    <button onClick={handleClear} type="button" title="Effacer"
                            className="text-white/30 hover:text-orange-employe text-xs px-1 leading-none transition-colors cursor-pointer border-none bg-transparent">
                        ✕
                    </button>
                )}
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

            {/* Dropdown suggestions */}
            {isOpen && suggestions.length > 0 && (
                <ul className="list-none m-0 py-1 bg-bleu-sombre border border-jaune-employe/25 rounded-xl
                               shadow-[0_8px_24px_rgba(14,35,48,0.7)] overflow-hidden
                               animate-[loc-fadein_0.15s_ease]">
                    {suggestions.map((s, i) => {
                        const p = s.placePrediction;
                        return (
                            <li
                                key={p.placeId}
                                onMouseDown={() => selectSuggestion(s)}
                                onMouseEnter={() => setCursor(i)}
                                className={`flex items-start gap-2 px-3 py-2.5 cursor-pointer
                                            border-b border-jaune-employe/10 last:border-b-0 transition-colors duration-100
                                            ${i === cursor ? 'bg-bleu-mid' : 'hover:bg-bleu-mid'}`}
                            >
                                <span className="text-sm shrink-0 mt-0.5 opacity-70">📌</span>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                    <span className="text-sm text-white font-semibold whitespace-nowrap overflow-hidden text-ellipsis">
                                        {p.mainText?.toString() || p.text?.toString()}
                                    </span>
                                    {p.secondaryText && (
                                        <span className="text-[0.72rem] text-white whitespace-nowrap overflow-hidden text-ellipsis">
                                            {p.secondaryText.toString()}
                                        </span>
                                    )}
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}

            {/* Badge localisation active */}
            {located && !geoError && (
                <div className="flex items-center gap-2 bg-bleu-sombre border border-jaune-employe/30 rounded-lg px-2.5 py-1.5
                                animate-[loc-fadein_0.25s_ease]">
                    <span className="shrink-0 w-2 h-2 rounded-full bg-jaune-employe
                                     animate-[loc-pulse_1.8s_ease-in-out_infinite]"/>
                    <span className="text-[0.72rem] text-jaune-employe whitespace-nowrap overflow-hidden text-ellipsis max-w-55">
                        {located.label}
                    </span>
                </div>
            )}

            {/* Erreur */}
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

