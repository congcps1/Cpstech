'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function Gallery({ images, alt }) {
  const [i, setI] = useState(0);
  if (!images?.length) return <div className="card product-detail-img"><div className="img-placeholder">CPSTECH</div></div>;
  return (
    <div>
      <div className="card product-detail-img">
        <Image src={images[i]} alt={alt} width={800} height={800} priority sizes="(max-width: 1100px) 92vw, 560px" />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, k) => (
            <button key={src} type="button" onClick={() => setI(k)} className={k === i ? 'active' : ''} aria-label={`Ảnh ${k + 1}`}>
              <Image src={src} alt={`${alt} – ảnh ${k + 1}`} width={64} height={64} sizes="64px" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
