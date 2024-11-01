"use client"

import { useState } from 'react';
import {wordList} from '../utils'
import Modal  from '../components/Modal'


export default function WordCard() {

    const [currentWord, setCurrentWord] = useState([]);
    const [currentWordHot, setCurrentWordHot] = useState([]); 
    const [inputValue, setInputValue] = useState('');
    const [score, setScore] = useState(0);
    const [usedWords, setUsedWords] = useState<string[]>([]);
    const [hotLetterUsed, setHotLetterUsed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);
    const [wordDetails, setWordDetails] = useState(null);

    function getLettersRandom(word:string){
        let  wordString = word;
        const arr = [];
        while(wordString){
            const rand:number = Math.floor(Math.random() * (wordString.length ));
            arr.push(wordString[rand]);
            wordString = wordString.slice(0, rand) + wordString.slice(rand + 1);
        }
        return arr;
    }

    function getRandomString(array: string[]) {
        const randomIndex = Math.floor(Math.random() * array.length);
        const randomWord = array[randomIndex];
        console.log(randomWord);
        const wordRandomized = getLettersRandom(randomWord);
        const hotLetter = wordRandomized.shift();
        const regLetters = wordRandomized;
        setCurrentWord(regLetters);
        setCurrentWordHot(hotLetter);
        console.log("currentWord", currentWord)
        console.log("currentWordHot", currentWordHot)
        
    }

    const handleClick = (letter) => {
        setInputValue((prevValue) => prevValue + letter);
        
    };

    const handleRandomClick = (wordArr) => {
        const notRandomArr = wordArr;
        const notRandomString = notRandomArr.join('');
        const randomString = getLettersRandom(notRandomString)
        setCurrentWord(randomString);
    }

    const deleteClick = () => {
        const currentInputDelete = inputValue.slice(0,-1);
        setInputValue(currentInputDelete);
        
    }

    async function submit(value:string) {
        if(!value || isLoading){return}
        const preUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        const word = value;
        const url = preUrl + word;
       
        
        console.log(usedWords);
        try {
            setIsLoading(true);
            const response = await fetch(url);
            const result = await response.json();
            
            console.log("result",result);
            if(result.title === "No Definitions Found"){
                console.log("Not a word");
                setHotLetterUsed(false);
                setInputValue('');
            }else{
                if(usedWords.includes(value)){
                    console.log("word in used words");
                    setInputValue('');
                } else if(!usedWords.includes(value) && hotLetterUsed) {
                    const addStringToArray = (newString: string) => {
                        setUsedWords((prevArray) => [...prevArray, newString]);
                    };
                   
                    addStringToArray(value);
                    const wordLength = value.length;
                    setScore(score + wordLength);
                    setInputValue('');
                    setHotLetterUsed(false);
                }else{
                    setInputValue('');
                    setHotLetterUsed(false);
                }
            }
        } catch (error) {
            console.error("error", error);
        } finally {
            setIsLoading(false);
        }
        
    };

    async function fetchWordDetails(word:string){
        if(!word || isLoadingDetails) {return}
        const preUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en/';
        const wordForUrl = word;
        const url = preUrl + wordForUrl;

        try{
            setIsLoadingDetails(true);

            const response = await fetch(url);
            const result = await response.json();
            setWordDetails(result);
            console.log("detail result",result);
        }catch (err){
            console.log("error", err)
        }finally{
            setIsLoadingDetails(false);
        }
    }
    return(
        <div>
            {wordDetails && (
                <Modal handleCloseModal={() => { setWordDetails(null) }}>
                <div className='modal'>
                    <h1>{wordDetails[0]?.word}</h1>
                    {wordDetails?.map((wordsData) => {
                        return wordsData?.meanings.map((wordsMeanings) => {
                            return wordsMeanings?.definitions.map((wordsDef, wordsDefIndex) => {
                                   return <p key={wordsDefIndex}>{wordsDef.definition}</p>
                            })
                        })
                            
                        
                    })}
                    
                </div>
            </Modal>
            )}
            
            <button 
            className='start-btn'
            onClick={() => 
                {getRandomString(wordList) 
                setUsedWords([])
                setScore(0)
                setInputValue('')
                setHotLetterUsed(false)
            }
                }>
                New Word
            </button>
           
            <div className='lettersCont'>
            {
                currentWord[0] ?

            <button className='hot-letter-button letter' 
            onClick={() => {
                handleClick(currentWordHot[0]) 
                setHotLetterUsed(true)}}>
            {currentWordHot[0]}
            </button>
            : <></>
            }
                {currentWord.map((item, index) => {
                    return(
                    <button className="letter-button letter" key={index} onClick={() => handleClick(item)}>
                        {item}
                    </button>
                    )
                })}
            </div>
            <div className='input-cont'>
                <h1>{inputValue}</h1>
            </div>
            <div className='controls-cont'>
                <button onClick={() => deleteClick()}>Delete</button>
                <button onClick={() => submit(inputValue)}>Submit</button>
                <button onClick={() => handleRandomClick(currentWord)}>Randomize</button>
            </div>
            <div className='score-cont'>
                <h1>Score: {score}</h1>
            </div>
            <div className='used-words-cont'>
                {usedWords.map((wordItem, wordIndex) => {
                    return(

                        <button className='used-word-btn' onClick={() => {fetchWordDetails(wordItem)}} key={wordIndex}>{wordItem}</button>
                    )
                })}
            </div>
        </div>
    )
}