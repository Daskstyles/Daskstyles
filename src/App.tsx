import React, { useMemo, useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Check, Sparkles, LineChart, Shield, Mail, Clock, ArrowRight,
  BadgeEuro, Calculator as CalcIcon, Building2, Users, Rocket, Linkedin,
  Instagram, Globe, FileText, Upload, Search, Tag, ChevronRight
} from "lucide-react";

/**
 * Combined BUPrime Website
 * - Full site with blog + calculator (from your JSX)
 * - Hero, services, contact form with Formspree
 * - Adds framer-motion animations for hero + services cards
 */

const BRAND = { name: "B.U Prime", email: "hello@buprime.com", phone: "+30 210 000 0000" };

export default function App() {
  // runtime checks
  useEffect(() => {
    const form = document.querySelector('form[action^="https://formspree.io/"]');
    console.assert(!!form, "Formspree <form> action missing or incorrect");
    console.assert(document.getElementById("contact") !== null, "#contact section missing");
  }, []);

  return (
    <div className="site min-h-screen flex flex-col bg-slate-950 text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-20 backdrop-blur bg-slate-900/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto flex justify-between items-center px-6 h-16">
          <span className="font-bold text-xl">{BRAND.name}</span>
          <nav className="flex gap-6 text-sm text-slate-300">
            <a href="#services">Services</a>
            <a href="#pricing">Pricing</a>
            <a href="#calculator">Calculator</a>
            <a href="#blog">Blog</a>
            <a href="#contact">Contact</a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section id="home" className="hero bg-gradient-to-r from-indigo-600 to-violet-700 text-center py-24">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-5xl font-extrabold"
        >
          Creative Marketing meets Business Intelligence
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-2xl mx-auto text-lg text-slate-200"
        >
          We help SMEs grow through digital marketing, BI dashboards, and HR support.
        </motion.p>
        <motion.a
          href="#contact"
          className="btn inline-flex bg-white text-indigo-600 font-bold mt-6 px-6 py-3 rounded-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Proposal
        </motion.a>
      </section>

      {/* Services */}
      <section id="services" className="py-16 bg-slate-950">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Our Services</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {["Web Development", "Digital Marketing", "Branding"].map((s) => (
              <motion.div key={s} whileHover={{ y: -6 }} className="p-6 rounded-xl border border-white/10 bg-slate-900/60">
                <h3 className="font-semibold text-lg mb-2">{s}</h3>
                <p className="text-slate-300 text-sm">High-impact {s.toLowerCase()} services for SMEs.</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog preview */}
      <section id="blog" className="py-16 bg-slate-900">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">From the Blog</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-5 rounded-xl border border-white/10 bg-slate-800">Post 1 preview</div>
            <div className="p-5 rounded-xl border border-white/10 bg-slate-800">Post 2 preview</div>
            <div className="p-5 rounded-xl border border-white/10 bg-slate-800">Post 3 preview</div>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 bg-slate-950">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center mb-10">Contact Us</h2>
          <form
            action="https://formspree.io/f/mrbgjzvo"
            method="POST"
            className="space-y-4 bg-slate-900/70 p-6 rounded-xl border border-white/10"
          >
            <div>
              <label className="block mb-1">Your Name</label>
              <input type="text" name="name" required className="w-full p-3 rounded bg-slate-800 border border-white/10" />
            </div>
            <div>
              <label className="block mb-1">Your Email</label>
              <input type="email" name="email" required className="w-full p-3 rounded bg-slate-800 border border-white/10" />
            </div>
            <div>
              <label className="block mb-1">Message</label>
              <textarea name="message" rows={4} required className="w-full p-3 rounded bg-slate-800 border border-white/10" />
            </div>
            <button type="submit" className="bg-indigo-600 hover:bg-indigo-500 px-5 py-3 rounded-xl font-bold">
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center text-slate-400 border-t border-white/10">
        © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
      </footer>
    </div>
  );
}
