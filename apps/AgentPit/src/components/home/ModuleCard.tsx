import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

interface ModuleCardProps {
  title: string
  subtitle: string
  icon: React.ReactNode
  route: string
  gradientFrom: string
  gradientTo: string
  delay?: number
}

const ModuleCard = ({
  title,
  subtitle,
  icon,
  route,
  gradientFrom,
  gradientTo,
  delay = 0
}: ModuleCardProps) => {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, delay)
    return () => clearTimeout(timer)
  }, [delay])

  const handleClick = () => {
    navigate(route)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        relative cursor-pointer transform transition-all duration-500 ease-out
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'}
        ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100 translate-y-0'}
      `}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className={`
        relative overflow-hidden rounded-3xl p-6
        bg-gradient-to-br ${gradientFrom} ${gradientTo}
        shadow-lg hover:shadow-2xl transition-shadow duration-300
        border border-white/20 backdrop-blur-sm
        min-h-[200px] flex flex-col items-center justify-center text-center
        group
      `}>
        <div className={`
          absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300
          rounded-3xl
        `} />

        <div className={`
          relative z-10 w-20 h-20 mb-4 rounded-2xl
          bg-white/20 backdrop-blur-md flex items-center justify-center
          transform transition-transform duration-300
          ${isHovered ? 'scale-110 rotate-3' : 'scale-100 rotate-0'}
          shadow-lg
        `}>
          <div className="text-4xl">
            {icon}
          </div>
        </div>

        <h3 className={`
          relative z-10 text-xl font-bold text-white mb-2
          transition-all duration-300
          ${isHovered ? 'text-yellow-200' : ''}
        `}>
          {title}
        </h3>

        <p className="relative z-10 text-sm text-white/90 font-medium">
          {subtitle}
        </p>

        <div className={`
          absolute -bottom-1 -right-1 w-16 h-16
          bg-white/10 rounded-full blur-xl
          transition-all duration-500
          ${isHovered ? 'w-24 h-24 opacity-60' : 'w-16 h-16 opacity-30'}
        `} />
      </div>
    </div>
  )
}

export default ModuleCard