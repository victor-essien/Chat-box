import express  from 'express'
import  OpenAI  from 'openai'
import { config } from "dotenv";
config();



const app = express()
app.use(express.static('public')) 
app.use(express.json())
const API_KEY = process.env.API_KEY;
const openai = new OpenAI ({
    apiKey :API_KEY
})

app.post('/chat', async (req, res)=> {   
   
    const requestData = req.body.question
    try {
      const resp = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
          messages: [
            { "role": "user", content: requestData}
          ]  
      })           
          
      res.status(200).json({message: resp.choices[0].message})
    } catch(e) {
        res.status(400).json({message: e.message})
    }
  })
  
app.listen(5000, () => {
    console.log('Server is running on port 5000')
})