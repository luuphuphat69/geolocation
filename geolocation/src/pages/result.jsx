import React, { useState, useEffect } from "react"
import { useLocation} from "react-router-dom"
import { Toaster } from "@/components/ui/toaster"
import axios from "axios"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Loader2, Search } from "lucide-react"
import WeatherCard from "../components/comps/weathercard"
import WeatherCard2
 from "../components/comps/weathercard2"
const columns = [
  { id: "name", label: "City" },
  { id: "state_name", label: "State / Province" },
  { id: "country_name", label: "Country" },
  { id: "latitude", label: "Latitude" },
  { id: "longitude", label: "Longitude" },
]

export default function Result() {
  const [page, setPage] = useState(1)
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedRow, setSelectedRow] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const location = useLocation()
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("city");

  const rowsPerPage = 10
  const totalPages = Math.ceil(data.length / rowsPerPage)

  useEffect(() => {
    if (query) {
      setSearchTerm(query)
      getData(query)
    }
  }, [query])

  const getData = async (term) => {
    if (!term) {
      console.error("Query is empty or undefined")
      return
    }
    setLoading(true)
    try {
      const response = await axios.get(`http://localhost:3000/v1/location?queries=${term}`)
      setData(response.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handlePageChange = (newPage) => {
    setPage(newPage)
  }

  const handleRowClick = (row) => {
    setSelectedRow(row)
  }

  const handleCloseDialog = () => {
    setSelectedRow(null)
  }

  const handleSearch = () => {
    getData(searchTerm)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-2xl">Search Results for &quot;{searchTerm}&quot;</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <Input
              type="text"
              placeholder="Search locations..."
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  setSearchTerm(e.target.value);
                  handleSearch();
                }
              }}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={handleSearch}>
              <Search className="mr-2 h-4 w-4" /> Search
            </Button>
          </div>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      {columns.map((column) => (
                        <TableHead key={column.id}>{column.label}</TableHead>
                      ))}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data
                      .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                      .map((row) => (
                        <TableRow
                          key={row.id}
                          onClick={() => handleRowClick(row)}
                          className="cursor-pointer hover:bg-muted"
                        >
                          {columns.map((column) => (
                            <TableCell key={column.id}>{row[column.id]}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                  </TableBody>
                </Table>
              </div>
              <Pagination className="mt-4">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => handlePageChange(page - 1)}
                      disabled={page === 1}
                    />
                  </PaginationItem>
                  {[...Array(totalPages)].map((_, index) => (
                    <PaginationItem key={index}>
                      <PaginationLink
                        onClick={() => handlePageChange(index + 1)}
                        isActive={page === index + 1}
                      >
                        {index + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext
                      onClick={() => handlePageChange(page + 1)}
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </>
          )}
        </CardContent>
      </Card>
      <Dialog open={!!selectedRow} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Weather for {selectedRow?.name}</DialogTitle>
          </DialogHeader>
          {selectedRow && <WeatherCard2 city={selectedRow?.name} lat={selectedRow?.latitude} long={selectedRow?.longitude} />}
        </DialogContent>
      </Dialog>
      <Toaster/>
    </div>
  )
}