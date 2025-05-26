'use client'
import React, { useState, useEffect } from 'react';
import { animated, useSpring, config } from '@react-spring/web';

export default function ExampleLoader({ isLoading = true }) {
  // Fade in/out animation
  const containerAnimation = useSpring({
    opacity: isLoading ? 1 : 0,
    config: { duration: 400 }
  });
  
  // Mountain range animation - shifting slightly for subtle motion
  const mountainAnimation = useSpring({
    from: { transform: 'translateY(0px)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateY(-5px)', config: { duration: 2000 } });
        await next({ transform: 'translateY(0px)', config: { duration: 2000 } });
      }
    }
  });
  
  // Cloud animation
  const cloudAnimation = useSpring({
    from: { transform: 'translateX(-10%)' },
    to: async (next) => {
      while (true) {
        await next({ transform: 'translateX(10%)', config: { duration: 10000 } });
        await next({ transform: 'translateX(-10%)', config: { duration: 10000 } });
      }
    }
  });
  
  // Progress bar animation
  const barAnimation = useSpring({
    from: { width: '0%' },
    to: async (next) => {
      while (true) {
        await next({ width: '100%', config: { duration: 3000 } });
        await next({ width: '0%', config: { duration: 0 } });
      }
    }
  });
  
  // Rotating loading messages for mountain theme
  const messages = [
    'Preparing your adventure...',
    'Discovering hidden trails...',
    'Mapping the terrain...',
    'Loading mountain scenery...',
    'Packing your virtual gear...'
  ];
  
  const [loadingText, setLoadingText] = useState(messages[0]);
  
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * messages.length);
      setLoadingText(messages[randomIndex]);
    }, 1000); // Changed from 3000ms to 1000ms for faster text changes
    
    return () => clearInterval(interval);
  }, []);

  return (
    <animated.div
      style={{
        ...containerAnimation,
        position: 'fixed',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(8px)',
        zIndex: 9999
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '24px',
          padding: '20px',
          maxWidth: '90%'
        }}
      >
        {/* Mountain logo animation */}
        <div 
          style={{ 
            width: '200px', 
            height: '120px', 
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '8px',
            marginBottom: '8px',
            backgroundColor: 'var(--nyanza)',
            boxShadow: '0 4px 15px rgba(88, 176, 156, 0.15)'
          }}
        >
          {/* Sky */}
          <div 
            style={{ 
              position: 'absolute', 
              inset: 0, 
              background: 'linear-gradient(180deg, var(--nyanza) 0%, var(--keppel) 100%)',
              opacity: 0.4
            }} 
          />
          
          {/* Animated clouds */}
          <animated.div
            style={{
              ...cloudAnimation,
              position: 'absolute',
              top: '15px',
              left: '10px',
              width: '180px',
              height: '20px'
            }}
          >
            {/* Cloud SVGs with project colors */}
            <svg width="180" height="20" viewBox="0 0 180 20">
              <path d="M20,15 C25,10 35,10 40,15 C45,5 60,5 65,15 C70,10 80,10 85,15 L85,20 L20,20 Z" 
                    fill="#ffffff" fillOpacity="0.8" />
              <path d="M100,12 C105,7 115,7 120,12 C123,5 133,5 138,12 L138,20 L100,20 Z" 
                    fill="#ffffff" fillOpacity="0.6" />
            </svg>
          </animated.div>
          
          {/* Animated mountain range */}
          <animated.div
            style={{
              ...mountainAnimation,
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              height: '80px'
            }}
          >
            {/* Mountain range SVG using the project's colors */}
            <svg width="100%" height="100%" viewBox="0 0 200 80">
              {/* Background mountains */}
              <path 
                d="M0,80 L0,50 L20,45 L40,55 L60,40 L80,50 L100,35 L120,45 L140,30 L160,40 L180,35 L200,45 L200,80 Z" 
                fill="var(--keppel)" 
              />
              
              {/* Middle mountains */}
              <path 
                d="M0,80 L0,60 L30,50 L50,60 L70,45 L90,55 L120,40 L150,50 L170,45 L200,55 L200,80 Z" 
                fill="var(--hunter-green)" 
              />
              
              {/* Foreground mountains */}
              <path 
                d="M0,80 L0,65 L15,60 L25,65 L40,55 L60,65 L75,60 L90,70 L110,60 L130,70 L150,55 L170,65 L185,60 L200,65 L200,80 Z" 
                fill="var(--drab-dark-brown)" 
              />
              
              {/* Snow caps on highest peaks */}
              <path 
                d="M100,35 L105,37 L110,36 L115,38 L120,45 M140,30 L145,32 L150,31 L155,34 L160,40" 
                stroke="var(--nyanza)" 
                strokeWidth="3" 
                fill="none" 
                strokeLinecap="round" 
              />
            </svg>
          </animated.div>
        </div>
        
        {/* Loading text */}
        <div
          style={{
            color: 'var(--drab-dark-brown-2)',
            fontSize: '15px',
            fontFamily: 'system-ui, sans-serif',
            fontWeight: '500',
            textAlign: 'center',
            maxWidth: '280px',
            minHeight: '40px'
          }}
        >
          {loadingText}
        </div>
        
        {/* Progress bar */}
        <div
          style={{
            width: '260px',
            height: '4px',
            backgroundColor: 'var(--nyanza)',
            borderRadius: '4px',
            overflow: 'hidden',
            marginTop: '5px'
          }}
        >
          <animated.div 
            style={{
              ...barAnimation,
              height: '100%',
              background: 'linear-gradient(90deg, var(--hunter-green), var(--keppel))'
            }}
          />
        </div>
      </div>
    </animated.div>
  );
}