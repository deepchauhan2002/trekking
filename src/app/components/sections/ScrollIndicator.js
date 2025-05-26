'use client'
import React from 'react';
import { animated, useSpring } from '@react-spring/web';

export default function ScrollIndicator({ opacity }) {
  return (
    <div 
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
      style={{
        opacity: opacity,
        transition: 'opacity 0.3s ease'
      }}
    >
      <p className="text-white/70 mb-2 text-sm">Scroll to explore</p>
      <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
        <animated.div 
          className="w-2 h-2 bg-white rounded-full mt-2"
          style={useSpring({
            from: { transform: 'translateY(0)' },
            to: async (next) => {
              while (true) {
                await next({ transform: 'translateY(6px)', config: { tension: 170, friction: 26 } });
                await next({ transform: 'translateY(0)', config: { tension: 170, friction: 26 } });
              }
            }
          })}
        />
      </div>
    </div>
  );
}