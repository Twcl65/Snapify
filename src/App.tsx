import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import LandingPage from './components/LandingPage'
import Photobooth from './components/Photobooth'
import PreviewStudio from './components/PreviewStudio'
import DownloadShare from './components/DownloadShare'

type AppState = 'landing' | 'photobooth' | 'preview' | 'download'

interface CustomizedData {
  images: string[]
  layout: string
  filter: string
  frame: string
  color: string
  watermark: string
  showDate: boolean
  date: string
}

function App() {
  const [currentState, setCurrentState] = useState<AppState>('landing')
  const [capturedImages, setCapturedImages] = useState<string[]>([])
  const [selectedLayout, setSelectedLayout] = useState<string>('strip')
  const [selectedFilter, setSelectedFilter] = useState<string>('normal')
  const [customizedData, setCustomizedData] = useState<CustomizedData | null>(null)

  const handleStartSession = () => {
    setCurrentState('photobooth')
  }

  const handleCapture = (images: string[]) => {
    setCapturedImages(images)
    setCurrentState('preview')
  }

  const handleConfirm = (data: CustomizedData) => {
    setCustomizedData(data)
    setCurrentState('download')
  }

  const handleRetake = () => {
    setCurrentState('photobooth')
  }

  const handleBackToLanding = () => {
    setCurrentState('landing')
    setCapturedImages([])
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatePresence mode="wait">
        {currentState === 'landing' && (
          <motion.div
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStartSession={handleStartSession} />
          </motion.div>
        )}

        {currentState === 'photobooth' && (
          <motion.div
            key="photobooth"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <Photobooth
              onCapture={handleCapture}
              onBack={handleBackToLanding}
              selectedLayout={selectedLayout}
              onLayoutChange={setSelectedLayout}
              selectedFilter={selectedFilter}
              onFilterChange={setSelectedFilter}
            />
          </motion.div>
        )}

        {currentState === 'preview' && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <PreviewStudio
              images={capturedImages}
              layout={selectedLayout}
              selectedFilter={selectedFilter}
              onConfirm={handleConfirm}
              onRetake={handleRetake}
              onBack={handleBackToLanding}
            />
          </motion.div>
        )}

        {currentState === 'download' && (
          <motion.div
            key="download"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5 }}
          >
            <DownloadShare
              images={capturedImages}
              layout={selectedLayout}
              customizedData={customizedData || undefined}
              onBackToLanding={handleBackToLanding}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App
