"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle, Clock, Microscope, Beaker, Activity, Droplet, Home as HomeIcon, Sparkles } from "lucide-react";
import ServiceCard from "@/components/ServiceCard";
import DoctorCard from "@/components/DoctorCard";
import AppointmentForm from "@/components/AppointmentForm";
import DynamicDoctorCarousel from "@/components/DynamicDoctorCarousel";
// import { doctors } from "@/data/doctors";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      {/* Hero Section with Video Background and Glass Effect */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Abstract Medical Video Background */}
        <div className="absolute inset-0 w-full h-full z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            poster="/images/hero-poster.jpg"
          >
            <source src="https://cdn.pixabay.com/video/2020/08/11/46944-449410189_large.mp4" type="video/mp4" />
          </video>
          {/* Heavy overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-teal-900/90 via-teal-800/80 to-teal-900/40 z-10 mix-blend-multiply" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </div>

        <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4 z-20 grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="space-y-8 text-white max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-teal-50 font-medium px-4 py-1.5 rounded-full text-sm">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              Government Certified A-Class Laboratory
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
              Precision in <br />
              Every <span className="text-medical-orange-500">Test.</span>
            </h1>

            <p className="text-lg md:text-xl text-teal-50 leading-relaxed font-light opacity-90">
              Experience world-class diagnostic services with state-of-the-art technology.
              We prioritize accuracy, speed, and your comfort above all else.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <Link href="/appointment">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-medical-orange-500 text-white px-8 py-4 rounded-full font-bold hover:bg-medical-orange-600 transition-all shadow-lg hover:shadow-orange-500/30 w-full sm:w-auto"
                >
                  Book Your Test
                </motion.button>
              </Link>
              <Link href="/services">
                <motion.button
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                  whileTap={{ scale: 0.95 }}
                  className="backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-full font-semibold hover:border-white transition-all w-full sm:w-auto"
                >
                  Explore Services
                </motion.button>
              </Link>
            </div>

            <div className="pt-8 flex items-center gap-8 text-sm font-medium text-teal-100/80">
              <div className="flex items-center gap-2">
                <CheckCircle className="text-medical-orange-500" size={18} /> 100% Accurate
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-medical-orange-500" size={18} /> Fast Reporting
              </div>
              <div className="flex items-center gap-2">
                <Activity className="text-medical-orange-500" size={18} /> ISO Certified
              </div>
            </div>
          </motion.div>

          {/* Floating Glass Card - Visual Element */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="hidden lg:block relative"
          >
            {/* Decorative Blobs */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-medical-orange-500 rounded-full blur-[100px] opacity-20 animate-pulse"></div>
            <div className="absolute -bottom-20 -left-10 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-20"></div>

            <div className="relative bg-white/10 backdrop-blur-xl p-8 rounded-3xl border border-white/20 shadow-2xl text-white overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Microscope size={120} />
              </div>

              <h3 className="text-2xl font-bold mb-6 relative z-10">Our Commitment</h3>

              <div className="space-y-6 relative z-10">
                <div className="flex items-start gap-4">
                  <div className="bg-medical-teal-500/20 p-3 rounded-xl border border-medical-teal-500/30">
                    <Droplet size={24} className="text-medical-teal-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Advanced Pathology</h4>
                    <p className="text-sm text-teal-100/70 leading-relaxed">Using AI-integrated microscopes for precise tissue analysis.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-medical-teal-500/20 p-3 rounded-xl border border-medical-teal-500/30">
                    <Beaker size={24} className="text-medical-teal-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Bio-Chemistry</h4>
                    <p className="text-sm text-teal-100/70 leading-relaxed">Fully automated analyzers ensuring zero human error.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-medical-teal-500/20 p-3 rounded-xl border border-medical-teal-500/30">
                    <HomeIcon size={24} className="text-medical-teal-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">Home Collection</h4>
                    <p className="text-sm text-teal-100/70 leading-relaxed">Book a test and we will collect sample from your home.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-medical-teal-500/20 p-3 rounded-xl border border-medical-teal-500/30">
                    <Sparkles size={24} className="text-medical-teal-200" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg">50+ Special Tests</h4>
                    <p className="text-sm text-teal-100/70 leading-relaxed">Advanced rare disease and genetic testing available.</p>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-center">
                <div className="text-sm">
                  <p className="text-teal-200">Daily Tests</p>
                  <p className="text-2xl font-bold">500+</p>
                </div>
                <div className="text-sm text-right">
                  <p className="text-teal-200">Doctor Network</p>
                  <p className="text-2xl font-bold">120+</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Preview - Clean & Minimal */}
      <section className="py-16 bg-medical-gray relative">
        <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-medical-teal-600 font-bold tracking-wider uppercase text-sm mb-2">Our Expertise</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 font-display">Services We Offer</h2>
            <div className="w-20 h-1 bg-medical-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg">
              We cover a wide spectrum of diagnostic tests, ensuring you get a complete health picture under one roof.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <ServiceCard
              title="Pathology"
              description="Comprehensive tissue analysis and cytology services."
              icon={<Microscope size={28} />}
              link="/services"
            />
            <ServiceCard
              title="Biochemistry"
              description="Liver, Kidney, Lipid profiles & specialized chemical tests."
              icon={<Beaker size={28} />}
              link="/services"
            />
            <ServiceCard
              title="Hematology"
              description="Complete blood counts and anemia studies."
              icon={<Droplet size={28} />}
              link="/services"
            />
            <ServiceCard
              title="Wellness"
              description="Preventive health packages for all age groups."
              icon={<Activity size={28} />}
              link="/services"
            />
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <button className="group text-medical-teal-600 font-bold text-lg flex items-center gap-2 mx-auto hover:text-medical-orange-500 transition-colors">
                View All Departments
                <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Our Doctors Section - NEW */}
      <section className="py-16 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50 rounded-full blur-[80px] opacity-60"></div>
        <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h4 className="text-medical-teal-600 font-bold tracking-wider uppercase text-sm mb-2">Meet Experts</h4>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Medical Team</h2>
            <div className="w-20 h-1 bg-medical-orange-500 mx-auto rounded-full mb-6"></div>
            <p className="text-gray-600 text-lg">
              Led by highly qualified specialists dedicated to providing accurate diagnostics and patient care.
            </p>
          </div>

          {/* Infinite Scroll Marquee */}
          <DynamicDoctorCarousel />
        </div>
      </section>

      {/* Why Choose Us & Appointment - Integrated Design */}
      <section className="py-16 bg-white overflow-hidden">
        <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 xl:gap-24 items-start">
            <div>
              <h4 className="text-medical-teal-600 font-bold tracking-wider uppercase text-sm mb-2">Why Us?</h4>
              <h2 className="text-4xl font-bold text-gray-900 mb-8 max-w-lg">We Set The Standard For <span className="text-medical-teal-500">Medical Diagnostics.</span></h2>

              <div className="grid gap-8">
                <div className="flex gap-4">
                  <div className="shrink-0 bg-teal-50 w-16 h-16 rounded-2xl flex items-center justify-center text-medical-teal-600 shadow-sm">
                    <CheckCircle size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Detailed Reports</h3>
                    <p className="text-gray-600 leading-relaxed">Our reports are detailed, easy to understand, and come with doctor&apos;s notes for critical values.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 bg-orange-50 w-16 h-16 rounded-2xl flex items-center justify-center text-medical-orange-600 shadow-sm">
                    <Clock size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Timely Delivery</h3>
                    <p className="text-gray-600 leading-relaxed">We respect your time. Online report access ensures you don&apos;t have to visit twice.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="shrink-0 bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm">
                    <Microscope size={32} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Hygiene First</h3>
                    <p className="text-gray-600 leading-relaxed">Strict sterilization protocols and disposable kits for every patient.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-medical-teal-500 to-medical-orange-500 rounded-3xl blur opacity-20"></div>
              <div className="relative bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-gray-50 px-8 py-6 border-b border-gray-100">
                  <h3 className="text-xl font-bold text-gray-800">Quick Appointment</h3>
                  <p className="text-gray-500 text-sm">No waiting lines. Book your slot now.</p>
                </div>
                <div className="p-0">
                  <AppointmentForm />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Location CTA - High Contrast & Visible */}
      <section className="relative py-20 bg-[#00363b] overflow-hidden">
        {/* CSS Pattern instead of missing image */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

        <div className="absolute top-0 right-0 w-96 h-96 bg-[#009ca6] rounded-full blur-[150px] opacity-20 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#ef8e1e] rounded-full blur-[120px] opacity-20 pointer-events-none"></div>

        <div className="w-full max-w-[90%] 2xl:max-w-[1600px] mx-auto px-4 relative z-10 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-8 drop-shadow-md">Visit Our Center</h2>
          <p className="text-white text-xl mb-12 max-w-2xl mx-auto font-medium leading-relaxed drop-shadow-sm">
            Conveniently located in Panipokhari RS sadan building 2nd floor.<br />
            <span className="text-[#ef8e1e] font-bold mt-2 block">Opposite to panipokhari height colony, Kathmandu</span>
          </p>
          <div className="flex flex-col sm:flex-row gap-5 justify-center">
            <Link href="/contact" className="bg-white text-[#00363b] px-10 py-5 rounded-full font-extrabold hover:bg-gray-100 transition shadow-[0_0_25px_rgba(255,255,255,0.4)] inline-flex items-center gap-2 justify-center text-lg transform hover:-translate-y-1">
              <ArrowRight size={22} className="text-[#ef8e1e]" /> Get Directions
            </Link>
            <a href="tel:015916870" className="bg-[#ef8e1e] text-white px-10 py-5 rounded-full font-extrabold hover:bg-[#d67c15] transition shadow-lg inline-flex items-center gap-2 justify-center text-lg transform hover:-translate-y-1">
              <Clock size={22} /> Call Now
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
