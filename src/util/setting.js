export const colorThemes = {
    宋江: 'song',
    鲁智深: 'lu',
    林冲: 'lin',
    卢俊义: 'yi',
    无党派: 'wu',
    李应: 'li',
    孙立: 'sun'
};

const margin = {
    top: 30,
    right: 50,
    bottom: 60,
    left: 40
};

const scatterWidth = 1200 - margin.left - margin.right;
const scatterHeight = 960 - margin.top - margin.bottom;

export const scatterSetting = {...margin,scatterWidth,scatterHeight};