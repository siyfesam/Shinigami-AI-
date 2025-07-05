const axios = require("axios");

async function generateReply(input) {
  try {
    const res = await axios.post("https://api.nova-oss.com/v1/chat/completions", {
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: input }]
    });

    return res.data.choices[0].message.content;
  } catch (err) {
    console.error("AI Error:", err.message);
    return "❌ حصلت مشكلة وأنا بحاول أرد.";
  }
}

module.exports = { generateReply };