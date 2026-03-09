import {useCallback, useEffect, useRef, useState} from 'react';
import {AdvancedMarker, APIProvider, Map, useMap} from '@vis.gl/react-google-maps';
import LocationSearch from "../../ui/LocationSearch/LocationSearch";
import SearchPanel from "../../ui/SearchPanel/SearchPanel";
import ResultsList from "../../ui/ResultsList/ResultsList";

/* ─────────────────────────────────────────────────────────────────────────────
   CONSTANTES
   ───────────────────────────────────────────────────────────────────────────── */

/**
 * Associe chaque type de lieu Google Places à un emoji affiché sur le marqueur.
 * La clé correspond au champ `primaryType` renvoyé par l'API Places.
 */
const PLACE_EMOJI = {
    restaurant: '🍽️', cafe: '☕', bar: '🍺', hospital: '🏥', pharmacy: '💊',
    supermarket: '🛒', school: '🏫', park: '🌳', gas_station: '⛽', bank: '🏦',
    gym: '💪', hotel: '🏨', museum: '🏛️', movie_theater: '🎬', bakery: '🥖',
    shopping_mall: '🛍️', train_station: '🚉', airport: '✈️', night_club: '🎉',
    spa: '🧖', library: '📚', post_office: '📮', parking: '🅿️',
    bicycle_store: '🚲', car_repair: '🔧',
};

/**
 * Traduit les niveaux de prix renvoyés par l'API Places en labels lisibles.
 * Ex : PRICE_LEVEL_MODERATE → "€€"
 */
