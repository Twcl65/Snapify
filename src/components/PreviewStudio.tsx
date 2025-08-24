import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    ArrowLeft,
    Palette,
    Image as ImageIcon,
    Check,
    X,
} from 'lucide-react'

interface PreviewStudioProps {
    images: string[]
    layout: string
    selectedFilter: string
    onConfirm: (data: {
        images: string[]
        layout: string
        filter: string
        frame: string
        color: string
        watermark: string
        showDate: boolean
        date: string
    }) => void
    onRetake: () => void
    onBack: () => void
}

const PreviewStudio = ({
    images,
    layout,
    selectedFilter,
    onConfirm,
    onRetake,
    onBack
}: PreviewStudioProps) => {
    const getCurrentFormattedDate = () => {
        return new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    }

    const [activeTab, setActiveTab] = useState('colors')
    const [selectedColor, setSelectedColor] = useState('#FFFFFF')
    const [localSelectedFilter, setLocalSelectedFilter] = useState(selectedFilter)

    const [selectedFrame, setSelectedFrame] = useState('strip')
    const [eventInfo, setEventInfo] = useState({
        title: 'Snapify',
        date: getCurrentFormattedDate(),
        location: 'Special Event',
        showDate: true
    })
    const [customizedImages, setCustomizedImages] = useState<string[]>([])
    const canvasRef = useRef<HTMLCanvasElement>(null)

    const handleConfirm = () => {
        const customizedData = {
            images: customizedImages.length > 0 ? customizedImages : images,
            layout: layout,
            filter: localSelectedFilter,
            frame: selectedFrame,
            color: selectedColor,
            watermark: eventInfo.title,
            showDate: eventInfo.showDate,
            date: eventInfo.showDate ? getCurrentFormattedDate() : ''
        }
        onConfirm(customizedData)
    }



    const colors = [
        '#E63946', '#FFB703', '#2B2D42', '#FF6B6B',
        '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#FFFFFF', '#000000', '#8B4513', '#FF69B4'
    ]

    const filterOptions = [
        { id: 'normal', name: 'Normal', filter: 'none' },
        { id: 'grayscale', name: 'Grayscale', filter: 'grayscale(100%)' },
        { id: 'dark', name: 'Dark', filter: 'brightness(0.6) contrast(1.2)' },
        { id: 'glow', name: 'Glow', filter: 'brightness(1.3) saturate(1.5) drop-shadow(0 0 10px rgba(255,255,255,0.8))' },
        { id: 'light', name: 'Light', filter: 'brightness(1.4) contrast(0.8) saturate(1.2)' },
        { id: 'vintage', name: 'Vintage', filter: 'sepia(0.8) hue-rotate(30deg)' },
        { id: 'cool', name: 'Cool', filter: 'hue-rotate(180deg) saturate(1.2)' },
    ]

    const frames = [
        { id: 'none', name: 'None', style: 'none' },
        { id: 'overlay1', name: 'Pink Corner Circle', style: 'overlay1' },
        { id: 'overlay2', name: 'Yellow Corner Circle', style: 'overlay2' },
        { id: 'overlay3', name: 'Blue Bottom Circle', style: 'overlay3' },
        { id: 'overlay4', name: 'Green Center Circle', style: 'overlay4' },
        { id: 'overlay5', name: 'White Border Frame', style: 'overlay5' },
        { id: 'overlay6', name: 'Corner Stars', style: 'overlay6' },
        { id: 'overlay7', name: 'Heart Corner', style: 'overlay7' },
        { id: 'overlay8', name: 'Diamond Frame', style: 'overlay8' },
        { id: 'strip', name: 'Photo Strip', style: 'strip' },
        { id: 'polaroid', name: 'Polaroid', style: 'polaroid' },
        { id: 'vintage', name: 'Vintage', style: 'vintage' },
        { id: 'modern', name: 'Modern', style: 'modern' },
    ]



    const applyCustomization = async (imageSrc: string, filter: string): Promise<string> => {
        const canvas = canvasRef.current
        if (!canvas) return imageSrc

        const ctx = canvas.getContext('2d')
        if (!ctx) return imageSrc

        const img = new Image()
        img.crossOrigin = 'anonymous'

        return new Promise((resolve) => {
            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height

                ctx.filter = filter
                ctx.drawImage(img, 0, 0)

                resolve(canvas.toDataURL('image/jpeg', 0.9))
            }
            img.src = imageSrc
        })
    }

    useEffect(() => {
        const updateImages = async () => {
            const updatedImages = await Promise.all(
                images.map(img => applyCustomization(img,
                    filterOptions.find(f => f.id === localSelectedFilter)?.filter || 'none'
                ))
            )
            setCustomizedImages(updatedImages)
        }
        updateImages()
    }, [images, localSelectedFilter])

    useEffect(() => {
        setCustomizedImages(images)
    }, [images])

    useEffect(() => {
        setEventInfo(prev => ({
            ...prev,
            date: getCurrentFormattedDate()
        }))

        const interval = setInterval(() => {
            setEventInfo(prev => ({
                ...prev,
                date: getCurrentFormattedDate()
            }))
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (eventInfo.showDate) {
            setEventInfo(prev => ({
                ...prev,
                date: getCurrentFormattedDate()
            }))
        }
    }, [eventInfo.showDate])

    const getFilterStyle = (filterId: string) => {
        const filter = filterOptions.find(f => f.id === filterId)
        return filter ? { filter: filter.filter } : {}
    }

    const isDarkColor = (color: string) => {
        const hex = color.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16)
        const g = parseInt(hex.substr(2, 2), 16)
        const b = parseInt(hex.substr(4, 2), 16)
        const brightness = (r * 299 + g * 587 + b * 114) / 1000
        return brightness < 128
    }

    const formatDate = (dateString: string) => {
        try {
            if (!dateString || dateString === 'Invalid Date') {
                return getCurrentFormattedDate()
            }

            const date = new Date(dateString)

            if (isNaN(date.getTime())) {
                return getCurrentFormattedDate()
            }

            return date.toLocaleString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            })
        } catch (error) {
            return getCurrentFormattedDate()
        }
    }



    const getFrameStyle = (frameId: string, layoutType: string) => {
        let baseStyle = ''

        switch (frameId) {
            case 'overlay1':
            case 'overlay2':
            case 'overlay3':
            case 'overlay4':
            case 'overlay5':
                baseStyle = 'p-3 shadow-lg border-2 relative'
                break
            case 'polaroid':
                baseStyle = 'p-4 shadow-lg border-2'
                break
            case 'vintage':
                baseStyle = 'p-3 border-4'
                break
            case 'modern':
                baseStyle = 'p-2 shadow-2xl border-2'
                break
            case 'strip':
                baseStyle = 'p-3 shadow-lg border-2'
                break
            default:
                baseStyle = 'p-3 shadow-lg border-2'
        }

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
        const displayImages = customizedImages.length > 0 ? customizedImages : images
        const frameStyle = getFrameStyle(selectedFrame, layout)
        const filterStyle = getFilterStyle(localSelectedFilter)
        const frameColorStyle = {
            backgroundColor: selectedColor,
            borderColor: selectedColor
        }

        const renderOverlay = (layoutType: string) => {
            if (selectedFrame.startsWith('overlay')) {
                const overlayNumber = selectedFrame.replace('overlay', '')

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



        switch (layout) {
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
                        <div className="text-center mt-2 mb-4 font-medium" style={{ color: isDarkColor(selectedColor) ? 'white' : '#374151' }}>
                            <div>{eventInfo.title}</div>
                            {eventInfo.showDate && (
                                <div className="text-sm mt-1 opacity-80">
                                    {eventInfo.date ? formatDate(eventInfo.date) : 'Loading...'}
                                </div>
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
                        <div className="text-center mt-2 mb-4 font-medium text-sm" style={{ color: isDarkColor(selectedColor) ? 'white' : '#374151' }}>
                            <div>{eventInfo.title}</div>
                            {eventInfo.showDate && (
                                <div className="text-sm mt-1 opacity-80">
                                    {eventInfo.date ? formatDate(eventInfo.date) : 'Loading...'}
                                </div>
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
                        <div className="text-center mt-2 mb-4 font-medium text-sm" style={{ color: isDarkColor(selectedColor) ? 'white' : '#374151' }}>
                            <div>{eventInfo.title}</div>
                            {eventInfo.showDate && (
                                <div className="text-sm mt-1 opacity-80">
                                    {eventInfo.date ? formatDate(eventInfo.date) : 'Loading...'}
                                </div>
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
                        <div className="text-center mt-2 mb-4 font-medium text-sm" style={{ color: isDarkColor(selectedColor) ? 'white' : '#374151' }}>
                            <div>{eventInfo.title}</div>
                            {eventInfo.showDate && (
                                <div className="text-sm mt-1 opacity-80">
                                    {eventInfo.date ? formatDate(eventInfo.date) : 'Loading...'}
                                </div>
                            )}
                        </div>
                    </div>
                )
            default:
                return null
        }
    }

    const renderTabContent = () => {
        switch (activeTab) {
            case 'colors':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-text">Frame Color</h4>
                        <div className="grid grid-cols-4 gap-3">
                            {colors.map((color) => (
                                <motion.button
                                    key={color}
                                    onClick={() => setSelectedColor(color)}
                                    className={`w-12 h-12 rounded-xl border-2 transition-all ${selectedColor === color ? 'border-primary-red scale-110' : 'border-gray-300'
                                        }`}
                                    style={{ backgroundColor: color }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                />
                            ))}
                        </div>
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Custom Frame Color
                            </label>
                            <input
                                type="color"
                                value={selectedColor}
                                onChange={(e) => setSelectedColor(e.target.value)}
                                className="w-full h-12 rounded-xl border-2 border-gray-300 cursor-pointer"
                            />
                        </div>
                    </div>
                )

            case 'filters':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-text">Picture Filters</h4>
                        <div className="space-y-3">
                            {filterOptions.map((filter) => (
                                <motion.button
                                    key={filter.id}
                                    onClick={() => setLocalSelectedFilter(filter.id)}
                                    className={`w-full p-3 rounded-xl text-left transition-all ${localSelectedFilter === filter.id
                                        ? 'bg-primary-red text-white'
                                        : 'bg-gray-100 text-text hover:bg-gray-200'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{filter.name}</span>
                                        {localSelectedFilter === filter.id && (
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Current Filter:</p>
                            <div className="flex items-center space-x-2">
                                <div
                                    className="w-8 h-8 rounded-lg border-2 border-gray-300"
                                    style={{
                                        filter: filterOptions.find(f => f.id === localSelectedFilter)?.filter || 'none',
                                        background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)'
                                    }}
                                ></div>
                                <span className="text-sm text-gray-600">
                                    {filterOptions.find(f => f.id === localSelectedFilter)?.name}
                                </span>
                            </div>
                        </div>
                    </div>
                )



            case 'frames':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-text">Frame Style</h4>
                        <div className="space-y-3">
                            {frames.map((frame) => (
                                <motion.button
                                    key={frame.id}
                                    onClick={() => setSelectedFrame(frame.id)}
                                    className={`w-full p-3 rounded-xl text-left transition-all ${selectedFrame === frame.id
                                        ? 'bg-primary-red text-white'
                                        : 'bg-gray-100 text-text hover:bg-gray-200'
                                        }`}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-medium">{frame.name}</span>
                                        {selectedFrame === frame.id && (
                                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                                <div className="w-2 h-2 bg-primary-red rounded-full"></div>
                                            </div>
                                        )}
                                    </div>
                                </motion.button>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm font-medium text-gray-700 mb-2">Current Frame:</p>
                            <div className="text-sm text-gray-600">
                                {frames.find(f => f.id === selectedFrame)?.name}
                            </div>
                        </div>
                    </div>
                )

            case 'watermark':
                return (
                    <div className="space-y-4">
                        <h4 className="font-semibold text-text">Watermark</h4>
                        <div className="space-y-3">
                            <input
                                type="text"
                                placeholder="Snapify"
                                value={eventInfo.title}
                                onChange={(e) => setEventInfo({ ...eventInfo, title: e.target.value })}
                                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red"
                            />
                        </div>

                        <h4 className="font-semibold text-text mt-6">Date and Time</h4>
                        <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="showDate"
                                    checked={eventInfo.showDate}
                                    onChange={(e) => setEventInfo({ ...eventInfo, showDate: e.target.checked })}
                                    className="w-4 h-4 text-primary-red focus:ring-primary-red border-gray-300 rounded"
                                />
                                <label htmlFor="showDate" className="text-sm text-gray-700">
                                    Show Date & Time
                                </label>
                            </div>
                        </div>
                    </div>
                )

            default:
                return null
        }
    }

    const tabs = [
        { id: 'colors', name: 'Colors', icon: Palette },
        { id: 'filters', name: 'Filters', icon: ImageIcon },
        { id: 'frames', name: 'Frames', icon: ImageIcon },
        { id: 'watermark', name: 'Watermark', icon: ImageIcon },
    ]

    return (
        <div className="min-h-screen bg-gray-200 p-4">
            <div className="flex justify-between items-center mb-6">
                <motion.button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-text hover:text-primary-red transition-colors"
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={24} />
                    <span>Back to Camera</span>
                </motion.button>

                <h1 className="text-2xl font-bold text-text">Preview & Customize</h1>

                <div className="w-24"></div>
            </div>

            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="card">
                            <h3 className="text-xl font-semibold text-text mb-6">Your Photos</h3>
                            <div className="flex justify-center">
                                {renderLayout()}
                            </div>

                            <div className="flex justify-center space-x-4 mt-8">
                                <motion.button
                                    onClick={onRetake}
                                    className="btn-secondary flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <X size={20} />
                                    <span>Retake</span>
                                </motion.button>

                                <motion.button
                                    onClick={handleConfirm}
                                    className="btn-primary flex items-center space-x-2"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Check size={20} />
                                    <span>Confirm & Continue</span>
                                </motion.button>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-text mb-4">Customization</h3>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {tabs.map((tab) => (
                                    <motion.button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-3 py-2 rounded-xl text-sm font-medium transition-all ${activeTab === tab.id
                                            ? 'bg-primary-red text-white'
                                            : 'bg-gray-100 text-text hover:bg-gray-200'
                                            }`}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="flex items-center space-x-2">
                                            <tab.icon size={16} />
                                            <span>{tab.name}</span>
                                        </div>
                                    </motion.button>
                                ))}
                            </div>

                            <div className="min-h-[300px]">
                                {renderTabContent()}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}

export default PreviewStudio
