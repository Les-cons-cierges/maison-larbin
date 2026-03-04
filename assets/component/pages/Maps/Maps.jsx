import {useCallback, useEffect, useRef, useState} from 'react';
import {AdvancedMarker, APIProvider, Map, useMap} from '@vis.gl/react-google-maps';
import LocationSearch from "../../ui/LocationSearch/LocationSearch";
import SearchPanel from "../../ui/SearchPanel/SearchPanel";
import ResultsList from "../../ui/ResultsList/ResultsList";

/* ── Emoji par type de lieu ── */
const PLACE_EMOJI = {
    restaurant: '🍽️', cafe: '☕', bar: '🍺', hospital: '🏥', pharmacy: '💊',
    supermarket: '🛒', school: '🏫', park: '🌳', gas_station: '⛽', bank: '🏦',
    gym: '💪', hotel: '🏨', museum: '🏛️', movie_theater: '🎬', bakery: '🥖',
    shopping_mall: '🛍️', train_station: '🚉', airport: '✈️', night_club: '🎉',
    spa: '🧖', library: '📚', post_office: '📮', parking: '🅿️',
    bicycle_store: '🚲', car_repair: '🔧',
};

const PRICE_LABELS = {
    PRICE_LEVEL_FREE: 'Gratuit',
    PRICE_LEVEL_INEXPENSIVE: '€',
    PRICE_LEVEL_MODERATE: '€€',
    PRICE_LEVEL_EXPENSIVE: '€€€',
    PRICE_LEVEL_VERY_EXPENSIVE: '€€€€',
};