const PRICE_LABELS = {
    PRICE_LEVEL_FREE: 'Gratuit',
    PRICE_LEVEL_INEXPENSIVE: '€',
    PRICE_LEVEL_MODERATE: '€€',
    PRICE_LEVEL_EXPENSIVE: '€€€',
    PRICE_LEVEL_VERY_EXPENSIVE: '€€€€',
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMPOSANT : MapInfoCard
   Carte d'information flottante affichée au bas de la carte (ou centrée sur
   desktop) lorsqu'un marqueur est sélectionné.
   Props :
     - place   : objet lieu Google Places (null = pas d'affichage)
     - onClose : callback appelé pour fermer la carte
   ───────────────────────────────────────────────────────────────────────────── */
const MapInfoCard = ({place, onClose}) => {
    // Ne rien afficher si aucun lieu n'est sélectionné
    if (!place) return null;

    const rating = place.rating;
    // Arrondi de la note pour afficher le bon nombre d'étoiles (sur 5)
    const stars  = rating ? Math.round(rating) : 0;
    // Récupère le label de prix traduit (ou null si absent)
    const price  = PRICE_LABELS[place.priceLevel] ?? null;
    // Indique si le lieu est actuellement ouvert
    const isOpen = place.currentOpeningHours?.openNow;

    return (
        <>
        {/* Empêche le clic sur la carte de se propager et de fermer la fiche */}
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
            {/* Poignée visuelle (drag handle) uniquement sur mobile */}
            <div className="md:hidden w-10 h-1 bg-jaune-employe rounded-full mx-auto mb-3 -mt-1"/>

            {/* Bouton de fermeture */}
            <button
                onClick={onClose}
                className="absolute top-3 right-3 text-jaune-employe hover:text-white transition-colors text-sm leading-none px-1 cursor-pointer bg-transparent border-none"
            >✕</button>

            {/* Nom du lieu */}
            <div className="font-bold text-bleu text-base leading-snug pr-6 mb-1">
                {place.displayName?.text}
            </div>

            {/* Adresse formatée */}
            {place.formattedAddress && (
                <div className="text-orange-employe text-xs mb-2 leading-snug">
                    📍 {place.formattedAddress}
                </div>
            )}

            {/* Ligne : note + niveau de prix */}
            <div className="flex items-center justify-between gap-2 mb-2">
                {rating && (
                    <div className="flex items-center gap-1.5">
                        {/* Étoiles pleines / vides selon la note arrondie */}
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

            {/* Statut ouvert / fermé */}
            {place.currentOpeningHours && (
                <div className={`text-xs font-semibold mb-2 ${isOpen ? 'text-emerald-300' : 'text-orange-employe'}`}>
                    {isOpen ? '✅ Ouvert maintenant' : '❌ Fermé'}
                </div>
            )}

            {/* Horaires hebdomadaires dans un élément <details> dépliable */}
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

            {/* Numéro de téléphone cliquable (lien tel:) */}
            {place.internationalPhoneNumber && (
                <div className="text-xs mt-1">
                    📞 <a href={`tel:${place.internationalPhoneNumber}`} className="text-orange-employe hover:underline">
                    {place.internationalPhoneNumber}
                </a>
                </div>
            )}

            {/* Site web du lieu (ouverture dans un nouvel onglet) */}
            {place.websiteUri && (
                <div className="text-xs mt-1">
                    🌐 <a href={place.websiteUri} target="_blank" rel="noreferrer" className="text-orange-employe hover:underline">
                    Site web
                </a>
                </div>
            )}
        </div>
        </>
    );
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMPOSANT : RadiusCircle
   Dessine un cercle Google Maps autour d'un point central pour visualiser
   le rayon de recherche. Utilise l'API native `google.maps.Circle`.
   Props :
     - center : { lat, lng } centre du cercle
     - radius : rayon en mètres
   ───────────────────────────────────────────────────────────────────────────── */
const RadiusCircle = ({center, radius}) => {
    // Accès à l'instance de la carte Google Maps parente (fournie par @vis.gl/react-google-maps)
    const map = useMap();
    // Référence mutable vers l'objet Circle natif (évite un re-render inutile)
    const circleRef = useRef(null);

    useEffect(() => {
        if (!map || !center) return;

        if (!circleRef.current) {
            // Création du cercle au premier montage
            circleRef.current = new window.google.maps.Circle({
                map, center, radius,
                fillColor: '#e76f51', fillOpacity: 0.07,   // Remplissage semi-transparent
                strokeColor: '#e76f51', strokeOpacity: 0.5, // Contour orangé
                strokeWeight: 2, clickable: false,           // Non interactif
            });
        } else {
            // Si le cercle existe déjà, on le rattache simplement à la carte
            circleRef.current.setMap(map);
        }

        // Nettoyage : détache le cercle de la carte à la destruction du composant
        return () => {
            if (circleRef.current) {
                circleRef.current.setMap(null);
                circleRef.current = null;
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [map]); // Ne se ré-exécute que si la référence de la carte change

    // Met à jour le centre du cercle sans recréer l'objet
    useEffect(() => { circleRef.current?.setCenter(center); }, [center]);
    // Met à jour le rayon du cercle sans recréer l'objet
    useEffect(() => { circleRef.current?.setRadius(radius); }, [radius]);

    return null; // Composant purement impératif, pas de rendu JSX
};

/* ─────────────────────────────────────────────────────────────────────────────
   COMPOSANT : MapContent
   Rendu de tous les éléments positionnés sur la carte :
     - marqueur de position de l'utilisateur + cercle de rayon
     - marqueur du point recherché (adresse saisie manuellement)
     - marqueurs des lieux trouvés par l'API Places
   Props :
     - userPos       : position de l'utilisateur { lat, lng }
     - places        : tableau de lieux retournés par l'API
     - activePlace   : lieu actuellement sélectionné (marqueur agrandi)
     - setActivePlace: setter pour changer le lieu actif
     - radius        : rayon de recherche en mètres
     - locatedPoint  : point issu d'une recherche d'adresse manuelle
     - placeType     : type de lieu par défaut (sert de fallback pour l'emoji)
   ───────────────────────────────────────────────────────────────────────────── */
const MapContent = ({userPos, places, activePlace, setActivePlace, radius, locatedPoint, placeType}) => {
    const map = useMap();

    // Quand un lieu actif est défini, on centre et zoome la carte sur lui
    useEffect(() => {
        if (activePlace && map) {
            map.panTo({lat: activePlace.location.latitude, lng: activePlace.location.longitude});
            map.setZoom(16);
        }
    }, [activePlace, map]);

    return (
        <>
            {/* ── Marqueur "Vous êtes ici" + cercle de rayon ── */}
            {userPos && (
                <>
                    <RadiusCircle center={userPos} radius={radius}/>
                    <AdvancedMarker position={userPos} title="Vous êtes ici">
                        {/* Point orange avec halo pour la position utilisateur */}
                        <div className="w-4 h-4 rounded-full bg-orange-employe border-[3px] border-white shadow-[0_0_10px_rgba(231,111,81,0.7)]"/>
                    </AdvancedMarker>
                </>
            )}

            {/* ── Marqueur pour une adresse saisie manuellement dans LocationSearch ── */}
            {locatedPoint && (
                <AdvancedMarker position={locatedPoint} title={locatedPoint.label}>
                    <div className="flex flex-col items-center gap-0">
                        {/* Étiquette avec le nom de l'adresse, tronquée si trop longue */}
                        <div className="bg-bleu-sombre border border-orange-employe rounded-lg px-2 py-1
                                        text-[0.72rem] text-bleu whitespace-nowrap max-w-45
                                        overflow-hidden text-ellipsis shadow-lg mb-1">
                            {locatedPoint.label}
                        </div>
                        <div className="w-3.5 h-3.5 rounded-full bg-orange-employe border-[3px] border-white shadow-[0_0_10px_rgba(231,111,81,0.8)]"/>
                    </div>
                </AdvancedMarker>
            )}

            {/* ── Marqueurs des lieux trouvés par l'API Places ── */}
            {places.map((place, i) => {
                const pos = {lat: place.location.latitude, lng: place.location.longitude};
                // Détermine si ce lieu est le lieu actuellement sélectionné
                const isActive = activePlace?.id === place.id;
                // Emoji : priorité au type précis du lieu, puis au type recherché, sinon 📍
                const emoji = PLACE_EMOJI[place.primaryType] ?? PLACE_EMOJI[placeType] ?? '📍';

                return (
                    <AdvancedMarker
                        key={place.id || i}
                        position={pos}
                        title={place.displayName?.text}
                        // Clic : sélectionne le lieu ou le désélectionne s'il était déjà actif
                        onClick={() => setActivePlace(isActive ? null : place)}
                    >
                        {/* Cercle coloré : agrandi et mis en avant si actif */}
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

/* ─────────────────────────────────────────────────────────────────────────────
   COMPOSANT PRINCIPAL : Maps
   Orchestration globale de la page carte :
     - Géolocalisation de l'utilisateur au chargement
     - Recherche de lieux via l'API Google Places (texte ou proximité)
     - Gestion de la sidebar responsive (drawer mobile / panneau desktop)
     - Affichage de la carte Google Maps avec tous ses éléments
   ───────────────────────────────────────────────────────────────────────────── */
const Maps = () => {
    const [userPos, setUserPos]           = useState(null);          // Coordonnées GPS de l'utilisateur
    const [mapCenter, setMapCenter]       = useState({lat: 48.8566, lng: 2.3522}); // Centre par défaut : Paris
    const [places, setPlaces]             = useState([]);            // Lieux retournés par l'API Places
    const [activePlace, setActivePlace]   = useState(null);          // Lieu sélectionné (fiche ouverte)
    const [isLoading, setIsLoading]       = useState(false);         // Indicateur de chargement
    const [error, setError]               = useState(null);          // Message d'erreur à afficher
    const [radius, setRadius]             = useState(2000);          // Rayon de recherche en mètres (2 km par défaut)
    const [locatedPoint, setLocatedPoint] = useState(null);          // Point issu de la recherche d'adresse
    const [mapKey, setMapKey]             = useState('init');        // Clé React pour forcer le re-montage de la carte
    const [placeType, setPlaceType]       = useState('restaurant');  // Type de lieu courant (emoji fallback)
    const [sidebarOpen, setSidebarOpen]   = useState(false);         // Visibilité de la sidebar sur mobile

    /**
     * Géolocalise l'utilisateur au montage du composant.
     * Si la permission est accordée, on centre la carte sur sa position.
     * Sinon on affiche un message d'erreur non bloquant.
     */
    useEffect(() => {
        if (!navigator.geolocation) return;
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const coords = {lat: pos.coords.latitude, lng: pos.coords.longitude};
                setUserPos(coords);
                setMapCenter(coords);
                // Nouveau mapKey pour forcer le re-rendu de la carte sur la bonne position
                setMapKey(`geo-${coords.lat},${coords.lng}`);
            },
            () => setError('Géolocalisation refusée — carte centrée par défaut.')
        );
    }, []);

    /**
     * Lance une recherche de lieux via l'API Google Places (New).
     * Deux modes :
     *   - Texte (searchText) : si `query` est renseigné
     *   - Proximité (searchNearby) : si `query` est vide
     * Plusieurs types de lieux peuvent être recherchés en parallèle (Promise.all).
     * Les doublons (même `id`) sont filtrés via un Set.
     *
     * @param {Object} params
     * @param {string}   params.query      - Texte de recherche libre (peut être vide)
     * @param {string[]} params.placeTypes - Types de lieux à rechercher (ex. ['restaurant'])
     * @param {number}   params.radius     - Rayon de recherche en mètres
     */
    const handleSearch = useCallback(async ({query, placeTypes, radius: r}) => {
        if (!userPos) {
            setError('Position introuvable. Autorisez la géolocalisation et rechargez.');
            return;
        }

        // Mise à jour des états avant la requête
        setRadius(r);
        setPlaceType(placeTypes[0]);
        setIsLoading(true);
        setError(null);
        setPlaces([]);
        setActivePlace(null);
        setSidebarOpen(false); // Ferme la sidebar mobile pendant le chargement

        try {
            const isText = query.trim().length > 0;

            // Choix de l'endpoint selon le mode de recherche
            const endpoint = isText
                ? 'https://places.googleapis.com/v1/places:searchText'
                : 'https://places.googleapis.com/v1/places:searchNearby';

            const headers = {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
                // FieldMask : liste des champs à retourner (optimise la facturation API)
                'X-Goog-FieldMask':
                    'places.id,places.displayName,places.formattedAddress,places.location,' +
                    'places.rating,places.userRatingCount,places.currentOpeningHours,' +
                    'places.priceLevel,places.internationalPhoneNumber,places.websiteUri,places.primaryType',
            };

            // Construction d'une requête par type de lieu, lancées en parallèle
            const requests = placeTypes.map((type) => {
                const body = isText
                    ? {
                        textQuery: query.trim(),
                        includedType: type,
                        maxResultCount: 20,
                        // Zone de biais : privilégie les résultats proches de l'utilisateur
                        locationBias: { circle: { center: {latitude: userPos.lat, longitude: userPos.lng}, radius: r } },
                    }
                    : {
                        includedTypes: [type],
                        maxResultCount: 20,
                        // Zone stricte : seuls les lieux dans le rayon sont retournés
                        locationRestriction: { circle: { center: {latitude: userPos.lat, longitude: userPos.lng}, radius: r } },
                    };
                return fetch(endpoint, {method: 'POST', headers, body: JSON.stringify(body)});
            });

            const responses = await Promise.all(requests);

            // Vérification des erreurs HTTP sur chaque réponse
            for (const res of responses) {
                if (!res.ok) {
                    const e = await res.json();
                    setError(`Erreur : ${e.error?.message || res.status}`);
                    return;
                }
            }

            // Décodage JSON de toutes les réponses
            const dataAll = await Promise.all(responses.map((r) => r.json()));

            // Fusion et dédoublonnage des lieux par leur identifiant unique
            const seen = new Set();
            const allPlaces = dataAll
                .flatMap((d) => d.places || [])
                .filter((p) => {
                    if (seen.has(p.id)) return false;
                    seen.add(p.id);
                    return true;
                });

            setPlaces(allPlaces);

            if (!allPlaces.length) setError('Aucun lieu trouvé dans ce rayon.');
        } catch (e) {
            setError(`Erreur réseau : ${e.message}`);
        } finally {
            setIsLoading(false);
        }
    }, [userPos]);

    /**
     * Recentre la carte sur une adresse saisie manuellement dans LocationSearch.
     * Réinitialise les résultats de recherche précédents.
     *
     * @param {Object} params
     * @param {number} params.lat   - Latitude du point
     * @param {number} params.lng   - Longitude du point
     * @param {string} params.label - Libellé de l'adresse (affiché sur le marqueur)
     */
    const handleLocate = useCallback(({lat, lng, label}) => {
        setLocatedPoint({lat, lng, label}); // Affiche un marqueur sur l'adresse trouvée
        setMapCenter({lat, lng});
        setMapKey(`loc-${lat},${lng}`);     // Force le re-rendu de la carte sur ce point
        setUserPos({lat, lng});             // Utilise ce point comme centre des prochaines recherches
        setPlaces([]);
        setActivePlace(null);
        setError(null);
    }, []);

    return (
        /* APIProvider fournit le contexte Google Maps (clé API + librairies) à tous les composants enfants */
        <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY} libraries={['places']} apiOptions={{loading: 'async'}}>
            {/* Conteneur principal : flex row sur desktop, plein écran en tenant compte de la navbar (50px) */}
            <div className="relative flex flex-col md:flex-row w-screen h-[calc(100vh-50px)] mt-[50px] overflow-hidden bg-bleu-sombre text-bleu">

                {/* ══ OVERLAY : fond semi-transparent derrière la sidebar sur mobile ══ */}
                {sidebarOpen && (
                    <div
                        className="fixed inset-0 bg-bleu-sombre/70 z-20 md:hidden"
                        onClick={() => setSidebarOpen(false)} // Clic sur l'overlay ferme la sidebar
                    />
                )}

                {/* ══ SIDEBAR : panneau latéral de recherche et de résultats ══
                    - Sur mobile : drawer qui remonte depuis le bas (translate-y)
                    - Sur desktop : panneau fixe à gauche de la carte               */}
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
                    {/* Poignée visuelle du drawer (mobile uniquement) */}
                    <div className="md:hidden flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 bg-orange-employe/40 rounded-full"/>
                    </div>

                    {/* Zone de contenu scrollable de la sidebar */}
                    <div className="flex-1 overflow-y-auto px-4 py-3 md:py-4
                                    [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]">

                        {/* Recherche d'adresse (géocodage) */}
                        <LocationSearch onLocate={handleLocate}/>

                        {/* Panneau de filtres : type de lieu, rayon, bouton rechercher */}
                        <SearchPanel onSearch={handleSearch} isLoading={isLoading} onRadiusChange={setRadius}/>

                        {/* Affichage conditionnel du message d'erreur */}
                        {error && (
                            <div className="mt-2.5 px-3 py-2.5 bg-orange-employe/15 border border-orange-employe/50
                                            rounded-lg text-orange-employe text-xs leading-relaxed">
                                {error}
                            </div>
                        )}

                        {/* Liste des lieux trouvés ; null si aucun résultat (évite l'affichage d'une liste vide) */}
                        <ResultsList
                            places={places.length > 0 ? places : null}
                            onSelectPlace={(p) => { setActivePlace(p); setSidebarOpen(false); }}
                            activePlace={activePlace}
                        />
                    </div>
                </aside>

                {/* ══ CARTE GOOGLE MAPS ══ */}
                <div className="flex-1 relative h-full">
                    {/* Changement de clé = re-montage = recentrage sur la nouvelle position */}
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
                        {/* Marqueurs et cercle de rayon */}
                        <MapContent
                            userPos={userPos} places={places}
                            activePlace={activePlace} setActivePlace={setActivePlace}
                            radius={radius} locatedPoint={locatedPoint} placeType={placeType}
                        />
                    </Map>

                    {/* Fiche détaillée du lieu sélectionné (superposée à la carte) */}
                    {activePlace && <MapInfoCard place={activePlace} onClose={() => setActivePlace(null)}/>}

                    {/* ══ BOUTON TOGGLE SIDEBAR (mobile uniquement) ══
                        Affiche aussi un badge avec le nombre de résultats               */}
                    <div className="md:hidden fixed bottom-6 right-4 z-40 flex items-center gap-2">
                        {/* Badge rouge indiquant le nombre de lieux trouvés */}
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
