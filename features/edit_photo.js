const axios = require('axios');
require('dotenv').config();

const EditPhotoHandler = async (text, msg) => {
    const cmd = text.split('/');
    if (cmd.length < 2) {
        return msg.reply('Salah bg. ketik *.edit_bg/warna*');
    }

    if (msg.hasMedia) {
        if (msg.type != 'image') {
            return msg.reply('format image aja bg gabisa format lain !!.');
        }

        msg.reply('proses bg sabar!! mager edit photo ya bg🗿🙏!.');

        const media = await msg.downloadMedia();

        if (media) {
            const color = cmd[1];
            const newPhoto = await EditPhotoRequest(media.data, color)

            if (!newPhoto.success) {
                return msg.reply('Terjadi kesalahan.');
            }

            const chat = await msg.getChat();
            media.data = newPhoto.base64;
            chat.sendMessage(media, { caption: '✅ Suksess yagesyak!' })
        }
    }
}

const EditPhotoRequest = async (base64, bg_color) => {

    const result = {
        success: false,
        base64: null,
        message: "",
    }

    return await axios({
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
    })
        .then((response) => {
            if (response.status == 200) {
                result.success = true;
                result.base64 = response.data.data.result_b64
            } else {
                result.message = "Failed response";
            }

            return result;
        })
        .catch((error) => {
            result.message = "Error : " + error.message;
            return result;
        });
}


module.exports = {
    EditPhotoHandler
}