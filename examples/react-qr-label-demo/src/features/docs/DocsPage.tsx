import { useEffect, useState } from 'react';
import { BookOpen, Terminal, Download, Github, ChevronRight, Layers, Zap, FileText } from 'lucide-react';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'packages', label: 'Packages' },
  { id: 'embed-designer', label: 'Embed Designer' },
  { id: 'headless', label: 'Headless Rendering' },
  { id: 'schema', label: 'Schema Reference' },
  { id: 'export', label: 'Export Formats' },
];

export function DocsPage() {
  const [activeSection, setActiveSection] = useState('overview');

  // Highlight nav item on scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen bg-white flex">

      {/* Sticky Sidebar */}
      <aside className="hidden lg:flex flex-col w-60 xl:w-72 shrink-0 sticky top-[72px] h-[calc(100vh-72px)] overflow-y-auto border-r border-gray-100 bg-gray-50/60 py-8 px-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 mb-4 px-2">On this page</p>
        <nav className="flex flex-col gap-1">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                activeSection === id
                  ? 'bg-blue-50 text-blue-700 border-l-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              <ChevronRight size={14} className={activeSection === id ? 'text-blue-500' : 'text-gray-400'} />
              {label}
            </button>
          ))}
        </nav>

        <div className="mt-auto pt-8 border-t border-gray-200">
          <a
            href="https://github.com/shashi089/qr-code-layout-generate-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors px-2"
          >
            <Github size={15} />
            View on GitHub
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0 px-5 sm:px-8 lg:px-12 xl:px-16 py-10 max-w-4xl">

        {/* ── OVERVIEW ── */}
        <section id="overview" className="mb-16 scroll-mt-24">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <BookOpen size={20} className="text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">QR Label Designer — Docs</h1>
          </div>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            QR Label Designer is powered by <code className="font-mono font-bold text-gray-800 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200 text-sm">react-qr-label</code>, a complete visual editor and high-performance print engine for React applications.
          </p>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { icon: <Layers size={18} className="text-blue-500" />, title: '<QRLabelDesigner /> Component', desc: 'Embeddable drag-and-drop designer workspace with responsive style controls, variable mapping, and dark mode.' },
              { icon: <Terminal size={18} className="text-green-500" />, title: 'StickerPrinter Engine', desc: 'Headless batch rendering engine that merges layouts with record arrays to output PNGs, PDFs, and ZPL commands.' },
            ].map(({ icon, title, desc }) => (
              <div key={title} className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 transition-colors">
                <div className="flex items-center gap-2 mb-2">{icon}<span className="font-bold text-gray-800">{title}</span></div>
                <p className="text-sm text-gray-500">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── PACKAGES ── */}
        <section id="packages" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Package Details</h2>
          <p className="text-gray-500 mb-6">The React library is published on npm and is open source under the MIT license.</p>

          {/* react-qr-label */}
          <div className="bg-gray-950 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <Layers size={16} className="text-indigo-400" />
                <code className="text-indigo-400 font-bold font-mono text-base">react-qr-label</code>
              </div>
              <div className="flex gap-3">
                <a href="https://www.npmjs.com/package/react-qr-label" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Download size={12} /> npm</a>
                <a href="https://github.com/shashi089/qr-code-layout-generate-tool/tree/main/packages/react-qr-label" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300"><Github size={12} /> source</a>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg px-4 py-3 font-mono text-sm text-gray-200">
              npm install react-qr-label
            </div>
            <p className="text-gray-400 text-sm mt-3">
              This package encapsulates the visual editor UI component and directly exports the headless generator (<code className="text-gray-300">StickerPrinter</code>) and PDF helper exports.
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Also import the stylesheet: <code className="text-gray-300">import 'react-qr-label/style.css'</code>
            </p>
          </div>
        </section>

        {/* ── EMBED DESIGNER ── */}
        <section id="embed-designer" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Embed Designer in React</h2>
          <p className="text-gray-500 mb-6">Use the native <code className="text-blue-600 font-mono bg-blue-50 px-1 rounded">react-qr-label</code> component wrapper to drop a visual editor into your React application in seconds.</p>
          <pre className="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
            <code className="text-gray-200">{
`// npm install react-qr-label
 
import { useState } from 'react';
import { QRLabelDesigner, type StickerLayout } from 'react-qr-label';
import 'react-qr-label/style.css';

// Define your entity schema (the data fields available in the designer)
const SCHEMA = {
  employee: {
    label: 'Employee Master',
    fields: [
      { name: 'fullName',    label: 'Full Name'    },
      { name: 'employeeId', label: 'Employee ID'   },
      { name: 'department', label: 'Department'    },
    ],
    sampleData: {
      fullName: 'Jane Smith',
      employeeId: 'EMP-2024-007',
      department: 'Engineering',
    },
  },
};

export function LabelDesigner() {
  const [layout, setLayout] = useState<StickerLayout>({
    id: crypto.randomUUID(),
    name: 'Employee Badge',
    width: 100,
    height: 60,
    unit: 'mm',
    backgroundColor: '#ffffff',
    elements: [],
  });

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <QRLabelDesigner
        style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        initialLayout={layout}
        entitySchemas={SCHEMA}
        onSave={(savedLayout) => {
          console.log('Saved layout:', savedLayout);
          setLayout(savedLayout);
        }}
      />
    </div>
  );
}`
            }</code>
          </pre>
        </section>

        {/* ── HEADLESS ── */}
        <section id="headless" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Headless Rendering</h2>
          <p className="text-gray-500 mb-6">Use the <code className="text-green-700 font-mono bg-green-50 px-1 rounded">StickerPrinter</code> engine (re-exported by <code className="text-green-700 font-mono bg-green-50 px-1 rounded">react-qr-label</code>) to programmatically render labels without any UI. Works in browser environments.</p>
          <pre className="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
            <code className="text-gray-200">{
`import { StickerPrinter } from 'react-qr-label';

const printer = new StickerPrinter();

// Define your layout template
const layout = {
  id: 'layout-1',
  name: 'Employee Badge',
  width: 100, height: 60, unit: 'mm',
  elements: [
    {
      id: 'qr-1',
      type: 'qr',              // 'qr' or 'text'
      x: 5, y: 5,             // position (in layout units)
      w: 40, h: 40,           // size (in layout units)
      content: '{{employeeId}}',  // dynamic variable syntax
    },
    {
      id: 'name-1',
      type: 'text',
      x: 50, y: 10, w: 45, h: 12,
      content: '{{fullName}}',
      style: { fontSize: 14, fontWeight: 'bold', color: '#111111' },
    },
    {
      id: 'dept-1',
      type: 'text',
      x: 50, y: 26, w: 45, h: 10,
      content: '{{department}}',
      style: { fontSize: 11, color: '#555555' },
    },
  ],
};

// Your data record — one record = one label
const data = {
  fullName: 'Jane Smith',
  employeeId: 'EMP-2024-007',
  department: 'Engineering',
};

// ─── Render as PNG (browser) ───────────────────────────────
const dataUrl = await printer.renderToDataURL(layout, data, { format: 'png' });
// Use dataUrl as <img src={dataUrl} /> or download it

// ─── Batch export multiple records as images ───────────────
const images = await printer.exportImages(layout, [data1, data2, data3]);

// ─── Export as PDF (requires: npm install jspdf) ───────────
const pdf = await printer.exportToPDF(layout, [data]);
pdf.save('employee-badge.pdf');

// ─── Export as ZPL for Zebra / thermal printers ───────────
const zplArray = printer.exportToZPL(layout, [data]);
console.log(zplArray[0]); // ^XA ... ^XZ  — send to printer`
            }</code>
          </pre>
        </section>

        {/* ── SCHEMA ── */}
        <section id="schema" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Schema Reference</h2>
          <p className="text-gray-500 mb-6">Every label is a plain JSON object of type <code className="text-purple-700 font-mono bg-purple-50 px-1 rounded">StickerLayout</code>. Use <code className="text-purple-700 font-mono bg-purple-50 px-1 rounded">{'{{variableName}}'}</code> for dynamic content.</p>
          <pre className="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
            <code className="text-gray-200">{
`// Re-exported by 'react-qr-label'

type Unit = 'mm' | 'cm' | 'in' | 'px';

type StickerLayout = {
  id: string;               // unique ID
  name: string;             // display name
  width: number;            // label width  (e.g. 100)
  height: number;           // label height (e.g. 60)
  unit: Unit;               // measurement unit
  backgroundColor?: string; // hex color, default transparent
  backgroundImage?: string; // URL or data-URL
  targetEntity?: string;    // key from EntitySchema
  elements: StickerElement[];
};

type StickerElement = {
  id: string;
  type: 'text' | 'qr';     // element type
  x: number;               // left position (in unit)
  y: number;               // top position  (in unit)
  w: number;               // width         (in unit)
  h: number;               // height        (in unit)
  content: string;         // static text OR '{{fieldName}}'
  qrSeparator?: string;    // separator when combining fields: '{{a}}-{{b}}'
  style?: {
    fontSize?: number;      // px
    fontFamily?: string;
    fontWeight?: string | number; // 'normal' | 'bold' | 400 | 700...
    color?: string;
    textAlign?: 'left' | 'center' | 'right';
    verticalAlign?: 'top' | 'middle' | 'bottom';
    backgroundColor?: string;
  };
};

// Entity schema (used by the designer UI)
type EntitySchema = {
  label: string;
  fields: { name: string; label: string }[];
  sampleData: Record<string, string>;
};`
            }</code>
          </pre>
        </section>

        {/* ── EXPORT FORMATS ── */}
        <section id="export" className="mb-16 scroll-mt-24">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Export Formats</h2>
          <p className="text-gray-500 mb-6">All exports are handled by the <code className="text-green-700 font-mono bg-green-50 px-1 rounded">StickerPrinter</code> class re-exported by <code className="text-green-700 font-mono bg-green-50 px-1 rounded">react-qr-label</code>.</p>

          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              { icon: <FileText size={20} className="text-orange-500" />, title: 'PNG / JPEG', desc: 'Canvas-based image export. One file per record. Works in browser.', method: 'renderToDataURL()' },
              { icon: <FileText size={20} className="text-red-500" />, title: 'PDF', desc: 'Multi-page PDF batch export via jspdf. Works in browser.', method: 'exportToPDF()' },
              { icon: <Zap size={20} className="text-blue-500" />, title: 'ZPL', desc: 'Zebra Programming Language for thermal printers. Returns plain text.', method: 'exportToZPL()' },
            ].map(({ icon, title, desc, method }) => (
              <div key={title} className="border border-gray-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">{icon}<span className="font-bold text-gray-800">{title}</span></div>
                <p className="text-xs text-gray-500 mb-2">{desc}</p>
                <code className="text-xs bg-gray-100 text-gray-700 rounded px-2 py-0.5 font-mono">{method}</code>
              </div>
            ))}
          </div>

          <pre className="bg-gray-950 rounded-2xl p-5 overflow-x-auto text-sm leading-relaxed">
            <code className="text-gray-200">{
`import { StickerPrinter } from 'react-qr-label';
import { exportToPDF } from 'react-qr-label/pdf'; // PDF sub-path export

const printer = new StickerPrinter();
const dataList = [{ fullName: 'Alice', employeeId: 'EMP-001' }];

// ── PNG ──────────────────────────────────────────────────────
const png = await printer.renderToDataURL(layout, dataList[0], { format: 'png' });

// ── JPEG (lower file size) ────────────────────────────────────
const jpg = await printer.renderToDataURL(layout, dataList[0], {
  format: 'jpeg',
  quality: 0.85,          // 0.0 – 1.0
});

// ── Batch PNG (one image per record) ──────────────────────────
const pngs = await printer.exportImages(layout, dataList);

// ── PDF (all records in one file) ────────────────────────────
const pdf = await printer.exportToPDF(layout, dataList);
pdf.save('labels.pdf');

// ── ZPL (all records, one ^XA…^XZ block each) ────────────────
const zplBlocks = printer.exportToZPL(layout, dataList);
const combined  = zplBlocks.join('\\n');
// Send 'combined' to your Zebra thermal printer via socket / API`
            }</code>
          </pre>
        </section>

        {/* Bottom Links */}
        <div className="border-t border-gray-100 pt-10 flex flex-col sm:flex-row gap-4 items-center justify-between">
          <p className="text-gray-400 text-sm">Found an issue or want to contribute?</p>
          <a
            href="https://github.com/shashi089/qr-code-layout-generate-tool"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-gray-900 text-white px-5 py-2.5 rounded-xl font-semibold text-sm hover:bg-gray-700 transition-all"
          >
            <Github size={18} />
            Open an Issue on GitHub
          </a>
        </div>

      </main>
    </div>
  );
}
