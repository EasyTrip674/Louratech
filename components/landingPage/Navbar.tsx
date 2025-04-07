"use client";

import { useState } from "react";
import { navLinks } from "@/utils/constants";
import { motion, AnimatePresence } from "motion/react";
import { MenuIcon, X } from "lucide-react";
import Link from "next/link";

const Navbar = () => {
  const [active, setActive] = useState("Accueil");
  const [toggle, setToggle] = useState(false);

  return (
    <nav className="w-full fixed top-0 left-0 z-50 dark:bg-gray-900 backdrop-blur-md shadow-theme-sm px-6 md:px-12 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <div className="text-gray-900 dark:text-white text-2xl font-bold">
          <span className="text-brand-500">Pro</span>Gestion
        </div>
      </Link>

      {/* Navigation Bureau */}
      <ul className="hidden md:flex space-x-8">
        {navLinks.map((nav) => (
          <li
            key={nav.id}
            className={`cursor-pointer text-[16px] font-medium transition-all duration-300 ${
              active === nav.title 
                ? "text-gray-900 dark:text-white font-bold" 
                : "text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            }`}
            onClick={() => setActive(nav.title)}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      {/* Bouton Menu Mobile */}
      <button
        className="md:hidden focus:outline-none z-50"
        onClick={() => setToggle(!toggle)}
      >
        {toggle ? <X className="w-6 h-6 text-gray-900 dark:text-white" /> : <MenuIcon className="w-6 h-6 text-gray-900 dark:text-white" />}
      </button>

      {/* Navigation Mobile */}
      <AnimatePresence>
        {toggle && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="fixed top-0 left-0 w-full h-screen z-40 bg-white dark:bg-gray-900 flex flex-col items-center justify-center"
          >
            <div className="flex flex-col items-center space-y-8 w-full h-full justify-center">
              {navLinks.map((nav) => (
                <motion.a
                  key={nav.id}
                  href={`#${nav.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-2xl font-medium text-gray-900 dark:text-white hover:text-brand-500 dark:hover:text-brand-400 transition-colors"
                  onClick={() => {
                    setActive(nav.title);
                    setToggle(false);
                  }}
                >
                  {nav.title}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
