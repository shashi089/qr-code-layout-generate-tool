import {
  ArrowRight,
  Cpu,
  Users,
  Shield,
  Zap,
  Layout,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface LandingPageProps {
  onNavigate: (view: "home" | "labels" | "docs") => void;
  onLoadPreset?: (presetId: string) => void;
}

export function LandingPage({ onNavigate, onLoadPreset }: LandingPageProps) {
  const handleLoadWorkflow = (presetId: string) => {
    if (onLoadPreset) {
      onLoadPreset(presetId);
    } else {
      onNavigate("labels");
    }
  };

  return (
    <div className="bg-white min-h-screen text-gray-900 font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-indigo-50/20 to-white pb-20 pt-16 sm:pb-32 sm:pt-36">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="lg:grid lg:grid-cols-12 lg:gap-12">
            <div className="text-center lg:text-left lg:col-span-7 flex flex-col justify-center">
              {/* Release Badge */}
              <div className="inline-flex items-center gap-1.5 self-center lg:self-start bg-blue-100/80 border border-blue-200/50 rounded-full px-3.5 py-1 text-xs font-semibold text-blue-700 mb-6 shadow-sm backdrop-blur-sm animate-pulse">
                <Sparkles size={12} />
                <span>React QR Label Designer v0.1.0 Released</span>
              </div>
              
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-[1.15]">
                Dynamic React{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  QR Label Designer
                </span>{" "}
                & Batch Printer
              </h1>
              
              <p className="mt-6 text-lg leading-relaxed text-gray-600 max-w-2xl mx-auto lg:mx-0">
                An embeddable drag-and-drop label editor and headless batch-mail-merge printing engine for React. Design professional layouts visually, map dynamic dataset fields, and render directly to **ZPL commands, PDFs, or PNGs** locally in the browser.
              </p>
              
              <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <button
                  onClick={() => onNavigate("labels")}
                  className="w-full sm:w-auto rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:shadow-blue-500/35 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer scale-100 hover:scale-[1.02] active:scale-98"
                >
                  Launch Sticker Studio <ArrowRight size={18} />
                </button>
                <button
                  onClick={() => onNavigate("docs")}
                  className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-blue-600 transition-all cursor-pointer font-bold"
                >
                  View Documentation <span aria-hidden="true">→</span>
                </button>
              </div>
            </div>
            
            {/* Right Hero Image Card */}
            <div className="mt-16 lg:col-span-5 lg:mt-0 flex items-center justify-center relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-3xl filter blur-3xl opacity-10 animate-blob"></div>
              <div className="relative rounded-2xl bg-white/80 p-5 shadow-2xl border border-gray-200/50 backdrop-blur-md rotate-1 hover:rotate-0 transition-transform duration-500 max-w-md w-full">
                <div className="bg-gray-900 rounded-xl p-6 text-gray-400 font-mono text-xs shadow-inner">
                  <div className="flex gap-1.5 mb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  </div>
                  <span className="text-blue-400">import</span> {"{"} <span className="text-yellow-300">QRLabelDesigner</span> {"}"} <span className="text-blue-400">from</span> <span className="text-green-300">'react-qr-label-designer'</span>;
                  <br />
                  <span className="text-blue-400">import</span> <span className="text-green-300">'react-qr-label-designer/style.css'</span>;
                  <br /><br />
                  <span className="text-gray-500">// Embed the designer component</span>
                  <br />
                  <span className="text-purple-400">&lt;</span><span className="text-yellow-300">QRLabelDesigner</span>
                  <br />
                  &nbsp;&nbsp;initialLayout={"{"}savedLayout{"}"}
                  <br />
                  &nbsp;&nbsp;entitySchemas={"{"}schemas{"}"}
                  <br />
                  &nbsp;&nbsp;onSave={"{"}(layout) =&gt; saveToDB(layout){"}"}
                  <br />
                  <span className="text-purple-400">/&gt;</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* STORY-DRIVEN PRESETS SECTION */}
      <div className="py-20 sm:py-28 bg-gray-50 border-y border-gray-200/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-blue-600 tracking-wider uppercase">
              Interactive Industry Workflows
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Choose a Preset Story & Launch the Designer
            </p>
            <p className="mt-4 text-base text-gray-600 leading-relaxed">
              Select one of the sample industries below. The demo will preload the corresponding data schema, sample database, and design template directly into your designer session.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Story A: Employees */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-blue-200 transition-all group duration-300">
              <div>
                <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-5 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Workforce ID Badges</h3>
                <p className="text-xs font-semibold text-blue-600 mb-4 bg-blue-50 py-1 px-2.5 rounded-full w-fit">
                  Use Case: Security & Events
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Design company tags, staff security badges, or visitor credentials. Automatically bind employee names, photos, departments, and scan URLs.
                </p>
              </div>
              <button
                onClick={() => handleLoadWorkflow("default-emp-layout")}
                className="w-full bg-gray-50 hover:bg-blue-600 hover:text-white border border-gray-200 hover:border-blue-600 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Load Staff Badge Preset <Sparkles size={14} />
              </button>
            </div>

            {/* Story B: Machines */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6 flex flex-col justify-between shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all group duration-300">
              <div>
                <div className="h-12 w-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 mb-5 group-hover:scale-110 transition-transform">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Equipment Asset spec</h3>
                <p className="text-xs font-semibold text-indigo-600 mb-4 bg-indigo-50 py-1 px-2.5 rounded-full w-fit">
                  Use Case: Industrial Maintenance
                </p>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  Print spec plates for plant machinery, tools, and servers. Integrate dynamic QR codes pointing to installation dates, serial codes, and service logs.
                </p>
              </div>
              <button
                onClick={() => handleLoadWorkflow("default-machine-layout")}
                className="w-full bg-gray-50 hover:bg-indigo-600 hover:text-white border border-gray-200 hover:border-indigo-600 rounded-xl py-3 text-sm font-semibold text-gray-700 transition-all cursor-pointer text-center flex items-center justify-center gap-1.5"
              >
                Load Asset Tag Preset <Sparkles size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* DEVELOPER WORKFLOW SECTION */}
      <div className="py-20 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-16">
            <h2 className="text-base font-semibold leading-7 text-blue-600 tracking-wider uppercase">
              Developer Tour
            </h2>
            <p className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Build a Full Labeling Pipeline in 3 Steps
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="relative flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                1
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Embed the Canvas UI</h4>
              <p className="text-gray-600 text-sm max-w-xs">
                Drop <code>&lt;QRLabelDesigner /&gt;</code> directly into your page layout. It adjusts to flex parents automatically and encapsulates all canvas controls.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                2
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Bind DB Schemas</h4>
              <p className="text-gray-600 text-sm max-w-xs">
                Define the available database fields. The designer automatically provides visual drag pills so users can map tags like `{"{{fullName}}"}`.
              </p>
            </div>

            <div className="relative flex flex-col items-center text-center">
              <div className="h-12 w-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-lg mb-4 shadow-inner">
                3
              </div>
              <h4 className="font-bold text-lg text-gray-900 mb-2">Headless Printing</h4>
              <p className="text-gray-600 text-sm max-w-xs">
                Extract the saved JSON and send it with your database arrays to `StickerPrinter` to batch print multi-page PDFs, PNG arrays, or raw ZPL code.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CORE BENEFITS */}
      <div className="py-20 sm:py-28 bg-gray-50 border-t border-gray-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            <div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-8 text-center lg:text-left">
                Engineered for High-Performance Apps
              </h3>
              <div className="space-y-6 max-w-xl mx-auto lg:mx-0">
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      ZPL Code Output (Thermal Printing)
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Convert design canvas layouts into raw **ZPL commands** dynamically. Stream print jobs directly to Zebra industrial thermal sticker printers on the local network.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <CheckCircle2 size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      Clean Ref-based Render System
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      Uses React callback refs to synchronize layout settings. No re-renders on layout updates, maintaining undo state and preventing cursor drag lag.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      100% Client-Side Privacy
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">
                      All canvas drawing, barcode parsing, PDF generation, and ZPL rendering happen locally in the browser. Zero server data sharing.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* CTA panel */}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 sm:p-12 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
              <div className="relative z-10 text-center lg:text-left">
                <h3 className="text-3xl font-extrabold mb-4">
                  Ready to test?
                </h3>
                <p className="text-blue-100 mb-8 max-w-sm mx-auto lg:mx-0 text-sm sm:text-base leading-relaxed">
                  Open the label design dashboard and try creating, editing, and batch exporting tags with mock database tables.
                </p>
                <button
                  onClick={() => onNavigate("labels")}
                  className="w-full sm:w-auto bg-white hover:bg-blue-50 text-blue-600 px-8 py-4 rounded-xl font-bold transition-all cursor-pointer shadow-lg hover:shadow-xl active:scale-98 text-sm"
                >
                  Launch Sticker Studio
                </button>
              </div>
              <div className="absolute -right-20 -bottom-20 opacity-10">
                <Layout size={300} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
