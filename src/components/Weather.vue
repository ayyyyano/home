<template>
  <div class="weather" v-if="weatherData.adCode.city && weatherData.weather.weather">
    <span>{{ weatherData.adCode.city }}&nbsp;</span>
    <span>{{ weatherData.weather.weather }}&nbsp;</span>
    <span>{{ weatherData.weather.temperature }}℃</span>
    <span class="sm-hidden">
      &nbsp;{{
        weatherData.weather.winddirection?.endsWith("风")
          ? weatherData.weather.winddirection
          : weatherData.weather.winddirection + "风"
      }}&nbsp;
    </span>
    <span class="sm-hidden">{{ weatherData.weather.windpower }}&nbsp;级</span>
  </div>
  <div class="weather" v-else>
    <span>{{ dateInfo }}</span>
  </div>
</template>

<script setup>
import { getAdcode, getWeather } from "@/api";
import { getDateInfo } from "@/utils/calendar.js";

// 高德开发者 Key
const mainKey = import.meta.env.VITE_WEATHER_KEY;

// 天气数据
const weatherData = reactive({
  adCode: {
    city: null, // 城市
    adcode: null, // 城市编码
  },
  weather: {
    weather: null, // 天气现象
    temperature: null, // 实时气温
    winddirection: null, // 风向描述
    windpower: null, // 风力级别
  },
});

// 日期信息
const dateInfo = ref('');

// 获取天气数据
const getWeatherData = async () => {
  try {
    if (!mainKey) return;
    // 获取 Adcode
    const adCode = await getAdcode(mainKey);
    console.log(adCode);
    if (adCode.infocode !== "10000") {
      throw "地区查询失败";
    }
    weatherData.adCode = {
      city: adCode.city,
      adcode: adCode.adcode,
    };
    // 获取天气信息
    const result = await getWeather(mainKey, weatherData.adCode.adcode);
    weatherData.weather = {
      weather: result.lives[0].weather,
      temperature: result.lives[0].temperature,
      winddirection: result.lives[0].winddirection,
      windpower: result.lives[0].windpower,
    };
  } catch (error) {
    console.error("天气信息获取失败:" + error);
  }
};

onMounted(() => {
  // 调用获取天气
  getWeatherData();
  dateInfo.value = getDateInfo();
});
</script>
