import React from 'react';
import { motion } from 'framer-motion';
import CompoundInterest from './CompoundInterest';

function Wealth() {
    return (
        // พื้นหลัง Deep Charcoal (#0B0E14)
        <div className="min-h-screen bg-[#0B0E14] text-white selection:bg-[#C5A059] selection:text-black font-sans relative overflow-hidden">

            {/* เอฟเฟกต์แสงฟุ้งๆ (Ambient Glow) สไตล์แอปเปิล */}
            <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#C5A059] opacity-[0.07] blur-[120px] rounded-full pointer-events-none"></div>

            {/* Navbar แบบเรียบง่าย */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-6 md:px-12 max-w-7xl mx-auto">
                <div className="text-xl font-semibold tracking-tighter flex items-center gap-2">
                    {/* โลโก้จำลองสีทอง */}
                    <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[#C5A059] to-[#E8D095]"></div>
                    Wealth<span className="text-white/50 font-light">OS</span>
                </div>
                <a href="/" className="text-sm text-gray-400 hover:text-white transition-colors duration-300">
                    Return to Portfolio
                </a>
            </nav>

            {/* Hero Section */}
            <main className="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 md:pt-32 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} // Easing นุ่มๆ แบบ Apple
                    className="flex flex-col items-center"
                >
                    {/* Subtitle */}
                    <p className="text-[#C5A059] text-xs md:text-sm font-medium tracking-[0.2em] uppercase mb-6">
                        Private Wealth Management Tool
                    </p>

                    {/* Main Headline (ใช้ tracking-tight ให้ตัวอักษรชิดกันนิดๆ สไตล์ Apple) */}
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-8 leading-[1.1]">
                        Empower your legacy. <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C5A059] via-[#E8D095] to-[#C5A059]">
                            Driven by data.
                        </span>
                    </h1>

                    {/* Description */}
                    <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
                        Elevate financial planning through advanced algorithms and intuitive design.
                        Experience the intersection of computer science and private banking.
                    </p>

                    {/* Buttons */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-5 w-full sm:w-auto">
                        <button className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-[#C5A059] to-[#D4B872] text-black font-semibold rounded-full hover:scale-105 transition-transform duration-300 shadow-[0_0_30px_rgba(197,160,89,0.2)]">
                            Calculate Wealth
                        </button>
                        <button className="w-full sm:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-medium rounded-full hover:bg-white/10 transition-all duration-300 backdrop-blur-md">
                            View Methodology
                        </button>
                    </div>
                </motion.div>
            </main>

            {/* พื้นที่สำหรับวาง Component เครื่องคำนวณทางการเงิน */}
            <section className="relative z-10 max-w-7xl mx-auto px-6 pb-32">
                <CompoundInterest />
            </section>

        </div>
    );
}

export default Wealth;