import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarMovement = () => {
  const [position, setPosition] = useState(0);
  const [isMovingLeft, setIsMovingLeft] = useState(false);
  const [isMovingRight, setIsMovingRight] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(null);
  const [loadedPhotos, setLoadedPhotos] = useState({});
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [opacity, setOpacity] = useState(1);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [initialOpacity, setInitialOpacity] = useState(0);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [messageVisible, setMessageVisible] = useState(false);
  const [chekiSize, setChekiSize] = useState({ width: 280, height: 380 });
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef(null);
  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // 写真とコメントのデータ
  const photoData = [
    { id: 1, position: 0, photo: '/photo1.png', comment: 'この度は、軽井沢まで祝福にきてくれてありがとう！' },
    { id: 2, position: -600, photo: '/photo2.png', comment: 'これらの写真は、拓真と雛子が出会ってからこれまでの思い出です' },
    { id: 3, position: -1200, photo: '/photo3.png', comment: '早いもので、付き合い始めてからもうすぐ5年…' },
    { id: 4, position: -1800, photo: '/photo4.png', comment: '時間は経ちましたが、まだまだ喧嘩の絶えないとても未熟な2人です' },
    { id: 5, position: -2400, photo: '/photo5.png', comment: 'みなさんにはこれからも助けてもらうばかりかと思いますが' },
    { id: 6, position: -3000, photo: '/photo6.png', comment: '円満な家庭を築けるように、2人で精一杯努力をしていきます' },
    { id: 7, position: -3600, photo: '/photo7.png', comment: 'そしていつか、みなさんにも少しでも恩返しができたらと思います' },
    { id: 8, position: -4200, photo: '/photo8.png', comment: '大切なみなさんが懇談できたらと思って、少人数での結婚式としていますので' },
    { id: 9, position: -4800, photo: '/photo9.png', comment: '今日はぜひ、楽しんでいってもらえたら嬉しいです！' },
  ];

  // ギャラリー用の写真データ
  const galleryPhotoData = [
    { id: 'g1', photo: '/gallery1.png', comment: '' },
    { id: 'g2', photo: '/gallery2.png', comment: '' },
    { id: 'g3', photo: '/gallery3.png', comment: '' },
    { id: 'g4', photo: '/gallery4.png', comment: '' },
    { id: 'g5', photo: '/gallery5.png', comment: '' },
    { id: 'g6', photo: '/gallery6.png', comment: '' },
    { id: 'g7', photo: '/gallery7.png', comment: '' },
    { id: 'g8', photo: '/gallery8.png', comment: '' },
    { id: 'g9', photo: '/gallery9.png', comment: '' },
    { id: 'g10', photo: '/gallery10.png', comment: '' },
  ];

  // チェキの固定レイアウト
  const chekiLayout = [
    { top: '2%', left: '15%', rotate: '-5deg', zIndex: 8 },
    { top: '10%', left: '-12%', rotate: '-2deg', zIndex: 3 },
    { top: '45%', left: '40%', rotate: '2deg', zIndex: 2 },
    { top: '70%', left: '-10%', rotate: '3deg', zIndex: 7 },
    { top: '55%', left: '75%', rotate: '-4deg', zIndex: 1 },
    { top: '25%', left: '30%', rotate: '4deg', zIndex: 5 },
    { top: '5%', left: '55%', rotate: '3deg', zIndex: 4 },
    { top: '30%', left: '0%', rotate: '-3deg', zIndex: 6 },
  ];

  // 初期表示のアニメーション
  useEffect(() => {
    const fadeInTimer = setTimeout(() => {
      setInitialOpacity(1);
    }, 100);

    return () => clearTimeout(fadeInTimer);
  }, []);

  // ギャラリーページ表示後のウェルカムメッセージ
  useEffect(() => {
    if (showGallery) {
      setShowWelcomeMessage(true);
      setMessageVisible(true);
    }
  }, [showGallery]);

  // 写真の事前読み込み
  useEffect(() => {
    const preloadImages = async () => {
      const allPhotos = [...photoData, ...galleryPhotoData];
      const loadPromises = allPhotos.map(data => {
        return new Promise((resolve, reject) => {
          const img = new window.Image();
          img.onload = () => {
            setLoadedPhotos(prev => ({ ...prev, [data.id]: img }));
            resolve();
          };
          img.onerror = reject;
          img.src = data.photo;
        });
      });

      try {
        await Promise.all(loadPromises);
        console.log('All images preloaded successfully');
      } catch (error) {
        console.error('Error preloading images:', error);
      }
    };

    preloadImages();
  }, []);

  useEffect(() => {
    const updateChekiSize = () => {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const aspectRatio = 380 / 280; // Original aspect ratio of the Cheki
      
      // Set height to 9/16 (a bit more than 1/2) of the viewport height
      const newHeight = vh * (9/16);
      
      // Calculate width based on the aspect ratio
      let newWidth = newHeight / aspectRatio;
      
      // If the calculated width is greater than the viewport width, adjust it
      if (newWidth > vw * 0.75) {
        newWidth = vw * 0.75; // Set width to 75% of viewport width
        // Recalculate height to maintain aspect ratio
        newHeight = newWidth * aspectRatio;
      }
      
      setChekiSize({ width: newWidth, height: newHeight });
    };

    updateChekiSize();
    window.addEventListener('resize', updateChekiSize);
    return () => window.removeEventListener('resize', updateChekiSize);
  }, []);

  const moveLeft = useCallback(() => {
    if (isTransitioning) return;
    velocityRef.current = Math.min(velocityRef.current + 0.5, 5);
    setPosition(prev => Math.min(prev + velocityRef.current, 0));
  }, [isTransitioning]);

  const moveRight = useCallback(() => {
    if (isTransitioning) return;
    velocityRef.current = Math.min(velocityRef.current + 0.5, 5);
    setPosition(prev => Math.max(prev - velocityRef.current, -5000));
  }, [isTransitioning]);

  const slowDown = useCallback(() => {
    velocityRef.current *= 0.9;
    if (velocityRef.current > 0.1) {
      if (isMovingLeft) {
        setPosition(prev => Math.min(prev + velocityRef.current, 0));
      } else if (isMovingRight) {
        setPosition(prev => Math.max(prev - velocityRef.current, -5000));
      }
    } else {
      velocityRef.current = 0;
    }
  }, [isMovingLeft, isMovingRight]);

  const animate = useCallback((time) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (isMovingLeft || isMovingRight) {
      if (isMovingLeft) moveLeft();
      if (isMovingRight) moveRight();
    } else {
      slowDown();
    }

    if (position <= -5000 && !isTransitioning) {
      setIsTransitioning(true);
      setIsMovingLeft(false);
      setIsMovingRight(false);
    }

    animationRef.current = window.requestAnimationFrame(animate);
  }, [isMovingLeft, isMovingRight, moveLeft, moveRight, slowDown, position, isTransitioning]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      animationRef.current = window.requestAnimationFrame(animate);
      return () => {
        if (animationRef.current) {
          window.cancelAnimationFrame(animationRef.current);
        }
      };
    }
  }, [animate]);

  useEffect(() => {
    if (isTransitioning) {
      const transitionTimer = setTimeout(() => {
        setOpacity(0);
        setTimeout(() => {
          const shuffledPhotos = shuffleArray([...galleryPhotoData]);
          const numPhotosToShow = Math.min(shuffledPhotos.length, chekiLayout.length, 10);
          setGalleryPhotos(shuffledPhotos.slice(0, numPhotosToShow));
          setShowGallery(true);
          setOpacity(1);
        }, 1000);
      }, 100);
      return () => clearTimeout(transitionTimer);
    }
  }, [isTransitioning]);

  useEffect(() => {
    const checkPhotoDisplay = () => {
      const displayRange = 200;
      const photoToDisplay = photoData.find(photo => 
        Math.abs(position - photo.position) <= displayRange
      );
      
      setCurrentPhotoIndex(photoToDisplay ? photoToDisplay.id : null);
    };

    checkPhotoDisplay();
  }, [position]);

  const PhotoDisplay = () => {
    const currentPhoto = photoData.find(photo => photo.id === currentPhotoIndex);
    
    if (!currentPhoto || !loadedPhotos[currentPhoto.id]) return null;

    return (
      <div className="absolute top-10 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 opacity-100">
        <div className="bg-white p-2 rounded-lg shadow-lg transform rotate-2" style={{ width: `${chekiSize.width}px`, height: `${chekiSize.height}px` }}>
          <div className="bg-gray-100 p-1 mb-2 h-[85%]">
            <img src={loadedPhotos[currentPhoto.id].src} alt="Polaroid" className="w-full h-full object-cover" />
          </div>
          <p className="text-center font-handwriting text-sm leading-tight" style={{ fontFamily: "'Caveat', cursive" }}>{currentPhoto.comment}</p>
        </div>
      </div>
    );
  };

  const GalleryDisplay = () => {
    return (
      <div className="absolute inset-0 bg-gray-100 flex items-center justify-center overflow-hidden">
        <div className="relative w-full h-full">
          {galleryPhotos.map((photo, index) => {
            const layout = chekiLayout[index % chekiLayout.length];
            return (
              <div
                key={photo.id}
                className="absolute bg-white p-2 rounded-lg shadow-lg transform transition-all duration-300 hover:z-40 hover:scale-105"
                style={{
                  top: layout.top,
                  left: layout.left,
                  transform: `rotate(${layout.rotate})`,
                  width: `${chekiSize.width}px`,
                  height: `${chekiSize.height}px`,
                  zIndex: layout.zIndex
                }}
              >
                <div className="bg-gray-100 p-1 mb-2 h-[85%]">
                  <img 
                    src={photo.photo}
                    alt={`Polaroid ${photo.id}`} 
                    className="w-full h-full object-cover"
                  />
                </div>
                <p 
                  className="text-center font-handwriting text-sm leading-tight"
                  style={{ fontFamily: "'Caveat', cursive" }}
                >
                  {photo.comment}
                </p>
              </div>
            );
          })}
        </div>
       {showWelcomeMessage && (
          <div 
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-3000 ${
              messageVisible ? 'opacity-100' : 'opacity-0'
            }`} 
            style={{ zIndex: 50 }}
          >
            <div 
              className={`w-96 h-96 flex items-center justify-center transition-transform duration-3000 ${
                messageVisible ? 'scale-100' : 'scale-95'
              }`}
              style={{
                background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0) 100%)',
              }}
            >
              <h1 
                className="text-4xl font-bold text-center text-gray-800"
                style={{ 
                  fontFamily: "'Playfair Display', serif",
                  textShadow: '0 0 10px rgba(255,255,255,0.5)'
                }}
              >
                Welcome to our wedding reception!
              </h1>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div 
      className="relative h-screen w-full overflow-hidden bg-gradient-to-b from-sky-400 to-sky-200"
      style={{ 
        opacity: initialOpacity, 
        transition: 'opacity 2s'
      }}
    >
      <div
        style={{ 
          opacity: opacity, 
          transition: 'opacity 1s'
        }}
      >
        {!showGallery ? (
          <>
            <div 
              className="absolute inset-0 will-change-transform"
              style={{ transform: `translateX(${position}px)`, width: '600%' }}
            >
              <div className="absolute bottom-0 left-0 w-[600%] h-1/6 bg-green-600" />
              <div className="absolute left-1/4 bottom-1/6 w-16 h-32 bg-gray-800" />
              <div className="absolute right-1/4 top-1/4 w-24 h-24 bg-yellow-500 rounded-full" />
              <div className="absolute left-3/4 bottom-1/6 w-16 h-32 bg-gray-800" />
              <div className="absolute right-3/4 top-1/3 w-16 h-16 bg-white rounded-full" />
            </div>
            
            <div className="absolute bottom-[12.00%] left-1/2 transform -translate-x-1/2">
              <img src="/car.png" alt="Car" className="h-20 w-auto" />
            </div>
            
            <PhotoDisplay />
            
            <div className="absolute inset-x-0 bottom-4 flex justify-between px-4">
              <button 
                onMouseDown={() => setIsMovingLeft(true)}
                onMouseUp={() => setIsMovingLeft(false)}
                onMouseLeave={() => setIsMovingLeft(false)}
                onTouchStart={() => setIsMovingLeft(true)}
                onTouchEnd={() => setIsMovingLeft(false)}
                className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                disabled={isTransitioning}
              >
                <ChevronLeft size={32} />
              </button>
              <button 
                onMouseDown={() => setIsMovingRight(true)}
                onMouseUp={() => setIsMovingRight(false)}
                onMouseLeave={() => setIsMovingRight(false)}
                onTouchStart={() => setIsMovingRight(true)}
                onTouchEnd={() => setIsMovingRight(false)}
                className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                disabled={isTransitioning}
              >
                <ChevronRight size={32} />
              </button>
            </div>
          </>
        ) : (
          <GalleryDisplay />
        )}
      </div>
    </div>
  );
};

export default CarMovement;