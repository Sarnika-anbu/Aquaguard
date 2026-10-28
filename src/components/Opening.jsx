import React,{useState, useEffect} from 'react';
import { Droplet} from 'lucid-react';
import '../styles/intro.css';

export default function Opening({OnComplete}) {
    const [fading , setFading] = useState(false);
    useEffect(()=>{
        const timer = setTimeout(()=>{
            setFading(true);
        },2000);

        const timer2 = setTimeout(()=>{
            if(OnComplete) OnComplete()
        },2800);
    return()=>{
        clearTimeout(timer);
        clearTimeout(timer2);
    };
    },[OnComplete]);
    return(
    <div className={`intro-overlay ${fading ? 'fade-out' : ''}`}>
    <div className="water-drop-icon animate-drop">
    <Droplet size={64} />
    </div>
    <h1 className="intro-title">AquaGuard</h1>
    <p className="intro-subtitle">Smart RO Water Monitoring System</p>
    <button className="btn-primary" onClick={() => setFading(true)}>
    Enter System →
  </button>
    </div>
    );
}