import { useEffect, useState, useRef, useMemo } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Stack,
    Divider,
} from '@mui/material';
import { Plus, Trash, Edit2, Download, Printer, FileDown, Database } from 'lucide-react';
import { StickerPrinter } from 'qrlayout-core';
import { exportToPDF } from 'qrlayout-core/pdf';
import type { SavedLayout, EntityType } from '../types';
import { ReusableTable } from '../components/ReusableTable';
import type { GridColDef } from '@mui/x-data-grid';
import { ENTITY_SCHEMAS } from '../entitySchemas';

interface MasterModuleProps {
    type: EntityType;
    icon?: React.ReactNode;
}

export function MasterModule({ type, icon }: MasterModuleProps) {
    const schema = ENTITY_SCHEMAS[type];
    const [records, setRecords] = useState<any[]>([]);
    const [layouts, setLayouts] = useState<SavedLayout[]>([]);
    const [selectedLayoutId, setSelectedLayoutId] = useState<string>('');
    const [openDialog, setOpenDialog] = useState(false);
    const [currentRecord, setCurrentRecord] = useState<any | null>(null);
    const printer = useRef(new StickerPrinter());

    const storageKey = `master_data_${type}`;

    useEffect(() => {
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
            setRecords(JSON.parse(savedData));
        } else {
            // Initial sample record
            const defaults = [{ ...schema.sampleData, id: '1' }];
            setRecords(defaults);
            localStorage.setItem(storageKey, JSON.stringify(defaults));
        }

        const savedLayouts = localStorage.getItem('qr-layouts');
        if (savedLayouts) {
            const parsed: SavedLayout[] = JSON.parse(savedLayouts);
            // Only show layouts matching this entity type
            // Fallback: If no targetEntity is set, assume it's for employees (legacy support)
            const filtered = parsed.filter(l =>
                l.targetEntity === type || (!l.targetEntity && type === 'employee')
            );
            setLayouts(filtered);
            if (filtered.length > 0) setSelectedLayoutId(filtered[0].id);
        }
    }, [type, storageKey, schema.sampleData]);

    const saveRecord = () => {
        if (!currentRecord) return;
        const newRecords = records.find(r => r.id === currentRecord.id)
            ? records.map(r => r.id === currentRecord.id ? currentRecord : r)
            : [...records, { ...currentRecord, id: Date.now().toString() }];

        setRecords(newRecords);
        localStorage.setItem(storageKey, JSON.stringify(newRecords));
        setOpenDialog(false);
        setCurrentRecord(null);
    };

    const deleteRecord = (id: string) => {
        const newRecords = records.filter(r => r.id !== id);
        setRecords(newRecords);
        localStorage.setItem(storageKey, JSON.stringify(newRecords));
    };

    const handleExport = async (record: any, format: 'png' | 'pdf' | 'zpl') => {
        const layout = layouts.find(l => l.id === selectedLayoutId);
        if (!layout) return alert('Please select a layout first!');

        if (format === 'png') {
            const dataUrl = await printer.current.renderToDataURL(layout as any, record as any, { format: 'png' });
            const link = document.createElement('a');
            link.download = `label-${type}-${record.id}.png`;
            link.href = dataUrl;
            link.click();
        } else if (format === 'pdf') {
            const pdf = await exportToPDF(layout as any, [record as any]);
            pdf.save(`label-${type}-${record.id}.pdf`);
        } else if (format === 'zpl') {
            const zpl = printer.current.exportToZPL(layout as any, [record as any]);
            console.log('ZPL Code:', zpl[0]);
            alert('ZPL Code generated in console!');
        }
    };

    const columns: GridColDef[] = useMemo(() => {
        const cols: GridColDef[] = schema.fields.map(f => ({
            field: f.name,
            headerName: f.label,
            flex: 1
        }));

        cols.push({
            field: 'actions',
            headerName: 'Actions',
            width: 250,
            renderCell: (params) => (
                <Stack direction="row" spacing={1} sx={{ mt: 1 }}>
                    <IconButton onClick={() => { setCurrentRecord(params.row); setOpenDialog(true); }} size="small" color="primary">
                        <Edit2 size={16} />
                    </IconButton>
                    <IconButton onClick={() => deleteRecord(params.row.id)} size="small" color="error">
                        <Trash size={16} />
                    </IconButton>
                    <Divider orientation="vertical" flexItem />
                    <IconButton onClick={() => handleExport(params.row, 'png')} size="small" title="Export PNG">
                        <Download size={16} />
                    </IconButton>
                    <IconButton onClick={() => handleExport(params.row, 'pdf')} size="small" title="Export PDF">
                        <FileDown size={16} />
                    </IconButton>
                    <IconButton onClick={() => handleExport(params.row, 'zpl')} size="small" title="Export ZPL">
                        <Printer size={16} />
                    </IconButton>
                </Stack>
            ),
        });
        return cols;
    }, [schema.fields, type, selectedLayoutId, layouts]);

    const searchFields = useMemo(() => schema.fields.map(f => f.name), [schema.fields]);

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {icon || <Database size={32} />} {schema.label} Master
                </Typography>
                <Stack direction="row" spacing={2} alignItems="center">
                    <FormControl size="small" sx={{ minWidth: 200 }}>
                        <InputLabel>Select Print Layout</InputLabel>
                        <Select
                            value={selectedLayoutId}
                            label="Select Print Layout"
                            onChange={(e) => setSelectedLayoutId(e.target.value)}
                        >
                            {layouts.map(l => (
                                <MenuItem key={l.id} value={l.id}>{l.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" startIcon={<Plus />} onClick={() => {
                        const empty: any = { id: '' };
                        schema.fields.forEach(f => empty[f.name] = '');
                        setCurrentRecord(empty);
                        setOpenDialog(true);
                    }}>
                        Add {schema.label}
                    </Button>
                </Stack>
            </Box>

            <ReusableTable
                rows={records}
                columns={columns}
                searchFields={searchFields}
            />

            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
                <DialogTitle>{currentRecord?.id ? `Edit ${schema.label}` : `Add ${schema.label}`}</DialogTitle>
                <DialogContent sx={{ pt: 2 }}>
                    <Grid container spacing={2}>
                        {schema.fields.map(f => (
                            <Grid size={{ xs: 12, sm: 6 }} key={f.name}>
                                <TextField
                                    fullWidth
                                    label={f.label}
                                    value={currentRecord?.[f.name] || ''}
                                    onChange={e => setCurrentRecord((p: any) => ({ ...p, [f.name]: e.target.value }))}
                                />
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button variant="contained" onClick={saveRecord}>Save</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
