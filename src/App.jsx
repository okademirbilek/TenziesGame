import React from "react";
import Die from "./Die";
import {nanoid} from "nanoid"
import Confetti from "react-confetti"
import {
  useWindowWidth,
  useWindowHeight
} from '@react-hook/window-size/throttled'
import Scores from "./Scores";



function App(){

  
//**************************timer*********************** */

  //state for timer
  const [timer, setTimer] = React.useState(0)
  const [isActive, setIsActive] = React.useState(false)
  const [isPaused, setIsPaused] = React.useState(false)
  const increment = React.useRef(null)


  //starting timer to 0
  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    increment.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  //pause timer 
  const handlePause = () => {
    clearInterval(increment.current)
    setIsPaused(false)
  }

  //reset timer 
  const handleReset = () => {
    clearInterval(increment.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }

  //formatting time to 00:00:00
  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    // const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)

    return `${getMinutes} : ${getSeconds}`
  }

//************************* local storage*********************** */
  //state for best score
  const [notes, setNotes] = React.useState(
    () => JSON.parse(localStorage.getItem("notes")) || []
  )
  React.useEffect(() => {
      localStorage.setItem("notes", JSON.stringify(notes))
  }, [notes])

  // const [currentScore, setCurrentScore] = React.useState(0)
  const bestScore=JSON.parse(localStorage.getItem("notes"))
  

  function choseBestScore(){
    const bestScore=JSON.parse(localStorage.getItem("notes"))
    //if u dont have any best scores
    if (bestScore.length === 0) {
        setNotes(timer)
    }else {
      if(timer > bestScore){
        alert("Sorry!! Better Luck Next Time")
      }else if(timer < bestScore) {
        alert("You have reached the best score")
        setNotes(timer)
      }else{
        alert("Wow!! You have the same score as the best one.")
      } 
    }
  }

//***************************************************************** */
  // console.log("hello")
  //count state
  const [count,setCount]=React.useState(0)
  // state:holding all dices 
  const [dices,setDices]=React.useState(allDice())

  //state holding game is alive or over 
  const [tenzies,setTenzies]=React.useState(false)
  //dices and tenzies related between them so we use useEffect 
  React.useEffect(()=>{
      //every time dices changes make count +1 
      //if all items isheld true (all green color )
      const newList=[]
      dices.map((item)=>{
        if(item.isHeld === true ){
          newList.push(item)
        }
      })
      //this part holds if all items values equal in array  
      if ( newList.length === 10){
        if(newList.every( (val, i, arr) => val.value === arr[0].value )){
          console.log("you win the game")
          //pause the timer 
          handlePause()
          setTenzies(true)
        }
      }

  },[dices])//it changes when dices state change 

  //function that generate random number with random id 
  //just for 1 item
  function generateNewDie() {
    return {
        value: Math.ceil(Math.random() * 6),
        isHeld: false,
        id: nanoid()
    }
}

  //function that generate random number with random id 
  //for all boxes 
  function allDice(){
    const diceList=[]
    for (let i = 0 ; i < 10 ; i++){
      diceList.push(generateNewDie())
    }
    return diceList 
  }
  //function  holds green box values to not change
  //when u click button 
  function holdDice(id){
     setDices(prevDices=>{
      return prevDices.map(items=>{
        return(
          items.id === id ? {...items, isHeld: !items.isHeld} : items 
          ) 
      }) 
     })
  }
  //function changes white box values 
  //when u click button 
  function rollDice(){
    //it works only when tenzies game is alive  
    if (!tenzies){
      //when the onclick works 
      //call timer start func 
      if(count===0){
        handleStart()
        console.log("zzz")
      }
      
      //set count state + 1 
      setCount(prevCount => prevCount+1)
      setDices(prevDices=>{
        return prevDices.map(items=>{
          return(
              items.isHeld  ? items : generateNewDie()
            ) 
        }) 
      })
    }else{
      //adding best scores to local storage
      console.log("calling score function")
      choseBestScore()
      //stop game
      setTenzies(false)
      //reset timer 
      handleReset()
      //restart game
      setDices(allDice())
      //set count to 0
      setCount(0)
      

    }
    
  }
  //dice component with props
  const diceElements=dices.map(items => <Die  key={items.id} value={items.value} isHeld={items.isHeld} id={items.id} handleChange={holdDice} />)
  //get window height and widht for confetti 
  const onlyWidth = useWindowWidth()
  const onlyHeight = useWindowHeight()
    return(
      <div className="main--part">
        {tenzies ? <Confetti width={onlyWidth}  height={onlyHeight} /> : ""}
        <div className="back--part">
          
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <div className="dice--container">  
            {diceElements}
          </div>


          <button 
              className="roll--button" 
              onClick={rollDice}>
              {tenzies ? "New Game" : "Roll"}
          </button>


          <div className="scores">
            <h2 className="counter">Roll Count: {count}</h2>
            <h2 className="time">Time: {formatTime()}</h2>
            <Scores notes={notes} />
          </div>


        </div>
      </div>
    )
  }
  
export default App