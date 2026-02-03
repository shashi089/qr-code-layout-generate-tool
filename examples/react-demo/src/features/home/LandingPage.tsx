import { ArrowRight, Cpu, Package, Users, Shield, Zap, Layout } from 'lucide-react';

interface LandingPageProps {
    onNavigate: (view: 'home' | 'labels' | 'employees' | 'machines' | 'storage') => void;
}

export function LandingPage({ onNavigate }: LandingPageProps) {
    return (
        <div className="bg-white min-h-screen">
            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pb-16 pt-24 sm:pb-24 sm:pt-32">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="lg:grid lg:grid-cols-12 lg:gap-8">
                        <div className="sm:text-center md:mx-auto md:max-w-2xl lg:col-span-6 lg:text-left flex flex-col justify-center">
                            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                                Industrial Grade <br />
                                <span className="text-blue-600">QR Label Designer</span>
                            </h1>
                            <p className="mt-6 text-lg leading-8 text-gray-600">
                              A powerful tool to design, manage, and print QR code labels for industrial assets, employees, bins, and storage locations.
                              Streamline operations with high-precision label layouts and seamless ZPL/PDF exports.
                            </p>
                            <div className="mt-10 flex items-center gap-x-6 sm:justify-center lg:justify-start">
                                <button
                                    onClick={() => onNavigate('labels')}
                                    className="rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white shadow-xl hover:bg-blue-500 transition-all flex items-center gap-2 cursor-pointer"
                                >
                                    Go to Designer <ArrowRight size={18} />
                                </button>
                                <button
                                    onClick={() => onNavigate('machines')}
                                    className="text-sm font-semibold leading-6 text-gray-900 flex items-center gap-1 hover:text-blue-600 transition-all cursor-pointer"
                                >
                                    View Asset Master <span aria-hidden="true">→</span>
                                </button>
                            </div>
                        </div>
                        <div className="mt-16 sm:mt-24 lg:col-span-6 lg:mt-0 flex items-center justify-center">
                            <div className="relative rounded-2xl bg-white p-4 shadow-2xl border border-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500">
                                <div className="bg-gray-50 rounded-lg p-8 border-2 border-dashed border-gray-200">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                            <Layout size={24} />
                                        </div>
                                        <div>
                                            <div className="h-2 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
                                            <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-32 w-full bg-white rounded border border-gray-200 flex items-center justify-center">
                                            <div className="p-2 border-2 border-gray-900 rounded">
                                                <div className="grid grid-cols-3 gap-1">
                                                    {[1, 1, 1, 1, 0, 1, 1, 1, 1].map((v, i) => (
                                                        <div key={i} className={`h-2 w-2 ${v ? 'bg-gray-900' : 'bg-transparent'}`}></div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="h-2 bg-gray-200 rounded w-full"></div>
                                            <div className="h-2 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Industrial Use Cases */}
            <div className="py-24 sm:py-32 bg-gray-50 border-y border-gray-100">
                <div className="mx-auto max-w-7xl px-8">
                    <div className="mx-auto max-w-2xl lg:text-center">
                        <h2 className="text-base font-semibold leading-7 text-blue-600">Built for Industry</h2>
                        <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                            Solutions for the Modern Factory Floor
                        </p>
                    </div>
                    <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
                        <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Package className="h-6 w-6 flex-none text-blue-600" />
                                    Storage Location Labels
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto italic font-medium">Use Case: Inventory Management</p>
                                    <p className="mt-2">
                                        Print high-durability QR codes for storage bins, pallets, and racks.
                                        Instantly view inventory counts or warehouse locations by scanning with any device.
                                    </p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Cpu className="h-6 w-6 flex-none text-blue-600" />
                                    Asset & Machine Tracking
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto italic font-medium">Use Case: Maintenance & Specs</p>
                                    <p className="mt-2">
                                        Generate labels for industrial machinery. Link QR codes directly to machine manuals,
                                        maintenance schedules, or technical specifications for quick access.
                                    </p>
                                </dd>
                            </div>
                            <div className="flex flex-col">
                                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                                    <Users className="h-6 w-6 flex-none text-blue-600" />
                                    Workforce Identification
                                </dt>
                                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                                    <p className="flex-auto italic font-medium">Use Case: Employee Badging</p>
                                    <p className="mt-2">
                                        Create secure employee id badges with integrated QR codes for attendance tracking,
                                        access control, and digital profile verification.
                                    </p>
                                </dd>
                            </div>
                        </dl>
                    </div>
                </div>
            </div>

            {/* Benefits */}
            <div className="py-24 sm:py-32">
                <div className="max-w-7xl mx-auto px-8">
                    <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Why use QR Layout Studio?</h3>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 shrink-0 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                                        <Zap size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">Instant Thermal Printing</h4>
                                        <p className="text-gray-600 text-sm">Export directly to ZPL format for Zebra and other industrial printers with zero middleware.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="h-10 w-10 shrink-0 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                                        <Shield size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-900">No Backend Required</h4>
                                        <p className="text-gray-600 text-sm">Your data stays in your browser. Fully functional offline tool using modern web standards.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-blue-600 rounded-2xl p-8 text-white flex flex-col justify-center relative overflow-hidden">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold mb-4">Ready to optimize?</h3>
                                <p className="text-blue-100 mb-8 max-w-sm">Start designing your first professional industrial label in seconds.</p>
                                <button
                                    onClick={() => onNavigate('labels')}
                                    className="bg-white text-blue-600 px-8 py-3 rounded-xl font-bold hover:bg-blue-50 transition-all cursor-pointer shadow-lg"
                                >
                                    Launch Designer
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
