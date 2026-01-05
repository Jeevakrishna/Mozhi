import React from 'react';

export default function MinimalTest() {
  return React.createElement('div', {
    style: {
      width: '100vw',
      height: '100vh',
      background: 'red',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px'
    }
  }, 'TEST PAGE - If you see this, React is working!');
}
