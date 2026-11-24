'use client';
import { useState } from 'react';

export default function Gallery({ images, alt }) {
  const [i, setI] = useState(0);
  if (!images?.length) return <div className="card product-detail-img"><div className="img-placeholder">CPSTECH</div></div>;
  return (
    <div>
      <div className="card product-detail-img">
        <img src={images[i]} alt={alt} />
      </div>
      {images.length > 1 && (
        <div className="thumbs">
          {images.map((src, k) => (
            <button key={src} type="button" onClick={() => setI(k)} className={k === i ? 'active' : ''} aria-label={`Ảnh ${k + 1}`}>
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
