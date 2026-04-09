import { useState, useEffect } from 'react'
import { type Game, type Achievement, games, achievements, leaderboardData } from '../../data/mockLifestyle'

type GameCategory = 'all' | Game['category']
type MiniGameType = 'numberGuess' | 'memory' | 'quiz' | null

const GameCenter = () => {
  const [selectedCategory, setSelectedCategory] = useState<GameCategory>('all')
  const [selectedGame, setSelectedGame] = useState<Game | null>(null)
  const [activeTab, setActiveTab] = useState<'games' | 'achievements' | 'leaderboard'>('games')
  const [currentMiniGame, setCurrentMiniGame] = useState<MiniGameType>(null)

  const filteredGames = selectedCategory === 'all'
    ? games
    : games.filter(game => game.category === selectedCategory)

  const categories: { key: GameCategory; label: string; icon: string }[] = [
    { key: 'all', label: '全部', icon: '🎮' },
    { key: 'casual', label: '休闲', icon: '🎯' },
    { key: 'puzzle', label: '益智', icon: '🧩' },
    { key: 'competitive', label: '竞技', icon: '⚔️' },
    { key: 'social', label: '社交', icon: '👥' },
    { key: 'adventure', label: '冒险', icon: '🗺️' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">游戏娱乐中心</h1>
          <p className="mt-2 text-gray-600">放松身心，享受游戏乐趣</p>
        </div>

        <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
          {[
            { key: 'games', label: '游戏大厅', icon: '🎮' },
            { key: 'achievements', label: '成就系统', icon: '🏆' },
            { key: 'leaderboard', label: '排行榜', icon: '📊' },
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as typeof activeTab)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1 ${
                activeTab === tab.key ? 'bg-white shadow text-primary-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'games' && !currentMiniGame && (
        <>
          {!selectedGame ? (
            <>
              <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl p-8 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="relative z-10">
                  <h2 className="text-3xl font-bold mb-2">🎉 欢迎来到游戏世界</h2>
                  <p className="text-white/90 mb-6">选择你喜欢的游戏，开始你的冒险之旅！</p>
                  <div className="grid grid-cols-3 gap-4 max-w-md">
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold">{games.length}</p>
                      <p className="text-sm opacity-90">款游戏</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold">{games.reduce((sum, g) => sum + g.onlinePlayers, 0).toLocaleString()}</p>
                      <p className="text-sm opacity-90">在线玩家</p>
                    </div>
                    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 text-center">
                      <p className="text-3xl font-bold">{achievements.length}</p>
                      <p className="text-sm opacity-90">个成就</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">快捷入口</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentMiniGame('numberGuess')}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">🔢</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">最近游玩</h4>
                        <p className="text-sm text-gray-500">数字猜谜</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      继续游戏
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setCurrentMiniGame('memory')}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">🃏</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">好友推荐</h4>
                        <p className="text-sm text-gray-500">记忆翻牌大师</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium">
                      开始游戏
                    </button>
                  </div>

                  <div className="bg-white rounded-lg shadow p-5 hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setSelectedGame(games[2])}>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">🔥</div>
                      <div>
                        <h4 className="font-semibold text-gray-900">热门游戏</h4>
                        <p className="text-sm text-gray-500">知识问答挑战</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
                      立即体验
                    </button>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-900">游戏分类</h3>
                </div>

                <div className="flex space-x-2 overflow-x-auto pb-2">
                  {categories.map(cat => (
                    <button
                      key={cat.key}
                      onClick={() => setSelectedCategory(cat.key)}
                      className={`px-5 py-2.5 rounded-full whitespace-nowrap font-medium transition-all flex items-center space-x-2 ${
                        selectedCategory === cat.key
                          ? 'bg-primary-600 text-white shadow-lg'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-primary-300'
                      }`}
                    >
                      <span>{cat.icon}</span>
                      <span>{cat.label}</span>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGames.map(game => (
                    <div
                      key={game.id}
                      onClick={() => setSelectedGame(game)}
                      className="bg-white rounded-lg shadow overflow-hidden hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                        <img
                          src={game.coverImage}
                          alt={game.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="px-6 py-3 bg-white text-gray-900 rounded-full font-semibold transform scale-95 group-hover:scale-100 transition-transform">
                            🎮 开始游戏
                          </button>
                        </div>
                        <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                          在线: {game.onlinePlayers.toLocaleString()}
                        </div>
                      </div>
                      <div className="p-5">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors">
                            {game.title}
                          </h3>
                          <div className="flex items-center space-x-1 bg-yellow-50 px-2 py-1 rounded">
                            <span className="text-yellow-500">⭐</span>
                            <span className="text-sm font-semibold text-yellow-700">{game.rating}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mb-3 line-clamp-2">{game.description}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-1">
                            {game.tags.slice(0, 2).map(tag => (
                              <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                {tag}
                              </span>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500">
                            👥 {game.playerCount.min}-{game.playerCount.max}人
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="relative h-96 bg-gradient-to-br from-gray-900 to-gray-700">
                <img src={selectedGame.coverImage} alt={selectedGame.title} className="w-full h-full object-cover opacity-80" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <button
                  onClick={() => setSelectedGame(null)}
                  className="absolute top-4 left-4 px-4 py-2 bg-white/20 backdrop-blur-md text-white rounded-lg hover:bg-white/30 transition-all"
                >
                  ← 返回
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <div className="flex items-end justify-between">
                    <div>
                      <h2 className="text-4xl font-bold text-white mb-2">{selectedGame.title}</h2>
                      <div className="flex items-center space-x-4 text-white/90">
                        <span>⭐ {selectedGame.rating}</span>
                        <span>👥 {selectedGame.playerCount.min}-{selectedGame.playerCount.max}人</span>
                        <span>🎮 {selectedGame.onlinePlayers.toLocaleString()} 在线</span>
                      </div>
                    </div>
                    <button className="px-8 py-4 bg-primary-600 text-white rounded-xl font-bold text-lg hover:bg-primary-700 transition-all transform hover:scale-105 shadow-xl">
                      🎮 开始游戏
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-3 gap-8">
                  <div className="col-span-2 space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">游戏介绍</h3>
                      <p className="text-gray-600 leading-relaxed">{selectedGame.description}</p>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">游戏截图</h3>
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg overflow-hidden">
                            <img
                              src={`https://images.unsplash.com/photo-1511512578047-dfb367046420?w=400`}
                              alt={'截图 ' + i}
                              className="w-full h-full object-cover hover:scale-105 transition-transform"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">玩家评价</h3>
                      <div className="space-y-4">
                        {[
                          { user: '玩家A', rating: 5, comment: '非常好玩的游戏，画面精美，操作流畅！', date: '2026-04-08' },
                          { user: '玩家B', rating: 4, comment: '很有趣，但是难度可以再调整一下。', date: '2026-04-07' },
                          { user: '玩家C', rating: 5, comment: '和朋友一起玩特别开心，推荐！', date: '2026-04-06' },
                        ].map((review, index) => (
                          <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center space-x-2">
                                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600 font-semibold">
                                  {review.user[0]}
                                </div>
                                <span className="font-medium text-gray-900">{review.user}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-yellow-500">{'⭐'.repeat(review.rating)}</span>
                                <span className="text-sm text-gray-400">{review.date}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 ml-12">{review.comment}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                      <h4 className="font-semibold text-gray-900 mb-4">游戏信息</h4>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">类型</span>
                          <span className="font-medium text-gray-900">
                            {selectedGame.category === 'casual' ? '休闲' :
                             selectedGame.category === 'puzzle' ? '益智' :
                             selectedGame.category === 'competitive' ? '竞技' :
                             selectedGame.category === 'social' ? '社交' : '冒险'}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">玩家人数</span>
                          <span className="font-medium text-gray-900">{selectedGame.playerCount.min}-{selectedGame.playerCount.max}人</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">在线人数</span>
                          <span className="font-medium text-primary-600">{selectedGame.onlinePlayers.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">评分</span>
                          <span className="font-medium text-yellow-600">⭐ {selectedGame.rating}/5</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 text-center">
                      <p className="text-4xl mb-2">🏆</p>
                      <p className="font-semibold text-gray-900 mb-1">挑战高分</p>
                      <p className="text-sm text-gray-500 mb-4">在排行榜上展示你的实力！</p>
                      <button
                        onClick={() => {
                          if (selectedGame.id === 'game-1') setCurrentMiniGame('numberGuess')
                          else if (selectedGame.id === 'game-2') setCurrentMiniGame('memory')
                          else if (selectedGame.id === 'game-3') setCurrentMiniGame('quiz')
                        }}
                        className="w-full py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium"
                      >
                        立即挑战
                      </button>
                    </div>

                    <div className="bg-gray-50 rounded-xl p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">标签</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGame.tags.map(tag => (
                          <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-sm text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'games' && currentMiniGame === 'numberGuess' && (
        <NumberGuessGame onBack={() => setCurrentMiniGame(null)} />
      )}

      {activeTab === 'games' && currentMiniGame === 'memory' && (
        <MemoryGame onBack={() => setCurrentMiniGame(null)} />
      )}

      {activeTab === 'games' && currentMiniGame === 'quiz' && (
        <QuizGame onBack={() => setCurrentMiniGame(null)} />
      )}

      {activeTab === 'achievements' && <AchievementsList />}

      {activeTab === 'leaderboard' && <Leaderboard />}
    </div>
  )
}

const NumberGuessGame = ({ onBack }: { onBack: () => void }) => {
  const [targetNumber, setTargetNumber] = useState(() => Math.floor(Math.random() * 100) + 1)
  const [guess, setGuess] = useState('')
  const [message, setMessage] = useState('')
  const [attempts, setAttempts] = useState(0)
  const [history, setHistory] = useState<{ guess: number; result: string }[]>([])
  const [isWon, setIsWon] = useState(false)

  const handleGuess = () => {
    const num = parseInt(guess)
    if (isNaN(num) || num < 1 || num > 100) {
      setMessage('请输入1-100之间的数字！')
      return
    }

    const newAttempts = attempts + 1
    setAttempts(newAttempts)

    let result: string
    if (num === targetNumber) {
      result = '🎉 恭喜你，猜对了！'
      setIsWon(true)
      setMessage(`太棒了！你在 ${newAttempts} 次尝试后猜对了数字 ${targetNumber}`)
    } else if (num < targetNumber) {
      result = '📈 太小了，再大一点！'
      setMessage(result)
    } else {
      result = '📉 太大了，再小一点！'
      setMessage(result)
    }

    setHistory([...history, { guess: num, result }])
    setGuess('')
  }

  const resetGame = () => {
    setTargetNumber(Math.floor(Math.random() * 100) + 1)
    setGuess('')
    setMessage('')
    setAttempts(0)
    setHistory([])
    setIsWon(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-8 text-white text-center">
          <button onClick={onBack} className="float-left mt-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all">← 返回</button>
          <h2 className="text-3xl font-bold">🔢 数字猜谜</h2>
          <p className="mt-2 opacity-90">我想了一个1到100之间的数字，你能猜出来吗？</p>
        </div>

        <div className="p-8">
          {!isWon ? (
            <div className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-4">
                  <span className="text-6xl font-bold text-blue-600">?</span>
                </div>
                <p className="text-gray-600">输入你的猜测（1-100）</p>
              </div>

              <div className="flex space-x-3">
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={guess}
                  onChange={(e) => setGuess(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleGuess()}
                  placeholder="输入数字..."
                  className="flex-1 px-6 py-4 text-2xl text-center border-2 border-gray-300 rounded-xl focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleGuess}
                  className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
                >
                  猜！
                </button>
              </div>

              {message && (
                <div className={`text-center p-4 rounded-xl ${message.includes('恭喜') ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'} text-lg font-medium`}>
                  {message}
                </div>
              )}

              <div className="text-center text-gray-500">
                已尝试次数：<span className="font-bold text-blue-600 text-xl">{attempts}</span>
              </div>

              {history.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4 max-h-48 overflow-y-auto">
                  <h4 className="font-semibold text-gray-700 mb-2">猜测历史：</h4>
                  <div className="space-y-1">
                    {history.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">第{index + 1}次：{item.guess}</span>
                        <span className={item.result.includes('小') ? 'text-blue-600' : item.result.includes('大') ? 'text-red-600' : 'text-green-600'}>
                          {item.result}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6">
              <div className="text-8xl animate-bounce">🎉</div>
              <h3 className="text-3xl font-bold text-green-600">恭喜你赢了！</h3>
              <p className="text-xl text-gray-700">答案就是 <span className="font-bold text-blue-600 text-3xl">{targetNumber}</span></p>
              <p className="text-gray-600">你用了 <span className="font-bold text-orange-600">{attempts}</span> 次就猜对了！</p>
              <button
                onClick={resetGame}
                className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 transition-colors"
              >
                再玩一次
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const emojis = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎵']
  const [cards, setCards] = useState<{ emoji: string; isFlipped: boolean; isMatched: boolean; id: number }[]>([])
  const [flippedCards, setFlippedCards] = useState<number[]>([])
  const [moves, setMoves] = useState(0)
  const [isWon, setIsWon] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  const initializeGame = () => {
    const shuffled = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, id) => ({ emoji, isFlipped: false, isMatched: false, id }))
    setCards(shuffled)
    setFlippedCards([])
    setMoves(0)
    setIsWon(false)
  }

  const flipCard = (id: number) => {
    if (flippedCards.length >= 2 || cards[id].isFlipped || cards[id].isMatched) return

    const newFlipped = [...flippedCards, id]
    setFlippedCards(newFlipped)

    const newCards = [...cards]
    newCards[id].isFlipped = true
    setCards(newCards)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      const [first, second] = newFlipped

      if (cards[first].emoji === cards[second].emoji) {
        setTimeout(() => {
          const matchedCards = [...cards]
          matchedCards[first].isMatched = true
          matchedCards[second].isMatched = true
          setCards(matchedCards)
          setFlippedCards([])

          if (matchedCards.every(card => card.isMatched)) {
            setIsWon(true)
          }
        }, 500)
      } else {
        setTimeout(() => {
          const resetCards = [...cards]
          resetCards[first].isFlipped = false
          resetCards[second].isFlipped = false
          setCards(resetCards)
          setFlippedCards([])
        }, 1000)
      }
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-8 text-white text-center">
          <button onClick={onBack} className="float-left mt-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all">← 返回</button>
          <h2 className="text-3xl font-bold">🃏 记忆翻牌大师</h2>
          <p className="mt-2 opacity-90">找出所有配对的卡片，考验你的记忆力！</p>
        </div>

        <div className="p-8">
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg">
              步数：<span className="font-bold text-green-600 text-2xl">{moves}</span>
            </div>
            <button
              onClick={initializeGame}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              重新开始
            </button>
          </div>

          {isWon ? (
            <div className="text-center space-y-6 py-12">
              <div className="text-8xl animate-bounce">🏆</div>
              <h3 className="text-3xl font-bold text-green-600">恭喜完成！</h3>
              <p className="text-xl text-gray-700">你用了 <span className="font-bold text-orange-600">{moves}</span> 步完成了游戏</p>
              <button
                onClick={initializeGame}
                className="px-8 py-4 bg-green-600 text-white rounded-xl font-bold text-lg hover:bg-green-700 transition-colors"
              >
                再玩一次
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {cards.map(card => (
                <button
                  key={card.id}
                  onClick={() => flipCard(card.id)}
                  className={`aspect-square rounded-xl text-5xl flex items-center justify-center transition-all duration-300 transform ${
                    card.isFlipped || card.isMatched
                      ? 'bg-white shadow-lg rotate-0 scale-105'
                      : 'bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 rotate-y-180'
                  } ${card.isMatched ? 'ring-4 ring-green-300' : ''}`}
                >
                  {(card.isFlipped || card.isMatched) ? card.emoji : '❓'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const QuizGame = ({ onBack }: { onBack: () => void }) => {
  const questions = [
    {
      question: '中国的首都是哪个城市？',
      options: ['上海', '北京', '广州', '深圳'],
      correct: 1,
    },
    {
      question: '一年有多少个月？',
      options: ['10个', '11个', '12个', '13个'],
      correct: 2,
    },
    {
      question: '太阳从哪个方向升起？',
      options: ['东', '南', '西', '北'],
      correct: 0,
    },
    {
      question: '水的化学式是什么？',
      options: ['CO2', 'H2O', 'O2', 'NaCl'],
      correct: 1,
    },
    {
      question: '地球围绕什么旋转？',
      options: ['月球', '火星', '太阳', '金星'],
      correct: 2,
    },
  ]

  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  const handleAnswer = (index: number) => {
    if (selectedAnswer !== null) return

    setSelectedAnswer(index)
    setIsCorrect(index === questions[currentQuestion].correct)

    if (index === questions[currentQuestion].correct) {
      setScore(score + 1)
    }

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
        setIsCorrect(null)
      } else {
        setShowResult(true)
      }
    }, 1500)
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setScore(0)
    setShowResult(false)
    setSelectedAnswer(null)
    setIsCorrect(null)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-8 text-white text-center">
          <button onClick={onBack} className="float-left mt-2 px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-all">← 返回</button>
          <h2 className="text-3xl font-bold">❓ 知识问答挑战</h2>
          <p className="mt-2 opacity-90">测试你的知识储备，看看你能答对几道题！</p>
        </div>

        <div className="p-8">
          {!showResult ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  问题 {currentQuestion + 1} / {questions.length}
                </span>
                <span className="text-sm font-bold text-orange-600">
                  得分：{score}
                </span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-orange-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                />
              </div>

              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border-2 border-orange-200">
                <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
                  {questions[currentQuestion].question}
                </h3>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      disabled={selectedAnswer !== null}
                      className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                        selectedAnswer === null
                          ? 'bg-white border-2 border-gray-200 hover:border-orange-400 hover:bg-orange-50'
                          : index === questions[currentQuestion].correct
                          ? 'bg-green-100 border-2 border-green-500 text-green-700'
                          : index === selectedAnswer
                          ? 'bg-red-100 border-2 border-red-500 text-red-700'
                          : 'bg-gray-100 border-2 border-gray-200 text-gray-500'
                      }`}
                    >
                      <span className="mr-3">{String.fromCharCode(65 + index)}.</span>
                      {option}
                      {selectedAnswer !== null && index === questions[currentQuestion].correct && (
                        <span className="float-right">✓</span>
                      )}
                      {selectedAnswer !== null && index === selectedAnswer && index !== questions[currentQuestion].correct && (
                        <span className="float-right">✗</span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {isCorrect !== null && (
                <div className={`text-center p-4 rounded-xl ${isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'} text-lg font-medium`}>
                  {isCorrect ? '🎉 回答正确！' : '😢 回答错误...'}
                </div>
              )}
            </div>
          ) : (
            <div className="text-center space-y-6 py-12">
              <div className="text-8xl animate-bounce">{score >= 4 ? '🏆' : score >= 2 ? '👍' : '💪'}</div>
              <h3 className="text-3xl font-bold text-gray-900">问答结束！</h3>
              <p className="text-xl text-gray-700">
                你答对了 <span className="font-bold text-orange-600 text-3xl">{score}</span> / {questions.length} 道题
              </p>
              <p className="text-lg text-gray-600">
                {score === 5 ? '完美！你是知识达人！' :
                 score >= 3 ? '很不错！继续努力！' :
                 score >= 2 ? '还可以，再多学习一下吧！' :
                 '别灰心，下次会更好！'}
              </p>
              <button
                onClick={resetQuiz}
                className="px-8 py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors"
              >
                再来一局
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const AchievementsList = () => {
  const getRarityColor = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return 'border-gray-300 bg-gray-50'
      case 'rare': return 'border-blue-300 bg-blue-50'
      case 'epic': return 'border-purple-300 bg-purple-50'
      case 'legendary': return 'border-yellow-400 bg-yellow-50'
      default: return 'border-gray-300 bg-gray-50'
    }
  }

  const getRarityLabel = (rarity: Achievement['rarity']) => {
    switch (rarity) {
      case 'common': return '普通'
      case 'rare': return '稀有'
      case 'epic': return '史诗'
      case 'legendary': return '传说'
      default: return ''
    }
  }

  const unlockedCount = achievements.filter(a => a.progress >= a.total).length
  const totalProgress = achievements.reduce((sum, a) => sum + (a.progress / a.total) * 100, 0) / achievements.length

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">已解锁成就</p>
          <p className="text-4xl font-bold">{unlockedCount} / {achievements.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-400 to-indigo-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">总体进度</p>
          <p className="text-4xl font-bold">{Math.round(totalProgress)}%</p>
        </div>
        <div className="bg-gradient-to-br from-green-400 to-teal-500 rounded-xl p-6 text-white">
          <p className="text-sm opacity-90 mb-1">传说成就</p>
          <p className="text-4xl font-bold">{achievements.filter(a => a.rarity === 'legendary').length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map(achievement => (
          <div
            key={achievement.id}
            className={`rounded-xl p-6 border-2 ${getRarityColor(achievement.rarity)} ${
              achievement.progress >= achievement.total ? 'opacity-100' : 'opacity-75'
            }`}
          >
            <div className="flex items-start space-x-4">
              <div className={`text-4xl ${achievement.progress >= achievement.total ? '' : 'grayscale'}`}>
                {achievement.icon}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-bold text-gray-900">{achievement.title}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    achievement.rarity === 'legendary' ? 'bg-yellow-200 text-yellow-800' :
                    achievement.rarity === 'epic' ? 'bg-purple-200 text-purple-800' :
                    achievement.rarity === 'rare' ? 'bg-blue-200 text-blue-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {getRarityLabel(achievement.rarity)}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{achievement.description}</p>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">进度</span>
                    <span className="font-medium text-gray-900">
                      {achievement.progress} / {achievement.total}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-500 ${
                        achievement.progress >= achievement.total
                          ? 'bg-green-500'
                          : 'bg-primary-500'
                      }`}
                      style={{ width: `${(achievement.progress / achievement.total) * 100}%` }}
                    />
                  </div>
                </div>
                {achievement.unlockedAt && (
                  <p className="text-xs text-green-600 mt-2">
                    ✓ 解锁于 {achievement.unlockedAt.toLocaleDateString('zh-CN')}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const Leaderboard = () => {
  const [viewMode, setViewMode] = useState<'friends' | 'global'>('friends')

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900">排行榜</h3>
          <div className="flex space-x-2 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('friends')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'friends' ? 'bg-white shadow text-primary-600' : 'text-gray-600'
              }`}
            >
              好友排名
            </button>
            <button
              onClick={() => setViewMode('global')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'global' ? 'bg-white shadow text-primary-600' : 'text-gray-600'
              }`}
            >
              全球排名
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {leaderboardData
            .filter(entry => viewMode === 'friends' ? entry.isFriend || entry.isCurrentUser : true)
            .sort((a, b) => a.rank - b.rank)
            .slice(0, viewMode === 'friends' ? 5 : 10)
            .map((entry) => (
              <div
                key={entry.rank}
                className={`flex items-center space-x-4 p-4 rounded-xl transition-all ${
                  entry.isCurrentUser
                    ? 'bg-primary-50 border-2 border-primary-200'
                    : entry.rank <= 3
                    ? 'bg-gradient-to-r from-yellow-50 to-orange-50'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${
                  entry.rank === 1 ? 'bg-yellow-400 text-white' :
                  entry.rank === 2 ? 'bg-gray-300 text-white' :
                  entry.rank === 3 ? 'bg-orange-400 text-white' :
                  'bg-gray-200 text-gray-600'
                }`}>
                  {entry.rank <= 3 ? ['🥇', '🥈', '🥉'][entry.rank - 1] : entry.rank}
                </div>

                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className={`font-semibold ${entry.isCurrentUser ? 'text-primary-600' : 'text-gray-900'}`}>
                      {entry.playerName}
                    </span>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-primary-100 text-primary-700 rounded text-xs">我</span>
                    )}
                    {entry.isFriend && !entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">好友</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                    <span>Lv.{entry.level}</span>
                    <span>·</span>
                    <span>{entry.score.toLocaleString()} 分</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">#{entry.rank}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default GameCenter
