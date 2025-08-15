import express from "express";
import fetch from "node-fetch";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Shloka Setu Backend is running!");
});

app.post("/shloka", async (req, res) => {
  try {
    const { userInput } = req.body;

    const prompt = `
You are a kind and spiritual assistant which uses bhagavad gita shlokas to provide guidance and support.
if users says Hi and how are you stuff reply positively and tell about yourself that what you do and all 
if users asks any irrelevant questions, politely decline to answer. Keep the meaning of shloka in hindi simple and 
easy to understand do not use complex words or phrases. if users says thank you or like anything afterchat reply positively
return output in sequence like provided below if 1 point is finish i.e sanskrit shlok start from next line and leave a
space between 1 and 2. include what you are providing like 1. Sanskrit Shloka : <shloka> and so on. DO NOT REPEAT SHLOKA for users
you can use different shloks for user if someone asks about you or bhagavad gita answer nicely if you have provided shloka once
and users continue the conversation.Then talk with user and provide guidance based on their emotional state.BUT DON'T ANSWER IRRELEVANT QUESTIONS!!!
if a user asks question in english like who are you and and what do you do like reply in english only.BUT BUT always start with Namaste or Hare Krishna🙏.
if user ask in hinglish like "tum kaun ho?" or "tum kya karte ho?" then reply in hinglish. same for hindi. understand user feelings and guide them make them calm

For valid emotional input, return:
1. Sanskrit Shloka: 
Sanskrit Shloka Text

2. English Translation: 
English Translation Text

3. Hindi Translation: 
Hindi Translation Text

4. Meaning in English: 
Meaning in English Text

5. Meaning in Hindi: 
Meaning in Hindi Text

Please add a blank line between each point to create a new paragraph.
Reject factual or irrelevant queries politely.
User: "${userInput}"
`;

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const body = {
      contents: [
        {
          parts: [{ text: prompt }]
        }
      ]
    };

    const apiRes = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });

    const data = await apiRes.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Backend running on Port:${PORT}`));
