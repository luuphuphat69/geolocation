import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { getLocation } from "../ultilities/api/api";
import "../css/result.css";

const Result2 = () => {
    const columns = [
        { id: "city_name", label: "City" },
        { id: "state_name", label: "State / Province" },
        { id: "country_name", label: "Country" },
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
    const [filters, setFilters] = useState({});
    const [sort, setSort] = useState(null);
    const [filterColumn, setFilterColumn] = useState("city_name");
    const [filterValue, setFilterValue] = useState("");

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
            temp = temp.filter(item =>
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

    return (
        <div className="result-container">
            <h1 className="page-title">Results with: {searchTerm}</h1>
            <p className="page-description">Click on a city to view detailed weather information</p>

            <div className="filter-controls">
                <div className="filter-input">
                    <select
                        className="filter-select"
                        value={filterColumn}
                        onChange={(e) => setFilterColumn(e.target.value)}
                    >
                        {columns.map(col => (
                            <option key={col.id} value={col.id}>{col.label}</option>
                        ))}
                    </select>
                    <input
                        type="text"
                        placeholder="Filter value..."
                        value={filterValue}
                        onChange={(e) => setFilterValue(e.target.value)}
                    />
                    <button onClick={applyFilter} className="filter-button">Apply Filter</button>
                </div>
                <button onClick={resetFilters} className="reset-button">Reset All</button>
            </div>

            <div className="active-filters">
                {Object.entries(filters).map(([col, val]) => (
                    <div key={col} className="filter-tag">
                        <span className="filter-tag-label">{col}:</span>
                        <span className="filter-tag-value">{val}</span>
                        <span className="remove-filter" onClick={() => removeFilter(col)}>×</span>
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

                        <span className="remove-filter" onClick={removeSort}>×</span>
                    </div>
                )}
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-8 w-8 animate-spin" />
                </div>
            ) : (
                <table className="city-table">
                    <thead>
                        <tr>
                            {columns.map(col => (
                                <th
                                    key={col.id}
                                    className={`sortable ${sort?.column === col.id
                                            ? sort.direction === "asc"
                                                ? "sort-asc"
                                                : "sort-desc"
                                            : ""
                                        }`}
                                    onClick={() => handleSort(col.id)}
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
                                <tr key={idx}>
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
        </div>
    );
};

export default Result2;
