'use client'
import React, { useState, useEffect, useRef } from 'react';
import { animated, useSpring, useTrail } from '@react-spring/web';

export default function LocationDisplay({ 
  location,
  elevation, 
  description,
  longDescription,
  media,
  nextLocation,
  colorScheme = "dark",
  sectionIndex,
  lenisInstance,
  windowHeight,
  scrollPosition,
  totalLocations
}) {
  const [scrollRatio, setScrollRatio] = useState(0);
  const containerRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  
  // Calculate section boundaries
  const sectionStartY = windowHeight * (6 + (sectionIndex * 3)); // 6 for hero+history, 3 for each location
  const sectionHeight = windowHeight * 3;
  
  // Calculate if section is in view and scroll ratio
  useEffect(() => {
    const calcScrollRatio = () => {
      // Calculate how far we've scrolled into this section (0 to 1)
      const relativeScroll = scrollPosition - sectionStartY;
      const ratio = Math.max(0, Math.min(relativeScroll / sectionHeight, 1));
      
      // Is this section in view?
      const inView = relativeScroll >= -windowHeight && relativeScroll <= sectionHeight;
      
      setScrollRatio(ratio);
      setIsInView(inView);
    };
    
    calcScrollRatio();
  }, [scrollPosition, sectionStartY, sectionHeight, windowHeight]);
  
  // Optimize lenis scroll for this section
  useEffect(() => {
    if (isInView && lenisInstance) {
      // Adjust for location display
      lenisInstance.options.smoothWheel = true;
      lenisInstance.options.wheelMultiplier = 1.3;
    }
  }, [isInView, lenisInstance]);
  
  // More gentle horizontal parallax effect
  const parallaxOffset = 80 * scrollRatio; // Reduced from 100 to 80 for smoother effect
  
  // Heading animation optimized
  const headingAnim = useSpring({
    opacity: isInView ? 1 : 0,
    transform: isInView ? 'translateY(0)' : 'translateY(50px)',
    config: { tension: 130, friction: 16 },
    delay: isInView ? 100 : 0
  });
  
  // Media animations with staggered timing and better performance
  const mediaTrail = useTrail(media.length, {
    opacity: isInView ? 1 : 0,
    transform: isInView ? 'translateY(0)' : 'translateY(30px)',
    config: { tension: 110, friction: 14 },
    delay: isInView ? 200 : 0
  });
  
  // Next location preview animation - smoother
  const nextPreviewAnim = useSpring({
    opacity: scrollRatio > 0.7 ? Math.min(3.33 * (scrollRatio - 0.7), 1) : 0,
    x: scrollRatio > 0.7 ? 0 : 100,
    config: { tension: 120, friction: 16 }
  });
  
  return (
    <div 
      ref={containerRef}
      className={`location-display ${colorScheme}`}
      style={{
        height: `${sectionHeight}px`,
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: colorScheme === 'dark' ? '#0A0D14' : '#F6F4F1',
        color: colorScheme === 'dark' ? '#F6F4F1' : '#0A0D14',
      }}
    >
      {/* Fixed content that stays during scroll */}
      <div 
        style={{
          position: 'sticky',
          top: 0,
          height: '100vh',
          width: '100%',
          overflow: 'hidden'
        }}
      >
        {/* Background gradient overlay for depth */}
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.6,
            background: colorScheme === 'dark' 
              ? 'radial-gradient(circle at 30% 30%, #1a1e2a 0%, #0A0D14 70%)' 
              : 'radial-gradient(circle at 30% 30%, #ffffff 0%, #F6F4F1 70%)'
          }}
        />
        
        {/* Elevation label */}
        <div 
          style={{
            position: 'absolute',
            top: '5vh',
            left: '5vw',
            zIndex: 5
          }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center',
            backgroundColor: 'var(--keppel)',
            padding: '8px 16px',
            borderRadius: '4px'
          }}>
            <span style={{ 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              color: '#FFF',
              letterSpacing: '0.05em'
            }}>
              {elevation}
            </span>
          </div>
        </div>
        
        {/* Main heading */}
        <animated.div
          style={{
            opacity: headingAnim.opacity,
            transform: headingAnim.transform,
            position: 'absolute',
            top: '15vh',
            left: '5vw',
            maxWidth: '60vw',
            zIndex: 10
          }}
        >
          <h2 style={{ 
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            fontWeight: 600,
            marginBottom: '1.5rem',
            letterSpacing: '-0.02em',
            lineHeight: 0.9
          }}>
            {location}
          </h2>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.5rem)',
            fontWeight: 300,
            maxWidth: '40vw',
            lineHeight: 1.6
          }}>
            {description}
          </p>
        </animated.div>
        
        {/* Horizontal parallax media container - optimized rendering */}
        <div
          style={{
            position: 'absolute',
            top: '40vh',
            left: 0,
            width: '100vw',
            height: '40vh',
            display: 'flex',
            transform: `translateX(${-parallaxOffset}vw)`,
            transition: 'transform 0.05s ease-out'
          }}
        >
          {/* Only render media when in view or close to view for performance */}
          {isInView && mediaTrail.map((style, index) => {
            const item = media[index];
            const width = index === 0 ? '50vw' : '30vw'; // First item larger
            
            return (
              <animated.div
                key={index}
                style={{
                  opacity: style.opacity,
                  transform: style.transform,
                  flexShrink: 0,
                  width: width,
                  height: '100%',
                  margin: '0 20px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
                  position: 'relative'
                }}
              >
                {item.type === 'image' ? (
                  <img
                    src={item.src}
                    alt={item.alt || location}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    loading="lazy" // Add lazy loading for better performance
                  />
                ) : (
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    // Only play video when in view for performance
                    onCanPlay={(e) => {
                      if (isInView) e.target.play();
                      else e.target.pause();
                    }}
                  >
                    <source src={item.src} type="video/mp4" />
                  </video>
                )}
                
                {/* Caption overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  padding: '20px',
                  background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                  color: '#FFF'
                }}>
                  <p style={{ 
                    fontSize: 'clamp(0.875rem, 1.2vw, 1.1rem)',
                    fontWeight: 500,
                    margin: 0
                  }}>
                    {item.caption}
                  </p>
                </div>
              </animated.div>
            );
          })}
          
          {/* Add extra space at the end for scrolling */}
          <div style={{ flexShrink: 0, width: '50vw' }}></div>
        </div>
        
        {/* Long description that appears during scroll - optimized animation */}
        <div style={{ 
          position: 'absolute',
          bottom: '10vh',
          right: '5vw',
          maxWidth: '40vw',
          opacity: Math.min(1, scrollRatio * 2),
          transform: `translateY(${Math.max(0, (1 - scrollRatio * 2) * 30)}px)`, // Reduced from 50px to 30px
          transition: 'opacity 0.2s ease, transform 0.2s ease' // Faster transition
        }}>
          <p style={{
            fontSize: 'clamp(0.875rem, 1.5vw, 1.1rem)',
            lineHeight: 1.8,
            fontWeight: 300
          }}>
            {longDescription}
          </p>
        </div>
        
        {/* Next location preview (appears at end of section) */}
        {nextLocation && (
          <animated.div style={{
            opacity: nextPreviewAnim.opacity,
            transform: nextPreviewAnim.x.to(x => `translateX(${x}px)`),
            position: 'absolute',
            bottom: '5vh',
            left: '5vw',
            display: 'flex',
            alignItems: 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'var(--keppel)',
              marginRight: '15px'
            }}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M8 3L14 8L8 13M14 8H2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div>
              <p style={{ 
                margin: 0, 
                fontSize: '0.875rem',
                fontWeight: 300,
                opacity: 0.7,
                marginBottom: '4px'
              }}>
                Next Location
              </p>
              <p style={{ 
                margin: 0, 
                fontSize: '1.25rem',
                fontWeight: 600
              }}>
                {nextLocation}
              </p>
            </div>
          </animated.div>
        )}
        
        {/* Location indicator (subtle UI element showing progress) */}
        <div style={{
          position: 'absolute',
          bottom: '5vh',
          right: '5vw',
          display: 'flex',
          gap: '6px',
          alignItems: 'center'
        }}>
          {Array.from({ length: totalLocations }).map((_, i) => (
            <div 
              key={i}
              style={{
                width: i === sectionIndex ? '20px' : '6px',
                height: '6px',
                borderRadius: '3px',
                backgroundColor: i === sectionIndex 
                  ? 'var(--keppel)' 
                  : colorScheme === 'dark' ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.2)',
                transition: 'width 0.3s ease'
              }}
            />
          ))}
        </div>
      </div>
      
      <style jsx global>{`
        .location-display.dark {
          --text-color: #F6F4F1;
          --bg-color: #0A0D14;
        }
        
        .location-display.light {
          --text-color: #0A0D14;
          --bg-color: #F6F4F1;
        }
      `}</style>
    </div>
  );
}