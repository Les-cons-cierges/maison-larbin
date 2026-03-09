import PlaceCard from "../PlaceCard/PlaceCard";

/**
 * Composant ResultsList
 * Affiche la liste des lieux retournés par la recherche Google Places.
 *
 * Props :
 *  - places       : tableau des lieux à afficher
 *  - onSelectPlace: fonction appelée quand l'utilisateur clique sur une carte
 *  - activePlace  : le lieu actuellement sélectionné (pour le mettre en surbrillance)
 */
const ResultsList = ({ places, onSelectPlace, activePlace }) => {
    // Si aucun résultat n'est encore disponible, on n'affiche rien
    if (!places) return null;

    return (
        // Conteneur principal séparé du reste par une bordure supérieure
        <div className="mt-3 pt-3 border-t border-orange-employe/15">

            {/* En-tête : affiche le nombre de résultats ou "Aucun résultat" */}
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-orange-employe uppercase tracking-widest">
                    {places.length > 0
                        ? `${places.length} résultat${places.length > 1 ? 's' : ''}` // pluriel automatique
                        : 'Aucun résultat'}
                </span>
            </div>

            {/*
              Liste scrollable des cartes de lieux.
              - Sur mobile : hauteur libre
              - Sur desktop (md) : hauteur max 384px avec scroll vertical
              - Scrollbar discrète via les propriétés CSS personnalisées
            */}
            <div className="flex flex-col gap-2 md:max-h-96 overflow-y-auto pr-1
                      [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]">
                {places.map((place, i) => (
                    <PlaceCard
                        key={place.id || i}  // clé unique : id du lieu ou index en fallback
                        place={place}        // données complètes du lieu (nom, adresse, note…)
                        onClick={onSelectPlace} // remonte la sélection au composant parent
                        isActive={activePlace?.id === place.id} // true si ce lieu est actuellement sélectionné
                    />
                ))}
            </div>
        </div>
    );
};

export default ResultsList;
