// ─── PricingCard ──────────────────────────────────────────────────────────────
// Props :
//   name        string   — Nom du plan (ex: "PME")
//   employeesLabel string — Label employés (ex: "1 à 50 employés")
//   subtitle    string   — Sous-titre
//   monthlyPrice number  — Prix mensuel
//   annualPrice  number  — Prix annuel affiché
//   annualOldPrice number — Ancien prix annuel (barré)
//   features    string[] — Liste des fonctionnalités
//   highlighted boolean  — Style mis en avant (fond noir)
//   onSubscribe  fn      — Callback bouton

function CheckIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

function BuildingIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M3 9h18M9 21V9M15 21V9" />
        </svg>
    );
}

export function PricingCard ({
    name = "PME",
    employeesLabel = "1 à 50 employés",
    subtitle = "Idéal pour les petites et moyennes structures",
    monthlyPrice = 499,
    annualPrice = 5489,
    annualOldPrice = 5988,
    features = [
        "Accès plateforme employés",
        "Pallier Cadres disponible",
        "Support par email",
        "Onboarding inclus",
        "Facturation mensuelle ou annuelle",
    ],
    highlighted = false,
    onSubscribe,
}) {
    const bg = highlighted ? "bg-black text-white" : "bg-white text-black";
    const border = highlighted ? "border-transparent" : "border-gray-200";
    const subtitleColor = highlighted ? "text-gray-400" : "text-gray-500";
    const featureColor = highlighted ? "text-gray-200" : "text-gray-700";
    const checkColor = highlighted ? "text-white" : "text-black";
    const dividerColor = highlighted ? "border-gray-700" : "border-gray-100";
    const btnBg = highlighted
        ? "bg-white text-black hover:bg-gray-100"
        : "bg-white text-black border border-gray-200 hover:border-black";
    const annualColor = highlighted ? "text-gray-400" : "text-gray-500";
    const oldPriceColor = highlighted ? "text-gray-500" : "text-gray-400";
    const iconBg = highlighted ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600";

    return (
        <div
            className={`${bg} border ${border} rounded-2xl p-7 flex flex-col gap-6 w-full max-w-sm shadow-sm`}
        >
            {/* Header */}
            <div className="flex flex-col gap-3">
                <h3 className="text-xl font-bold">{name}</h3>

                {/* Employees badge */}
                <div className={`flex items-center gap-2 ${iconBg} w-fit px-3 py-1.5 rounded-lg`}>
                    <BuildingIcon />
                    <span className="text-sm font-semibold">{employeesLabel}</span>
                </div>

                <p className={`text-sm ${subtitleColor}`}>{subtitle}</p>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-black">{monthlyPrice}€</span>
                    <span className={`text-sm ${subtitleColor}`}>/mois</span>
                </div>
                <p className={`text-xs ${annualColor}`}>
                    Ou {annualPrice.toLocaleString("fr-FR")}€ annuel au lieu de{" "}
                    <span className={`line-through ${oldPriceColor}`}>
                        {annualOldPrice.toLocaleString("fr-FR")}€
                    </span>{" "}
                    !
                </p>
            </div>

            {/* Divider */}
            <hr className={`border-t ${dividerColor}`} />

            {/* Features */}
            <ul className="flex flex-col gap-3">
                {features.map((feature) => (
                    <li key={feature} className="flex items-center gap-3">
                        <span className={`flex-shrink-0 ${checkColor}`}>
                            <CheckIcon />
                        </span>
                        <span className={`text-sm ${featureColor}`}>{feature}</span>
                    </li>
                ))}
            </ul>

            {/* CTA */}
            <button
                onClick={onSubscribe}
                className={`mt-auto w-full py-3.5 rounded-xl text-sm font-semibold transition-colors duration-200 ${btnBg}`}
            >
                Souscrire
            </button>
        </div>
    );
}

export default PricingCard;

