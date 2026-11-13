import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HoverPlayCard({
  src,
  poster,
  className = '',
  loop = false,
  mutedOnHover = true,
}) {
  const videoRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [userStarted, setUserStarted] = useState(false);
  const [prevMuted, setPrevMuted] = useState(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    let ignore = false;

    const doPlayMuted = async () => {
      if (!video) return;
      if (prevMuted === null) setPrevMuted(video.muted);
      if (mutedOnHover) video.muted = true;
      try {
        await video.play();
        if (!ignore) setIsPlaying(true);
      } catch {
        if (!ignore) setIsPlaying(false);
      }
    };

    const doPause = () => {
      if (!video) return;
      video.pause();
      setIsPlaying(false);
      if (!userStarted && prevMuted !== null) video.muted = prevMuted;
    };

    if (isHovering && !userStarted) {
      void doPlayMuted();
    } else if (!isHovering && !userStarted) {
      doPause();
    }

    return () => {
      ignore = true;
    };
  }, [isHovering, mutedOnHover, userStarted]);

  const handleIconClick = async () => {
    const video = videoRef.current;
    if (!video) return;
    if (!isPlaying) {
      setUserStarted(true);
      video.muted = false;
      setPrevMuted(false);
      try {
        await video.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onEnded = () => {
      setIsPlaying(false);
      setUserStarted(false);
    };
    video.addEventListener('play', onPlay);
    video.addEventListener('pause', onPause);
    video.addEventListener('ended', onEnded);
    return () => {
      video.removeEventListener('play', onPlay);
      video.removeEventListener('pause', onPause);
      video.removeEventListener('ended', onEnded);
    };
  }, []);

  return (
    <div
      className={`relative rounded-xl overflow-hidden group ${className}`}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        loop={loop}
        playsInline
        preload="auto"
        muted
        className="block w-full h-auto bg-black"
      />

      <AnimatePresence>
        {(isHovering || !isPlaying) && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
          >
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleIconClick();
              }}
              className="pointer-events-auto flex items-center justify-center rounded-full w-16 h-16 bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors duration-300"
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute left-3 bottom-3 font-mono text-[11px] uppercase tracking-[0.2em] text-[#d4d4d0] bg-black/50 px-2.5 py-1 rounded-full backdrop-blur-sm">
        {isPlaying ? 'Playing' : 'Paused'}
      </div>
    </div>
  );
}
