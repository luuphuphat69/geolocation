import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogTitle,
} from "@/components/ui/dialog";
import { getLocation } from "../../utilities/api/api";
import "../../css/result.css";
import WeatherCard2 from "../weather-card/page/weathercard2";
import { AddToFavoriteButton } from "./components/addtoFavoriteBtn";

const Result2 = () => {
    const columns = [
        { id: "action", label: "Action", disableSort: true, disableFilter: true },
        { id: "city", label: "City" },
        { id: "state", label: "State / Province" },
        { id: "country", label: "Country" },
        { id: "latitude", label: "Latitude" },
        { id: "longitude", label: "Longitude" },
    ];
    const numericColumns = ["latitude", "longitude"];

    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("city");

    const [data, setData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [filterColumn, setFilterColumn] = useState("city_name");
    const [filterValue, setFilterValue] = useState("");
    const [favorites, setFavorites] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const { toast } = useToast()

    // Load favorites once
    useEffect(() => {
        const saved = JSON.parse(localStorage.getItem("favorites") || "[]");
        setFavorites(saved);
        setLoaded(true);
    }, []);

    // Sync on change
    useEffect(() => {
        if (loaded) {
            localStorage.setItem("favorites", JSON.stringify(favorites));
        }
    }, [favorites, loaded]);

    useEffect(() => {
        if (query) {
            setSearchTerm(query);
            fetchData(query);
        }
    }, [query]);

    const fetchData = async (term) => {
        setLoading(true);
        try {
            const response = await getLocation(term);
            setData(response.data);
            setFilteredData(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Apply filtering and sorting
    useEffect(() => {
        let temp = [...data];

        // Filtering
        Object.entries(filters).forEach(([col, val]) => {
            temp = temp.filter((item) =>
                item[col]?.toString().toLowerCase().includes(val.toLowerCase())
            );
        });

        // Sorting
        if (sort) {
            temp.sort((a, b) => {
                const aVal = a[sort.column];
                const bVal = b[sort.column];
                if (aVal < bVal) return sort.direction === "asc" ? -1 : 1;
                if (aVal > bVal) return sort.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        setFilteredData(temp);
    }, [filters, sort, data]);

    const applyFilter = () => {
        if (!filterValue.trim()) return;
        setFilters({ ...filters, [filterColumn]: filterValue.trim() });
        setFilterValue("");
    };

    const resetFilters = () => {
        setFilters({});
        setSort(null);
    };

    const removeFilter = (column) => {
        const newFilters = { ...filters };
        delete newFilters[column];
        setFilters(newFilters);
    };

    const removeSort = () => setSort(null);

    const handleSort = (column) => {
        let direction = "asc";
        if (sort?.column === column && sort.direction === "asc") {
            direction = "desc";
        }
        setSort({ column, direction });
    };

    const handleCloseDialog = () => {
        setSelectedRow(null);
    };

    const handleRowClick = (row) => {
        setSelectedRow(row);
    };

    // toggle favorite ---
    const toggleFavorite = (item) => {
        const exists = favorites.find(
            (fav) =>
                fav.name === item.name &&
                fav.latitude === item.latitude &&
                fav.longitude === item.longitude
        );

        if (exists) {
            setFavorites(favorites.filter((fav) => fav !== exists));
        } else {
            if (favorites.length >= 10) {
                toast({
                    title: "Limit reached",
                    description: "You can only have up to 10 favorites.",
                    variant: "destructive",
                    action: (
                        <ToastAction altText="Goto schedule to undo">OK</ToastAction>
                    )
                });
                return;
            }
            setFavorites([
                ...favorites,
                { name: item.name, latitude: item.latitude, longitude: item.longitude },
            ]);
        }
    };

    // check if favorite
    const isFavorite = (item) =>
        favorites.some(
            (fav) =>
                fav.name === item.name &&
                fav.latitude === item.latitude &&
                fav.longitude === item.longitude
        );
    return (
        <div className="result-container">
            <h1 className="page-title">Results with: {searchTerm}</h1>
            <p className="page-description">Click on a city to view detailed weather information</p>

            {/* Filter Controls */}
            <div className="filter-controls">
                <div className="filter-input">
                    <select
                        className="filter-select"
                        value={filterColumn}
                        onChange={(e) => setFilterColumn(e.target.value)}
                    >
                        {columns
                            .filter((col) => !col.disableFilter)
                            .map((col) => (
                                <option key={col.id} value={col.id}>
                                    {col.label}
                                </option>
                            ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Filter value..."
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                    <button onClick={applyFilter} className="filter-button">
                        Apply Filter
                    </button>
                </div>
                <button onClick={resetFilters} className="reset-button">
                    Reset All
                </button>
            </div>

            {/* Active Filters */}
            <div className="active-filters">
                {Object.entries(filters).map(([col, val]) => (
                    <div key={col} className="filter-tag">
                        <span className="filter-tag-label">{col}:</span>
                        <span className="filter-tag-value">{val}</span>
                        <span className="remove-filter" onClick={() => removeFilter(col)}>
                            ×
                        </span>
                    </div>
                ))}
                {sort && (
                    <div className="filter-tag sort-tag">
                        <span className="filter-tag-label">Sort:</span>
                        <span className="filter-tag-value">
                            {sort.column} (
                            {numericColumns.includes(sort.column)
                                ? sort.direction === "asc"
                                    ? "Lowest → Highest"
                                    : "Highest → Lowest"
                                : sort.direction === "asc"
                                    ? "A → Z"
                                    : "Z → A"}
                            )
                        </span>

                        <span className="remove-filter" onClick={removeSort}>
                            ×
                        </span>
                    </div>
                )}
            </div>

            {/* Table */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <table className="city-table">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th
                                    key={col.id}
                                    className={
                                        col.disableSort
                                            ? ""
                                            : `sortable ${sort?.column === col.id
                                                ? sort.direction === "asc"
                                                    ? "sort-asc"
                                                    : "sort-desc"
                                                : ""
                                            }`
                                    }
                                    onClick={() => !col.disableSort && handleSort(col.id)}
                                >
                                    {col.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length} className="no-results">
                                    No matching records found
                                </td>
                            </tr>
                        ) : (
                            filteredData.map((item, idx) => (
                                <tr key={idx} onClick={() => handleRowClick(item)}>
                                    <td width="10px" onClick={(e) => e.stopPropagation()}>
                                        <AddToFavoriteButton
                                            item={item}
                                            isFavorite={isFavorite(item)}
                                            onToggle={toggleFavorite}
                                        />
                                    </td>

                                    <td>{item.name}</td>
                                    <td>{item.state_name}</td>
                                    <td>{item.country_name}</td>
                                    <td>{item.latitude}</td>
                                    <td>{item.longitude}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            )}
            <Dialog open={!!selectedRow} onOpenChange={handleCloseDialog}>
                <DialogContent className="max-w-[550px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Weather for {selectedRow?.name}</DialogTitle>
                        <DialogDescription>
                            Detailed weather forecast for selected location.
                        </DialogDescription>
                    </DialogHeader>
                    {selectedRow && (
                        <WeatherCard2
                            city={selectedRow?.name}
                            lat={selectedRow?.latitude}
                            long={selectedRow?.longitude}
                        />
                    )}
                </DialogContent>
            </Dialog>
            <Toaster />
        </div>
    );
};

export default Result2;