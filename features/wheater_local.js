const axios = require('axios');
require('dotenv').config();

const WheaterLocalHandler = async (text, msg) => {
    const cmd = text.split('/');
    if (cmd.length < 2) {
        return msg.reply('Format pengecekan cuaca salah. Silakan gunakan format: *.cekcuaca/nama_kota*');
    }

    const cityName = cmd[1].trim(); // Ambil nama kota dari perintah

    msg.reply(`Sedang memproses pengecekan cuaca untuk kota ${cityName}. Harap tunggu sebentar... 🌦️`);

    try {
        const result = await WheaterLocalRequest(cityName); // Panggil fungsi untuk mendapatkan data cuaca berdasarkan nama kota
        if (result.success) {
            const weatherData = result.data;
            const weatherDescription = translateWeatherDescription(weatherData.weather[0].description);
            const temperature = weatherData.main.temp;
            const humidity = weatherData.main.humidity;
            const windSpeed = weatherData.wind.speed;

            const replyMessage = `Cuaca saat ini di ${cityName}:\n${weatherDescription}\nTemperatur: ${temperature}°C\nKelembaban: ${humidity}%\nKecepatan Angin: ${windSpeed} m/s`;

            return msg.reply(replyMessage);
        } else {
            console.error('Gagal mendapatkan data cuaca:', result.message);
            msg.reply('Gagal mendapatkan data cuaca. Silakan coba lagi nanti.');
        }
    } catch (error) {
        console.error('Error:', error.message);
        msg.reply('Terjadi kesalahan saat memproses data cuaca. Silakan coba lagi nanti.');
    }
}

// Fungsi untuk mendapatkan data cuaca berdasarkan nama kota
const WheaterLocalRequest = async (cityName) => {
    const result = {
        success: false,
        data: null,
        message: "",
    }

    try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${process.env.API_KEY_WHEATER}`);
        console.log(response);
        if (response.status === 200) {
            result.success = true;
            result.data = response.data;
        } else {
            result.message = "Failed response";
        }
    } catch (error) {
        result.message = "Error : " + error.message;
    }

    return result;
}

// Fungsi untuk menerjemahkan deskripsi cuaca ke Bahasa Indonesia
function translateWeatherDescription(description) {
    switch (description.toLowerCase()) {
        case "overcast clouds":
            return "Awan mendung";
        case "clear":
            return "Cerah";
        case "cloudy":
            return "Berawan";
        case "light rain":
            return "Hujan ringan";
        case "moderate rain":
            return "Hujan sedang";
        case "heavy rain":
            return "Hujan lebat";
        case "snow":
            return "Salju";
        case "freezing rain":
            return "Hujan dingin";
        case "sleet":
            return "Hujan es";
        case "snow showers":
            return "Hujan salju";
        case "fog":
            return "Kabut";
        case "partly cloudy":
            return "Berawan sebagian";
        case "storm":
            return "Badai";
        case "strong winds":
            return "Angin kencang";
        case "drizzle":
            return "Gerimis";
        case "thunderstorm":
            return "Hujan badai";
        case "hot":
            return "Panas";
        case "broken clouds":
            return "Awan pecah";
        default:
            return description;
    }
}

module.exports = {
    WheaterLocalHandler,
    WheaterLocalRequest
}
