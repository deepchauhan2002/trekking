'use client'
import React from 'react';
import { animated } from '@react-spring/web';

export default function MysterySection({ style }) {
  return (
    <animated.div
      style={{
        ...style,
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 30,
        pointerEvents: style.opacity.get() > 0.1 ? 'auto' : 'none'
      }}
    >
      <div className="w-full max-w-4xl mx-auto px-6 py-10 bg-black/40 backdrop-blur-sm rounded-lg">
        <div className="mb-6 inline-block px-4 py-2 bg-teal-500/30 backdrop-blur-sm rounded-full text-teal-200 font-medium">
          The Mystery
        </div>
        
        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
          What Happened at Skeleton Lake?
        </h2>
        
        <div className="prose prose-lg prose-invert max-w-none">
          <p className="text-white/90 text-lg md:text-xl mb-6 leading-relaxed">
            Evidence points to a catastrophic hailstorm with hailstones as large as 
            cricket balls that caused fatal blunt-force trauma to the heads and 
            shoulders of the victims. With nowhere to seek shelter in the 
            high-altitude basin, they were tragically killed by nature's fury.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-xl text-teal-300 mb-2">Altitude</h3>
              <p className="text-white/80">5,029 meters (16,499 ft)</p>
            </div>
            <div className="bg-black/30 p-4 rounded-lg">
              <h3 className="text-xl text-teal-300 mb-2">Dating</h3>
              <p className="text-white/80">9th century CE</p>
            </div>
          </div>
        </div>
      </div>
    </animated.div>
  );
}