export const wordList = [
    "capture", "fathoms", "lantern", "painter", 
    , "journal", "fluster", "chapter", 
    "bravest", "glances", "dolphin", "harvest", 
    "plaster", "sandier", "segment", 
    "blazing", "predict", "freight", "resolve"
]

export function getLettersRandom(word){
    let  wordString = word;
    const arr = [];
    while(wordString){
        let rand = Math.random() * (wordString.length - 1);
        arr.push(wordString[rand]);
        wordString = wordString.slice(0, rand) + wordString.slice(rand + 1);
    }
    return arr;
}