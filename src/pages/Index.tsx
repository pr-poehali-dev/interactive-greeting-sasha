import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

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

  useEffect(() => {
    if (showIntro) {
      speak('Мяу! Привет, Саша! С днём рождения!');
    }
  }, [showIntro]);

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ru-RU';
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const startGame = () => {
    setShowIntro(false);
    setCatMessage('Выбери своё первое пожелание! 🎁');
    speak('Выбери своё первое пожелание!');
  };

  const selectWish = (wish: string) => {
    const newWishes = [...selectedWishes, wish];
    setSelectedWishes(newWishes);
    
    if (currentStep < wishes.length - 1) {
      setCurrentStep(currentStep + 1);
      const nextStep = currentStep + 2;
      setCatMessage(`Отличный выбор! Теперь выбери пожелание ${nextStep} 😺`);
      speak(`Отличный выбор! Теперь выбери пожелание ${nextStep}`);
    } else {
      setCatMessage('Ура! Все пожелания выбраны! 🎊');
      speak('Ура! Все пожелания выбраны!');
      setConfetti(true);
    }
  };

  if (showIntro) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-300 via-purple-300 to-blue-300 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-white/90 backdrop-blur shadow-2xl">
          <div className="text-center space-y-6">
            <div className="text-8xl animate-bounce">🐱</div>
            <h1 className="text-5xl font-bold text-purple-600 animate-pulse">
              Саша!
            </h1>
            <p className="text-3xl text-pink-500 font-semibold">
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
              className="text-2xl px-12 py-8 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-105 transition-all"
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
            {[...Array(50)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`
                }}
              >
                {['🎉', '🎊', '⭐', '✨', '🎈', '🎁'][Math.floor(Math.random() * 6)]}
              </div>
            ))}
          </div>
        )}
        <Card className="max-w-3xl w-full p-8 bg-white/95 backdrop-blur shadow-2xl relative z-10">
          <div className="text-center space-y-6">
            <div className="text-9xl animate-bounce">🐱💖</div>
            <h2 className="text-4xl font-bold text-purple-600">
              Твои волшебные пожелания:
            </h2>
            <div className="space-y-4">
              {selectedWishes.map((wish, index) => (
                <div 
                  key={index}
                  className="bg-gradient-to-r from-pink-100 to-purple-100 p-4 rounded-xl shadow-md transform hover:scale-105 transition-all"
                >
                  <p className="text-2xl font-semibold text-gray-800">
                    {index + 1}. {wish}
                  </p>
                </div>
              ))}
            </div>
            <div className="bg-gradient-to-r from-yellow-200 to-pink-200 p-6 rounded-2xl mt-8">
              <p className="text-2xl text-gray-800 font-bold">
                🎉 Пусть всё это сбудется! 🎉
              </p>
              <p className="text-xl text-gray-700 mt-2">
                Самый лучший день рождения у самой лучшей Саши! 💖
              </p>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const currentWish = wishes[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 flex items-center justify-center p-4">
      <Card className="max-w-3xl w-full p-8 bg-white/90 backdrop-blur shadow-2xl">
        <div className="space-y-6">
          <div className="text-center">
            <div className="text-8xl mb-4 animate-bounce">🐱</div>
            <div className="bg-gradient-to-r from-purple-200 to-pink-200 p-4 rounded-2xl">
              <p className="text-2xl font-semibold text-gray-800">
                {catMessage}
              </p>
            </div>
          </div>

          <div className="flex justify-center gap-2 my-6">
            {wishes.map((_, index) => (
              <div
                key={index}
                className={`w-4 h-4 rounded-full ${
                  index < currentStep ? 'bg-green-500' :
                  index === currentStep ? 'bg-purple-500 animate-pulse' :
                  'bg-gray-300'
                }`}
              />
            ))}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-3xl font-bold text-purple-600">
              Пожелание {currentStep + 1} из 5
            </h3>
          </div>

          <div className="grid gap-6">
            {currentWish.options.map((option, index) => (
              <Button
                key={index}
                onClick={() => selectWish(option.text)}
                size="lg"
                className="text-2xl px-8 py-12 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg transform hover:scale-105 transition-all h-auto"
              >
                <span className="text-4xl mr-4">{option.emoji}</span>
                {option.text}
              </Button>
            ))}
          </div>

          <div className="text-center mt-6">
            <p className="text-lg text-gray-600">
              Выбрано пожеланий: {selectedWishes.length} 🌟
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
