import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { MapMedical } from './components/map-medical'
import states from './components/states.geo.json';
function App() {
  return (
    <div className="App">
      <MapMedical states={states} 
      width={window.innerHeight}
      height={window.innerWidth} 
      zoom={10} 
      statesStyle={{
        fillColor: 'transparent',
        strokeColor: 'red',
        strokeWeight: 1,
        strokeOpacity: .1
      }} />
    </div>
  )
}

export default App
