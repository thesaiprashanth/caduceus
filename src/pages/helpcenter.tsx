import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
    Search,
    BookOpen,
    MessageCircle,
    Users,
    ChevronDown,
    Plus,
    Target,
    Zap,
    ShieldCheck,
    Instagram,
    ArrowUpRight
} from 'lucide-react';

interface AccordionItemProps {
    title: string;
    content: string;
    isOpen: boolean;
    onClick: () => void;
}

const AccordionItem = ({ title, content, isOpen, onClick }: AccordionItemProps) => {
    return (
        <div className="border-b border-white/5 last:border-0">
            <button
                onClick={onClick}
                className="w-full py-6 flex items-center justify-between text-left group hover:text-white transition-colors"
            >
                <span className={`text-lg transition-colors ${isOpen ? 'text-white font-semibold' : 'text-white/60'}`}>
                    {title}
                </span>
                <div className={`p-2 rounded-lg bg-white/5 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-brand-primary/20' : ''}`}>
                    <ChevronDown className={`w-5 h-5 transition-colors ${isOpen ? 'text-brand-primary' : 'text-white/40'}`} />
                </div>
            </button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                    >
                        <p className="pb-8 text-white/40 leading-relaxed max-w-3xl">
                            {content}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default function HelpCenterPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [openAccordion, setOpenAccordion] = useState<number | null>(0);

    const categories = [
        {
            title: "User Guides",
            description: "Step-by-step tutorials to help you master lead extraction and outreach automation.",
            icon: <BookOpen className="w-8 h-8 text-[#00D1FF]" />,
            color: "bg-[#00D1FF]/10",
            borderColor: "border-[#00D1FF]/20"
        },
        {
            title: "AI Knowledge",
            description: "Understand how Gemini AI analyzes relationship quality and generates personalized leads.",
            icon: <Target className="w-8 h-8 text-brand-primary" />,
            color: "bg-brand-primary/10",
            borderColor: "border-brand-primary/20"
        },
        {
            title: "Community",
            description: "Join our Discord for strategy tips, networking with marketers, and platform updates.",
            icon: <Users className="w-8 h-8 text-[#FF00D1]" />,
            color: "bg-[#FF00D1]/10",
            borderColor: "border-[#FF00D1]/20"
        }
    ];

    const faqs = [
        {
            title: "How does the AI extract leads from Instagram?",
            content: "Caduceus uses Gemini 1.5 Flash to scan profile bios, engagement metrics, and post content. It identifies intent signals (like 'contact for business' or 'DM for collabs') and scores leads based on their relevance to your industry."
        },
        {
            title: "Is Caduceus compliant with Instagram's Terms of Service?",
            content: "Yes, Caduceus operates within safe rate limits and only accesses publicly available data. We use ethical extraction methods that prioritize account safety and data privacy."
        },
        {
            title: "Can I automate outreach directly from the dashboard?",
            content: "Absolutely. Once leads are identified in your pipeline, you can use our 'Smart Outreach' agent to generate personalized DM templates and automate follow-ups while maintaining a human-like touch."
        },
        {
            title: "Common API Integration issues",
            content: "If you're having trouble connecting your Instagram Business account, ensure that the account is linked to a Facebook Page and that you have granted 'Insights' and 'Messaging' permissions in the Meta Settings."
        }
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[#050505] text-white">
            {/* Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-accent/5 blur-[120px] rounded-full" />
                <div className="absolute top-[10%] right-[-10%] w-[40%] h-[40%] bg-brand-primary/5 blur-[120px] rounded-full" />
            </div>

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12">
                {/* Breadcrumb / Top Link */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <div className="flex gap-6 text-sm font-medium text-white/40">
                        <a href="#" className="hover:text-white transition-colors">Documentation</a>
                        <a href="#" className="hover:text-white transition-colors">Resources</a>
                        <a href="#" className="hover:text-white transition-colors">API Reference</a>
                    </div>
                    <div className="ml-auto flex gap-3">
                        <button className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-sm font-medium hover:bg-white/10 transition-all">
                            Submit a Request
                        </button>
                        <button className="px-5 py-2 rounded-full bg-brand-primary text-white text-sm font-bold hover:opacity-90 transition-all shadow-lg shadow-brand-primary/20">
                            Sign In
                        </button>
                    </div>
                </motion.div>

                {/* Hero Section */}
                <div className="text-center mb-24">
                    <motion.h1
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-5xl md:text-7xl font-bold tracking-tight mb-8"
                    >
                        How can we <span className="gradient-text italic font-serif">help you?</span>
                    </motion.h1>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="max-w-2xl mx-auto relative group"
                    >
                        <div className="absolute -inset-1 bg-gradient-to-r from-brand-accent via-brand-primary to-brand-secondary rounded-2xl blur opacity-20 group-focus-within:opacity-40 transition duration-500"></div>
                        <div className="relative flex items-center bg-[#0a0a0a] border border-white/10 rounded-2xl p-2 transition-all group-focus-within:border-white/20">
                            <div className="pl-4 text-white/30">
                                <Search className="w-5 h-5" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search for guides, FAQ, or features..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 bg-transparent border-none focus:ring-0 px-4 py-3 text-lg outline-none placeholder:text-white/20"
                            />
                            <div className="pr-2">
                                <button className="p-3 rounded-xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all">
                                    <ArrowUpRight className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                        <p className="mt-4 text-white/30 text-sm">
                            Or <span className="text-white/60 font-medium">explore topics</span> below to find what you need.
                        </p>
                    </motion.div>
                </div>

                {/* Categories Grid */}
                <div className="grid md:grid-cols-3 gap-6 mb-24">
                    {categories.map((cat, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -5 }}
                            className={`p-8 rounded-[2rem] bg-[#0a0a0a] border ${cat.borderColor} flex flex-col items-start gap-6 group cursor-pointer transition-all hover:bg-white/[0.02]`}
                        >
                            <div className={`p-4 rounded-2xl ${cat.color} transition-transform group-hover:scale-110 duration-500`}>
                                {cat.icon}
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors">{cat.title}</h3>
                                <p className="text-white/40 leading-relaxed">
                                    {cat.description}
                                </p>
                            </div>
                            <div className="mt-auto pt-4 flex items-center gap-2 text-sm font-semibold text-white/20 group-hover:text-white transition-colors">
                                Explore <ArrowUpRight className="w-4 h-4" />
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* FAQ Section */}
                <div className="max-w-4xl mx-auto">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-3xl font-bold mb-2">Getting Started</h2>
                            <p className="text-white/30">Everything you need to know to get up and running.</p>
                        </div>
                        <div className="hidden md:block">
                            <button className="flex items-center gap-2 text-sm font-semibold text-white/40 hover:text-white transition-colors">
                                View all FAQ <ArrowUpRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="bg-[#0a0a0a] border border-white/5 rounded-[2rem] px-8 py-4">
                        {filteredFaqs.length > 0 ? (
                            filteredFaqs.map((faq, idx) => (
                                <AccordionItem
                                    key={idx}
                                    title={faq.title}
                                    content={faq.content}
                                    isOpen={openAccordion === idx}
                                    onClick={() => setOpenAccordion(openAccordion === idx ? null : idx)}
                                />
                            ))
                        ) : (
                            <div className="py-12 text-center text-white/20 italic">
                                No results found for "{searchQuery}"
                            </div>
                        )}
                    </div>
                </div>

                {/* Support Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="mt-32 p-12 rounded-[3rem] bg-gradient-to-br from-brand-primary/20 via-[#0a0a0a] to-brand-accent/20 border border-white/10 text-center relative overflow-hidden"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl font-bold mb-4">Still need help?</h2>
                        <p className="text-white/40 max-w-xl mx-auto mb-10">
                            Our support team is available 24/7 to help you with any technical issues or strategy questions.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/90 transition-all flex items-center justify-center gap-2">
                                <MessageCircle className="w-5 h-5" />
                                Chat with Support
                            </button>
                            <button className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-white/5 border border-white/10 font-bold hover:bg-white/10 transition-all">
                                Send an Email
                            </button>
                        </div>
                    </div>

                    {/* Decorative icons behind */}
                    <div className="absolute top-10 right-10 opacity-[0.03] scale-[4]">
                        <Instagram className="w-24 h-24" />
                    </div>
                    <div className="absolute bottom-10 left-10 opacity-[0.03] scale-[3] -rotate-12">
                        <Zap className="w-24 h-24" />
                    </div>
                </motion.div>
            </div>
        </div>
    );
}