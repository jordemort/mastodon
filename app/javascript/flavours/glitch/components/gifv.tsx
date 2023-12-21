import { useCallback, useState, useLayoutEffect } from 'react';

interface Props {
  src: string;
  key: string;
  alt?: string;
  lang?: string;
  width: number;
  height: number;
  onClick?: () => void;
}

export const GIFV: React.FC<Props> = ({
  src,
  alt,
  lang,
  width,
  height,
  onClick,
}) => {
  const [loading, setLoading] = useState(true);
  const [preScale, setPreScale] = useState(1);

  useLayoutEffect(() => {
    function updatePreScale() {
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;

      let imageToWindowWidth = windowWidth / width;

      if (imageToWindowWidth > 1) {
        if (width >= (windowWidth * 0.8)) {
          imageToWindowWidth = 1;
        } else {
          imageToWindowWidth = imageToWindowWidth * 0.8;
        }
      }

      let imageToWindowHeight = (windowHeight * 0.8) / height;

      setPreScale(Math.min(imageToWindowWidth, imageToWindowHeight));
    };
    window.addEventListener('resize', updatePreScale);
    updatePreScale();
    return () => window.removeEventListener('resize', updatePreScale);
  }, []);

  const handleLoadedData: React.ReactEventHandler<HTMLVideoElement> =
    useCallback(() => {
      setLoading(false);
    }, [setLoading]);

  const handleClick: React.MouseEventHandler = useCallback(
    (e) => {
      if (onClick) {
        e.stopPropagation();
        onClick();
      }
    },
    [onClick],
  );

  const handleAltClick: React.MouseEventHandler = (e) => { e.stopPropagation(); };
  const scaledWidth = Math.floor(width * preScale);
  const scaledHeight = Math.floor(height * preScale);

  return (
    <>
    <div className='gifv' style={{ position: 'relative', width: scaledWidth, height: scaledHeight  }}>
      {loading && (
        <canvas
          width={scaledWidth}
          height={scaledHeight}
          role='button'
          tabIndex={0}
          aria-label={alt}
          title={alt}
          lang={lang}
          onClick={handleClick}
        />
      )}

      <video
        src={src}
        role='button'
        tabIndex={0}
        aria-label={alt}
        title={alt}
        lang={lang}
        muted
        loop
        autoPlay
        playsInline
        onClick={handleClick}
        onLoadedData={handleLoadedData}
        style={{ position: loading ? 'absolute' : 'static', top: 0, left: 0 }}
      />
    </div>
    {alt && <div className='zoomable-image-alt' onClick={handleAltClick}>{alt}</div>}
    </>
  );
};
