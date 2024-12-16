import {useEffect, useState} from 'react'
import '../style/ScoreCard.css'

export default function ScoreCard(){

    const userId = sessionStorage.getItem('participantId')
    const roomId = sessionStorage.getItem('roomId')

    const [scores, setScores] = useState([])

    useEffect(()=> {
        async function getScores(){
            console.log('getting scores')

            const response = await fetch(`/api/ratings/${userId}`)
            console.log(response.ok)

            const data = await response.json()
            console.log(data)

            setScores(data)
        }
        
        getScores()

    }, [])

    return (
        <div className = "modal">
            <table>
                <tr>
                    <th>Wine Number</th>
                    <th>Score</th>
                    <th>Notes</th>
                </tr>
                {
                    scores.map((s)=>(
                        <tr key={s.id}>
                            <td>{s.wineNumber}</td>
                            <td>{s.rating}</td>
                            <td>{s.notes}</td>
                        </tr>
                    ))
                }

            </table>
        
        </div>
    )
}