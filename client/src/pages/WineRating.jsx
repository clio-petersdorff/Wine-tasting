import React , {useState , useEffect} from 'react';
import { useNavigate } from "react-router-dom";

import avatars from '../assets/avatars.json'

import '../style/WineRating.css'

import Footer from "../components/Footer"
import Header from "../components/Header"
import ScoreCard from "../components/ScoreCard"

export default function WineRating() {
  const navigate = useNavigate()

  const userId = sessionStorage.getItem('participantId');
  const roomId = sessionStorage.getItem('roomId')
  const [wineNumber, setWineNumber] = useState()

  useEffect(() => {
    async function getPerson(){ 
      const response = await fetch(`/api/participants/${userId}`)
      const data = await response.json();
      setPerson(data)

      const img = avatars.find((avatar) => avatar.id === data.avatarId)
      setImages(img.image)      
    } 

    getPerson()

    async function getWineNumber(){
      // console.log("roomId: ", roomId)
      const response = await fetch(`/api/rooms/${roomId}`)

      const data = await response.json()
      setWineNumber(data.currentWineNumber)
    }

    getWineNumber()

  },[])

  const [person, setPerson] = useState({})
  const [images, setImages] = useState(avatars);
  const [rating, setRating] = useState()
  const [notes, setNotes] = useState("")
  const [showScores, setShowScores] = useState(false)

  function handleRatingChange(e){
    setRating(e.target.value);
  }

  function handleNotesChange(e){
    setNotes(e.target.value);
  }

  async function handleSubmit(e){
    e.preventDefault()

    if (rating > 0 && rating <11){
      try {
        // Send rating and notes to the backend
        await fetch(`/api/${roomId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId, rating, notes}),
        });
        console.log("Rating submitted successfully!");
        } catch (error) {
          console.error("Error submitting rating:", error);
        
        }        
        // Update status
        try {
          await fetch(`/api/participants/${userId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({ status: 'waiting' })
          })

          console.log("Status updated successfully")

        } catch (error) {
          console.error("Error updating status:", error);
        }

        // Navigate to waiting room
        navigate(`/${roomId}/waiting-room`)

        // Clear the form after submission
        setRating(null);
        setNotes("");

    } else {
      alert("Please enter a rating between 1 and 10.");
    }
  }
    
    return (
      <div className="main-container">

        <div className="header">
          <Header/>
        </div>

        <div className = {showScores?"blur":""}>
          <div className="card-layout">
              <img className="selected-avatar" src = {images}/>
              <h3 className="name">{person.name}</h3>
          </div>

          <h2>Wine #{wineNumber}</h2>
            <form onSubmit={handleSubmit} className="wine-rating-form">
                <div className="form-group">
                    <label htmlFor="rating">Rating:</label>
                    <input
                        type="number"
                        id="rating"
                        value={rating}
                        min="1"
                        max="10"
                        onChange={handleRatingChange}
                        className="input-field"
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="notes">Tasting Notes:</label>
                    <input
                        type="text"
                        id="notes"
                        value={notes}
                        onChange={handleNotesChange}
                        className="input-field"
                    />
                </div>
                <button type="submit" className="submit-button">Finished</button>
            </form>
        </div>
        {
          showScores && 
          <ScoreCard/>
        }
        <div >
          <button className = "submit-button" onClick={()=>setShowScores(!showScores)}>{showScores ? 'Close' : 'Show Scores'}</button>
        </div>

        <div className="footer">
          <Footer/>
        </div>
        
      </div>
    );
  }