/* ── Carte info flottante ── */
const MapInfoCard = ({place, onClose}) => {
    if (!place) return null;
    const rating = place.rating;
    const stars  = rating ? Math.round(rating) : 0;
    const price  = PRICE_LABELS[place.priceLevel] ?? null;
    const isOpen = place.currentOpeningHours?.openNow;

    return (
        <div
            className="absolute bottom-0 left-0 right-0 z-20
                       md:bottom-6 md:left-1/2 md:right-auto md:-translate-x-1/2 md:w-80
                       bg-bleu-sombre border-t-2 border-jaune-employe
                       md:border-2 md:rounded-2xl
                       rounded-t-2xl p-4 pt-5
                       shadow-[0_-4px_32px_rgba(27,71,93,0.7)] md:shadow-[0_8px_32px_rgba(27,71,93,0.7)]
                       animate-[infocard-in_0.2s_ease] max-h-[70vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
        >
            {/* Poignée mobile */}
            <div className="md:hidden w-10 h-1 bg-jaune-employe rounded-full mx-auto mb-3 -mt-1"/>

            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-jaune-employe hover:text-white transition-colors text-sm leading-none px-1 cursor-pointer bg-transparent border-none"
            >✕</button>

            <div className="font-bold text-bleu text-base leading-snug pr-6 mb-1">
                {place.displayName?.text}
            </div>

            {place.formattedAddress && (
                <div className="text-orange-employe text-xs mb-2 leading-snug">
                    📍 {place.formattedAddress}
                </div>
            )}

            <div className="flex items-center justify-between gap-2 mb-2">
                {rating && (
                    <div className="flex items-center gap-1.5">
                        <span className="text-orange-employe text-xs tracking-tighter">
                            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                        </span>
                        <span className="text-orange-employe font-bold text-sm">{rating.toFixed(1)}</span>
                        {place.userRatingCount && (
                            <span className="text-bleu text-xs">({place.userRatingCount} avis)</span>
                        )}
                    </div>
                )}
                {price && (
                    <span className="bg-orange-employe/20 border border-orange-employe/50 rounded-md px-2 py-0.5 text-xs font-bold text-orange-employe">
                        {price}
                    </span>
                )}
            </div>

            {place.currentOpeningHours && (
                <div className={`text-xs font-semibold mb-2 ${isOpen ? 'text-emerald-300' : 'text-orange-employe'}`}>
                    {isOpen ? '✅ Ouvert maintenant' : '❌ Fermé'}
                </div>
            )}

            {place.currentOpeningHours?.weekdayDescriptions?.length > 0 && (
                <details className="mb-2 text-xs">
                    <summary className="cursor-pointer text-orange-employe hover:text-bleu transition-colors mb-1">
                        Horaires
                    </summary>
                    <ul className="list-none p-0 m-0 space-y-0.5">
                        {place.currentOpeningHours.weekdayDescriptions.map((d, i) => (
                            <li key={i} className="text-bleu">{d}</li>
                        ))}
                    </ul>
                </details>
            )}

            {place.internationalPhoneNumber && (
                <div className="text-xs mt-1">
                    📞 <a href={`tel:${place.internationalPhoneNumber}`} className="text-orange-employe hover:underline">
                    {place.internationalPhoneNumber}
                </a>
                </div>
            )}
            {place.websiteUri && (
                <div className="text-xs mt-1">
                    🌐 <a href={place.websiteUri} target="_blank" rel="noreferrer" className="text-orange-employe hover:underline">
                    Site web
                </a>
                </div>
            )}
        </div>
    );
};

/* ── Cercle de rayon ── */
const RadiusCircle = ({center, radius}) => {
    const map = useMap();
    const circleRef = useRef(null);

    useEffect(() => {
        if (!map || !center) return;
        if (!circleRef.current) {
            circleRef.current = new window.google.maps.Circle({
                map, center, radius,
                fillColor: '#e76f51', fillOpacity: 0.07,
                strokeColor: '#e76f51', strokeOpacity: 0.5,
                strokeWeight: 2, clickable: false,
            });
        } else { circleRef.current.setMap(map); }
        return () => { if (circleRef.current) { circleRef.current.setMap(null); circleRef.current = null; } };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]);

    useEffect(() => { circleRef.current?.setCenter(center); }, [center]);
    useEffect(() => { circleRef.current?.setRadius(radius); }, [radius]);
    return null;
};

/* ── Contenu de la carte ── */
const MapContent = ({userPos, places, activePlace, setActivePlace, radius, locatedPoint, placeType}) => {
    const map = useMap();

    useEffect(() => {
        if (activePlace && map) {
            map.panTo({lat: activePlace.location.latitude, lng: activePlace.location.longitude});
            map.setZoom(16);
        }
    }, [activePlace, map]);

    return (
        <>
            {userPos && (
                <>
                    <RadiusCircle center={userPos} radius={radius}/>
                    <AdvancedMarker position={userPos} title="Vous êtes ici">
                        <div className="w-4 h-4 rounded-full bg-orange-employe border-[3px] border-white shadow-[0_0_10px_rgba(231,111,81,0.7)]"/>
                    </AdvancedMarker>
                </>
            )}

            {locatedPoint && (
                <AdvancedMarker position={locatedPoint} title={locatedPoint.label}>
                    <div className="flex flex-col items-center gap-0">
                        <div className="bg-bleu-sombre border border-orange-employe rounded-lg px-2 py-1
                                        text-[0.72rem] text-bleu whitespace-nowrap max-w-45
                                        overflow-hidden text-ellipsis shadow-lg mb-1">
                            {locatedPoint.label}
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-orange-employe border-[3px] border-white shadow-[0_0_10px_rgba(231,111,81,0.8)]"/>
                    </div>
                </AdvancedMarker>
            )}

            {places.map((place, i) => {
                const pos = {lat: place.location.latitude, lng: place.location.longitude};
                const isActive = activePlace?.id === place.id;
                const emoji = PLACE_EMOJI[place.primaryType] ?? PLACE_EMOJI[placeType] ?? '📍';
                return (
                    <AdvancedMarker
                        key={place.id || i}
                        position={pos}
                        title={place.displayName?.text}
                        onClick={() => setActivePlace(isActive ? null : place)}
                    >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full
                                         border-2 text-xl cursor-pointer
                                         shadow-[0_2px_10px_rgba(0,0,0,0.4)] transition-all duration-150
                                         ${isActive
                            ? 'bg-orange-employe border-white scale-125 shadow-[0_0_0_4px_rgba(231,111,81,0.35)]'
                            : 'bg-bleu-sombre border-orange-employe hover:scale-110 hover:border-orange-employe hover:bg-orange-employe'}`}>
                            {emoji}
                        </div>
                    </AdvancedMarker>
                );
            })}
        </>
    );
};

/* ── Composant principal ── */
const Maps = () => {
    const [userPos, setUserPos]           = useState(null);
    const [mapCenter, setMapCenter]       = useState({lat: 48.8566, lng: 2.3522});
    const [places, setPlaces]             = useState([]);
    const [activePlace, setActivePlace]   = useState(null);
    const [isLoading, setIsLoading]       = useState(false);
    const [error, setError]               = useState(null);
    const [radius, setRadius]             = useState(2000);
    const [locatedPoint, setLocatedPoint] = useState(null);
    const [mapKey, setMapKey]             = useState('init');
    const [placeType, setPlaceType]       = useState('restaurant');
    const [sidebarOpen, setSidebarOpen]   = useState(false);

    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                setUserPos(coords); setMapCenter(coords);
                setMapKey(`geo-${coords.lat},${coords.lng}`);
            },
            () => setError('Géolocalisation refusée — carte centrée par défaut.')
        );
    }, []);

    const handleSearch = useCallback(async ({query, placeTypes, radius: r}) => {
        if (!userPos) { setError('Position introuvable. Autorisez la géolocalisation et rechargez.'); return; }
        setRadius(r); setPlaceType(placeTypes[0]);
        setIsLoading(true); setError(null); setPlaces([]); setActivePlace(null);
        setSidebarOpen(false);

        try {
            const isText = query.trim().length > 0;
            const endpoint = isText
                ? 'https://places.googleapis.com/v1/places:searchText'
                : 'https://places.googleapis.com/v1/places:searchNearby';
            const headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                'X-Goog-FieldMask':
                    'places.id,places.displayName,places.formattedAddress,places.location,' +
                    'places.rating,places.userRatingCount,places.currentOpeningHours,' +
                    'places.priceLevel,places.internationalPhoneNumber,places.websiteUri,places.primaryType',
            };
            const requests = placeTypes.map((type) => {
                const body = isText
                    ? { textQuery: query.trim(), includedType: type, maxResultCount: 20,
                        locationBias: { circle: { center: {latitude: userPos.lat, longitude: userPos.lng}, radius: r } } }
                    : { includedTypes: [type], maxResultCount: 20,
                        locationRestriction: { circle: { center: {latitude: userPos.lat, longitude: userPos.lng}, radius: r } } };
                return fetch(endpoint, {method: 'POST', headers, body: JSON.stringify(body)});
            });
            const responses = await Promise.all(requests);
            for (const res of responses) {
                if (!res.ok) { const e = await res.json(); setError(`Erreur : ${e.error?.message || res.status}`); return; }
            }
            const dataAll = await Promise.all(responses.map((r) => r.json()));
            const seen = new Set();
            const allPlaces = dataAll.flatMap((d) => d.places || []).filter((p) => {
                if (seen.has(p.id)) return false; seen.add(p.id); return true;
            });
            setPlaces(allPlaces);
            if (!allPlaces.length) setError('Aucun lieu trouvé dans ce rayon.');
        } catch (e) {
            setError(`Erreur réseau : ${e.message}`);
        } finally { setIsLoading(false); }
    }, [userPos]);

    const handleLocate = useCallback(({lat, lng, label}) => {
        setLocatedPoint({lat, lng, label}); setMapCenter({lat, lng});
        setMapKey(`loc-${lat},${lng}`); setUserPos({lat, lng});
        setPlaces([]); setActivePlace(null); setError(null);
    }, []);

    return (
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']} apiOptions={{loading: 'async'}}>
            <div className="relative flex flex-col md:flex-row w-screen h-[calc(100vh-50px)] mt-[50px] overflow-hidden bg-bleu-sombre text-bleu">

                {/* ══ OVERLAY sombre sur mobile quand sidebar ouverte ══ */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-bleu-sombre/70 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                )}

                {/* ══ SIDEBAR ══ */}
                <aside className={`
                    fixed md:relative
                    inset-x-0 bottom-0 md:inset-auto
                    z-30 md:z-10
                    h-[85vh] md:h-full
                    w-full md:w-80 md:min-w-80
                    bg-bleu-sombre border-t-2 md:border-t-0 md:border-r-2 border-orange-employe/30
                    rounded-t-3xl md:rounded-none
                    flex flex-col
                    transition-transform duration-300 ease-in-out
                    ${sidebarOpen ? 'translate-y-0' : 'translate-y-full md:translate-y-0'}
                    [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]
                `}>
                    {/* Poignée de drag mobile */}
                    <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 bg-orange-employe/40 rounded-full"/>
                    </div>

                    {/* Contenu scrollable */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 md:py-4
                                    [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]">
                        <LocationSearch onLocate={handleLocate}/>
                        <SearchPanel onSearch={handleSearch} isLoading={isLoading} onRadiusChange={setRadius}/>
                        {error && (
                            <div className="mt-2.5 px-3 py-2.5 bg-orange-employe/15 border border-orange-employe/50
                                            rounded-lg text-orange-employe text-xs leading-relaxed">
                                {error}
                            </div>
                        )}
                        <ResultsList places={places.length > 0 ? places : null} onSelectPlace={(p) => { setActivePlace(p); setSidebarOpen(false); }} activePlace={activePlace}/>
                    </div>
                </aside>

                {/* ══ CARTE ══ */}
                <div className="flex-1 relative h-full">
                    <Map
                        key={mapKey}
                        mapId={import.meta.env.VITE_GOOGLE_MAPS_MAP_ID}
                        style={{width: '100%', height: '100%'}}
                        defaultCenter={mapCenter}
                        defaultZoom={13}
                        gestureHandling="greedy"
                        disableDefaultUI
                        onClick={() => setActivePlace(null)}
                    >
                        <MapContent
                            userPos={userPos} places={places}
                            activePlace={activePlace} setActivePlace={setActivePlace}
                            radius={radius} locatedPoint={locatedPoint} placeType={placeType}
                        />
                    </Map>

                    {/* Info card */}
                    {activePlace && <MapInfoCard place={activePlace} onClose={() => setActivePlace(null)}/>}

                    {/* ══ BOUTON toggle sidebar (mobile only) ══ */}
                    <div className="md:hidden fixed bottom-6 right-4 z-40 flex items-center gap-2">
                        {places.length > 0 && !sidebarOpen && (
                            <span className="bg-orange-employe text-white text-xs font-black rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                {places.length}
                            </span>
                        )}
                        <button
                            type="button"
                            onClick={() => setSidebarOpen((o) => !o)}
                            className="flex items-center gap-2 bg-orange-employe text-white
                                       text-sm font-bold px-5 py-3 rounded-2xl cursor-pointer border-none
                                       shadow-[0_4px_20px_rgba(231,111,81,0.5)]
                                       transition-all duration-200 active:scale-95 hover:bg-orange-employe/85"
                        >
                            {sidebarOpen ? '✕ Fermer' : '🔍 Rechercher'}
                        </button>
                    </div>
                </div>
            </div>
        </APIProvider>
    );
};

export default Maps;
