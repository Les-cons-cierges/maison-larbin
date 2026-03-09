/**
 * Composant PlaceCard
 * Carte cliquable représentant un lieu retourné par l'API Google Places.
 * Affiche le nom, l'adresse, la note en étoiles et le statut ouvert/fermé.
 *
 * Props :
 *  - place    : objet lieu Google Places (displayName, formattedAddress, rating…)
 *  - onClick  : fonction appelée au clic → remonte le lieu sélectionné au parent
 *  - isActive : booléen — true si ce lieu est actuellement sélectionné (style surbrillance)
 */
const PlaceCard = ({ place, onClick, isActive }) => {
    const rating = place.rating;
    // Arrondit la note pour afficher le bon nombre d'étoiles pleines (ex: 4.3 → 4 étoiles)
    const stars  = rating ? Math.round(rating) : 0;

    return (
        <div
            onClick={() => onClick(place)} // remonte le lieu cliqué au composant parent
            className={`bg-bleu-sombre border rounded-xl px-3 py-2.5 cursor-pointer text-sm
                  transition-all duration-200
                  ${isActive
                // Style actif : bordure orange + fond légèrement plus clair + halo
                ? 'border-orange-employe bg-bleu-mid shadow-[0_0_0_2px_rgba(231,111,81,0.2)]'
                // Style inactif : bordure discrète + effet hover (léger décalage vers la droite)
                : 'border-orange-employe/20 hover:border-orange-employe/60 hover:bg-bleu-mid hover:translate-x-0.5'}`}
        >
            {/* Nom du lieu — tronqué avec "…" si trop long */}
            <div className="font-bold text-bleu mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {place.displayName?.text || place.name}
            </div>

            {/* Adresse — affichée uniquement si disponible */}
            {place.formattedAddress && (
                <div className="text-bleu text-xs mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    📍 {place.formattedAddress}
                </div>
            )}

            {/* Note — affichée uniquement si disponible */}
            {rating && (
                <div className="flex items-center gap-1.5 mb-1">
                    {/* Étoiles pleines (★) puis vides (☆) selon la note arrondie */}
                    <span className="text-orange-employe text-xs tracking-tighter">
                        {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
                    </span>
                    {/* Note décimale (ex: 4.3) */}
                    <span className="text-orange-employe font-bold text-xs">{rating.toFixed(1)}</span>
                    {/* Nombre d'avis entre parenthèses */}
                    {place.userRatingCount && (
                        <span className="text-bleu text-xs">({place.userRatingCount})</span>
                    )}
                </div>
            )}

            {/* Statut ouvert/fermé — vert si ouvert, orange si fermé */}
            {place.currentOpeningHours && (
                <div className={`text-xs font-semibold ${place.currentOpeningHours.openNow ? 'text-emerald-300' : 'text-orange-employe'}`}>
                    {place.currentOpeningHours.openNow ? '✅ Ouvert' : '❌ Fermé'}
                </div>
            )}
        </div>
    );
};

export default PlaceCard;
