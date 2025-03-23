'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';
import { useLectio } from '../context/LectioContext';
import { IconButton, FlexRow } from './StyledComponents';

// Icon components
const SoundOn = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>
  </svg>
);

const SoundOff = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
    <line x1="23" y1="9" x2="17" y2="15"></line>
    <line x1="17" y1="9" x2="23" y2="15"></line>
  </svg>
);

const BackgroundSound: React.FC = () => {
  const { session, toggleSound } = useLectio();
  const { backgroundSound } = session;
  const [volume, setVolume] = useState(0.3);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize sound
    soundRef.current = new Howl({
      src: ['/sounds/ambient.mp3'], // Will need to add this file to public/sounds directory
      html5: true,
      loop: true,
      volume: volume,
    });

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (!soundRef.current) return;

    if (backgroundSound) {
      soundRef.current.play();
    } else {
      soundRef.current.pause();
    }
  }, [backgroundSound]);

  useEffect(() => {
    if (soundRef.current) {
      soundRef.current.volume(volume);
    }
  }, [volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <FlexRow style={{ justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
      <IconButton onClick={toggleSound} title={backgroundSound ? 'Turn off sound' : 'Turn on sound'}>
        {backgroundSound ? <SoundOn /> : <SoundOff />}
      </IconButton>
      
      {backgroundSound && (
        <input
          type="range"
          min="0"
          max="1"
          step="0.1"
          value={volume}
          onChange={handleVolumeChange}
          style={{ width: '100px' }}
        />
      )}
    </FlexRow>
  );
};

export default BackgroundSound; 