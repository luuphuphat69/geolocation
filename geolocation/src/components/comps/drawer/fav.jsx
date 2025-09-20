export const Fav = ({favourites}) => {
    return (
        <div className="p-3">
              <h4 class="text-sm font-bold text-slate-700">Favourites</h4>
            <div className="space-y-2">
                {favourites.length === 0 ? (
                    <p className="text-xs text-slate-400">No favourites yet.</p>
                ) : (
                    favourites.map((d, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onSelectCity(d.city)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50/60 transition text-left"
                        >
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                {d.city[0]}
                            </span>
                            <span className="text-sm text-slate-800">
                                {d.city}, <span className="text-slate-500">{d.country}</span>
                            </span>
                            <span className="ml-auto text-sm text-indigo-700 font-semibold">
                                {d.current.temp}°
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    )
}