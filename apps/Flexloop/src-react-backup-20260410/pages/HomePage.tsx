import { useState, useEffect } from 'react'
import ModuleCard from '../components/home/ModuleCard'

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  const coreModules = [
    {
      title: '自动变现',
      subtitle: '全自动收益',
      icon: '💰',
      route: '/monetization',
      gradientFrom: 'from-emerald-400',
      gradientTo: 'to-teal-600'
    },
    {
      title: 'Sphinx 构建',
      subtitle: '快速建站',
      icon: '🏛️',
      route: '/sphinx',
      gradientFrom: 'from-amber-400',
      gradientTo: 'to-orange-600'
    },
    {
      title: '智能体与人交互',
      subtitle: '',
      icon: '💬',
      route: '/chat',
      gradientFrom: 'from-blue-400',
      gradientTo: 'to-indigo-600'
    },
    {
      title: '人与人的真实连接',
      subtitle: '',
      icon: '🤝',
      route: '/social',
      gradientFrom: 'from-pink-400',
      gradientTo: 'to-rose-600'
    },
    {
      title: '交易',
      subtitle: '',
      icon: '🛒',
      route: '/marketplace',
      gradientFrom: 'from-cyan-400',
      gradientTo: 'to-blue-600'
    },
    {
      title: '智能体核心',
      subtitle: '',
      icon: '🧠',
      route: '/collaboration',
      gradientFrom: 'from-violet-400',
      gradientTo: 'to-purple-600'
    },
    {
      title: '智能体与智能体交互自动协作',
      subtitle: '',
      icon: '🤖',
      route: '/collaboration',
      gradientFrom: 'from-fuchsia-400',
      gradientTo: 'to-pink-600'
    },
    {
      title: '存储记忆',
      subtitle: '',
      icon: '☁️',
      route: '/memory',
      gradientFrom: 'from-sky-400',
      gradientTo: 'to-cyan-600'
    },
    {
      title: '定制可以自动变现的智能体',
      subtitle: '',
      icon: '⚙️',
      route: '/customize',
      gradientFrom: 'from-slate-400',
      gradientTo: 'to-gray-600'
    }
  ]

  const extraModules = [
    {
      title: '约友',
      subtitle: '约会交友',
      icon: '💑',
      route: '/lifestyle',
      gradientFrom: 'from-red-400',
      gradientTo: 'to-pink-600'
    },
    {
      title: '开会',
      subtitle: '视频会议',
      icon: '📹',
      route: '/social',
      gradientFrom: 'from-green-400',
      gradientTo: 'to-emerald-600'
    },
    {
      title: '旅游',
      subtitle: '',
      icon: '✈️',
      route: '/lifestyle',
      gradientFrom: 'from-lime-400',
      gradientTo: 'to-green-600'
    },
    {
      title: '游戏',
      subtitle: '',
      icon: '🎮',
      route: '/lifestyle',
      gradientFrom: 'from-purple-400',
      gradientTo: 'to-violet-600'
    }
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900" />

      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-2000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className={`
          text-center mb-12 transition-all duration-1000 ease-out
          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-10'}
        `}>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
            利用该智能体，借助Sphinx构建一个可以
            <span className="block mt-2 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-transparent">
              自动变现的网站
            </span>
          </h1>

          <div className="w-32 h-1 mx-auto my-6 bg-gradient-to-r from-transparent via-white/50 to-transparent rounded-full" />

          <p className="text-lg md:text-xl text-white/90 font-medium tracking-wide">
            打造您的自动赚钱平台 ✨
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
          {coreModules.map((module, index) => (
            <ModuleCard
              key={module.title}
              {...module}
              delay={index * 100}
            />
          ))}
        </div>

        <div className={`
          mt-8 pt-8 border-t border-white/20 transition-all duration-1000 delay-700
          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}>
          <h2 className="text-2xl font-bold text-white text-center mb-6">
            更多精彩功能 🌟
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {extraModules.map((module, index) => (
              <ModuleCard
                key={module.title}
                {...module}
                delay={(9 + index) * 100}
              />
            ))}
          </div>
        </div>

        <div className={`
          text-center mt-12 pb-8 transition-all duration-1000 delay-1000
          ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}
        `}>
          <p className="text-white/70 text-sm">
            点击任意模块开始您的智能体之旅 →
          </p>
        </div>
      </div>
    </div>
  )
}

export default HomePage