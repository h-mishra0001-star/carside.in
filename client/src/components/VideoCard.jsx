import React, { useState } from 'react';

function VideoCard({ video }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = (e) => {
    e.stopPropagation();
    setShowModal(true);
    setIsPlaying(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsPlaying(false);
  };

  // Format view count (e.g., 2.5M -> 2,500,000)
  const formatViews = (views) => {
    if (typeof views === 'string') return views;
    if (views >= 1000000) return (views / 1000000).toFixed(1) + 'M';
    if (views >= 1000) return (views / 1000).toFixed(1) + 'K';
    return views.toString();
  };

  // YouTube video IDs mapping
  const getYouTubeId = (title) => {
    const videos = {
      'Lamborghini Revuelto - First Drive': 'dQw4w9WgXcQ',
      'Porsche 911 GT3 RS - Track Test': 'dQw4w9WgXcQ',
      'Tesla Cybertruck - Off-road Test': 'dQw4w9WgXcQ'
    };
    return videos[title] || 'dQw4w9WgXcQ';
  };

  return (
    <>
      <div 
        className="video-card" 
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePlay}
      >
        <div className="video-thumb">
          <img src={video.thumbnail} alt={video.title} loading="lazy" />
          <div className={`video-overlay ${isHovered ? 'active' : ''}`}>
            <i className={`fas fa-play-circle ${isHovered ? 'pulse' : ''}`}></i>
          </div>
          <span className="video-duration">{video.duration}</span>
          {video.isNew && <span className="new-badge">NEW</span>}
        </div>
        
        <div className="video-info">
          <div className="video-channel-icon">
            <img src={`https://ui-avatars.com/api/?background=b9d024&color=fff&name=${video.channel?.charAt(0)}`} alt={video.channel} />
          </div>
          <div className="video-details">
            <h3>{video.title}</h3>
            <p className="video-channel">{video.channel}</p>
            <div className="video-meta">
              <span><i className="fas fa-eye"></i> {formatViews(video.views)} views</span>
              <span><i className="fas fa-clock"></i> {video.timeAgo}</span>
              <span><i className="fas fa-thumbs-up"></i> {Math.floor(Math.random() * 50) + 10}K</span>
            </div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      {showModal && (
        <div className="video-modal-overlay" onClick={closeModal}>
          <div className="video-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="video-modal-close" onClick={closeModal}>
              <i className="fas fa-times"></i>
            </button>
            <div className="video-player">
              <iframe 
                width="100%" 
                height="400" 
                src={`https://www.youtube.com/embed/${getYouTubeId(video.title)}?autoplay=${isPlaying ? 1 : 0}`}
                title={video.title}
                frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            </div>
            <div className="video-modal-info">
              <h3>{video.title}</h3>
              <div className="video-modal-stats">
                <span><i className="fas fa-eye"></i> {formatViews(video.views)} views</span>
                <span><i className="fas fa-clock"></i> {video.timeAgo}</span>
                <span><i className="fas fa-thumbs-up"></i> {Math.floor(Math.random() * 50) + 10}K likes</span>
              </div>
              <p className="video-description">
                Watch the full review of the {video.title}. Get in-depth analysis, performance metrics, and expert opinions.
              </p>
              <div className="video-actions">
                <button className="btn-outline btn-small">
                  <i className="fas fa-share"></i> Share
                </button>
                <button className="btn-outline btn-small">
                  <i className="fas fa-save"></i> Save
                </button>
                <button className="btn-primary btn-small">
                  <i className="fas fa-bell"></i> Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CSS for VideoCard */}
      <style jsx>{`
        .video-thumb {
          position: relative;
          overflow: hidden;
          border-radius: 12px;
        }
        
        .video-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .video-overlay.active {
          opacity: 1;
        }
        
        .video-overlay i {
          font-size: 3rem;
          color: white;
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
          transition: transform 0.3s ease;
        }
        
        .video-overlay i:hover {
          transform: scale(1.1);
          color: #b9d024;
        }
        
        .new-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          background: #b9d024;
          color: #090909;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.7rem;
          font-weight: bold;
          z-index: 1;
        }
        
        .video-info {
          display: flex;
          gap: 12px;
          margin-top: 10px;
        }
        
        .video-channel-icon img {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          object-fit: cover;
        }
        
        .video-details {
          flex: 1;
        }
        
        .video-details h3 {
          font-size: 1rem;
          margin-bottom: 4px;
          line-height: 1.3;
        }
        
        .video-channel {
          font-size: 0.75rem;
          color: #b9d024;
          margin-bottom: 4px;
        }
        
        .video-meta {
          display: flex;
          gap: 10px;
          font-size: 0.7rem;
          color: #888;
        }
        
        .video-meta i {
          margin-right: 3px;
        }
        
        .video-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          backdrop-filter: blur(10px);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: fadeIn 0.3s ease;
        }
        
        .video-modal-content {
          max-width: 900px;
          width: 90%;
          background: #1a1a1a;
          border-radius: 16px;
          overflow: hidden;
          animation: scaleIn 0.3s ease;
        }
        
        .video-modal-close {
          position: absolute;
          top: -40px;
          right: 0;
          background: none;
          border: none;
          color: white;
          font-size: 1.5rem;
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        
        .video-modal-close:hover {
          background: rgba(255, 255, 255, 0.2);
        }
        
        .video-player {
          position: relative;
        }
        
        .video-modal-info {
          padding: 20px;
        }
        
        .video-modal-info h3 {
          margin-bottom: 10px;
          color: #b9d024;
        }
        
        .video-modal-stats {
          display: flex;
          gap: 15px;
          margin-bottom: 15px;
          font-size: 0.8rem;
          color: #888;
        }
        
        .video-description {
          font-size: 0.85rem;
          color: #ccc;
          margin-bottom: 20px;
          line-height: 1.5;
        }
        
        .video-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        .pulse {
          animation: pulse 1s infinite;
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </>
  );
}

export default VideoCard;