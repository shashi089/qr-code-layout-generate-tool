import { useState } from 'react';
import {
    Box,
    TextField,
    InputAdornment,
    Paper,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import type { GridColDef, GridValidRowModel } from '@mui/x-data-grid';
import { Search } from 'lucide-react';

interface ReusableTableProps<T extends GridValidRowModel> {
    rows: T[];
    columns: GridColDef[];
    loading?: boolean;
    searchFields: (keyof T)[];
}

export function ReusableTable<T extends GridValidRowModel>({
    rows,
    columns,
    loading = false,
    searchFields,
}: ReusableTableProps<T>) {
    const [searchText, setSearchText] = useState('');

    const filteredRows = rows.filter((row) => {
        return searchFields.some((field) => {
            const value = row[field as string];
            return String(value).toLowerCase().includes(searchText.toLowerCase());
        });
    });

    return (
        <Paper sx={{ width: '100%', mb: 2, p: 2, borderRadius: 2 }}>
            <Box sx={{ mb: 2 }}>
                <TextField
                    fullWidth
                    variant="outlined"
                    placeholder="Search..."
                    size="small"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search size={18} />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={filteredRows}
                    columns={columns}
                    loading={loading}
                    initialState={{
                        pagination: {
                            paginationModel: { pageSize: 5 },
                        },
                    }}
                    pageSizeOptions={[5, 10, 25]}
                    disableRowSelectionOnClick
                    sx={{
                        border: 0,
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#f5f5f5',
                            fontWeight: 'bold',
                        },
                    }}
                />
            </Box>
        </Paper>
    );
}
