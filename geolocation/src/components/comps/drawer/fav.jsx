import { useEffect, useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import WeatherCard2 from "../../../pages/weathercard2";

export const Fav = () => {
    const [favourites, setFavourites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showDialog, setShowDialog] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState(null);

    useEffect(() => {
        const loadFavs = () => {
            try {
                const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
                setFavourites(saved);
            } catch (e) {
                console.error("Error parsing favourites:", e);
                setFavourites([]);
            }
            setLoading(false);
        };

        loadFavs();
    }, []);

    const onSelectCity = (city) => {
        setShowDialog(!showDialog);
        setSelectedLocation(city);
    }
    const handleCloseDialog = () => {
        setSelectedLocation(null)
    }

    return (
        <div className="p-3">
            <h4 className="text-sm font-bold text-slate-700">Favourites</h4>
            <div className="space-y-2">
                {loading ? (
                    <p className="text-xs text-slate-400 italic">Loading favourites…</p>
                ) : favourites.length === 0 ? (
                    <p className="text-xs text-slate-400">No favourites yet.</p>
                ) : (
                    favourites.map((d, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => onSelectCity(d)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg border border-transparent hover:border-indigo-200 hover:bg-indigo-50/60 transition text-left"
                        >
                            <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-semibold">
                                {d.name[0]}
                            </span>
                            <span className="text-sm text-slate-800">
                                {d.name}
                            </span>
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};
