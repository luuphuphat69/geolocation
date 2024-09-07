import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import CircularProgress from '@mui/material/CircularProgress';
import WeatherCard from "../components/weather-popup";
import Dialog from '@mui/material/Dialog';

const Result = () => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);
    const { state } = useLocation();
    const { query } = state;

    const getData = () => {
        if (!query) {
            console.error("Query is empty or undefined");
            return;
        }
        setLoading(true);
        axios.get(`http://localhost:3000/v1/result?queries=${query}`)
            .then(response => {
                const transformedData = response.data.map(record => createData(record));
                setData(transformedData);
                setLoading(false);
            }).catch(err => {
                console.log(err);
                setLoading(false);
            });
    }

    useEffect(() => {
        getData();
    }, [query]);

    const columns = [
        { id: 'id', label: 'ID', minWidth: 100 },
        { id: 'name', label: 'City', minWidth: 100 },
        { id: 'state_name', label: 'State / Provinces', minWidth: 100 },
        { id: 'country_name', label: 'Country', minWidth: 100 },
        { id: 'latitude', label: 'Latitude', minWidth: 100 },
        { id: 'longitude', label: 'Longitude', minWidth: 100 }
    ];

    function createData(record) {
        return {
            id: record.id,
            name: record.name,
            state_name: record.state_name,
            country_name: record.country_name,
            latitude: record.latitude,
            longitude: record.longitude
        };
    }

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const handleClick = (row) => {
        setSelectedRow(row);  // Set the clicked row data
    };

    const handleClose = () => {
        setSelectedRow(null);  // Close the popup
    };

    return (
        <div style={{ position: 'absolute', top: '10%', left: '0px', right: '0px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                style={{ minWidth: column.minWidth, fontWeight: 'bold' }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
                                                    return (
                                                        <TableCell key={column.id} onClick={() => handleClick(row)}>
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        <TablePagination
                            rowsPerPageOptions={[10, 25, 100]}
                            component="div"
                            count={data.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                        />
                    </Paper>
                )}
            </div>

            <Dialog open={!!selectedRow} onClose={handleClose}>
                {selectedRow && <WeatherCard value={selectedRow} />}
            </Dialog>
        </div>
    );
}
export default Result;