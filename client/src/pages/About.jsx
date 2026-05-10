import React from 'react';

const About = () => {
    return (
        <div className="min-h-screen bg-white">
            {/* Hero Section */}
            <section className="py-32 px-6 max-w-5xl mx-auto text-center">
                <span className="text-blue-600 font-black text-xs uppercase tracking-[0.4em] mb-6 block">Our Story</span>
                <h1 className="text-7xl font-black tracking-tighter text-[#1D1D1F] mb-10 leading-[0.9]">
                    Driven by <br /> <span className="text-gray-300">Perfection.</span>
                </h1>
                <p className="text-2xl text-[#86868B] font-medium leading-relaxed max-w-3xl mx-auto">
                    RentFlow is not just a car rental. It's a premium experience designed for those who value time, comfort, and the thrill of the road.
                </p>
            </section>

            {/* Grid Features */}
            <section className="py-20 px-6 bg-[#F5F5F7]">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        { title: "The Fleet", desc: "From Economic to Luxury, our cars are maintained to the highest Apple-like standards.", icon: "🏎️" },
                        { title: "Seamless", desc: "Book your dream car in less than 60 seconds with our intuitive interface.", icon: "📱" },
                        { title: "Transparent", desc: "No hidden fees. What you see is what you pay. Pure honesty.", icon: "💎" }
                    ].map((item, i) => (
                        <div key={i} className="bg-white p-12 rounded-[3rem] shadow-sm hover:shadow-xl transition-all duration-500">
                            <div className="text-4xl mb-6">{item.icon}</div>
                            <h3 className="text-2xl font-black tracking-tight mb-4">{item.title}</h3>
                            <p className="text-[#86868B] font-medium leading-relaxed">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Quote Section */}
            <section className="py-40 px-6 text-center max-w-4xl mx-auto">
                <blockquote className="text-4xl font-black italic tracking-tighter leading-tight text-[#1D1D1F]">
                    "At RentFlow, we don't just move people. <br /> We move souls."
                </blockquote>
                <div className="mt-8 font-bold text-gray-400 uppercase tracking-widest text-xs">— RentFlow Team</div>
            </section>
        </div>
    );
};

export default About;