const btn = document.getElementById("btn")

btn.addEventListener('click', getResponse)

async function getResponse(){
 let inputText = document.getElementById('input').value
 const parentDiv = document.getElementById('chat-area')

 
    const question = document.createElement('div')
    question.innerHTML = inputText
    question.classList.add('box')
    parentDiv.appendChild(question)
    document.getElementById('input').value =""
    try{
    let res = await fetch('http://localhost:5000/chat', 
  {
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'                
    },
    body: JSON.stringify({
      question: inputText          
    })
  }
)

const data = await res.json() 

if(data.message) {
    const answer = document.createElement('div')
    answer.innerHTML = data.message.content
    answer.classList.add("box", "answer")
    parentDiv.appendChild(answer)
  }
}catch(error){
    console.log("Error:", error)
}
  if(inputText === ''){
    
 }
 }

 
