'use client'
import React, { useState, useEffect, useRef } from 'react';
import { animated, useSpring, useTransition, config, useSpringRef } from '@react-spring/web';

export default function ExperienceSection({ style = {}, isVisible, scrollProgress, lenisInstance }) {
  // Config for media slideshow
  const mediaItems = [
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1579802063117-8118f0a7e2bd",
      alt: "Roopkund Lake with visible skeletal remains",
      caption: "The Mysterious Lake of Skeletons"
    },
    {
      type: "video",
      src: "https://player.vimeo.com/external/517090025.hd.mp4?s=9c68554dbbf9be5b2095a1e7b51ffabe95ac9fbd&profile_id=175&oauth2_token_id=57447761",
      caption: "The trek to Roopkund through breathtaking Himalayan landscapes"
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1631909577873-d90def514edb",
      alt: "Human remains preserved in the mountain atmosphere",
      caption: "Preserved remains from the 9th century CE"
    },
    {
      type: "image",
      src: "https://images.unsplash.com/photo-1499110751954-594fd46286c9",
      alt: "Himalayan mountains surrounding the area",
      caption: "The stunning Himalayan mountains surrounding Roopkund"
    }
  ];

  // State for slideshow
  const [slideshowIndex, setSlideshowIndex] = useState(0);
  const [paragraphsVisible, setParagraphsVisible] = useState(false);
  const [factsVisible, setFactsVisible] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const currentVideoRef = useRef(null);

  // Adjust Lenis scroll behavior for this section
  useEffect(() => {
    if (isVisible && lenisInstance) {
      lenisInstance.options.smoothWheel = true;
      lenisInstance.options.wheelMultiplier = 0.9;
    }
  }, [isVisible, lenisInstance]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isVisible) return;
    
    const interval = setInterval(() => {
      setSlideshowIndex((current) => (current + 1) % mediaItems.length);
    }, 6000); // Change slide every 6 seconds
    
    return () => clearInterval(interval);
  }, [isVisible, mediaItems.length]);
  
  // Manage video playback
  useEffect(() => {
    const currentItem = mediaItems[slideshowIndex];
    
    // Handle video playback logic
    if (currentItem.type === 'video' && currentVideoRef.current) {
      currentVideoRef.current.currentTime = 0;
      
      const playPromise = currentVideoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsVideoPlaying(true))
          .catch(() => setIsVideoPlaying(false));
      }
    } else {
      setIsVideoPlaying(false);
    }
  }, [slideshowIndex, mediaItems]);

  // Show content based on scroll progress
  useEffect(() => {
    if (scrollProgress > 0.2) {
      setParagraphsVisible(true);
    }
    
    if (scrollProgress > 0.6) {
      setFactsVisible(true);
    }
  }, [scrollProgress]);

  // Main entrance animation
  const containerAnimation = useSpring({
    from: { opacity: 0 },
    to: { opacity: isVisible ? 1 : 0 },
    config: { tension: 120, friction: 14 },
  });
  
  // Slideshow transition
  const slideTransitions = useTransition(slideshowIndex, {
    from: { opacity: 0, transform: 'scale(1.1)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.9)' },
    config: { tension: 170, friction: 22 },
  });
  
  // Paragraph reveal animations
  const paragraphAnimation = useSpring({
    opacity: paragraphsVisible ? 1 : 0,
    transform: paragraphsVisible ? 'translateY(0px)' : 'translateY(40px)',
    config: { tension: 120, friction: 14, mass: 1 },
    delay: 200,
  });
  
  // Facts section animation
  const factsAnimation = useSpring({
    opacity: factsVisible ? 1 : 0,
    transform: factsVisible ? 'translateY(0px)' : 'translateY(50px)',
    config: { tension: 100, friction: 14 },
    delay: 400,
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
        zIndex: 30, // Higher than other sections
        backgroundColor: 'var(--background)',
        color: 'var(--foreground)',
        overflow: 'hidden',
        ...containerAnimation,
        ...style,
      }}
    >
      {/* Background pattern */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundImage: `radial-gradient(var(--nyanza) 1px, transparent 1px)`,
          backgroundSize: '30px 30px',
          opacity: 0.05,
          zIndex: 0,
        }}
      />

      <div className="content-container"
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          padding: '0 clamp(16px, 5vw, 80px)',
          overflowY: 'auto',
          scrollbarWidth: 'none', // Hide scrollbar for Firefox
          msOverflowStyle: 'none', // Hide scrollbar for IE/Edge
        }}
      >
        {/* Media slideshow section */}
        <div 
          style={{
            width: '100%',
            height: '55vh',
            position: 'relative',
            borderRadius: '0 0 clamp(8px, 3vw, 24px) clamp(8px, 3vw, 24px)',
            overflow: 'hidden',
            marginBottom: '30px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          {slideTransitions((style, index) => {
            const item = mediaItems[index];
            return (
              <animated.div
                style={{
                  ...style,
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                }}
              >
                {item.type === 'image' ? (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <img
                      src={item.src}
                      alt={item.alt}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                ) : (
                  <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                    <video
                      ref={currentVideoRef}
                      src={item.src}
                      muted
                      loop
                      playsInline
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </div>
                )}
                
                {/* Caption overlay */}
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '100%',
                  background: 'linear-gradient(to top, rgba(61,53,34,0.8) 0%, rgba(61,53,34,0.4) 50%, transparent 100%)',
                  padding: '60px 30px 20px',
                  boxSizing: 'border-box',
                  color: 'white',
                  textAlign: 'center',
                }}>
                  <p style={{ 
                    fontSize: 'clamp(1rem, 1.5vw, 1.25rem)', 
                    fontWeight: 400,
                    margin: 0,
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {item.caption}
                  </p>
                </div>
              </animated.div>
            );
          })}
          
          {/* Slideshow indicators */}
          <div style={{
            position: 'absolute',
            bottom: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            gap: '10px',
            zIndex: 2,
          }}>
            {mediaItems.map((_, i) => (
              <button
                key={i}
                onClick={() => setSlideshowIndex(i)}
                style={{
                  width: i === slideshowIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background: i === slideshowIndex ? 'var(--keppel)' : 'rgba(255,255,255,0.5)',
                  border: 'none',
                  padding: 0,
                  cursor: 'pointer',
                  transition: 'width 0.3s ease, background 0.3s ease',
                }}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Title and description */}
        <animated.div 
          style={{
            ...paragraphAnimation,
            maxWidth: '900px',
            margin: '0 auto',
            width: '100%',
            textAlign: 'left',
            padding: '20px 0',
          }}
        >
          <h1 style={{
            fontSize: 'clamp(2rem, 6vw, 3.5rem)',
            fontWeight: 600,
            color: 'var(--drab-dark-brown)',
            marginBottom: '1.2rem',
            position: 'relative',
            display: 'inline-block',
          }}>
            The Skeleton Lake
            <div style={{
              position: 'absolute',
              bottom: '-10px',
              left: '0',
              width: '60%',
              height: '4px',
              background: 'var(--keppel)',
              borderRadius: '2px',
            }}/>
          </h1>

          <p style={{
            fontSize: 'clamp(1.1rem, 1.2vw, 1.3rem)',
            lineHeight: 1.7,
            color: 'var(--drab-dark-brown-2)',
            marginBottom: '1.5rem',
            fontWeight: 400,
          }}>
            At an altitude of 5,029 meters (16,500 feet) in the Indian Himalayan mountains of Uttarakhand lies 
            a small glacial lake with a dark and mysterious history. Roopkund, often referred to as "Skeleton Lake," 
            contains the remains of several hundred individuals dating back to the 9th century CE.
          </p>

          <p style={{
            fontSize: 'clamp(1.1rem, 1.2vw, 1.3rem)',
            lineHeight: 1.7,
            color: 'var(--drab-dark-brown-2)',
            marginBottom: '1.5rem',
            fontWeight: 400,
          }}>
            The lake, which remains frozen for most of the year, reveals its eerie contents during a brief melt 
            period. When the ice recedes, hundreds of skeletons become visible, scattered around the lake's shores 
            and at its bottom. For decades, these remains were a perplexing mystery to scientists and locals alike.
          </p>
        </animated.div>

        {/* Fact cards section */}
        <animated.div 
          style={{
            ...factsAnimation,
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 'clamp(16px, 3vw, 30px)',
            width: '100%',
            maxWidth: '1200px',
            margin: '20px auto 40px',
            padding: '10px',
            boxSizing: 'border-box',
          }}
        >
          {/* Fact Card 1 */}
          <div style={{
            backgroundColor: 'rgba(88, 176, 156, 0.08)',
            borderRadius: '12px',
            padding: 'clamp(20px, 3vw, 30px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderLeft: '4px solid var(--keppel)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }} className="hover-card">
            <h3 style={{ 
              fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)',
              fontWeight: 600,
              color: 'var(--hunter-green)',
              marginBottom: '1rem',
            }}>
              Scientific Analysis
            </h3>
            <p style={{
              fontSize: 'clamp(0.95rem, 1vw, 1.05rem)',
              lineHeight: 1.6,
              color: 'var(--drab-dark-brown-2)',
              margin: 0,
            }}>
              Modern DNA analysis has revealed that the skeletal remains belong to distinct groups of people: some 
              from South Asia, others from the eastern Mediterranean, and yet others from Southeast Asia. This 
              suggests that these weren't merely local travelers, but diverse groups who perished at this remote location.
            </p>
          </div>

          {/* Fact Card 2 */}
          <div style={{
            backgroundColor: 'rgba(88, 176, 156, 0.08)',
            borderRadius: '12px',
            padding: 'clamp(20px, 3vw, 30px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderLeft: '4px solid var(--keppel)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }} className="hover-card">
            <h3 style={{ 
              fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)',
              fontWeight: 600,
              color: 'var(--hunter-green)',
              marginBottom: '1rem',
            }}>
              Cause of Death
            </h3>
            <p style={{
              fontSize: 'clamp(0.95rem, 1vw, 1.05rem)',
              lineHeight: 1.6,
              color: 'var(--drab-dark-brown-2)',
              margin: 0,
            }}>
              Examination of the skulls revealed depressed fractures, suggesting that the victims died from blows 
              to the head. Intriguingly, these injuries came from above and were of similar size—consistent with being 
              struck by round objects about the size of cricket balls. Scientists now believe that the cause was a 
              sudden, severe hailstorm with unusually large hailstones.
            </p>
          </div>

          {/* Fact Card 3 */}
          <div style={{
            backgroundColor: 'rgba(88, 176, 156, 0.08)',
            borderRadius: '12px',
            padding: 'clamp(20px, 3vw, 30px)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
            borderLeft: '4px solid var(--keppel)',
            transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          }} className="hover-card">
            <h3 style={{ 
              fontSize: 'clamp(1.2rem, 1.5vw, 1.4rem)',
              fontWeight: 600,
              color: 'var(--hunter-green)',
              marginBottom: '1rem',
            }}>
              Local Folklore
            </h3>
            <p style={{
              fontSize: 'clamp(0.95rem, 1vw, 1.05rem)',
              lineHeight: 1.6,
              color: 'var(--drab-dark-brown-2)',
              margin: 0,
            }}>
              Local legends speak of a king who angered the mountain goddess Nanda Devi. The group was crossing 
              the mountains with dancers and musicians, disrespecting the sacred grounds. As punishment, the goddess 
              sent a deadly hailstorm, killing everyone. This folklore aligns surprisingly well with the scientific 
              evidence of death by hail, bridging ancient wisdom and modern science.
            </p>
          </div>
        </animated.div>

        {/* Add some breathing room at the bottom */}
        <div style={{ height: '40px' }} />
      </div>

      {/* Scroll indicator - only visible at the beginning */}
      {scrollProgress < 0.2 && (
        <div style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 50,
          opacity: 0.6,
          animation: 'bounce 2s infinite',
        }}>
          <p style={{ 
            margin: '0 0 8px 0', 
            fontSize: '0.8rem', 
            textTransform: 'uppercase',
            letterSpacing: '2px',
            color: 'var(--drab-dark-brown)',
          }}>
            Scroll to discover
          </p>
          <svg width="24" height="12" viewBox="0 0 24 12">
            <path 
              d="M2 2L12 10L22 2" 
              stroke="var(--drab-dark-brown)" 
              strokeWidth="2" 
              fill="none" 
              strokeLinecap="round"
            />
          </svg>
        </div>
      )}

      {/* Custom CSS for animations */}
      <style jsx global>{`
        .content-container::-webkit-scrollbar {
          display: none;
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0) translateX(-50%); }
          40% { transform: translateY(-10px) translateX(-50%); }
          60% { transform: translateY(-5px) translateX(-50%); }
        }
        
        .hover-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
      `}</style>
    </animated.div>
  );
}