import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-[#FBFBFD] font-sans antialiased">
            
            {/* Manifest Header */}
            <section className="py-40 px-6 max-w-4xl mx-auto text-left space-y-8">
                <span className="text-[#0071E3] font-black text-[11px] uppercase tracking-[0.3em] block">
                    Our Philosophy
                </span>
                <h1 className="text-6xl sm:text-8xl font-black tracking-tighter text-[#1D1D1F] leading-[0.95]">
                    Engineering <br />
                    <span className="text-gray-300">the experience.</span>
                </h1>
                <p className="text-xl sm:text-2xl text-[#86868B] font-medium leading-relaxed tracking-tight max-w-2xl pt-4">
                    RentFlow was built to eliminate the friction between desire and destination. We bypass corporate bureaucracy to deliver absolute engineering at your fingertips.
                </p>
            </section>

            <section className="px-6 max-w-4xl mx-auto space-y-24 pb-32">
                
                <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-start gap-6">
                    <span className="text-xs font-black uppercase tracking-widest text-[#1D1D1F] sm:w-1/3">
                        01 / Curated Fleet
                    </span>
                    <p className="text-md text-[#86868B] font-medium tracking-tight sm:w-2/3 leading-relaxed">
                        We don’t stock cars; we select machinery. Every vehicle in our tiers undergoes strict mechanical calibration to ensure performance matches aesthetic perfection.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-start gap-6">
                    <span className="text-xs font-black uppercase tracking-widest text-[#1D1D1F] sm:w-1/3">
                        02 / Zero Friction
                    </span>
                    <p className="text-md text-[#86868B] font-medium tracking-tight sm:w-2/3 leading-relaxed">
                        Time is the ultimate luxury. Our interface is stripped of unnecessary data layers, allowing secure deployment of any vehicle in our fleet under sixty seconds.
                    </p>
                </div>

                <div className="border-t border-gray-100 pt-8 flex flex-col sm:flex-row justify-between items-start gap-6">
                    <span className="text-xs font-black uppercase tracking-widest text-[#1D1D1F] sm:w-1/3">
                        03 / Clear Integrity
                    </span>
                    <p className="text-md text-[#86868B] font-medium tracking-tight sm:w-2/3 leading-relaxed">
                        No hidden clauses. No algorithmic price surges. We operate on absolute transparency, providing premium hardware with software integrity.
                    </p>
                </div>

            </section>

            <section className="py-40 bg-[#1D1D1F] text-white px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-6">
                    <blockquote className="text-3xl sm:text-5xl font-black tracking-tighter leading-tight italic">
                        "At RentFlow, we don't just move people. <br />
                        <span className="text-[#0071E3] not-italic">We move souls.</span>"
                    </blockquote>
                    <div className="pt-4 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                        — RentFlow Studio Collective
                    </div>
                </div>
            </section>

        </div>
    );
};

export default About;