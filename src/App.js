import React, { useRef } from 'react';
import DotGrid from './components/DotGrid/DotGrid';

const ExampleComponent = () => (
  <div style={{ width: '100%', height: '100%', backgroundColor: 'blue', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
    Hello, World!
  </div>
);

function App() {
  const dotGridRef = useRef(null);

  const handleReveal = () => {
    if (dotGridRef.current) {
      dotGridRef.current.revealComponent(ExampleComponent, 50, 25, 100, 50);
    }
  };

  // Render ExampleComponent before the onClick event occurs
  const exampleComponent = <ExampleComponent />;

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <DotGrid ref={dotGridRef} />
      {exampleComponent}
      <button onClick={handleReveal} style={{ position: 'absolute', top: '10px', left: '10px', zIndex: 10 }}>Reveal Component</button>
    </div>
  );
}

export default App;