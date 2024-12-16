import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import "../style/Header.css"

import PreventBack from '../components/PreventBack'

export default function Header(){
    const tempHostId = sessionStorage.getItem('tempHostId');
    const roomId = sessionStorage.getItem('roomId')

    let navigate = useNavigate()

    const [sureAlert, setSureAlert] = useState(false)
    const [sure, setSure] = useState(false)

    function exitGame(e){
        e.preventDefault()
        console.log("Are you sure?")

        // Are you sure? alert
        setSureAlert(!sureAlert)
    }

    function endGame(){
        // Change status to 'finished'

        // Go to scores
        navigate(`/${roomId}/score-calculation`)

        // make all players go to scores
    }

    return(
        <>
            <PreventBack/>
            <div className = 'header'>
                <div>
                    <span className='bold-text'>Competitive</span> Wine Tasting
                </div>
                {
                    tempHostId &&
                    <button className = "exit button" onClick={(e)=>exitGame(e)}>End tasting</button>       
                }

                {
                    sureAlert &&
                    <div className = "sure-alert">
                        <p>Are you sure?</p>
                        <button className = 'button' onClick={endGame}>Yes - take us to the final scores</button>
                        <button className = 'button' onClick={()=>setSureAlert(!sureAlert)}>Oops - no not finished yet</button>
                    </div>
                }

            </div>
        </>


    )
}