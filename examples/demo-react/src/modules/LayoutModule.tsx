import { useEffect, useState, useRef } from 'react';
import {
    Box,
    Button,
    Grid,
    TextField,
    Typography,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    IconButton,
    List,
    ListItem,
    ListItemButton,
    ListItemText,
    Divider,
    Paper,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
} from '@mui/material';
import { Plus, Trash, Edit2, Layout as LayoutIcon, Type, QrCode, AlignLeft, AlignCenter, AlignRight, AlignStartVertical, AlignCenterVertical, AlignEndVertical } from 'lucide-react';
import { StickerPrinter } from 'qrlayout-core';
import type { SavedLayout, EntityType } from '../types';
import { ReusableTable } from '../components/ReusableTable';
import type { GridColDef } from '@mui/x-data-grid';
import { ENTITY_SCHEMAS } from '../entitySchemas';

export function LayoutModule() {
    const [layouts, setLayouts] = useState<SavedLayout[]>([]);
    const [currentLayout, setCurrentLayout] = useState<SavedLayout | null>(null);
    const [selectedElementId, setSelectedElementId] = useState<string | null>(null);
    const [view, setView] = useState<'list' | 'edit'>('list');
    const previewRef = useRef<HTMLCanvasElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const printer = useRef(new StickerPrinter());

    const [pxPerUnit, setPxPerUnit] = useState(1);
    const [testData, setTestData] = useState<any>({
        name: 'Rajesh Sharma',
        employeeId: 'EMP-101',
        designation: 'Senior Architect',
        place: 'Mumbai'
    });

    // Load from local storage and add defaults
    useEffect(() => {
        const saved = localStorage.getItem('qr-layouts');
        if (saved) {
            const parsed: SavedLayout[] = JSON.parse(saved);
            // Migration: Ensure all legacy layouts have targetEntity='employee'
            const migrated = parsed.map(l => ({
                ...l,
                targetEntity: l.targetEntity || 'employee'
            }));
            setLayouts(migrated);
        } else {
            const defaults: SavedLayout[] = [
                {
                    id: '1',
                    name: 'Standard Badge',
                    width: 100,
                    height: 60,
                    unit: 'mm',
                    backgroundColor: '#ffffff',
                    targetEntity: 'employee',
                    elements: [
                        { id: 't1', type: 'text', x: 5, y: 5, w: 90, h: 8, content: 'VISITOR PASS', style: { textAlign: 'center', fontWeight: 'bold' } },
                        { id: 'q1', type: 'qr', x: 35, y: 15, w: 30, h: 30, content: 'https://example.com' },
                    ],
                    isDefault: true,
                },
                {
                    id: '2',
                    name: 'Small Sticker',
                    width: 50,
                    height: 25,
                    unit: 'mm',
                    backgroundColor: '#ffffff',
                    targetEntity: 'employee',
                    elements: [
                        { id: 'q1', type: 'qr', x: 5, y: 2, w: 20, h: 20, content: 'SKU-001' },
                        { id: 't1', type: 'text', x: 27, y: 10, w: 20, h: 5, content: 'SKU-001' },
                    ],
                    isDefault: true,
                }
            ];
            setLayouts(defaults);
            localStorage.setItem('qr-layouts', JSON.stringify(defaults));
        }
    }, []);

    useEffect(() => {
        if (view === 'edit' && currentLayout && previewRef.current) {
            printer.current.renderToCanvas(currentLayout as any, testData, previewRef.current).then(() => {
                const canvas = previewRef.current;
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    setPxPerUnit(rect.width / currentLayout.width);
                }
            });
        }
    }, [currentLayout, view, testData]);

    const saveLayout = () => {
        if (!currentLayout) return;
        const newLayouts = layouts.find(l => l.id === currentLayout.id)
            ? layouts.map(l => l.id === currentLayout.id ? currentLayout : l)
            : [...layouts, { ...currentLayout, id: Date.now().toString() }];

        setLayouts(newLayouts);
        localStorage.setItem('qr-layouts', JSON.stringify(newLayouts));
        setView('list');
        setCurrentLayout(null);
        setSelectedElementId(null);
    };

    const deleteLayout = (id: string) => {
        const newLayouts = layouts.filter(l => l.id !== id);
        setLayouts(newLayouts);
        localStorage.setItem('qr-layouts', JSON.stringify(newLayouts));
    };

    const addElement = (type: 'text' | 'qr') => {
        if (!currentLayout) return;
        const id = Math.random().toString(36).substr(2, 9);
        const newElement = {
            id,
            type,
            x: 10,
            y: 10,
            w: type === 'qr' ? 20 : 50,
            h: type === 'qr' ? 20 : 10,
            content: type === 'qr' ? 'https://example.com' : 'Sample Text',
            style: type === 'text' ? { fontSize: 12, textAlign: 'left' } : undefined
        };
        setCurrentLayout({
            ...currentLayout,
            elements: [...currentLayout.elements, newElement as any]
        });
        setSelectedElementId(id);
    };

    const updateElement = (id: string, updates: any) => {
        if (!currentLayout) return;
        setCurrentLayout({
            ...currentLayout,
            elements: currentLayout.elements.map(el =>
                el.id === id ? { ...el, ...updates } : el
            )
        });
    };

    const handleDragStart = (e: React.MouseEvent, id: string) => {
        if (view !== 'edit' || !currentLayout) return;
        e.preventDefault();
        setSelectedElementId(id);

        const element = currentLayout.elements.find(el => el.id === id);
        if (!element) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const initialElX = element.x;
        const initialElY = element.y;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dx = (moveEvent.clientX - startX) / pxPerUnit;
            const dy = (moveEvent.clientY - startY) / pxPerUnit;

            updateElement(id, {
                x: Math.round((initialElX + dx) * 10) / 10,
                y: Math.round((initialElY + dy) * 10) / 10,
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const handleResizeStart = (e: React.MouseEvent, id: string) => {
        if (view !== 'edit' || !currentLayout) return;
        e.preventDefault();
        e.stopPropagation(); // Don't trigger drag
        setSelectedElementId(id);

        const element = currentLayout.elements.find(el => el.id === id);
        if (!element) return;

        const startX = e.clientX;
        const startY = e.clientY;
        const initialW = element.w;
        const initialH = element.h;

        const onMouseMove = (moveEvent: MouseEvent) => {
            const dw = (moveEvent.clientX - startX) / pxPerUnit;
            const dh = (moveEvent.clientY - startY) / pxPerUnit;

            updateElement(id, {
                w: Math.max(1, Math.round((initialW + dw) * 10) / 10),
                h: Math.max(1, Math.round((initialH + dh) * 10) / 10),
            });
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };

    const columns: GridColDef[] = [
        { field: 'name', headerName: 'Layout Name', flex: 1 },
        { field: 'width', headerName: 'Width', width: 100 },
        { field: 'height', headerName: 'Height', width: 100 },
        { field: 'unit', headerName: 'Unit', width: 100 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <Box>
                    <IconButton onClick={() => { setCurrentLayout(params.row); setView('edit'); }} size="small" color="primary">
                        <Edit2 size={16} />
                    </IconButton>
                    {!params.row.isDefault && (
                        <IconButton onClick={() => deleteLayout(params.row.id)} size="small" color="error">
                            <Trash size={16} />
                        </IconButton>
                    )}
                </Box>
            ),
        },
    ];

    const selectedElement = currentLayout?.elements.find(el => el.id === selectedElementId);

    if (view === 'edit' && currentLayout) {
        return (
            <Box p={3}>
                <Box display="flex" justifyContent="space-between" mb={3}>
                    <Typography variant="h5">Designer: {currentLayout.name}</Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button variant="outlined" onClick={() => setView('list')}>Cancel</Button>
                        <Button variant="contained" onClick={saveLayout}>Save Changes</Button>
                    </Box>
                </Box>

                <Grid container spacing={3} sx={{ height: 'calc(100vh - 160px)', overflow: 'hidden' }}>
                    {/* LEFT PANEL: CONFIG & ELEMENTS */}
                    <Grid size={{ xs: 12, md: 3 }} sx={{ height: '100%', overflowY: 'auto', pr: 1 }}>
                        <Stack spacing={3}>
                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Configuration</Typography>
                                <TextField
                                    fullWidth label="Layout Name" value={currentLayout.name} sx={{ mb: 2 }} size="small"
                                    onChange={e => setCurrentLayout({ ...currentLayout, name: e.target.value })}
                                />
                                <Grid container spacing={1}>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField fullWidth label="Width" type="number" value={currentLayout.width} size="small"
                                            onChange={e => setCurrentLayout({ ...currentLayout, width: Number(e.target.value) })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 6 }}>
                                        <TextField fullWidth label="Height" type="number" value={currentLayout.height} size="small"
                                            onChange={e => setCurrentLayout({ ...currentLayout, height: Number(e.target.value) })}
                                        />
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Target Entity</InputLabel>
                                            <Select value={currentLayout.targetEntity || 'employee'} label="Target Entity"
                                                onChange={e => {
                                                    const entity = e.target.value as EntityType;
                                                    setCurrentLayout({
                                                        ...currentLayout,
                                                        targetEntity: entity
                                                    });
                                                    // Automatically update test data to schema default
                                                    setTestData(ENTITY_SCHEMAS[entity].sampleData);
                                                }}
                                            >
                                                {Object.entries(ENTITY_SCHEMAS).map(([key, schema]) => (
                                                    <MenuItem key={key} value={key}>{schema.label}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                                        <FormControl fullWidth size="small">
                                            <InputLabel>Unit</InputLabel>
                                            <Select value={currentLayout.unit} label="Unit"
                                                onChange={e => setCurrentLayout({ ...currentLayout, unit: e.target.value as any })}
                                            >
                                                <MenuItem value="mm">mm</MenuItem>
                                                <MenuItem value="cm">cm</MenuItem>
                                                <MenuItem value="in">in</MenuItem>
                                                <MenuItem value="px">px</MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid size={{ xs: 12 }} sx={{ mt: 1 }}>
                                        <TextField
                                            fullWidth label="Background Color" size="small"
                                            placeholder="#ffffff"
                                            value={currentLayout.backgroundColor || ''}
                                            onChange={e => setCurrentLayout({ ...currentLayout, backgroundColor: e.target.value })}
                                            InputProps={{
                                                startAdornment: (
                                                    <Box sx={{
                                                        width: 16, height: 16, mr: 1, border: '1px solid #ccc',
                                                        backgroundColor: currentLayout.backgroundColor || '#fff'
                                                    }} />
                                                )
                                            }}
                                        />
                                    </Grid>
                                </Grid>
                            </Paper>

                            <Paper sx={{ p: 2 }}>
                                <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                                    <Typography variant="h6">Elements</Typography>
                                    <Box>
                                        <IconButton size="small" onClick={() => addElement('text')} title="Add Text"><Type size={18} /></IconButton>
                                        <IconButton size="small" onClick={() => addElement('qr')} title="Add QR"><QrCode size={18} /></IconButton>
                                    </Box>
                                </Box>
                                <Divider sx={{ mb: 1 }} />
                                <List dense sx={{ maxHeight: 200, overflow: 'auto' }}>
                                    {currentLayout.elements.map((el) => (
                                        <ListItem key={el.id}
                                            disablePadding
                                            secondaryAction={
                                                <IconButton edge="end" size="small" onClick={(e) => {
                                                    e.stopPropagation();
                                                    setCurrentLayout({ ...currentLayout, elements: currentLayout.elements.filter(e => e.id !== el.id) });
                                                    if (selectedElementId === el.id) setSelectedElementId(null);
                                                }}>
                                                    <Trash size={14} />
                                                </IconButton>
                                            }
                                        >
                                            <ListItemButton
                                                selected={selectedElementId === el.id}
                                                onClick={() => setSelectedElementId(el.id)}
                                                sx={{ borderRadius: 1 }}
                                            >
                                                <ListItemText
                                                    primary={el.type.toUpperCase()}
                                                    secondary={el.content.length > 20 ? el.content.substring(0, 20) + '...' : el.content}
                                                />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                                </List>
                            </Paper>

                            <Paper sx={{ p: 2 }}>
                                <Typography variant="h6" gutterBottom>Preview Data (Test)</Typography>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={12}
                                    size="small"
                                    label="Test Data (JSON)"
                                    value={JSON.stringify(testData, null, 2)}
                                    onChange={(e) => {
                                        try {
                                            setTestData(JSON.parse(e.target.value));
                                        } catch (e) {
                                            // Handle invalid JSON silently while typing
                                        }
                                    }}
                                    sx={{ fontFamily: 'monospace', mb: 1 }}
                                />
                                <Typography variant="caption" color="textSecondary">
                                    Edit JSON to see dynamic fields resolve in preview.
                                </Typography>
                            </Paper>
                        </Stack>
                    </Grid>

                    {/* CENTER: CANVAS PREVIEW */}
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Paper sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center', backgroundColor: '#f1f5f9', border: '1px dashed #cbd5e1' }}>
                            <Box sx={{ position: 'relative', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                                <canvas ref={previewRef} style={{ display: 'block', backgroundColor: '#fff' }} />
                                <Box
                                    ref={overlayRef}
                                    sx={{
                                        position: 'absolute',
                                        top: 0, left: 0, width: '100%', height: '100%',
                                        pointerEvents: 'none'
                                    }}
                                >
                                    {currentLayout.elements.map(el => (
                                        <Box
                                            key={el.id}
                                            onMouseDown={(e) => handleDragStart(e, el.id)}
                                            sx={{
                                                position: 'absolute',
                                                left: el.x * pxPerUnit,
                                                top: el.y * pxPerUnit,
                                                width: el.w * pxPerUnit,
                                                height: el.h * pxPerUnit,
                                                border: selectedElementId === el.id ? '2px solid #2563eb' : '1px solid rgba(37, 99, 235, 0.3)',
                                                backgroundColor: selectedElementId === el.id ? 'rgba(37, 99, 235, 0.05)' : 'transparent',
                                                pointerEvents: 'auto',
                                                cursor: 'move',
                                                '&:hover': {
                                                    borderColor: '#2563eb',
                                                    backgroundColor: 'rgba(37, 99, 235, 0.05)'
                                                }
                                            }}
                                        >
                                            {selectedElementId === el.id && (
                                                <Box
                                                    onMouseDown={(e) => handleResizeStart(e, el.id)}
                                                    sx={{
                                                        position: 'absolute',
                                                        right: -5,
                                                        bottom: -5,
                                                        width: 10,
                                                        height: 10,
                                                        backgroundColor: '#2563eb',
                                                        cursor: 'nwse-resize',
                                                        borderRadius: '50%',
                                                        zIndex: 2,
                                                        border: '2px solid #fff'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                            <Typography variant="caption" sx={{ mt: 2, color: '#64748b' }}>
                                Click and drag elements to reposition them.
                            </Typography>
                        </Paper>
                    </Grid>

                    {/* RIGHT PANEL: PROPERTIES */}
                    <Grid size={{ xs: 12, md: 3 }} sx={{ height: '100%', overflowY: 'auto', pl: 1 }}>
                        <Paper sx={{ p: 2, minHeight: '100%' }}>
                            <Typography variant="h6" gutterBottom>Properties</Typography>
                            <Divider sx={{ mb: 2 }} />

                            {selectedElement ? (
                                <Stack spacing={2}>
                                    <Box>
                                        <TextField
                                            fullWidth label="Content" size="small" multiline rows={2}
                                            value={selectedElement.content}
                                            onChange={(e) => updateElement(selectedElement.id, { content: e.target.value })}
                                        />
                                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 1 }}>
                                            {currentLayout.targetEntity && ENTITY_SCHEMAS[currentLayout.targetEntity].fields.map(field => (
                                                <Button
                                                    key={field.name}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{ fontSize: '0.65rem', py: 0.1, px: 0.5, minWidth: 0 }}
                                                    onClick={() => updateElement(selectedElement.id, { content: selectedElement.content + `{{${field.name}}}` })}
                                                >
                                                    + {field.label}
                                                </Button>
                                            ))}
                                        </Box>
                                    </Box>

                                    <Grid container spacing={1}>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField fullWidth label="X Pos" type="number" size="small" value={selectedElement.x}
                                                onChange={(e) => updateElement(selectedElement.id, { x: Number(e.target.value) })} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField fullWidth label="Y Pos" type="number" size="small" value={selectedElement.y}
                                                onChange={(e) => updateElement(selectedElement.id, { y: Number(e.target.value) })} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField fullWidth label="Width" type="number" size="small" value={selectedElement.w}
                                                onChange={(e) => updateElement(selectedElement.id, { w: Number(e.target.value) })} />
                                        </Grid>
                                        <Grid size={{ xs: 6 }}>
                                            <TextField fullWidth label="Height" type="number" size="small" value={selectedElement.h}
                                                onChange={(e) => updateElement(selectedElement.id, { h: Number(e.target.value) })} />
                                        </Grid>
                                    </Grid>

                                    {selectedElement.type === 'text' && (
                                        <>
                                            <TextField fullWidth label="Font Size" type="number" size="small" value={selectedElement.style?.fontSize || 12}
                                                onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontSize: Number(e.target.value) } })} />

                                            <Grid container spacing={2}>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="textSecondary" display="block">Horizontal Align</Typography>
                                                    <ToggleButtonGroup
                                                        value={selectedElement.style?.textAlign || 'left'}
                                                        exclusive
                                                        size="small"
                                                        onChange={(_, val) => val && updateElement(selectedElement.id, { style: { ...selectedElement.style, textAlign: val } })}
                                                    >
                                                        <ToggleButton value="left" title="Left"><AlignLeft size={16} /></ToggleButton>
                                                        <ToggleButton value="center" title="Center"><AlignCenter size={16} /></ToggleButton>
                                                        <ToggleButton value="right" title="Right"><AlignRight size={16} /></ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Grid>
                                                <Grid size={{ xs: 6 }}>
                                                    <Typography variant="caption" color="textSecondary" display="block">Vertical Align</Typography>
                                                    <ToggleButtonGroup
                                                        value={selectedElement.style?.verticalAlign || 'top'}
                                                        exclusive
                                                        size="small"
                                                        onChange={(_, val) => val && updateElement(selectedElement.id, { style: { ...selectedElement.style, verticalAlign: val } })}
                                                    >
                                                        <ToggleButton value="top" title="Top"><AlignStartVertical size={16} /></ToggleButton>
                                                        <ToggleButton value="middle" title="Middle"><AlignCenterVertical size={16} /></ToggleButton>
                                                        <ToggleButton value="bottom" title="Bottom"><AlignEndVertical size={16} /></ToggleButton>
                                                    </ToggleButtonGroup>
                                                </Grid>
                                            </Grid>

                                            <FormControl fullWidth size="small">
                                                <InputLabel>Font Weight</InputLabel>
                                                <Select
                                                    value={selectedElement.style?.fontWeight || 'normal'}
                                                    label="Font Weight"
                                                    onChange={(e) => updateElement(selectedElement.id, { style: { ...selectedElement.style, fontWeight: e.target.value } })}
                                                >
                                                    <MenuItem value="normal">Normal</MenuItem>
                                                    <MenuItem value="bold">Bold</MenuItem>
                                                </Select>
                                            </FormControl>
                                        </>
                                    )}
                                </Stack>
                            ) : (
                                <Box sx={{ py: 4, textAlign: 'center' }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Select an element to edit its properties.
                                    </Typography>
                                </Box>
                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );
    }

    return (
        <Box p={3}>
            <Box display="flex" justifyContent="space-between" mb={3} alignItems="center">
                <Typography variant="h4" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <LayoutIcon size={32} /> Layout Configuration
                </Typography>
                <Button variant="contained" startIcon={<Plus />} onClick={() => {
                    setCurrentLayout({
                        id: Date.now().toString(),
                        name: 'New Layout',
                        width: 100,
                        height: 60,
                        unit: 'mm',
                        backgroundColor: '#ffffff',
                        targetEntity: 'employee',
                        elements: []
                    });
                    setView('edit');
                }}>
                    Create New Layout
                </Button>
            </Box>

            <ReusableTable
                rows={layouts}
                columns={columns}
                searchFields={['name']}
            />
        </Box>
    );
}
