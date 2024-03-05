const axios = require('axios');
require('dotenv').config();

const ChatAIHandler = async (text, msg) => {
    const cmd = text.split('/');
    if (cmd.length < 2) {
        return msg.reply('Format Salah. Ketik *.ask/your question*');
    }

    msg.reply('Memproses pertanyaan Anda...');

    const question = cmd[1];
    try {
        const response = await askGPT3(question);
        if (response && response.data && response.data.choices.length > 0) {
            const messageContent = response.data.choices[0].message.content;
            return msg.reply(messageContent);
        } else {
            return msg.reply('Gagal mendapatkan respons dari ChatGPT.');
        }
    } catch (error) {
        console.error(error);
        return msg.reply('Terjadi kesalahan dalam memproses pertanyaan Anda.');
    }
}

const askGPT3 = async (question) => {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/completions',
            {
                model: "text-davinci-002", // Ganti dengan model yang Anda inginkan
                prompt: question,
                max_tokens: 150
            },
            {
                headers: {
                    "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error('Failed to get response from OpenAI API');
        }
    } catch (error) {
        throw new Error(`Failed to send request to OpenAI API: ${error.message}`);
    }
}

module.exports = {
    ChatAIHandler
}
