import { motion } from 'framer-motion'
import { Camera, Sparkles, Heart, Image as ImageIcon, Share2 } from 'lucide-react'

interface LandingPageProps {
    onStartSession: () => void
}

const LandingPage = ({ onStartSession }: LandingPageProps) => {
    return (
        <div className="min-h-screen bg-white relative overflow-hidden">
            {/* Subtle pattern background */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, #e5e7eb 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            {/* Main content */}
            <div className="relative z-10 min-h-screen flex flex-col">
                {/* Navbar */}
                <nav className="flex justify-between items-center p-4 border-b border-gray-100">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="flex items-center space-x-3"
                    >
                        <div className="w-10 h-10 bg-red-500 rounded-xl flex items-center justify-center">
                            <Camera className="text-white" size={24} />
                        </div>
                        <span className="text-2xl font-bold text-gray-900">Snapify</span>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="hidden md:flex items-center space-x-8 text-gray-600"
                    >
                    </motion.div>
                </nav>

                {/* Hero section */}
                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="max-w-5xl"
                    >

                        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-8 leading-tight">
                            Capture Your
                            <span className="block text-red-500">
                                Perfect Moment
                            </span>
                        </h1>

                        <p className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed max-w-3xl mx-auto">
                            Create stunning photo memories with our modern photobooth experience.
                            Professional-quality photos with instant customization and sharing.
                        </p>

                        <motion.button
                            onClick={onStartSession}
                            className="group relative inline-flex items-center justify-center px-12 py-6 text-xl font-semibold text-white bg-red-500 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Camera className="mr-3 group-hover:rotate-12 transition-transform duration-300" size={24} />
                            Start Photo Session
                        </motion.button>
                    </motion.div>
                </div>

                {/* Features section */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                    className="px-6 pb-16"
                >
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-16">
                            Why Choose Snapify?
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.8 }}
                                className="text-center p-8 rounded-2xl bg-red-50 border border-red-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <ImageIcon className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Multiple Layouts</h3>
                                <p className="text-gray-600">Choose from single photos, strips, grids, or creative collages to match your style.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.9 }}
                                className="text-center p-8 rounded-2xl bg-red-50 border border-red-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Sparkles className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Instant Filters</h3>
                                <p className="text-gray-600">Apply beautiful filters and effects in real-time to make your photos stand out.</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 1.0 }}
                                className="text-center p-8 rounded-2xl bg-red-50 border border-red-100 hover:shadow-lg transition-all duration-300"
                            >
                                <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                    <Share2 className="text-white" size={32} />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-4">Easy Sharing</h3>
                                <p className="text-gray-600">Download your photos in multiple formats and share them instantly with friends and family.</p>
                            </motion.div>
                        </div>
                    </div>
                </motion.div>

                {/* Footer */}
                <motion.footer
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 1.2 }}
                    className="text-center py-12 border-t border-gray-100 bg-gray-50"
                >
                    <div className="max-w-4xl mx-auto px-6">
                        <div className="flex items-center justify-center space-x-2 mb-4">
                            <Heart className="text-red-500" size={20} />
                            <span className="text-gray-600">Made with love for special moments</span>
                        </div>
                        <p className="text-sm text-gray-500">
                            © 2024 Snapify - Cameron
                        </p>
                    </div>
                </motion.footer>
            </div>
        </div>
    )
}

export default LandingPage
