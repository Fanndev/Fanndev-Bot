// const { MessageMedia } = require('whatsapp-web.js');

// const createStickerHandler = async (msg) => {
//     try {
//         msg.reply('Mengubah gambar menjadi stiker...');

//         const media = await msg.downloadMedia();
        
//         if (!media || !media.mimetype.includes('image')) {
//             return msg.reply('Mohon kirimkan gambar.');
//         }

//         const sticker = await createStickerFromMedia(media);
        
//         if (sticker) {
//             msg.reply(sticker);
//         } else {
//             msg.reply('Gagal membuat stiker dari gambar.');
//         }
//     } catch (error) {
//         console.error('Error creating sticker:', error);
//         msg.reply('Terjadi kesalahan dalam membuat stiker dari gambar.');
//     }
// };

// const createStickerFromMedia = async (media) => {
//     try {
//         const mediaData = await media.download();
//         const sticker = new MessageMedia(media.mimetype, mediaData, 'sticker.' + media.mimetype.split('/')[1]);
//         return sticker;
//     } catch (error) {
//         console.error('Error creating sticker from media:', error);
//         return null;
//     }
// };

// module.exports = {
//     createStickerHandler
// };
