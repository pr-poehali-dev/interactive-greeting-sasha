import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';

const wishes = [
  {
    step: 1,
    options: [
      { text: '🌟 Исполнения всех желаний', emoji: '✨' },
      { text: '🎯 Достижения всех целей', emoji: '🏆' }
    ]
  },
  {
    step: 2,
    options: [
      { text: '💖 Море любви и дружбы', emoji: '🤗' },
      { text: '🌈 Ярких и весёлых приключений', emoji: '🎪' }
    ]
  },
  {
    step: 3,
    options: [
      { text: '🎨 Вдохновения и творчества', emoji: '🎭' },
      { text: '📚 Новых знаний и открытий', emoji: '🔬' }
    ]
  },
  {
    step: 4,
    options: [
      { text: '☀️ Солнечного настроения каждый день', emoji: '😊' },
      { text: '🎵 Музыки и танцев до утра', emoji: '💃' }
    ]
  },
  {
    step: 5,
    options: [
      { text: '🦄 Волшебства и чудес', emoji: '✨' },
      { text: '🎁 Сюрпризов и подарков', emoji: '🎉' }
    ]
  }
];

export default function Index() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedWishes, setSelectedWishes] = useState<string[]>([]);
  const [showIntro, setShowIntro] = useState(true);
  const [catMessage, setCatMessage] = useState('');
  const [confetti, setConfetti] = useState(false);
  const [showStars, setShowStars] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [showCatSpeech, setShowCatSpeech] = useState(false);
  const [currentWishIndex, setCurrentWishIndex] = useState(0);

  useEffect(() => {
    if (showIntro) {
      speak('Мяу! Привет, Саша! С днём рождения!');
      setShowStars(true);
    }
  }, [showIntro]);

  const playSound = (frequency: number, duration: number, type: OscillatorType = 'sine') => {
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    const ctx = audioContextRef.current;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  };

  const playMelody = () => {
    const notes = [523, 587, 659, 698, 784, 880, 988, 1047];
    notes.forEach((note, index) => {
      setTimeout(() => playSound(note, 0.3), index * 150);
    });
  };

  const playSuccessSound = () => {
    playSound(659, 0.2);
    setTimeout(() => playSound(784, 0.2), 100);
    setTimeout(() => playSound(988, 0.3), 200);
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const speakWishes = (wishList: string[]) => {
    const cleanedWishes = wishList.map(w => {
      return w.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
    });
    
    const intro = 'Саша! Я желаю тебе...';
    speak(intro);
    
    setTimeout(() => {
      cleanedWishes.forEach((wish, index) => {
        setTimeout(() => {
          setCurrentWishIndex(index + 1);
          speak(wish);
        }, index * 3000);
      });
      
      setTimeout(() => {
        setCurrentWishIndex(999);
        speak('Пусть всё это обязательно сбудется! С днём рождения!');
      }, cleanedWishes.length * 3000);
    }, 2000);
  };

  const startGame = () => {
    setShowIntro(false);
    setCatMessage('Выбери своё первое пожелание! 🎁');
    speak('Выбери своё первое пожелание!');
    playMelody();
    setIsMusicPlaying(true);
  };

  const selectWish = (wish: string) => {
    const newWishes = [...selectedWishes, wish];
    setSelectedWishes(newWishes);
    playSuccessSound();
    
    if (currentStep < wishes.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextStep = currentStep + 2;
      setCatMessage(`Отличный выбор! Теперь выбери пожелание ${nextStep} 😺`);
      speak(`Отличный выбор! Теперь выбери пожелание ${nextStep}`);
    } else {
      setCatMessage('Ура! Все пожелания выбраны! 🎊');
      setConfetti(true);
      playMelody();
      setTimeout(() => {
        setShowCatSpeech(true);
        speakWishes(newWishes);
      }, 2000);
    }
  };

  const toggleMusic = () => {
    if (isMusicPlaying) {
      window.speechSynthesis.cancel();
      setIsMusicPlaying(false);
    } else {
      playMelody();
      setIsMusicPlaying(true);
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-4 relative overflow-hidden">
        {showStars && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute text-3xl animate-sparkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`
                }}
              >
                ⭐
              </div>
            ))}
          </div>
        )}
        <Card className="max-w-2xl w-full p-8 bg-white/90 backdrop-blur shadow-2xl relative z-10 animate-float">
          <div className="text-center space-y-6">
            <div className="text-8xl animate-wiggle">🐱</div>
            <h1 className="text-5xl font-bold text-purple-600 animate-rainbow">
              Саша!
            </h1>
            <p className="text-3xl text-pink-500 font-semibold animate-pulse">
              С Днём Рождения! 🎂
            </p>
            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 p-6 rounded-2xl">
              <p className="text-xl text-gray-800 leading-relaxed">
                Мяу! Я котик-волшебник 🪄 и пришёл поздравить тебя!
                <br />
                Ты можешь сама выбрать 5 самых лучших пожеланий!
                <br />
                Нажми на кнопку и начнём волшебство! ✨
              </p>
            </div>
            <Button 
              onClick={startGame}
              size="lg"
              className="text-2xl px-12 py-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-110 transition-all animate-pulse"
            >
              Начать выбирать! 🎁
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (currentStep >= wishes.length) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 via-pink-300 to-purple-300 flex items-center justify-center p-4 relative overflow-hidden">
        {confetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(100)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-confetti-fall"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '🎈', '🎁', '💖', '🌟'][Math.floor(Math.random() * 8)]}
              </div>
            ))}
          </div>
        )}
        <Card className="max-w-3xl w-full p-8 bg-white/95 backdrop-blur shadow-2xl relative z-10 animate-float">
          <div className="text-center space-y-6">
            <div className="text-9xl animate-wiggle">🐱💖</div>
            
            {showCatSpeech ? (
              <div className="space-y-6">
                <div className="bg-gradient-to-r from-purple-300 to-pink-300 p-6 rounded-3xl animate-pulse border-4 border-purple-500">
                  <p className="text-3xl font-bold text-gray-800 mb-4">
                    Саша! Я желаю тебе...
                  </p>
                </div>
                
                <div className="space-y-4">
                  {selectedWishes.map((wish, index) => (
                    <div 
                      key={index}
                      className={`bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-xl shadow-md transform transition-all duration-500 ${
                        index < currentWishIndex ? 'scale-105 border-4 border-green-500' : 'scale-95 opacity-50'
                      } animate-float`}
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <p className="text-2xl font-semibold text-gray-800">
                        {index + 1}. {wish}
                      </p>
                      {index < currentWishIndex && (
                        <div className="text-4xl mt-2 animate-bounce">✅</div>
                      )}
                    </div>
                  ))}
                </div>
                
                {currentWishIndex > selectedWishes.length && (
                  <div className="bg-gradient-to-r from-yellow-200 to-pink-200 p-6 rounded-2xl mt-8 animate-pulse border-4 border-yellow-500">
                    <p className="text-3xl text-gray-800 font-bold">
                      🎉 Пусть всё это обязательно сбудется! 🎉
                    </p>
                    <p className="text-2xl text-gray-700 mt-2">
                      С днём рождения, Саша! 💖
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-bold text-purple-600 animate-rainbow">
                  Твои волшебные пожелания:
                </h2>
                <div className="space-y-4">
                  {selectedWishes.map((wish, index) => (
                    <div 
                      key={index}
                      className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-xl shadow-md transform hover:scale-105 transition-all animate-float"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <p className="text-2xl font-semibold text-gray-800">
                        {index + 1}. {wish}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="bg-gradient-to-r from-yellow-200 to-pink-200 p-6 rounded-2xl mt-8 animate-pulse">
                  <p className="text-2xl text-gray-800 font-bold">
                    🎉 Котик готовится произнести волшебные слова... 🎉
                  </p>
                </div>
              </>
            )}
            
            <Button
              onClick={toggleMusic}
              size="lg"
              className="mt-6 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            >
              <Icon name={isMusicPlaying ? "Volume2" : "VolumeX"} className="mr-2" size={24} />
              {isMusicPlaying ? 'Звук вкл' : 'Звук выкл'}
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const currentWish = wishes[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-2xl animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            {['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)]}
          </div>
        ))}
      </div>
      <Card className="max-w-3xl w-full p-8 bg-white/90 backdrop-blur shadow-2xl relative z-10 animate-float">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-wiggle">🐱</div>
            <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-4 rounded-2xl animate-pulse">
              <p className="text-2xl font-semibold text-gray-800">
                {catMessage}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-2 my-6">
            {wishes.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all ${
                  index < currentStep ? 'bg-green-500 animate-sparkle' :
                  index === currentStep ? 'bg-purple-500 animate-pulse scale-125' :
                  'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-purple-600 animate-bounce">
              Пожелание {currentStep + 1} из 5
            </h3>
          </div>

          <div className="grid gap-6">
            {currentWish.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => selectWish(option.text)}
                size="lg"
                className="text-2xl px-8 py-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-110 hover:rotate-2 transition-all h-auto"
              >
                <span className="text-4xl mr-4 animate-bounce">{option.emoji}</span>
                {option.text}
              </Button>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-lg text-gray-600 animate-pulse">
              Выбрано пожеланий: {selectedWishes.length} 🌟
            </p>
          </div>

          <div className="flex justify-center mt-4">
            <Button
              onClick={toggleMusic}
              variant="outline"
              size="sm"
              className="bg-white/50"
            >
              <Icon name={isMusicPlaying ? "Volume2" : "VolumeX"} size={20} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
