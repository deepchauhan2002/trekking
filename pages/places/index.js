'use client'
import "../../src/app/globals.css";
import { useState, useEffect, useRef } from "react";
import { animated, useSpring } from "@react-spring/web";
import Lenis from 'lenis'
import VideoLoader from "../../src/app/components/VideoLoader";
import HeroSection from "../../src/app/components/sections/HeroSection";
import HistorySection from "../../src/app/components/sections/HistorySection";
import ExperienceSection from "../../src/app/components/sections/ExperienceSection";

export default function Places() {
    const [scrollPosition, setScrollPosition] = useState(0);
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [videoError, setVideoError] = useState(false);
    const [windowHeight, setWindowHeight] = useState(0);
    const [isClient, setIsClient] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const lenisRef = useRef(null);

    // Initialize client-side variables and smooth scroll
    useEffect(() => {
        setIsClient(true);
        setWindowHeight(window.innerHeight);

        // Initialize Lenis with improved smooth scrolling settings
        lenisRef.current = new Lenis({
            duration: 0.9, // Slightly increased for smoother transitions
            easing: (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t)), // Improved easing curve
            orientation: 'vertical',
            smoothWheel: true,
            wheelMultiplier: 1.2, // Reduced for better control
            touchMultiplier: 2.0, // Increased for better mobile experience
            smooth: true
        });

        // Make lenis available globally for other components
        window.lenisInstance = lenisRef.current;

        // Add scroll observer to dynamically adjust Lenis behavior
        lenisRef.current.on('scroll', ({ progress }) => {
            // Dynamically adjust scroll behavior based on section
            if (progress < 0.2) {
                // In hero section - faster scroll
                lenisRef.current.options.wheelMultiplier = 1.5;
            } else if (progress < 0.6) {
                // In history section - slower for better reading
                lenisRef.current.options.wheelMultiplier = 0.9;
            } else {
                // In experience section - moderate speed
                lenisRef.current.options.wheelMultiplier = 1.2;
            }
        });

        function raf(time) {
            if (lenisRef.current) {
                lenisRef.current.raf(time);
            }
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            if (lenisRef.current) {
                lenisRef.current.destroy();
            }
            delete window.lenisInstance;
        };
    }, []);

    // ----- REFINED SCROLL PROGRESS CALCULATIONS -----
    // Hero section - slightly faster transition for better pacing
    const heroProgress = isClient ? Math.min(scrollPosition / (windowHeight * 2.5), 1) : 0;
    
    // History section starts earlier and has longer duration for better viewing
    const historyProgress = isClient ? 
        Math.max(0, Math.min((scrollPosition - windowHeight * 1.8) / (windowHeight * 1.2), 1)) : 0;
    
    // History exit progress starts later for more viewing time
    const historyExitProgress = isClient ?
        Math.max(0, Math.min((scrollPosition - windowHeight * 5) / (windowHeight), 1)) : 0;
    
    // Experience section progress follows history exit
    const experienceProgress = isClient ?
        Math.max(0, Math.min((scrollPosition - windowHeight * 6) / (windowHeight * 5), 1)) : 0;
    
    // ----- ENHANCED VIDEO EFFECTS -----
    // Keep video more visible throughout with gradual dimming instead of fading out
    const videoOpacity = Math.max(0.4, 1 - (heroProgress * 0.6)); 
    
    // Video now expands during history section transition for a "zoom out" effect
    const videoScale = 1 + (historyProgress * 0.15); 
    
    // Add progressive blur and brightness reduction as we scroll
    const videoBlur = historyProgress * 4; // Pixels of blur
    const videoBrightness = 1 - (historyProgress * 0.4); // Reduce brightness

    // Handle scroll events with throttling for performance
    useEffect(() => {
        let ticking = false;
        
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    if (containerRef.current) {
                        setScrollPosition(window.scrollY);
                    }
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle video loading
    useEffect(() => {
        if (videoRef.current) {
            const video = videoRef.current;
            
            const handleLoadedData = () => {
                setVideoLoaded(true);
            };
            
            const handleError = () => {
                setVideoError(true);
                setVideoLoaded(true);
            };
            
            const handleProgress = () => {
                if (video.buffered.length > 0) {
                    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
                    const duration = video.duration;
                    if (duration > 0) {
                        setLoadingProgress((bufferedEnd / duration) * 100);
                    }
                }
            };
            
            video.addEventListener('loadeddata', handleLoadedData);
            video.addEventListener('error', handleError);
            video.addEventListener('progress', handleProgress);
            
            return () => {
                video.removeEventListener('loadeddata', handleLoadedData);
                video.removeEventListener('error', handleError);
                video.removeEventListener('progress', handleProgress);
            };
        }
    }, [videoRef]);

    // Enhanced video animation with additional effects
    const videoAnimation = useSpring({
        scale: videoScale,
        opacity: videoOpacity,
        filter: `blur(${videoBlur}px) brightness(${videoBrightness})`,
        config: { tension: 170, friction: 26 } // Smoother animation
    });

    // Enhanced history section animation with backdrop blur effect
    const historyAnimation = useSpring({
        opacity: historyProgress * (1 - historyExitProgress),
        y: historyExitProgress > 0 
            ? -100 * historyExitProgress 
            : (1 - historyProgress) * 30, // Reduced for smoother entry
        backdrop: `blur(${historyProgress * 5}px)`,
        config: { tension: 180, friction: 24 }
    });
    
    // Experience section animation
    const experienceAnimation = useSpring({
        opacity: experienceProgress,
        config: { tension: 120, friction: 14 }
    });

    // Adjusted total height for better pacing
    const totalHeight = isClient ? (13 * windowHeight) : '1300vh'; 
    // 2.5 for Hero + 3.5 for History + 7 for Experience

    return (
        <>
            {/* Custom Video Loader */}
            <VideoLoader isLoading={!videoLoaded} progress={loadingProgress} />

            <div
                ref={containerRef}
                style={{ 
                    height: totalHeight, 
                    margin: 0 
                }}
            >
                {/* Fixed container for all sections */}
                <div className="fixed inset-0 w-full h-screen overflow-hidden">
                    
                    {/* Background video with enhanced animation */}
                    <animated.div
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            zIndex: 1,
                            opacity: videoAnimation.opacity,
                            transform: videoAnimation.scale.to(s => `scale(${s})`),
                            filter: videoAnimation.filter
                        }}
                    >
                        <video
                            ref={videoRef}
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="auto"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                opacity: videoLoaded ? 1 : 0,
                                transition: 'opacity 1s ease-in-out',
                                objectPosition: 'center center',
                            }}
                        >
                            <source src="https://storage.cloud.google.com/test-bucket-trekking/PXL_20220504_052132231.mp4" type="video/mp4" />
                        </video>
                        
                        {/* Dynamic video overlay gradient that adjusts with scroll */}
                        <div
                            style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                background: `linear-gradient(0deg, 
                                    rgba(0, 0, 0, ${0.6 + historyProgress * 0.2}) 0%, 
                                    rgba(0, 0, 0, ${0.3 + historyProgress * 0.3}) 100%)`,
                                zIndex: 2,
                                transition: 'background 0.3s ease-out',
                            }}
                        />
                    </animated.div>
                    
                    {/* Hero Section - with improved transition */}
                    <div style={{ 
                        position: 'absolute', 
                        inset: 0,
                        zIndex: 5, 
                        opacity: historyProgress > 0.1 ? 0 : 1,
                        transform: `translateY(${historyProgress > 0.05 ? -30 : 0}px)`,
                        transition: 'opacity 0.3s ease-out, transform 0.4s ease-out',
                    }}>
                        <HeroSection 
                            scrollProgress={heroProgress}
                            videoAnimation={{
                                opacity: videoAnimation.opacity,
                                scale: videoAnimation.scale
                            }}
                            videoRef={videoRef}
                            videoLoaded={videoLoaded}
                            shouldHide={historyProgress > 0.1}
                            lenisInstance={lenisRef.current}
                        />
                    </div>

                    {/* History Section - with backdrop blur */}
                    <HistorySection 
                        style={{
                            opacity: historyAnimation.opacity,
                            transform: historyAnimation.y.to(y => `translateY(${y}px)`),
                            backdropFilter: historyAnimation.backdrop,
                        }}
                        isVisible={historyProgress > 0 && historyExitProgress < 1}
                        lenisInstance={lenisRef.current}
                    />
                    
                    {/* Experience Section */}
                    <ExperienceSection
                        style={{
                            opacity: experienceAnimation.opacity,
                            pointerEvents: experienceProgress > 0 ? 'auto' : 'none',
                        }}
                        isVisible={experienceProgress > 0}
                        scrollProgress={experienceProgress}
                        lenisInstance={lenisRef.current}
                        windowHeight={windowHeight}
                    />
                </div>
            </div>
        </>
    );
}