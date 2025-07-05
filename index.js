const { Client } = require("discord.js-selfbot-v13");
const fs = require("fs-extra");
const path = require("path");
const ai = require("./ai");
const config = require("./config.json");
const statsPath = path.join(__dirname, "stats.json");

const client = new Client();
let stats = { messages_sent: 0, users_interacted: [] };

if (fs.existsSync(statsPath)) {
  stats = fs.readJsonSync(statsPath);
}

client.on("ready", () => {
  console.log(`✅ Shinigami AI شغال من خلال: ${client.user.username}`);
  client.user.setPresence({ activities: [{ name: "ذكاء الظلال", type: "LISTENING" }] });
});

client.on("messageCreate", async (message) => {
  if (message.author.id === client.user.id) return;

  // أوامر البوت تبدأ بـ $
  const prefix = "$";
  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift()?.toLowerCase();

  if (!message.content.startsWith(prefix)) return;

  // أمر تغيير التوكن
  if (command === "settoken" && message.author.id === config.owner_id) {
    const newToken = args[0];
    if (!newToken) return message.reply("❌ لازم تحط التوكن");

    config.token = newToken;
    fs.writeJsonSync("./config.json", config, { spaces: 2 });
    message.reply("✅ تم تحديث التوكن. أعد تشغيل البوت.");
    return process.exit();
  }

  // أمر إحصائيات البوت
  if (command === "states") {
    return message.reply(`📊 إحصائيات Shinigami:\n\n- 📨 عدد الرسائل المرسلة: ${stats.messages_sent}\n- 👤 عدد المستخدمين: ${stats.users_interacted.length}`);
  }

  // سؤال عن المالك
  const triggers = ["مين المالك", "المالك", "صانعك", "مبرمجك", "مين صنعك"];
  if (triggers.some(q => message.content.toLowerCase().includes(q))) {
    return message.reply(`👤 المالك الحقيقي لـ Shinigami هو:\n\n**Shinigami** – تقدر تتواصل معاه على ديسكورد:  \n<@${config.owner_id}>\n\n🔮 هو من أطلق ذكائي الصناعي في عوالم الظلال!`);
  }

  // الردود الذكية في الخاص فقط
  if (message.channel.type === "DM") {
    const reply = await ai.generateReply(message.content);
    if (reply) {
      message.reply(reply);

      stats.messages_sent++;
      if (!stats.users_interacted.includes(message.author.id)) {
        stats.users_interacted.push(message.author.id);
      }
      fs.writeJsonSync(statsPath, stats, { spaces: 2 });
    }
  }
});

client.login(config.token);