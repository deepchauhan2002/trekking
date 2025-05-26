'use client'
import React from 'react';
import { animated, useSpring } from '@react-spring/web';

export default function GroundPlan() {
  // Animation for the path drawing effect
  const pathAnimation = useSpring({
    from: { strokeDashoffset: 1000 },
    to: { strokeDashoffset: 0 },
    config: { tension: 40, friction: 15 },
    delay: 800
  });

  // Fade-in animations for markers and labels
  const fadeIn = useSpring({
    from: { opacity: 0 },
    to: { opacity: 1 },
    config: { duration: 1000 },
    delay: 1500
  });

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 1200 300" 
        preserveAspectRatio="none"
        style={{ 
          position: 'absolute',
          bottom: 0,
          left: 0,
          filter: 'drop-shadow(0 -10px 10px rgba(0,0,0,0.1))'
        }}
      >
        {/* Base terrain - semi-transparent layer */}
        <path 
          d="M-20,300 L-20,200 Q100,180 200,190 T400,170 T600,150 T800,160 T1000,140 T1220,170 L1220,300 Z" 
          fill="rgba(255,255,255,0.08)" 
        />

        {/* Middle terrain layer */}
        <path 
          d="M-20,300 L-20,220 Q150,210 250,230 T450,200 T650,180 T850,190 T1050,170 T1220,200 L1220,300 Z" 
          fill="rgba(255,255,255,0.12)" 
        />

        {/* Front terrain - more visible */}
        <path 
          d="M-20,300 L-20,240 Q200,250 300,260 T500,230 T700,240 T900,220 T1100,230 T1220,240 L1220,300 Z" 
          fill="rgba(255,255,255,0.15)" 
        />
        
        {/* Trek path - animated line showing the route */}
        <animated.path
          d="M100,260 C200,240 250,180 300,210 C350,235 400,190 450,180 C500,170 550,200 600,170 C650,145 700,155 750,130 C800,105 850,120 900,90"
          stroke="var(--keppel)"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="1000"
          strokeDashoffset={pathAnimation.strokeDashoffset}
          style={{ 
            opacity: 0.7,
            filter: 'drop-shadow(0 0 3px rgba(100,255,218,0.5))'
          }}
        />

        {/* Location markers */}
        <animated.g style={{ opacity: fadeIn.opacity }}>
          {/* Wan Village */}
          <circle cx="100" cy="260" r="4" fill="var(--keppel)" />
          <text x="100" y="280" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">
            Wan Village
          </text>
          <text x="100" y="292" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">
            2,500m
          </text>
          
          {/* Bedni Bugyal */}
          <circle cx="300" cy="210" r="4" fill="var(--keppel)" />
          <text x="300" y="230" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">
            Bedni Bugyal
          </text>
          <text x="300" y="242" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">
            3,350m
          </text>
          
          {/* Ali Bugyal */}
          <circle cx="450" cy="180" r="4" fill="var(--keppel)" />
          <text x="450" y="200" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">
            Ali Bugyal
          </text>
          <text x="450" y="212" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">
            3,500m
          </text>
          
          {/* Pathar Nachauni */}
          <circle cx="600" cy="170" r="4" fill="var(--keppel)" />
          <text x="600" y="158" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">
            Pathar Nachauni
          </text>
          <text x="600" y="170" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">
            3,800m
          </text>
          
          {/* Bhagwabasa */}
          <circle cx="750" cy="130" r="4" fill="var(--keppel)" />
          <text x="750" y="118" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.7)">
            Bhagwabasa
          </text>
          <text x="750" y="130" textAnchor="middle" fontSize="9" fill="rgba(255,255,255,0.5)">
            4,100m
          </text>
          
          {/* Roopkund Lake */}
          <circle cx="900" cy="90" r="5" fill="var(--keppel)" />
          <circle cx="900" cy="90" r="8" fill="none" stroke="var(--keppel)" strokeWidth="2" opacity="0.5">
            <animate attributeName="r" from="8" to="16" dur="3s" repeatCount="indefinite" />
            <animate attributeName="opacity" from="0.5" to="0" dur="3s" repeatCount="indefinite" />
          </circle>
          <text x="900" y="78" textAnchor="middle" fontSize="11" fontWeight="bold" fill="rgba(255,255,255,0.8)">
            Roopkund Lake
          </text>
          <text x="900" y="92" textAnchor="middle" fontSize="10" fill="rgba(255,255,255,0.6)">
            5,029m
          </text>
        </animated.g>
      </svg>
    </div>
  );
}