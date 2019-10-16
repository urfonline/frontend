import React, {useCallback, useEffect, useRef, useState} from 'react';

interface IProps {
  stream: string;
  userState: any; // todo
  onChange: any;
}

export const PlayerAudio: React.FC<IProps> = ({ userState, stream, onChange}) => {
  const [cacheKey] = useState(Math.random());
  const ref = useRef<HTMLAudioElement>(null);
  const handleEvent = useCallback(onChange, []);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.addEventListener('stalled', handleEvent);
      ref.current.addEventListener('ended', handleEvent);
      ref.current.addEventListener('error', handleEvent);
      ref.current.addEventListener('loadstart', handleEvent);
      ref.current.addEventListener('playing', handleEvent);
      ref.current.addEventListener('stalled', handleEvent);
      ref.current.addEventListener('suspend', handleEvent);
      ref.current.addEventListener('waiting', handleEvent);
    }

    return () => {
      if (ref.current !== null) {
        ref.current.removeEventListener('stalled', handleEvent);
        ref.current.removeEventListener('ended', handleEvent);
        ref.current.removeEventListener('error', handleEvent);
        ref.current.removeEventListener('loadstart', handleEvent);
        ref.current.removeEventListener('playing', handleEvent);
        ref.current.removeEventListener('stalled', handleEvent);
        ref.current.removeEventListener('suspend', handleEvent);
        ref.current.removeEventListener('waiting', handleEvent);
      }
    }
  }, [ref]);

  useEffect(() => {
    if (userState) {
      if (ref.current) {
        ref.current.play();
      }
    }
  }, [userState]);

  return (
    <audio
      src={`${stream}?nocache=${cacheKey}`}
      autoPlay
      ref={ref}
    />
  )
};
