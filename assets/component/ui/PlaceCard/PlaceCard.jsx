const PlaceCard = ({ place, onClick, isActive }) => {
    const rating = place.rating;
    const stars  = rating ? Math.round(rating) : 0;

    return (
        <div
            onClick={() => onClick(place)}
            className={`bg-bleu-sombre border rounded-xl px-3 py-2.5 cursor-pointer text-sm
                  transition-all duration-200
                  ${isActive
                ? 'border-orange-employe bg-bleu-mid shadow-[0_0_0_2px_rgba(231,111,81,0.2)]'
                : 'border-orange-employe/20 hover:border-orange-employe/60 hover:bg-bleu-mid hover:translate-x-0.5'}`}
        >
            <div className="font-bold text-bleu mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                {place.displayName?.text || place.name}
            </div>
            {place.formattedAddress && (
                <div className="text-bleu text-xs mb-1 whitespace-nowrap overflow-hidden text-ellipsis">
                    📍 {place.formattedAddress}
                </div>
            )}
            {rating && (
                <div className="flex items-center gap-1.5 mb-1">
          <span className="text-orange-employe text-xs tracking-tighter">
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
          </span>
                    <span className="text-orange-employe font-bold text-xs">{rating.toFixed(1)}</span>
                    {place.userRatingCount && (
                        <span className="text-bleu text-xs">({place.userRatingCount})</span>
                    )}
                </div>
            )}
            {place.currentOpeningHours && (
                <div className={`text-xs font-semibold ${place.currentOpeningHours.openNow ? 'text-emerald-300' : 'text-orange-employe'}`}>
                    {place.currentOpeningHours.openNow ? '✅ Ouvert' : '❌ Fermé'}
                </div>
            )}
        </div>
    );
};

export default PlaceCard;
