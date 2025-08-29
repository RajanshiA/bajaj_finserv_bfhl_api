import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

// ---------- Personal details (Rajanshi Awasthi) ----------
const FULL_NAME = "rajanshi_awasthi"; // lowercase + underscores
const DOB_DDMMYYYY = "15122002";
const EMAIL = "rajanshiawasthi@gmail.com";
const ROLL = "22BCE7579";

// ---------- Utility Functions ----------
const isDigitsOnly = (s) => /^[0-9]+$/.test(s);
const isLettersOnly = (s) => /^[A-Za-z]+$/.test(s);

// alternating caps after reversing characters
const toAlternatingCaps = (s) => {
  let result = "";
  let upper = true;
  for (const ch of s) {
    if (/[A-Za-z]/.test(ch)) {
      result += upper ? ch.toUpperCase() : ch.toLowerCase();
      upper = !upper;
    } else {
      result += ch;
    }
  }
  return result;
};

// ---------- POST /bfhl ----------
app.post("/bfhl", (req, res) => {
  try {
    const arr = Array.isArray(req.body.data) ? req.body.data : null;

    if (!arr) {
      return res.status(200).json({
        is_success: false,
        user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
        email: EMAIL,
        roll_number: ROLL,
        odd_numbers: [],
        even_numbers: [],
        alphabets: [],
        special_characters: [],
        sum: "0",
        concat_string: ""
      });
    }

    const even_numbers = [];
    const odd_numbers = [];
    const alphabets = [];
    const special_characters = [];

    let sumNumbers = 0;
    let flatLetters = "";

    for (const raw of arr) {
      const s = String(raw);

      if (isDigitsOnly(s)) {
        const val = Number(s);
        if (!Number.isNaN(val)) {
          if (val % 2 === 0) {
            even_numbers.push(s);
          } else {
            odd_numbers.push(s);
          }
          sumNumbers += val;
        }
      } else if (isLettersOnly(s)) {
        alphabets.push(s.toUpperCase());
        flatLetters += s;
      } else {
        special_characters.push(s);
      }
    }

    const reversedLetters = flatLetters.split("").reverse().join("");
    const concat_string = toAlternatingCaps(reversedLetters);

    return res.status(200).json({
      is_success: true,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers,
      even_numbers,
      alphabets,
      special_characters,
      sum: String(sumNumbers),
      concat_string
    });
  } catch (err) {
    return res.status(200).json({
      is_success: false,
      user_id: `${FULL_NAME}_${DOB_DDMMYYYY}`,
      email: EMAIL,
      roll_number: ROLL,
      odd_numbers: [],
      even_numbers: [],
      alphabets: [],
      special_characters: [],
      sum: "0",
      concat_string: "",
      error: "Unexpected error"
    });
  }
});

// ---------- Health check ----------
app.get("/", (_req, res) => {
  res.status(200).json({
    status: "Running",
    route: "/bfhl",
    method: "POST",
    example: { data: ["a", "1", "334", "4", "R", "$"] }
  });
});

// ---------- Start server (for local testing) ----------
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`BFHL API running on port ${PORT}`);
});
