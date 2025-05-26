'use client'
import React, { useState, useEffect } from 'react';
import { animated, useSpring, useTrail, config } from '@react-spring/web';

export default function HistorySection({ style = {}, isVisible, lenisInstance }) {
  const [animationStarted, setAnimationStarted] = useState(false);
  
  // Optimize animation trigger timing
  useEffect(() => {
    if (isVisible) {
      // Faster animation start for better connection with video transition
      const timer = setTimeout(() => setAnimationStarted(true), 100);
      return () => clearTimeout(timer);
    } else {
      setAnimationStarted(false);
    }
  }, [isVisible]);

  // Sync lenis scroll parameters for this section
  useEffect(() => {
    if (isVisible && lenisInstance) {
      // Adjust for history section
      lenisInstance.options.smoothWheel = true;
      lenisInstance.options.wheelMultiplier = 0.8; // Slower for more time in this section
    }
  }, [isVisible, lenisInstance]);
  
  // More connected entry animation
  const containerAnimation = useSpring({
    from: { opacity: 0, backdrop: 'blur(0px)' },
    to: { 
      opacity: animationStarted ? 1 : 0,
      backdrop: animationStarted ? 'blur(5px)' : 'blur(0px)' 
    },
    config: { tension: 80, friction: 14 }, // Smoother entry
  });
  
  // Content animations with staggered entry
  const contentAnimation = useSpring({
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { 
      opacity: animationStarted ? 1 : 0, 
      transform: animationStarted ? 'translateY(0px)' : 'translateY(30px)'
    },
    config: { tension: 120, friction: 14 },
    delay: 200
  });
  
  // Text paragraphs with staggered trail effect
  const paragraphs = [
    "DISCOVERED IN 1942, ROOPKUND CONTAINS HUNDREDS OF HUMAN SKELETONS. WHEN THE ICE MELTS, REMAINS FROM THE 9TH CENTURY BECOME VISIBLE TO TREKKERS. LOCATED IN UTTARAKHAND, INDIA.",
    "DNA ANALYSIS REVEALS THESE INDIVIDUALS CAME FROM DISTINCT GENETIC GROUPS ACROSS SOUTH ASIA, THE MEDITERRANEAN, AND SOUTHEAST ASIA."
  ];
  
  const trail = useTrail(paragraphs.length, {
    from: { opacity: 0, y: 30 },
    to: { 
      opacity: animationStarted ? 1 : 0,
      y: animationStarted ? 0 : 30 
    },
    config: config.gentle,
    delay: 400
  });

  return (
    <animated.div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 20,
        backgroundColor: 'rgba(242, 236, 228, 0.97)',
        backdropFilter: containerAnimation.backdrop,
        pointerEvents: isVisible ? 'auto' : 'none',
        color: 'var(--drab-dark-brown)',
        overflow: 'hidden',
        opacity: containerAnimation.opacity,
        ...style,
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        padding: 'clamp(20px, 5vw, 60px)',
        paddingBottom: 'clamp(40px, 8vh, 80px)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        boxSizing: 'border-box',
        justifyContent: 'space-between',
      }}>
        <animated.div style={{
          ...contentAnimation,
          marginTop: 'auto',
          marginBottom: 'clamp(20px, 5vh, 40px)',
          width: '100%',
          maxWidth: '1400px',
          alignSelf: 'center',
        }}>
          <h2 style={{ 
            color: 'var(--drab-dark-brown)',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            fontWeight: 400,
            lineHeight: 1.1,
            letterSpacing: '-0.01em',
            maxWidth: '100%',
            overflowWrap: 'break-word',
            paddingRight: '10px',
            position: 'relative',
          }}>
            Roopkund Lake sits amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique
            <span style={{
              position: 'absolute',
              bottom: '-15px',
              left: '0',
              width: 'clamp(80px, 15vw, 200px)',
              height: '4px',
              background: 'var(--keppel)',
              borderRadius: '2px',
            }}></span>
          </h2>
        </animated.div>
        
        <div style={{
          marginTop: 'auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 'clamp(20px, 4vw, 40px)',
          width: '100%',
          maxWidth: '1400px',
          alignSelf: 'center',
        }}>
          {trail.map((style, i) => (
            <animated.div 
              key={i}
              style={{
                transform: style.y.to(y => `translateY(${y}px)`),
                opacity: style.opacity,
              }}
            >
              <p style={{ 
                color: 'var(--drab-dark-brown-2)',
                fontSize: 'clamp(0.75rem, 1vw, 0.875rem)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                lineHeight: '1.8',
                maxWidth: '100%',
                overflowWrap: 'break-word',
              }}>
                {paragraphs[i]}
              </p>
            </animated.div>
          ))}
        </div>
      </div>
    </animated.div>
  );
}