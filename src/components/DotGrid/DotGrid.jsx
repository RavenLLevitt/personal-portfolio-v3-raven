import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from 'react';

const DotGrid = forwardRef((props, ref) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [revealedComponent, setRevealedComponent] = useState(null);
  const containerRef = useRef(null);

  const gridWidth = 200;
  const gridHeight = 100;
  const dotSize = 2;
  const minSpacing = 1;

  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  const calculateSpacing = () => {
    const horizontalSpacing = Math.max((dimensions.width - dotSize * gridWidth) / (gridWidth - 1), minSpacing);
    const verticalSpacing = Math.max((dimensions.height - dotSize * gridHeight) / (gridHeight - 1), minSpacing);
    return Math.min(horizontalSpacing, verticalSpacing);
  };

  const spacing = calculateSpacing();

  const containerStyle = {
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    overflow: 'hidden',
    position: 'relative',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridWidth}, ${dotSize}px)`,
    gridTemplateRows: `repeat(${gridHeight}, ${dotSize}px)`,
    gap: `${spacing}px`,
    justifyContent: 'center',
    alignContent: 'center',
    height: '100%',
  };

  const dotStyle = {
    width: `${dotSize}px`,
    height: `${dotSize}px`,
    backgroundColor: 'white',
    borderRadius: '50%',
    transition: 'all 0.5s ease-in-out',
  };

  const revealComponent = (Component, gridX, gridY, gridWidth, gridHeight) => {
    const startX = gridX;
    const startY = gridY;
    const endX = startX + gridWidth - 1;
    const endY = startY + gridHeight - 1;

    // Animate dots
    const dots = containerRef.current.querySelectorAll('[data-x][data-y]');
    dots.forEach(dot => {
      const x = parseInt(dot.getAttribute('data-x'));
      const y = parseInt(dot.getAttribute('data-y'));
      
      if (x >= startX && x <= endX && y >= startY && y <= endY) {
        dot.style.transform = 'scale(5)';
        dot.style.opacity = '0';
      } else {
        dot.style.transform = 'scale(1)';
        dot.style.opacity = '1';
      }
    });

    // Reveal component after animation
    setTimeout(() => {
      setRevealedComponent(
        <div style={{
          position: 'absolute',
          left: `${startX * (dotSize + spacing)}px`,
          top: `${startY * (dotSize + spacing)}px`,
          width: `${gridWidth * (dotSize + spacing) - spacing}px`,
          height: `${gridHeight * (dotSize + spacing) - spacing}px`,
          opacity: 0,
          transition: 'opacity 0.5s ease-in-out',
        }}>
          <Component />
        </div>
      );
      
      // Fade in the component
      setTimeout(() => {
        const componentElement = containerRef.current.querySelector('div:last-child');
        if (componentElement) {
          componentElement.style.opacity = '1';
        }
      }, 50);
    }, 500);
  };

  useImperativeHandle(ref, () => ({
    revealComponent
  }));

  const renderDots = () => {
    const dots = [];
    for (let y = 0; y < gridHeight; y++) {
      for (let x = 0; x < gridWidth; x++) {
        dots.push(
          <div
            key={`${x}-${y}`}
            style={dotStyle}
            data-x={x}
            data-y={y}
          />
        );
      }
    }
    return dots;
  };

  return (
    <div ref={containerRef} style={containerStyle}>
      <div style={gridStyle}>
        {renderDots()}
      </div>
      {revealedComponent}
    </div>
  );
});

export default DotGrid;