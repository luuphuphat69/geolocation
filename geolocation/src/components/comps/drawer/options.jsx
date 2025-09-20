import { useAppOptions } from "../../../AppOptionsContext";
export const Options = () => {

    const { isCelciusUnit, setIsCelciusUnit, showCurrentCard, setShowCurrentCard } = useAppOptions();
    return (
        <div className="p-3">
            <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-bold text-slate-700">Options</h4>
            </div>

            <div className="space-y-3" id="optionsList">
                {/* Toggle current weather card */}
                <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition">
                    <span className="text-[13px] text-slate-700">
                        Show current weather card
                    </span>
                    <button
                        id="optToggleCurrentCard"
                        type="button"
                        onClick={() => setShowCurrentCard(!showCurrentCard)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${showCurrentCard ? "bg-indigo-500" : "bg-slate-300"
                            }`}
                        aria-pressed={showCurrentCard}
                    >
                        <span className="sr-only">Toggle current card</span>
                        <span
                            className={`dot inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition ${showCurrentCard ? "translate-x-5" : "translate-x-0"
                                }`}
                        ></span>
                    </button>
                </label>

                {/* Toggle Celsius */}
                <label className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-slate-200 hover:bg-slate-50 transition">
                    <span className="text-[13px] text-slate-700">Use Celsius</span>
                    <button
                        id="optToggleCelsius"
                        type="button"
                        onClick={() => setIsCelciusUnit(!isCelciusUnit)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${isCelciusUnit ? "bg-blue-500" : "bg-slate-300"
                            }`}
                        aria-pressed={isCelciusUnit}
                    >
                        <span className="sr-only">Toggle Celsius</span>
                        <span
                            className={`dot inline-block h-5 w-5 transform rounded-full bg-white shadow ring-1 ring-black/5 transition ${isCelciusUnit ? "translate-x-5" : "translate-x-0"
                                }`}
                        ></span>
                    </button>
                </label>
            </div>
        </div>
    );
};