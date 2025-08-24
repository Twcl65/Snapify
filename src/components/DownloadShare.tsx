import { useState } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Download,
    Share2,
    Instagram,
    Facebook,
    Mail,
    CheckCircle
} from 'lucide-react'
import html2canvas from 'html2canvas'

interface DownloadShareProps {
    images: string[]
    layout: string
    customizedData?: {
        images: string[]
        layout: string
        filter: string
        frame: string
        color: string
        watermark: string
        showDate: boolean
        date: string
    }
    onBackToLanding: () => void
}

const DownloadShare = ({ images, layout, customizedData, onBackToLanding }: DownloadShareProps) => {
    const [downloadFormat, setDownloadFormat] = useState('png')
    const [isDownloading, setIsDownloading] = useState(false)
    const [downloadComplete, setDownloadComplete] = useState(false)

    const handleDownload = async () => {
        setIsDownloading(true)

        try {
            const photoContainer = document.getElementById('photo-container')
            if (!photoContainer) return

            const canvas = await html2canvas(photoContainer, {
                backgroundColor: null,
                scale: 2,
                useCORS: true,
                allowTaint: true
            })

            canvas.toBlob((blob) => {
                if (!blob) return

                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.download = `Snapify-${layout}-${Date.now()}.${downloadFormat}`
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                URL.revokeObjectURL(url)

                setDownloadComplete(true)
                setTimeout(() => setDownloadComplete(false), 2000)
            }, `image/${downloadFormat}`)
        } catch (error) {
        } finally {
            setIsDownloading(false)
        }
    }

    const handleShare = (platform: string) => {
        const shareData = {
            title: 'My Snapify Photos',
            text: 'Check out my amazing photos from Snapify!',
            url: window.location.href
        }

        if (navigator.share && platform === 'native') {
            navigator.share(shareData)
        } else {
            const urls = {
                instagram: 'https://instagram.com',
                facebook: 'https://facebook.com/sharer/sharer.php',
                mail: `mailto:?subject=${encodeURIComponent(shareData.title)}&body=${encodeURIComponent(shareData.text)}`
            }

            if (urls[platform as keyof typeof urls]) {
                window.open(urls[platform as keyof typeof urls], '_blank')
            }
        }
    }

    const displayImages = customizedData?.images || images
    const displayLayout = customizedData?.layout || layout
    const frameColor = customizedData?.color || '#FFFFFF'
    const watermark = customizedData?.watermark || 'Your Photos'
    const showDate = customizedData?.showDate || false
    const date = customizedData?.date || ''
    const filter = customizedData?.filter || 'normal'
    const frame = customizedData?.frame || 'strip'

    const isDarkColor = (color: string) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 128
    }

    const getFilterStyle = (filterId: string) => {
        const filterOptions = [
            { id: 'normal', filter: 'none' },
            { id: 'grayscale', filter: 'grayscale(100%)' },
            { id: 'dark', filter: 'brightness(0.6) contrast(1.2)' },
            { id: 'glow', filter: 'brightness(1.3) saturate(1.5) drop-shadow(0 0 10px rgba(255,255,255,0.8))' },
            { id: 'light', filter: 'brightness(1.4) contrast(0.8) saturate(1.2)' },
            { id: 'vintage', filter: 'sepia(0.8) hue-rotate(30deg)' },
            { id: 'cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
        ]
        const selectedFilter = filterOptions.find(f => f.id === filterId)
        return selectedFilter ? { filter: selectedFilter.filter } : {}
    }

    const getFrameStyle = (layoutType: string) => {
        const baseStyle = 'p-3 shadow-lg border-2'

        switch (layoutType) {
            case 'single':
                return `${baseStyle} aspect-square max-w-md mx-auto shadow-2xl`
            case 'strip':
                return `${baseStyle} flex flex-col space-y-2 max-w-sm mx-auto shadow-xl`
            case 'grid':
                return `${baseStyle} max-w-md mx-auto shadow-lg`
            case 'collage':
                return `${baseStyle} max-w-lg mx-auto shadow-xl`
            default:
                return baseStyle
        }
    }

    const renderLayout = () => {
        const frameStyle = getFrameStyle(displayLayout)
        const filterStyle = getFilterStyle(filter)
        const frameColorStyle = {
            backgroundColor: frameColor,
            borderColor: frameColor
        }

        const renderOverlay = (layoutType: string) => {
            if (frame.startsWith('overlay')) {
                const overlayNumber = frame.replace('overlay', '')

                if (layoutType === 'single') {
                    return (
                        <div className="absolute inset-0 pointer-events-none">
                            {overlayNumber === '1' && (
                                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '2' && (
                                <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '3' && (
                                <div className="absolute bottom-4 right-4 w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '4' && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '5' && (
                                <div className="absolute inset-4 border-4 border-white opacity-60 rounded-2xl"></div>
                            )}
                            {overlayNumber === '6' && (
                                <>
                                    <div className="absolute top-2 left-2 w-8 h-8 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute top-2 right-2 w-8 h-8 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute bottom-2 left-2 w-8 h-8 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute bottom-2 right-2 w-8 h-8 text-yellow-400 opacity-90">⭐</div>
                                </>
                            )}
                            {overlayNumber === '7' && (
                                <div className="absolute top-2 right-2 w-16 h-16 text-red-500 opacity-90 text-2xl">❤️</div>
                            )}
                            {overlayNumber === '8' && (
                                <div className="absolute inset-2 border-4 border-purple-500 opacity-80 transform rotate-45"></div>
                            )}
                        </div>
                    )
                } else if (layoutType === 'strip') {
                    return (
                        <div className="absolute inset-0 pointer-events-none">
                            {overlayNumber === '1' && (
                                <div className="absolute top-2 right-2 w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '2' && (
                                <div className="absolute top-2 left-2 w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '3' && (
                                <div className="absolute bottom-2 right-2 w-14 h-14 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '4' && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '5' && (
                                <div className="absolute inset-2 border-3 border-white opacity-60 rounded-lg"></div>
                            )}
                            {overlayNumber === '6' && (
                                <>
                                    <div className="absolute top-1 left-1 w-6 h-6 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute top-1 right-1 w-6 h-6 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute bottom-1 left-1 w-6 h-6 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute bottom-1 right-1 w-6 h-6 text-yellow-400 opacity-90">⭐</div>
                                </>
                            )}
                            {overlayNumber === '7' && (
                                <div className="absolute top-1 right-1 w-12 h-12 text-red-500 opacity-90 text-xl">❤️</div>
                            )}
                            {overlayNumber === '8' && (
                                <div className="absolute inset-1 border-3 border-purple-500 opacity-80 transform rotate-45"></div>
                            )}
                        </div>
                    )
                } else {
                    return (
                        <div className="absolute inset-0 pointer-events-none">
                            {overlayNumber === '1' && (
                                <div className="absolute top-2 right-2 w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-600 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '2' && (
                                <div className="absolute top-2 left-2 w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '3' && (
                                <div className="absolute bottom-2 right-2 w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '4' && (
                                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-green-400 to-teal-500 rounded-full opacity-90 shadow-lg"></div>
                            )}
                            {overlayNumber === '5' && (
                                <div className="absolute inset-2 border-3 border-white opacity-60 rounded-lg"></div>
                            )}
                            {overlayNumber === '6' && (
                                <>
                                    <div className="absolute top-1 left-1 w-7 h-7 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute top-1 right-1 w-7 h-7 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute bottom-1 left-1 w-7 h-7 text-yellow-400 opacity-90">⭐</div>
                                    <div className="absolute bottom-1 right-1 w-7 h-7 text-yellow-400 opacity-90">⭐</div>
                                </>
                            )}
                            {overlayNumber === '7' && (
                                <div className="absolute top-1 right-1 w-14 h-14 text-red-500 opacity-90 text-2xl">❤️</div>
                            )}
                            {overlayNumber === '8' && (
                                <div className="absolute inset-1 border-3 border-purple-500 opacity-80 transform rotate-45"></div>
                            )}
                        </div>
                    )
                }
            }
            return null
        }

        switch (displayLayout) {
            case 'single':
                return (
                    <div className={`${frameStyle} relative`} style={frameColorStyle}>
                        <div className="p-4 relative">
                            <img
                                src={displayImages[0]}
                                alt="Photo"
                                className="w-full h-full object-cover rounded-2xl"
                                style={{ ...filterStyle, transform: 'scaleX(-1)' }}
                            />
                        </div>
                        {renderOverlay('single')}
                        <div className="text-center mt-2 mb-4 font-medium" style={{ color: isDarkColor(frameColor) ? 'white' : '#374151' }}>
                            <div>{watermark}</div>
                            {showDate && (
                                <div className="text-sm mt-1 opacity-80">{date}</div>
                            )}
                        </div>
                    </div>
                )
            case 'strip':
                return (
                    <div className={`${frameStyle} relative`} style={frameColorStyle}>
                        <div className="pt-4">
                            {displayImages.slice(0, 4).map((image, index) => (
                                <motion.div
                                    key={index}
                                    className="relative mb-2"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="relative">
                                        <img
                                            src={image}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-24 object-cover rounded-xl"
                                            style={{ ...filterStyle, transform: 'scaleX(-1)' }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {renderOverlay('strip')}
                        <div className="text-center mt-2 mb-4 font-medium text-sm" style={{ color: isDarkColor(frameColor) ? 'white' : '#374151' }}>
                            <div>{watermark}</div>
                            {showDate && (
                                <div className="text-sm mt-1 opacity-80">{date}</div>
                            )}
                        </div>
                    </div>
                )
            case 'grid':
                return (
                    <div className={`${frameStyle} relative`} style={frameColorStyle}>
                        <div className="pt-4 grid grid-cols-2 gap-2">
                            {displayImages.slice(0, 4).map((image, index) => (
                                <motion.div
                                    key={index}
                                    className="relative"
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="relative">
                                        <img
                                            src={image}
                                            alt={`Photo ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-xl"
                                            style={{ ...filterStyle, transform: 'scaleX(-1)' }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {renderOverlay('grid')}
                        <div className="text-center mt-2 mb-4 font-medium text-sm" style={{ color: isDarkColor(frameColor) ? 'white' : '#374151' }}>
                            <div>{watermark}</div>
                            {showDate && (
                                <div className="text-sm mt-1 opacity-80">{date}</div>
                            )}
                        </div>
                    </div>
                )
            case 'collage':
                return (
                    <div className={`${frameStyle} relative`} style={frameColorStyle}>
                        <div className="pt-4 grid grid-cols-3 gap-1">
                            {displayImages.slice(0, 6).map((image, index) => (
                                <motion.div
                                    key={index}
                                    className={`relative ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="relative">
                                        <img
                                            src={image}
                                            alt={`Photo ${index + 1}`}
                                            className={`w-full object-cover rounded-lg ${index === 0 ? 'h-32' : 'h-16'}`}
                                            style={{ ...filterStyle, transform: 'scaleX(-1)' }}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {renderOverlay('collage')}
                        <div className="text-center mt-2 mb-4 font-medium text-sm" style={{ color: isDarkColor(frameColor) ? 'white' : '#374151' }}>
                            <div>{watermark}</div>
                            {showDate && (
                                <div className="text-sm mt-1 opacity-80">{date}</div>
                            )}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    return (
        <div className="min-h-screen bg-background p-4 relative overflow-hidden">

            <div className="flex justify-between items-center mb-6">
                <motion.button
                    onClick={onBackToLanding}
                    className="flex items-center space-x-2 text-text hover:text-primary-red transition-colors"
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={24} />
                    <span>Back to Home</span>
                </motion.button>

                <h1 className="text-2xl font-bold text-text">Download & Share</h1>

                <div className="w-24"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="card">
                        <h3 className="text-xl font-semibold text-text mb-6">Your Final Photos</h3>

                        <div className="mb-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="font-semibold text-text mb-2">Layout: {displayLayout}</h4>
                                    <p className="text-sm text-gray-600">
                                        {displayLayout === 'single' && 'Single large photo'}
                                        {displayLayout === 'strip' && 'Vertical photo strip with 4 photos'}
                                        {displayLayout === 'grid' && '2x2 grid layout with 4 photos'}
                                        {displayLayout === 'collage' && 'Mixed size collage with 6 photos'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <div className="text-2xl font-bold text-primary-red">
                                        {displayLayout === 'single' && '1'}
                                        {displayLayout === 'strip' && '4'}
                                        {displayLayout === 'grid' && '4'}
                                        {displayLayout === 'collage' && '6'}
                                    </div>
                                    <div className="text-xs text-gray-500">Photos</div>
                                </div>
                            </div>
                        </div>

                        <div id="photo-container" className="flex justify-center">
                            {renderLayout()}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
                                <Download size={20} />
                                <span>Download</span>
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-text mb-2">
                                        Download Format
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['png', 'jpg', 'pdf'].map((format) => (
                                            <motion.button
                                                key={format}
                                                onClick={() => setDownloadFormat(format)}
                                                className={`p-3 rounded-xl text-sm font-medium transition-all ${downloadFormat === format
                                                    ? 'bg-primary-red text-white'
                                                    : 'bg-gray-100 text-text hover:bg-gray-200'
                                                    }`}
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                {format.toUpperCase()}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                <motion.button
                                    onClick={handleDownload}
                                    disabled={isDownloading}
                                    className="w-full btn-primary flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    {downloadComplete ? (
                                        <>
                                            <CheckCircle size={20} />
                                            <span>Download Complete!</span>
                                        </>
                                    ) : (
                                        <>
                                            <Download size={20} />
                                            <span>{isDownloading ? 'Processing...' : 'Download Photos'}</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </div>

                        <div className="card">
                            <h3 className="text-lg font-semibold text-text mb-4 flex items-center space-x-2">
                                <Share2 size={20} />
                                <span>Share</span>
                            </h3>

                            <div className="space-y-3">
                                <motion.button
                                    onClick={() => handleShare('native')}
                                    className="w-full btn-secondary flex items-center justify-center space-x-2"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <Share2 size={20} />
                                    <span>Share via...</span>
                                </motion.button>

                                <div className="grid grid-cols-3 gap-3">
                                    <motion.button
                                        onClick={() => handleShare('instagram')}
                                        className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Instagram size={20} className="mx-auto mb-1" />
                                        <span className="text-xs">Instagram</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleShare('facebook')}
                                        className="p-3 bg-blue-600 text-white rounded-xl hover:shadow-lg transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Facebook size={20} className="mx-auto mb-1" />
                                        <span className="text-xs">Facebook</span>
                                    </motion.button>

                                    <motion.button
                                        onClick={() => handleShare('mail')}
                                        className="p-3 bg-gray-600 text-white rounded-xl hover:shadow-lg transition-all"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <Mail size={20} className="mx-auto mb-1" />
                                        <span className="text-xs">Email</span>
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="card">
                            <motion.button
                                onClick={onBackToLanding}
                                className="w-full btn-primary"
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Start New Session
                            </motion.button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DownloadShare
