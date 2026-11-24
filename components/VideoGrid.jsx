'use client';
import { useState } from 'react';

function Video({ v }) {
  const [play, setPlay] = useState(false);
  return (
    <div className="card video-card">
      <div className="video-frame">
        {play ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${v.id}?autoplay=1&rel=0`}
            title={v.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <button type="button" className="video-thumb" onClick={() => setPlay(true)} aria-label={`Phát video: ${v.title}`}>
            <img src={`https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`} alt={v.title} loading="lazy" />
            <span className="play-btn" aria-hidden="true">▶</span>
          </button>
        )}
      </div>
      <h3>{v.title}</h3>
    </div>
  );
}

export default function VideoGrid({ videos }) {
  return (
    <div className="video-grid">
      {videos.map((v) => <Video key={v.id} v={v} />)}
    </div>
  );
}
