const qrcode = require('qrcode-terminal');
const { EditPhotoHandler } = require('./features/edit_photo');
const { ChatAIHandler } = require('./features/chat_ai');
const { WheaterLocalHandler } = require('./features/wheater_local');
// const { createStickerHandler } = require('./features/meme_stiker');
const { RemoveBackgroundHandler } = require('./features/remove_bg');
require('dotenv').config();
// const OpenAI = require('openai');
const { Client, LocalAuth, MessageMedia  } = require('whatsapp-web.js');


const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    aboutClient(client);
    console.log('\x1b[32m%s\x1b[0m', `🅕 🅐 🅝 🅝 🅓 🅔 🅥 - 🅑 🅞 🅣 `);
    console.log('AKTIF✅!');
    console.log("Type .menu to see menu");
});

// const openai = new OpenAI({ apiKey: `${process.env.API_KEY_OPENAI}` });

// async function main() {
//   const completion = await openai.chat.completions.create({
//     messages: [{ role: "system", content: "You are a helpful assistant." }],
//     model: "gpt-3.5-turbo",
//   });

//   console.log(completion.choices[0]);
// }

client.on('message', async msg => {
    const chat = await msg.getChat();
    const contact = await msg.getContact();
console.log(`💬 ${contact.pushname} : ${msg.body}\n`);
    try {
    switch (msg.body.toLowerCase()) {
      case '.stiker':
      case '.sticker':
      case 'st':
        if(msg.hasMedia){
          const media = await msg.downloadMedia();
          chat.sendMessage(media,
            {
              sendMediaAsSticker: true,
              stickerName: 'Fanndev.stiker',
              stickerAuthor: 'Fanndev'
            }
          );
          console.log(`💬 ${contact.pushname} : Sticker sent!\n`);
        } else {
          msg.reply('Send image with caption .sticker');
        };
        break;
      case '!error':
        // console.log(new Error());
        new Error();
        break;
    }
  } catch (error) {
    console.error(error);
  };

    const mentions = await msg.getMentions();
    
    for (let user of mentions) {
        msg.reply(`${user.pushname || 'Unknown'} Halo saya BOT FANNDEV Siap membantu anda, ketik .menu untuk membuka menu`);
    }

    const text = msg.body ? msg.body.toLowerCase() : '';

    //Kalo orang sedang menguji bot
    if (text === 'p' || text === '.' || text === 'tes' || text === 'bot') {
        await client.sendMessage(msg.from, '*Bot Aktif* ketik *.menu* untuk melihat fitur');
    }

    //menu Bot
    if (text === '.menu') {
        // Membuat teks menu dalam satu pesan dengan menggunakan karakter baris baru (\n) sebagai pemisah
        const menuText = `
*🤖 FANNDEV BOT MENU 🤖*

*1.* *Edit background image :*
Ketik *.edit_bg/blue* untuk mengubah latar belakang menjadi biru warna bisa bebas
Contoh: *.edit_bg/blue*

*2.* *Tanya ChatGPT :*
Ketik *.ask/* diikuti pertanyaan yang ingin Anda tanyakan
Contoh: *.ask/Apa yang dimaksud dengan kecerdasan buatan?*

*3.* *Cek cuaca :*
Ketik *.cekcuaca/* diikuti dengan nama kota atau lokasi yang ingin Anda cek cuacanya
Contoh: *.cekcuaca/Jakarta*

*4.* *Create Stiker :*
Ketik *.stiker* membuat stiker format img


*5.* *Remove background image :*
Ketik *.removebg/* untuk mengubah latar belakang menjadi biru
Contoh: *.removebg/*

🌈 Nikmati pengalaman menggunakan FANNDEV BOT! 🌈
        `;

    // Mengirim pesan yang berisi GIF setelah pesan teks menu
    await client.sendMessage(msg.from, menuText);
    }

     if (text === '.everyone') {
        const chat = await msg.getChat();
        
        let text = '';
        let mentions = [];

        for (let participant of chat.participants) {
            mentions.push(`${participant.id.user}@c.us`);
            text += `@${participant.id.user} `;
        }

        await chat.sendMessage(text, { mentions });
    }

    // .edit_bg/bg_color
    if (text.includes(".edit_bg/")) {
        await EditPhotoHandler(text, msg);
    }
    // .ask/question?
    if (text.includes(".ask")) {
        await ChatAIHandler(text, msg);
    }
    // cekcuaca
    if (text.includes(".cekcuaca")) {
    await WheaterLocalHandler(text, msg);
    }
    // Remove BG
    if (text.includes(".removebg/")) {
    await RemoveBackgroundHandler(text, msg);
    }

});

function aboutClient(client){
  console.log((
    '\nAbout Client :' +
    '\n  - Username : ' + client.info.pushname +
    '\n  - Phone    : ' + client.info.wid.user
  ));
};

// main()
client.initialize();