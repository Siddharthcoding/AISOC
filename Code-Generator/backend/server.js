const express = require("express");
const Groq = require("groq-sdk");
const bodyParser = require("body-parser");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const app = express();

// Enhanced CORS configuration
app.use(cors({
  origin: 'http://localhost:5173', // Update with your frontend origin
  credentials: true
}));

app.use(bodyParser.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

const PORT = process.env.PORT || 5000;
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// Enhanced UwU Language Specification from README.md
const languageSpecification = `
# PythOwO Language Specification

// Core Syntax:
- Variables: 'pwease <name> = <value>'
- Conditionals: IF《condition》THWEN《expression》EWIF《condition》THWEN《expression》EWSE《expression》
- Loops: WHILE《condition》STWEP《expression》
- Functions: FWUNCTION《name》(<params>) THWEN《expression》END
- Printing: pwrint(<expression>)
- Comments: # Single-line comments

// Data Types:
- Numbers: Integers and floats (501, 3.1415)
- Strings: "Hello uwu" ow 'nyaa~'
- Booleans: twue/fawse

// Error Handling:
- "OwO, what's this? <error_type>? Oh nyo!"
- Automatic error highlighting with caret positions

// Example Structure:
pwease tehe = 501
IF tehe == 502 THWEN
    pwease chan = "tehe is 502!"
EWIF tehe == 501 THWEN
    pwease chan = "tehe is 501!"
EWSE
    pwease chan = "tehe is 500!"
pwrint(chan)
`;

// Rate-limited code generation endpoint
app.post("/generate", async (req, res) => {
  try {
    // Rate limiting for anonymous users
    if (!req.session.authenticated) {
      req.session.guestUses = (req.session.guestUses || 0) + 1;
      if (req.session.guestUses > 2) {
        return res.status(401).json({
          error: "Login required for further usage",
          code: "AUTH_REQUIRED"
        });
      }
    }

    const { userPrompt } = req.body;
    
    // Enhanced prompt with pythOwO examples
    const enhancedPrompt = `${languageSpecification}

Generate PythOwO code for: ${userPrompt.trim()}
Follow these rules:
1. Use exact keywords: pwease, IF/THWEN/EWIF/EWSE, WHILE/STWEP
2. Maintain 2-space indentation
3. Include cute error handling where needed
4. Wrap code between markers:

=== Begin UwU Code ===
<your code here>
=== End UwU Code ===`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: enhancedPrompt }],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 512,
      top_p: 0.95,
      stop: ["=== End UwU Code ==="]
    });

    // Extract code between markers
    const fullText = chatCompletion.choices[0]?.message?.content || "";
    const codeBlock = fullText.match(/=== Begin UwU Code ===([\s\S]*?)=== End UwU Code ===/)?.[1]?.trim() || fullText;

    res.json({
      uwuCode: codeBlock,
      remaining: req.session.authenticated ? 'unlimited' : 2 - req.session.guestUses
    });
    
  } catch (error) {
    console.error("Code generation error:", error);
    res.status(500).json({ 
      error: "Failed to generate UwU code",
      details: error.message 
    });
  }
});

// Auth endpoints
app.post('/login', (req, res) => {
  // Add actual authentication logic here
  req.session.authenticated = true;
  req.session.guestUses = 0; // Reset counter on login
  res.json({ success: true });
});

app.post('/logout', (req, res) => {
  req.session.destroy();
  res.json({ success: true });
});

app.get('/check-auth', (req, res) => {
  res.json({
    authenticated: !!req.session.authenticated,
    remaining: req.session.authenticated ? 'unlimited' : 2 - (req.session.guestUses || 0)
  });
});

app.listen(PORT, () => {
  console.log(`🐾 UwU Server running on http://localhost:${PORT}`);
});
