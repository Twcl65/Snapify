import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
    Camera,
    ArrowLeft,
    Palette,
    Grid3X3,
    Image as ImageIcon,
    Sparkles
} from 'lucide-react'

interface PhotoboothProps {
    onCapture: (images: string[]) => void
    onBack: () => void
    selectedLayout: string
    onLayoutChange: (layout: string) => void
    selectedFilter: string
    onFilterChange: (filter: string) => void
}

const Photobooth = ({ onCapture, onBack, selectedLayout, onLayoutChange, selectedFilter, onFilterChange }: PhotoboothProps) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const countdownTimerRef = useRef<NodeJS.Timeout | null>(null)
    const [stream, setStream] = useState<MediaStream | null>(null)
    const [isCameraOn, setIsCameraOn] = useState(false)
    const [isStartingCamera, setIsStartingCamera] = useState(false)
    const [countdown, setCountdown] = useState<number | null>(null)
    const [isCapturing, setIsCapturing] = useState(false)
    const [selectedCountdown, setSelectedCountdown] = useState(3)
    const [isCameraInverted] = useState(true)
    const [capturedImages, setCapturedImages] = useState<string[]>([])
    const [captureCount, setCaptureCount] = useState(4)
    const [showEditButton, setShowEditButton] = useState(false)

    const layouts = [
        { id: 'single', name: 'Single', icon: ImageIcon, photoCount: 1, description: 'One large photo' },
        { id: 'strip', name: 'Strip', icon: Grid3X3, photoCount: 4, description: 'Vertical photo strip' },
        { id: 'grid', name: 'Grid', icon: Grid3X3, photoCount: 4, description: '2x2 grid layout' },
        { id: 'collage', name: 'Collage', icon: Sparkles, photoCount: 6, description: 'Mixed size collage' },
    ]

    const filters = [
        { id: 'normal', name: 'Normal', icon: ImageIcon, filter: 'none' },
        { id: 'vintage', name: 'Vintage', icon: Palette, filter: 'sepia(0.8) hue-rotate(30deg)' },
        { id: 'blackwhite', name: 'B&W', icon: Palette, filter: 'grayscale(100%)' },
        { id: 'warm', name: 'Warm', icon: Palette, filter: 'sepia(0.5) brightness(1.1) saturate(1.2)' },
        { id: 'cool', name: 'Cool', icon: Palette, filter: 'hue-rotate(180deg) saturate(1.2)' },
        { id: 'glow', name: 'Glow', icon: Palette, filter: 'brightness(1.3) saturate(1.5) drop-shadow(0 0 10px rgba(255,255,255,0.8))' },
    ]

    const startCamera = async () => {
        try {
            setIsStartingCamera(true)

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera access is not supported in this browser')
            }

            const mediaStream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: 'user',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            })

            setStream(mediaStream)

            if (videoRef.current) {
                const video = videoRef.current

                try {
                    video.srcObject = mediaStream

                    if (video.srcObject === mediaStream) {
                    } else {
                    }
                } catch (error) {
                }

                video.onloadedmetadata = () => {
                    setIsCameraOn(true)
                    setIsStartingCamera(false)
                }

                video.oncanplay = () => {
                    if (!isCameraOn) {
                        setIsCameraOn(true)
                        setIsStartingCamera(false)
                    }
                }

                video.onplaying = () => {
                    if (!isCameraOn) {
                        setIsCameraOn(true)
                        setIsStartingCamera(false)
                    }
                }

                video.load()

                video.play().then(() => {
                }).catch(() => {
                })

                setTimeout(() => {
                    if (isStartingCamera && !isCameraOn) {
                        setIsCameraOn(true)
                        setIsStartingCamera(false)
                    }
                }, 3000)
            }
        } catch (error) {
            setIsStartingCamera(false)
            if (error instanceof Error) {
                if (error.name === 'NotAllowedError') {
                    alert('Camera access was denied. Please allow camera access and refresh the page.')
                } else if (error.name === 'NotFoundError') {
                    alert('No camera found. Please connect a camera and try again.')
                } else if (error.name === 'NotSupportedError') {
                    alert('Camera access is not supported in this browser.')
                } else {
                    alert(`Camera error: ${error.message}`)
                }
            }
        }
    }

    useEffect(() => {
        startCamera()

        const currentLayout = layouts.find(layout => layout.id === selectedLayout)
        if (currentLayout) {
            setCaptureCount(currentLayout.photoCount)
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop())
            }
            if (countdownTimerRef.current) {
                clearTimeout(countdownTimerRef.current)
                countdownTimerRef.current = null
            }
        }
    }, [])

    const startCountdown = () => {
        if (isCapturing) {
            return
        }

        if (captureCount === 0) {
            return
        }

        if (countdownTimerRef.current) {
            clearTimeout(countdownTimerRef.current)
            countdownTimerRef.current = null
        }

        setIsCapturing(true)
        setCountdown(selectedCountdown)

        const runCountdown = (currentCount: number) => {
            if (currentCount > 1) {
                countdownTimerRef.current = setTimeout(() => {
                    setCountdown(currentCount - 1)
                    runCountdown(currentCount - 1)
                }, 1000)
            } else {
                setCountdown(0)
                capturePhoto()
                setCountdown(null)
            }
        }

        runCountdown(selectedCountdown)
    }

    const capturePhoto = async () => {
        if (!videoRef.current || !canvasRef.current) return

        const video = videoRef.current
        const canvas = canvasRef.current
        const ctx = canvas.getContext('2d')

        if (!ctx) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight

        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        const imageData = canvas.toDataURL('image/jpeg', 0.9)

        const filteredImageData = await applyFilterToImage(imageData, selectedFilter)

        setCapturedImages(prev => {
            const newImages = [...prev, filteredImageData]

            const currentLayout = layouts.find(layout => layout.id === selectedLayout)
            const requiredPhotos = currentLayout ? currentLayout.photoCount : 4

            if (newImages.length >= requiredPhotos) {
                setShowEditButton(true)
            }

            return newImages
        })

        setCaptureCount(prev => {
            const newCount = Math.max(0, prev - 1)
            return newCount
        })

        setIsCapturing(false)
    }



    const retakePhoto = (index: number) => {
        setCapturedImages(prev => {
            const newImages = prev.filter((_, i) => i !== index)

            const currentLayout = layouts.find(layout => layout.id === selectedLayout)
            const requiredPhotos = currentLayout ? currentLayout.photoCount : 4
            if (newImages.length < requiredPhotos) {
                setShowEditButton(false)
            }

            return newImages
        })

        const currentLayout = layouts.find(layout => layout.id === selectedLayout)
        const maxPhotos = currentLayout ? currentLayout.photoCount : 4
        setCaptureCount(prev => Math.min(maxPhotos, prev + 1))
    }

    const resetAllPhotos = () => {
        setCapturedImages([])
        const currentLayout = layouts.find(layout => layout.id === selectedLayout)
        setCaptureCount(currentLayout ? currentLayout.photoCount : 4)
        setShowEditButton(false)
    }

    const handleLayoutChange = (layoutId: string) => {
        const selectedLayout = layouts.find(layout => layout.id === layoutId)
        if (selectedLayout) {
            setCaptureCount(selectedLayout.photoCount)
            setCapturedImages([])
            setShowEditButton(false)
        }
        onLayoutChange(layoutId)
    }

    const applyFilterToImage = (imageSrc: string, filterId: string): Promise<string> => {
        return new Promise((resolve) => {
            const canvas = canvasRef.current
            if (!canvas) {
                resolve(imageSrc)
                return
            }

            const ctx = canvas.getContext('2d')
            if (!ctx) {
                resolve(imageSrc)
                return
            }

            const img = new Image()
            img.onload = () => {
                canvas.width = img.width
                canvas.height = img.height

                const selectedFilter = filters.find(f => f.id === filterId)
                if (selectedFilter && selectedFilter.filter !== 'none') {
                    ctx.filter = selectedFilter.filter
                }

                ctx.drawImage(img, 0, 0)
                resolve(canvas.toDataURL('image/jpeg', 0.9))
            }
            img.src = imageSrc
        })
    }

    return (
        <div className="min-h-screen bg-background p-4">
            <div className="flex justify-between items-center mb-6">
                <motion.button
                    onClick={onBack}
                    className="flex items-center space-x-2 text-text hover:text-primary-red transition-colors"
                    whileHover={{ x: -5 }}
                >
                    <ArrowLeft size={24} />
                    <span>Back to Home</span>
                </motion.button>

                <h1 className="text-2xl font-bold text-text">Snapify</h1>

                <div className="w-24"></div>
            </div>

            <div className="max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="card p-0 overflow-hidden">
                            <div className="relative bg-black rounded-t-2xl overflow-hidden">

                                <motion.video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    controls={false}
                                    className="w-full h-full object-cover"
                                    style={{
                                        filter: filters.find(f => f.id === selectedFilter)?.filter || 'none'
                                    }}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{
                                        opacity: isCameraOn ? 1 : 0,
                                        scale: isCameraOn ? 1 : 0.95,
                                        scaleX: isCameraInverted ? -1 : 1
                                    }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                />

                                {!isCameraOn && (
                                    <div className="absolute inset-0 aspect-video flex items-center justify-center">
                                        <div className="text-center text-white">
                                            <motion.div
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                <Camera size={64} className="mx-auto mb-4 opacity-70" />
                                            </motion.div>
                                            {isStartingCamera ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <p className="mb-4">Starting camera...</p>
                                                    <div className="animate-spin w-8 h-8 border-4 border-white border-t-transparent rounded-full mx-auto"></div>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    <p className="mb-4">Camera not started</p>
                                                    <motion.button
                                                        onClick={startCamera}
                                                        className="px-6 py-3 bg-primary-red text-white rounded-xl hover:bg-red-600 transition-colors"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Start Camera
                                                    </motion.button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {countdown && (
                                    <motion.div
                                        className="absolute inset-0 flex items-center justify-center bg-black/50"
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                    >
                                        <motion.div
                                            className="text-white text-8xl font-bold"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 0.5 }}
                                        >
                                            {countdown}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-text font-medium">Countdown:</span>
                                        <select
                                            value={selectedCountdown}
                                            onChange={(e) => setSelectedCountdown(Number(e.target.value))}
                                            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-red"
                                        >
                                            <option value={3}>3s</option>
                                            <option value={5}>5s</option>
                                            <option value={10}>10s</option>
                                        </select>
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <span className="text-text font-medium">Captures left:</span>
                                        <span className="text-2xl font-bold text-primary-red">{captureCount}</span>
                                    </div>

                                    <motion.button
                                        onClick={startCountdown}
                                        disabled={isCapturing || !isCameraOn || captureCount === 0}
                                        className="w-20 h-20 bg-primary-red rounded-full flex items-center justify-center text-white shadow-soft hover:shadow-soft-hover transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        <Camera size={32} />
                                    </motion.button>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="card">
                                <h3 className="text-lg font-semibold text-text mb-4">Layout</h3>
                                <select
                                    value={selectedLayout}
                                    onChange={(e) => handleLayoutChange(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red"
                                >
                                    {layouts.map((layout) => (
                                        <option key={layout.id} value={layout.id}>
                                            {layout.name} ({layout.photoCount} photos)
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Current Layout:</p>
                                    <div className="flex items-center space-x-2">
                                        <div className="w-8 h-8 bg-primary-red rounded-lg flex items-center justify-center text-white text-xs font-bold">
                                            {layouts.find(l => l.id === selectedLayout)?.photoCount}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-800">
                                                {layouts.find(l => l.id === selectedLayout)?.name}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                {layouts.find(l => l.id === selectedLayout)?.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="card">
                                <h3 className="text-lg font-semibold text-text mb-4">Filters</h3>
                                <select
                                    value={selectedFilter}
                                    onChange={(e) => onFilterChange(e.target.value)}
                                    className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-red"
                                >
                                    {filters.map((filter) => (
                                        <option key={filter.id} value={filter.id}>
                                            {filter.name}
                                        </option>
                                    ))}
                                </select>
                                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-medium text-gray-700 mb-2">Active Filter:</p>
                                    <div className="flex items-center space-x-2">
                                        <div
                                            className="w-8 h-8 rounded-lg border-2 border-gray-300"
                                            style={{
                                                filter: filters.find(f => f.id === selectedFilter)?.filter || 'none',
                                                background: 'linear-gradient(45deg, #f0f0f0, #e0e0e0)'
                                            }}
                                        ></div>
                                        <span className="text-sm text-gray-600">
                                            {filters.find(f => f.id === selectedFilter)?.name}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Filter preview shown on camera feed
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Captured images display */}
                    <div className="lg:col-span-1">
                        <div className="card">
                            <h3 className="text-lg font-semibold text-text mb-4">Captured Photos</h3>
                            {capturedImages.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    <Camera size={48} className="mx-auto mb-2 opacity-50" />
                                    <p>No photos captured yet</p>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {capturedImages.map((image, index) => (
                                        <motion.div
                                            key={index}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            className="relative group"
                                        >
                                            <img
                                                src={image}
                                                alt={`Captured photo ${index + 1}`}
                                                className="w-full h-32 object-cover rounded-lg"
                                                style={{ transform: 'scaleX(-1)' }}
                                            />

                                            {/* Retake button overlay */}
                                            <div className="absolute top-2 right-2">
                                                <motion.button
                                                    onClick={() => retakePhoto(index)}
                                                    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-colors"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    title="Retake photo"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                </motion.button>
                                            </div>

                                            {/* Photo number overlay */}
                                            <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm font-medium">
                                                Photo {index + 1}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Edit Photos Button */}
                            {showEditButton && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.5, delay: 0.3 }}
                                    className="mt-6 space-y-3"
                                >
                                    <motion.button
                                        onClick={() => onCapture(capturedImages)}
                                        className="w-full bg-primary-red text-white py-3 px-6 rounded-xl font-semibold hover:bg-red-600 transition-colors shadow-lg"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        ✨ Edit Photos & Customize
                                    </motion.button>
                                    <div className="text-xs text-gray-500 text-center">
                                        Layout: {layouts.find(l => l.id === selectedLayout)?.name} |
                                        Filter: {filters.find(f => f.id === selectedFilter)?.name}
                                    </div>

                                    <motion.button
                                        onClick={resetAllPhotos}
                                        className="w-full bg-gray-500 text-white py-2 px-6 rounded-xl font-medium hover:bg-gray-600 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        🔄 Start Over
                                    </motion.button>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
        </div>
    )
}

export default Photobooth
