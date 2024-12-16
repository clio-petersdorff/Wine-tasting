import React, { useState } from 'react'
import ReactDOM from "react-dom";
import QRCode from "react-qr-code";
import { useNavigate } from "react-router-dom";

import '../style/NewTasting.css'


export default function NewTasting() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1)

    async function createNewRoom(){ 
      console.log('click')
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      
      if (!response.ok) {
        throw new Error('Failed to create room');
      }
  
      const data = await response.json();
      console.log(data);
  
      // Store the tempHostId and roomId for later use
      sessionStorage.setItem('tempHostId', data.tempHostId);
      sessionStorage.setItem('roomId', data.roomId);
  
      // Move to the next step
      setStep(2);
    }

    const roomId = sessionStorage.getItem('roomId');
    const roomLink = roomId ? `${window.location.origin}/${roomId}/choose-avatar` : '';

    return (
  
      <div className = "main-container">
        
        {
          step == 1 &&
          <>
            <h2>
              Create new tasting room
            </h2>
          
            <div>  
                <button onClick={()=>createNewRoom()}>New Tasting</button>  
                {/* <button onClick={()=>navigate('/wine-rating')}>New Tasting</button>   */}
            </div>
          </>
        }
        {
          step == 2 &&
          <>
            <h2>Share this link with your friends:</h2>
            {/* https://www.npmjs.com/package/react-qr-code */}
            <div className='qr-code'>
              <QRCode value={roomLink} />
            </div>

            <div style={{ width: '100%', padding: '10px' }}>
                <a href = {roomLink} target='_blank'>{roomLink}</a>
                <button className = "copy-button" onClick={() => {navigator.clipboard.writeText(roomLink)}}>copy</button>               
            </div>


            <button onClick={() => navigate(`${roomId}/choose-avatar`)}>Go to Tasting</button>

          </>
        }
      </div>
  
    );
  }