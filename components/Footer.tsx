import Link from "next/link";
import Image from "next/image";
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ChevronRight, Clock } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-[#001f22] text-white pt-20 pb-10 border-t-4 border-[#ef8e1e]">
            <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="bg-white p-1 rounded-lg shadow-lg">
                                <Image
                                    src="/images/logo.png"
                                    alt="Sukra House Logo"
                                    width={45}
                                    height={45}
                                    className="w-12 h-auto"
                                />
                            </div>
                            <div className="leading-tight">
                                <span className="block text-2xl font-bold text-white tracking-wide">Sukra</span>
                                <span className="block text-[11px] font-bold text-[#ef8e1e] uppercase tracking-widest">House of Diagnostics</span>
                            </div>
                        </div>
                        <p className="text-gray-300 text-sm leading-relaxed font-medium">
                            Your trusted partner in health. A-Class Medical Diagnostic Laboratory committed to accuracy, reliability, and speed.
                        </p>
                        <div className="flex gap-4 pt-4">
                            <Link href="#" className="bg-[#00363b] p-3 rounded-full hover:bg-[#ef8e1e] hover:text-white transition-all text-teal-100 shadow-md transform hover:-translate-y-1">
                                <Facebook size={20} />
                            </Link>
                            <Link href="#" className="bg-[#00363b] p-3 rounded-full hover:bg-[#ef8e1e] hover:text-white transition-all text-teal-100 shadow-md transform hover:-translate-y-1">
                                <Twitter size={20} />
                            </Link>
                            <Link href="#" className="bg-[#00363b] p-3 rounded-full hover:bg-[#ef8e1e] hover:text-white transition-all text-teal-100 shadow-md transform hover:-translate-y-1">
                                <Instagram size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Services Column */}
                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#ef8e1e] rounded-full"></span>
                            Our Services
                        </h3>
                        <ul className="space-y-4">
                            <li><Link href="/services" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Pathology</Link></li>
                            <li><Link href="/services" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Bio-Chemistry</Link></li>
                            <li><Link href="/services" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Hematology</Link></li>
                            <li><Link href="/services" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Microbiology</Link></li>
                            <li><Link href="/services" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Health Checkups</Link></li>
                        </ul>
                    </div>

                    {/* Quick Links Column */}
                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#ef8e1e] rounded-full"></span>
                            Quick Links
                        </h3>
                        <ul className="space-y-4">
                            <li><Link href="/" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Home</Link></li>
                            <li><Link href="/about" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> About Us</Link></li>
                            <li><Link href="/appointment" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Book Test</Link></li>
                            <li><Link href="/contact" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Contact</Link></li>
                            <li><Link href="#" className="text-gray-300 hover:text-[#ef8e1e] flex items-center gap-3 transition-colors text-sm font-medium border-b border-white/5 pb-2 hover:border-white/20"><ChevronRight size={16} className="text-[#ef8e1e]" /> Patient Portal</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h3 className="text-xl font-bold mb-8 text-white flex items-center gap-2">
                            <span className="w-1.5 h-6 bg-[#ef8e1e] rounded-full"></span>
                            Contact Us
                        </h3>
                        <ul className="space-y-5">
                            <li className="flex gap-4 items-start">
                                <MapPin className="text-[#ef8e1e] shrink-0 mt-1" size={22} />
                                <span className="text-gray-300 text-sm leading-relaxed font-medium">Panipokhari RS sadan building 2nd floor, <br />opposite panipokhari height colony, Kathmandu</span>
                            </li>
                            <li className="flex gap-4 items-center">
                                <Phone className="text-[#ef8e1e] shrink-0" size={22} />
                                <span className="text-white text-base font-bold tracking-wide">01-5916870/71</span>
                            </li>
                            <li className="flex gap-4 items-center">
                                <Mail className="text-[#ef8e1e] shrink-0" size={22} />
                                <span className="text-gray-300 text-sm font-medium">info@sukradiagnostic.com</span>
                            </li>
                            <li className="flex gap-4 items-start">
                                <Clock className="text-[#ef8e1e] shrink-0 mt-1" size={22} />
                                <div className="text-gray-300 text-sm font-medium">
                                    <p>Sun - Fri: 8:00 - 19:00</p>
                                    <p className="text-xs text-[#ef8e1e] mt-1 font-bold">Saturday: 8:00 - 15:00</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-400 text-sm font-medium">
                        © {new Date().getFullYear()} Sukra House of Diagnostic. All rights reserved. <br className="md:hidden" />
                        <span className="hidden md:inline mx-2">|</span>
                        Development in progress by <Link href="http://www.ostech.com.np" target="_blank" className="text-[#ef8e1e] hover:text-white transition-colors">OS Technology Pvt. Ltd</Link>
                    </p>
                    <div className="flex gap-8 text-sm text-gray-400 font-medium">
                        <Link href="#" className="hover:text-[#ef8e1e] transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-[#ef8e1e] transition-colors">Terms of Service</Link>
                        <Link href="#" className="hover:text-[#ef8e1e] transition-colors">Disclaimer</Link>
                    </div>
                </div>
                <p className="text-center text-[10px] text-gray-500 mt-8 font-medium">
                    Disclaimer: All diagnostic reports are confidential and handled according to government medical standards.
                </p>
            </div>
        </footer>
    );
}
