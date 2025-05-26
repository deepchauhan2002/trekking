'use client'
import React, { useEffect, useState } from 'react';
import { animated, useSpring } from '@react-spring/web';

export default function HeroSection({ 
  scrollProgress, 
  videoAnimation, 
  videoRef, 
  videoLoaded, 
  shouldHide,
  lenisInstance
}) {
  // Use threshold-based approach for more immediate text switch
  const textSwitchThreshold = 0.3; // Text switches at 30% scroll
  
  // First text is fully visible until threshold, then immediately starts fading
  const firstTextOpacity = scrollProgress < textSwitchThreshold 
    ? 1 
    : Math.max(0, 1 - ((scrollProgress - textSwitchThreshold) * 5));
  
  // Second text is invisible until threshold, then immediately starts appearing
  const secondTextOpacity = scrollProgress < textSwitchThreshold 
    ? 0 
    : Math.min(1, (scrollProgress - textSwitchThreshold) * 5);
  
  // Use direct CSS transitions for immediate effect
  const firstTextStyle = {
    position: 'absolute',
    opacity: shouldHide ? 0 : firstTextOpacity,
    transform: `translateY(${scrollProgress * -50}px)`, // More dramatic movement
    maxWidth: '1200px',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    marginTop: '10vh', // Moved lower on screen as requested
    transition: 'opacity 0.05s ease' // Even shorter transition for immediate change
  };

  const secondTextStyle = {
    position: 'absolute',
    opacity: shouldHide ? 0 : secondTextOpacity,
    transform: `translateY(${(1 - scrollProgress) * 50}px)`, // More dramatic movement
    maxWidth: '1200px',
    width: '100%',
    textAlign: 'center',
    color: 'white',
    transition: 'opacity 0.05s ease' // Even shorter transition for immediate change
  };

  // Sync lenis scroll with animation frames
  useEffect(() => {
    if (!videoLoaded) return;
    
    // Update lenis scroll parameters when the hero section is active
    if (!shouldHide && lenisInstance) {
      // Make scrolling even less smooth for hero section
      lenisInstance.options.smoothWheel = true;
      lenisInstance.options.wheelMultiplier = 1.8; // Increased for extremely fast response
    }
  }, [videoLoaded, shouldHide, lenisInstance]);

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        overflow: 'hidden',
        zIndex: 1,
      }}
    >
      {/* Content container */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '0 20px',
        }}
      >
        {/* Text that fades out on scroll - using direct styles */}
        <div style={firstTextStyle}>
          <h1
            style={{
              fontSize: 'clamp(4rem, 8vw, 18rem)',
              fontWeight: 'bold',
              marginBottom: '20px',
              lineHeight: 1.1,
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.05em'
            }}
          >
            ROOPKUND
          </h1>
        </div>

        {/* Text that fades in on scroll - using direct styles */}
        <div style={secondTextStyle}>
          <h1
            style={{
              fontSize: 'clamp(2.5rem, 4vw, 5rem)',
              fontWeight: 'bold',
              marginBottom: '20px',
              lineHeight: 1.1,
              textShadow: '0 4px 8px rgba(0, 0, 0, 0.5)',
              letterSpacing: '0.05em'
            }}
          >
            THE MYSTERIOUS LAKE
          </h1>
          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 2.5rem)',
              fontWeight: 300,
              maxWidth: '700px',
              margin: '0 auto',
              color: 'var(--keppel)',
              textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
            }}
          >
            Discover the secrets of Roopkund's ancient remains
          </p>
        </div>
      </div>

      {/* Removed itinerary section as requested */}
    </div>
  );
}