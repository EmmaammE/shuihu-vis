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
    top: 60,
    right: 50,
    bottom: 60,
    left: 120
};

const scatterWidth = 1000 - margin.left - margin.right;
const scatterHeight = 600 - margin.top - margin.bottom;
export const scatterSetting = {...margin,scatterWidth,scatterHeight};

export const colorThemes_ = {
    宋江: '#ff634d',
    鲁智深: '#5067eb',
    林冲: '#fdd981',
    卢俊义: '#b2df8a',
    李应: '#a6cee3',
    孙立: ' #72939c',
    无党派: ' #f3a8bd',
    非108将: '#f1f3ff'
};

const lineGraphMargin = {
    top:10,
    right: 30,
    bottom: 50,
    left: 24,
}

const lineGraphWidth = 4000 - lineGraphMargin.right - lineGraphMargin.left;
const lineGraphHeight = 250 - lineGraphMargin.top - lineGraphMargin.bottom;
export const lineGraphSetting = {...lineGraphMargin,lineGraphWidth,lineGraphHeight};

const treemapMargin = {
    top:0,
    right:0,
    left:0,
    bottom:20,
    // 局部放大treemap
    childWidth:100,
    childHeight:100
}

const treemapWidth = 640- treemapMargin.right - treemapMargin.left;
const treemapHeight = 600 - treemapMargin.top - treemapMargin.bottom;
export const treemapSetting = {...treemapMargin,treemapWidth,treemapHeight};

export const wordcloudSetting = {
    width:300,
    height:200
}

export const song = {
    1:'关胜',
    2:'呼延灼',
    3:'张清',
    4:'戴宗',
    5:'李逵',
    6:'穆弘',
    7:'李俊',
    8:'欧鹏',
    9:'燕顺',
}