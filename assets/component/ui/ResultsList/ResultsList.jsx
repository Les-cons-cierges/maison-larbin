import PlaceCard from "../PlaceCard/PlaceCard";

const ResultsList = ({ places, onSelectPlace, activePlace }) => {
    if (!places) return null;

    return (
        <div className="mt-3 pt-3 border-t border-orange-employe/15">
            <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-bold text-orange-employe uppercase tracking-widest">
          {places.length > 0 ? `${places.length} résultat${places.length > 1 ? 's' : ''}` : 'Aucun résultat'}
        </span>
            </div>
            <div className="flex flex-col gap-2 md:max-h-96 overflow-y-auto pr-1
                      [scrollbar-width:thin] [scrollbar-color:--color-orange-employe_transparent]">
                {places.map((place, i) => (
                    <PlaceCard
                        key={place.id || i}
                        place={place}
                        onClick={onSelectPlace}
                        isActive={activePlace?.id === place.id}
                    />
                ))}
            </div>
        </div>
    );
};

export default ResultsList;
