// 二十四节气 (近似日期)
const SOLAR_TERMS = [
  { name: '小寒', m: 1, d: 5 }, { name: '大寒', m: 1, d: 20 },
  { name: '立春', m: 2, d: 4 }, { name: '雨水', m: 2, d: 19 },
  { name: '惊蛰', m: 3, d: 6 }, { name: '春分', m: 3, d: 21 },
  { name: '清明', m: 4, d: 5 }, { name: '谷雨', m: 4, d: 20 },
  { name: '立夏', m: 5, d: 6 }, { name: '小满', m: 5, d: 21 },
  { name: '芒种', m: 6, d: 6 }, { name: '夏至', m: 6, d: 21 },
  { name: '小暑', m: 7, d: 7 }, { name: '大暑', m: 7, d: 23 },
  { name: '立秋', m: 8, d: 7 }, { name: '处暑', m: 8, d: 23 },
  { name: '白露', m: 9, d: 8 }, { name: '秋分', m: 9, d: 23 },
  { name: '寒露', m: 10, d: 8 }, { name: '霜降', m: 10, d: 23 },
  { name: '立冬', m: 11, d: 7 }, { name: '小雪', m: 11, d: 22 },
  { name: '大雪', m: 12, d: 7 }, { name: '冬至', m: 12, d: 22 },
];

const TIAN_GAN = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
const DI_ZHI = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
const SHENG_XIAO = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
const LUNAR_DAYS = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十'];

// 农历年数据: [春节月, 春节日, 闰月(0=无), 闰月天数, 12个平月天数(从正月到腊月, 1=30天 0=29天)]
const LUNAR_YEAR_DATA = {
  2024: [2, 10, 0, 0, [1,0,1,0,1,1,0,1,0,1,0,1]],
  2025: [1, 29, 6, 1, [1,0,1,0,1,0,1,1,0,1,0,0]],
  2026: [2, 17, 6, 0, [1,0,0,1,0,0,0,0,1,0,1,1]],
  2027: [2, 6,  0, 0, [1,0,1,0,1,0,1,1,0,1,0,1]],
  2028: [1, 26, 5, 1, [1,0,1,0,1,0,0,1,0,1,0,1]],
  2029: [2, 13, 0, 0, [1,0,1,1,0,1,0,1,0,1,0,0]],
  2030: [2, 3,  0, 0, [1,0,1,0,1,0,1,0,1,0,1,0]],
};

function getSolarTerm(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  for (const t of SOLAR_TERMS) {
    if (t.m === month && t.d === day) return t.name;
  }
  return null;
}

function getLunarInfo(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const yd = LUNAR_YEAR_DATA[year];
  if (!yd) return { month: '?', day: '?' };

  const [cnyM, cnyD, leapMonth, leapIsBig, monthFlags] = yd;

  const cnyDate = new Date(year, cnyM - 1, cnyD);
  const targetDate = new Date(year, month - 1, day);
  let offset = Math.round((targetDate - cnyDate) / 86400000);

  if (offset < 0) return { month: '腊', day: LUNAR_DAYS[29 + offset] || '?', isLeap: false };

  for (let m = 0; m < 12; m++) {
    const days = monthFlags[m] ? 30 : 29;
    if (offset < days) {
      const ganZhi = `${TIAN_GAN[(year - 4) % 10]}${DI_ZHI[(year - 4) % 12]}`;
      return {
        month: LUNAR_MONTHS[m],
        day: LUNAR_DAYS[offset],
        ganZhi,
        shengXiao: SHENG_XIAO[(year - 4) % 12],
        isLeap: false,
      };
    }
    offset -= days;
    if (leapMonth > 0 && m + 1 === leapMonth) {
      const leapDays = leapIsBig ? 30 : 29;
      if (offset < leapDays) {
        const ganZhi = `${TIAN_GAN[(year - 4) % 10]}${DI_ZHI[(year - 4) % 12]}`;
        return {
          month: `闰${LUNAR_MONTHS[m]}`,
          day: LUNAR_DAYS[offset],
          ganZhi,
          shengXiao: SHENG_XIAO[(year - 4) % 12],
          isLeap: true,
        };
      }
      offset -= leapDays;
    }
  }

  return { month: '?', day: '?' };
}

export function getDateInfo() {
  const now = new Date();
  const term = getSolarTerm(now);
  const lunar = getLunarInfo(now);

  let text = `农历${lunar.month}月${lunar.day}`;
  if (term) text = `${term} · ${text}`;
  return text;
}
