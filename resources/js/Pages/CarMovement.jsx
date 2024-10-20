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
  const [showButtons, setShowButtons] = useState(true);
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const velocityRef = useRef(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef(null);
  const [showWhitePage, setShowWhitePage] = useState(false);
  const [whitePageOpacity, setWhitePageOpacity] = useState(0);
  const audioRef = useRef(null);
  const skipTime = 50; // スキップする時間（秒）
  const [audioLoaded, setAudioLoaded] = useState(false);
  const [showStartButton, setShowStartButton] = useState(true);
  
  // 音楽のロードを優先する新しい関数
  const loadAudio = () => {
    return new Promise((resolve, reject) => {
      const audio = new Audio('/background-music.mp3');
      audio.addEventListener('canplaythrough', () => {
        audioRef.current = audio;
        setAudioLoaded(true);
        resolve();
      });
      audio.addEventListener('error', reject);
      audio.load();
    });
  };
  
  // Start ボタンを処理する新しい関数
  const handleStartClick = () => {
    setShowStartButton(false);
    // ここで必要な初期化処理を行う（例：音楽の再生開始）
    if (audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Audio playback was prevented. User interaction may be required.');
      });
    }
  };
  
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };
  
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const carHeight = 80; // ピクセル単位で車の高さを指定
  const carBottomPosition = 100; // 画面下端からの距離（ピクセル）

  // 写真とコメントのデータ
  const photoData = [
    { id: 1, position: -400, photo: '/photo1.png', comment: '今日は来てくれて\nありがとう！' },
    { id: 2, position: -950, photo: '/photo2.png', comment: '付き合い始めてから\nもうすぐ5年' },
    { id: 3, position: -1500, photo: '/photo3.png', comment: 'これまで本当に\n色んなことがありましたし' },
    { id: 4, position: -2050, photo: '/photo4.png', comment: 'まだまだ喧嘩の絶えない\n未熟な二人ですが' },
    { id: 5, position: -2600, photo: '/photo5.png', comment: 'みなさんに\n支えていただいて' },
    { id: 6, position: -3150, photo: '/photo6.png', comment: '無事に挙式を\n終えることができました' },
    { id: 7, position: -3700, photo: '/photo7.png', comment: '本当に\nありがとうございました' },
    { id: 8, position: -4250, photo: '/photo8.png', comment: 'この後は披露宴\nたくさんお話ししましょう' },
    { id: 9, position: -4800, photo: '/photo9.png', comment: '今日はぜひ\n楽しんでいってください！' },
  ];

  // 共通の背景スタイル設定
  const commonBackgroundStyle = {
    width: '100%',
    height: '100%',
    top: '0%',
    left: '0%',
    backgroundSize: 'cover',
    backgroundPosition: 'center center',
    backgroundRepeat: 'no-repeat',
  };
  
  const groundHeight = 150; // ピクセル単位
  
  // 背景画像データ
  const backgroundData = [
    { 
      id: 'bg1', 
      photo: '/background1.jpg',
      position: 0,
      customStyle: {
        width: 950,
        height: 550,
        bottomOffset: -5,
        left: 0,
      }
    },
    { 
      id: 'bg2', 
      photo: '/background2.jpg',
      position: 1950,
      customStyle: {
        width: 1000,
        height: 350,
        bottomOffset: 150,
        left: 0,
      }
    },
    { 
      id: 'bg3', 
      photo: '/background3.jpg',
      position: 1050,
      customStyle: {
        width: 1000,
        height: 350,
        bottomOffset: 40,
        left: 0,
      }
    },
    { 
      id: 'bg4', 
      photo: '/background4.jpg',
      position: 3000,
      customStyle: {
        width: 1000,
        height: 400,
        bottomOffset: 55,
        left: 0,
      }
    },
    { 
      id: 'bg5', 
      photo: '/background5.jpg',
      position: 3760,
      customStyle: {
        width: 1200,
        height: 750,
        bottomOffset: 75,
        left: 0,
      }
    },
    { 
      id: 'bg6', 
      photo: '/background6.jpg',
      position: 4600,
      customStyle: {
        width: 1000,
        height: 700,
        bottomOffset: -30,
        left: 0,
      }
    },
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

  // 写真の事前読み込み（既存の関数）
  const preloadImages = async () => {
    const allPhotos = [...photoData, ...galleryPhotoData, ...backgroundData];
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

  // 音楽と画像を並行してロードする
  useEffect(() => {
    const loadAllAssets = async () => {
      try {
        // 音楽のロードを開始
        const audioLoadPromise = loadAudio();
        
        // 画像のプリロードを並行して開始
        const imageLoadPromise = preloadImages();
        
        // 両方のロードが完了するまで待機
        await Promise.all([audioLoadPromise, imageLoadPromise]);
        
        console.log('All assets (audio and images) loaded successfully');
      } catch (error) {
        console.error('Error loading assets:', error);
      }
    };

    loadAllAssets();
  }, []);
  
  // 音楽の自動再生（audioLoaded ステートを使用）
  useEffect(() => {
    if (audioLoaded && audioRef.current) {
      audioRef.current.play().catch(error => {
        console.log('Auto-play was prevented. This is normal in many browsers.');
        
        const playAttempt = () => {
          audioRef.current.play();
          document.removeEventListener('click', playAttempt);
        };
        document.addEventListener('click', playAttempt);
      });
    }
  }, [audioLoaded]);

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
    velocityRef.current = Math.min(velocityRef.current + 0.25, 2.5); // 加速度と最大速度を半分に
    setPosition(prev => Math.min(prev + velocityRef.current, 0));
  }, [isTransitioning]);

  const moveRight = useCallback(() => {
    if (isTransitioning) return;
    velocityRef.current = Math.min(velocityRef.current + 0.25, 2.5); // 加速度と最大速度を半分に
    setPosition(prev => Math.max(prev - velocityRef.current, -5000));
  }, [isTransitioning]);

  const slowDown = useCallback(() => {
    velocityRef.current *= 0.9;
    if (velocityRef.current > 0.05) { // 停止する閾値も半分に
      if (isMovingLeft) {
        setPosition(prev => Math.min(prev + velocityRef.current, 0));
      } else if (isMovingRight) {
        setPosition(prev => Math.max(prev - velocityRef.current, -5000));
      }
    } else {
      velocityRef.current = 0;
    }
  }, [isMovingLeft, isMovingRight]);

  const AUTO_SCROLL_POSITION = -4800; // 自動スクロールが始まる位置
  const FINAL_POSITION = -5200; // 最終位置
  
  const SkyBackground = () => {
    return (
      <div 
        className="absolute inset-0" 
        style={{
          background: 'linear-gradient(to top, #FFFFFF 0%, #FFFFFF 40%, #F0F8FF 60%, #E6F3FF 70%, #B3E0FF 80%, #4DB8FF 90%, #1E90FF 100%)',
          zIndex: 0 // 他の要素の背後に配置
        }}
      />
    );
  };

  useEffect(() => {
    if (position <= AUTO_SCROLL_POSITION && !isAutoScrolling) {
      setShowButtons(false);
      setIsAutoScrolling(true);
      setIsMovingLeft(false);
      setIsMovingRight(false);
    }
  }, [position, isAutoScrolling]);

  const animate = useCallback((time) => {
    if (lastTimeRef.current === 0) {
      lastTimeRef.current = time;
    }
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (isAutoScrolling) {
      const remainingDistance = FINAL_POSITION - position;
      const scrollSpeed = remainingDistance / 180; // 12フレームで1秒
      setPosition(prev => Math.max(prev + scrollSpeed, FINAL_POSITION));

      if (position <= -5150) {
        setIsAutoScrolling(false);
        setIsTransitioning(true);
      }
    } else if (isMovingLeft || isMovingRight) {
      if (isMovingLeft) moveLeft();
      if (isMovingRight) moveRight();
    } else {
      slowDown();
    }

    animationRef.current = window.requestAnimationFrame(animate);
  }, [isMovingLeft, isMovingRight, moveLeft, moveRight, slowDown, position, isTransitioning, isAutoScrolling]);

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
        // フェードアウト
        setOpacity(0);
        setTimeout(() => {
          // 白いページにフェードイン
          setShowWhitePage(true);
          setWhitePageOpacity(1);
          setTimeout(() => {
            // 白いページからフェードアウト
            setWhitePageOpacity(0);
            setTimeout(() => {
              // ギャラリーの準備
              const shuffledPhotos = shuffleArray([...galleryPhotoData]);
              const numPhotosToShow = Math.min(shuffledPhotos.length, chekiLayout.length, 10);
              setGalleryPhotos(shuffledPhotos.slice(0, numPhotosToShow));
              setShowGallery(true);
              // ウェルカムメッセージを表示
              setShowWelcomeMessage(true);
              setMessageVisible(true);
              // 全体をフェードイン
              setOpacity(1);
            }, 1000);
          }, 1000);
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
  
  const WhitePage = () => (
    <div
      className="absolute inset-0 bg-white"
      style={{
        opacity: whitePageOpacity,
        transition: 'opacity 1s',
        zIndex: 100,
      }}
    />
  );
  
  // コンポーネントがマウントされたときに音楽を自動再生
  useEffect(() => {
    if (audioRef.current) {
      // ユーザーインタラクションなしで再生を試みる
      audioRef.current.play().catch(error => {
        console.log('Auto-play was prevented. This is normal in many browsers.');
        
        // 自動再生が失敗した場合、ユーザーのインタラクションを待つ
        const playAttempt = () => {
          audioRef.current.play();
          document.removeEventListener('click', playAttempt);
        };
        document.addEventListener('click', playAttempt);
      });
    }
  }, []);

  const BackgroundImages = () => {
    return (
      <div className="absolute inset-0 overflow-hidden">
        <SkyBackground />
        {backgroundData.map((bg) => {
          const bottomPosition = windowSize.height - bg.customStyle.bottomOffset;
          const topPosition = bottomPosition - bg.customStyle.height;
          
          return (
            <div
              key={bg.id}
              className="absolute bg-cover bg-center"
              style={{
                width: `${bg.customStyle.width}px`,
                height: `${bg.customStyle.height}px`,
                top: `${topPosition}px`,
                left: `${bg.customStyle.left}px`,
                backgroundImage: `url(${bg.photo})`,
                transform: `translateX(calc(${position}px + ${bg.position}px))`,
                zIndex: 1 // 空の上に配置
              }}
            />
          );
        })}
      </div>
    );
  };
  
  const Ground = () => {
    return (
      <div 
        className="absolute left-0 right-0 bg-black" 
        style={{ 
          height: `${groundHeight}px`,
          bottom: '0px', 
          zIndex: 1 // 背景より上、車より下
        }}
      />
    );
  };

  const PhotoDisplay = () => {
    const currentPhoto = photoData.find(photo => photo.id === currentPhotoIndex);
    
    if (!currentPhoto || !loadedPhotos[currentPhoto.id]) return null;

    return (
      <div 
        className="absolute top-10 left-1/2 transform -translate-x-1/2 transition-opacity duration-300 opacity-100"
        style={{ zIndex: 3 }}
      >
        <div className="bg-white p-4 rounded-lg shadow-lg transform rotate-2" style={{ width: `${chekiSize.width}px`, height: `${chekiSize.height}px` }}>
          <div className="bg-gray-100 p-1 mb-4 h-[75%]">
            <img src={loadedPhotos[currentPhoto.id].src} alt="Polaroid" className="w-full h-full object-cover" />
          </div>
          <div className="h-[20%] flex items-center justify-center">
            <p 
              className="text-center font-handwriting leading-tight"
              style={{ 
                fontFamily: "'Dancing Script', cursive",
                fontSize: '1.2rem',
                color: '#1a1a1a',
                whiteSpace: 'pre-line'
              }}
            >
              {currentPhoto.comment}
            </p>
          </div>
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
      className="relative h-screen w-full overflow-hidden"
      style={{ 
        opacity: initialOpacity, 
        transition: 'opacity 2s'
      }}
    >
      {showStartButton && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <button
            onClick={handleStartClick}
            className="px-6 py-3 bg-blue-500 text-white text-xl font-bold rounded-lg shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors duration-200"
          >
            Start
          </button>
        </div>
      )}
      <div 
        className="relative overflow-hidden"
        style={{ 
          opacity: opacity, 
          transition: 'opacity 1s',
          width: `${windowSize.width}px`,
          height: `${windowSize.height}px`,
        }}
      >
        {!showGallery ? (
          <>
            <BackgroundImages />
            
            <Ground />
            
            <div 
              className="absolute left-1/2 transform -translate-x-1/2" 
              style={{ 
                zIndex: 2,
                bottom: `${carBottomPosition}px`,
              }}
            >
              <img 
                src="/car.png" 
                alt="Car" 
                style={{
                  height: `${carHeight}px`,
                  width: 'auto',
                }}
              />
            </div>
            
            <PhotoDisplay />
            
            {showButtons && (
              <div className="absolute inset-x-0 bottom-4 flex justify-between px-4" style={{ zIndex: 3 }}>
                <button 
                  onMouseDown={() => setIsMovingLeft(true)}
                  onMouseUp={() => setIsMovingLeft(false)}
                  onMouseLeave={() => setIsMovingLeft(false)}
                  onTouchStart={() => setIsMovingLeft(true)}
                  onTouchEnd={() => setIsMovingLeft(false)}
                  className="w-16 h-16 flex items-center justify-center bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-lg"
                  disabled={isTransitioning || isAutoScrolling}
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
                  disabled={isTransitioning || isAutoScrolling}
                >
                  <ChevronRight size={32} />
                </button>
              </div>
            )}
          </>
        ) : (
          <GalleryDisplay />
        )}
      </div>
      {showWhitePage && <WhitePage />}
    </div>
  );
};

export default CarMovement;