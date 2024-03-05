const axios = require('axios');
require('dotenv').config();

const RemoveBackgroundHandler = async (text, msg) => {
    const cmd = text.split('/');
    if (cmd.length < 2) {
        return msg.reply('Format salah. Ketik *.removebg*');
    }

    if (msg.hasMedia) {
        if (msg.type != 'image') {
            return msg.reply('Hanya format gambar yang didukung untuk menghapus latar belakang.');
        }

        msg.reply('Sedang menghapus latar belakang gambar...');

        const media = await msg.downloadMedia();

        if (media) {
            const color = cmd[1];
            const editedPhoto = await removeBackground(media.data, color);

            if (!editedPhoto.success) {
                return msg.reply('Terjadi kesalahan dalam menghapus latar belakang.');
            }

            const chat = await msg.getChat();
            media.data = editedPhoto.base64;
            chat.sendMessage(media, { caption: '✅ Suksess yagesyak!' });
        }
    }
}

const removeBackground = async (base64, bg_color) => {
    const result = {
        success: false,
        base64: null,
        message: "",
    }

    try {
        const response = await axios({
            method: 'post',
            url: process.env.URL_API_REMOVE_BG,
            data: {
                image_file_b64: base64,
                bg_color: bg_color
            },
            headers: {
                "accept": "application/json",
                "Content-Type": "application/json",
                "X-Api-Key": process.env.API_KEY_REMOVEBG,
            },
        });

        if (response.status === 200) {
            result.success = true;
            result.base64 = response.data.data.result_b64;
        } else {
            result.message = "Failed response";
        }
    } catch (error) {
        result.message = "Error: " + error.message;
    }

    return result;
}

module.exports = {
    RemoveBackgroundHandler
}
