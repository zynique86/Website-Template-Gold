// 商品与分类数据（示例数据，可替换为真实商品）
const CATEGORIES = {
  jade: {
    name: "翡翠",
    en: "Jadeite",
    page: "jade.html",
    tagline: "温润如玉 · 千年东方之美",
    intro: "精选缅甸天然A货翡翠，每件均附国家权威机构鉴定证书。种水通透、色泽灵动，承载东方文化的温润与雅致。",
    colors: ["#2f8f5b", "#7cc79a"],
  },
  gold: {
    name: "金饰",
    en: "Gold",
    page: "gold.html",
    tagline: "足金传承 · 璀璨一生",
    intro: "足金999与18K金工艺，古法手作与现代设计兼备。无论婚嫁、生肖还是日常佩戴，都能找到属于你的那一份金色。",
    colors: ["#c9a24a", "#f3dc8f"],
  },
  silver: {
    name: "银饰",
    en: "Silver",
    page: "silver.html",
    tagline: "纯银净透 · 轻奢日常",
    intro: "S925纯银打造，简约设计适合日常叠戴。亲肤不易过敏，是送礼与自用的轻奢之选。",
    colors: ["#9aa3ad", "#e3e7eb"],
  },
  diamond: {
    name: "钻石",
    en: "Diamond",
    page: "diamond.html",
    tagline: "恒久闪耀 · 见证真爱",
    intro: "严选GIA认证钻石，4C标准层层把关。从求婚钻戒到纪念项链，为每一个重要时刻定格永恒光芒。",
    colors: ["#6d8fb8", "#d6e6f7"],
  },
};

// 款式（每个材质页按款式筛选）
const TYPES = {
  ring: { name: "戒指", shape: "ring" },
  necklace: { name: "项链", shape: "drop" },
  pendant: { name: "吊坠", shape: "gem" },
  earring: { name: "耳饰", shape: "studs" },
  bracelet: { name: "手链", shape: "chain" },
  bangle: { name: "手镯", shape: "bangle" },
  anklet: { name: "脚链", shape: "anklet" },
};

const PRODUCTS = [
  // 翡翠
  { id: "j1", cat: "jade", type: "pendant", name: "冰种飘绿平安扣吊坠", price: 12800, tag: "热销", desc: "冰种质地，飘绿自然，18K金镶嵌。附NGTC鉴定证书。" },
  { id: "j2", cat: "jade", type: "pendant", name: "糯冰种观音吊坠", price: 26800, desc: "糯冰种底，雕工细腻，寓意平安护佑。" },
  { id: "j3", cat: "jade", type: "bangle", name: "满绿翡翠手镯", price: 168000, tag: "珍藏", desc: "满绿阳绿，圈口56-58mm，一镯一证。" },
  { id: "j4", cat: "jade", type: "bangle", name: "冰种贵妃手镯", price: 38800, desc: "椭圆贵妃镯型，冰透起光，贴合手腕。" },
  { id: "j5", cat: "jade", type: "ring", name: "紫罗兰翡翠戒指", price: 9800, tag: "新品", desc: "春色紫罗兰蛋面，18K白金群镶小钻。" },
  { id: "j6", cat: "jade", type: "ring", name: "冰种马鞍戒指", price: 7600, desc: "整料掏制马鞍戒，复古雅致。" },
  { id: "j7", cat: "jade", type: "necklace", name: "翡翠叶子项链", price: 15800, desc: "寓意事业有成，金叶衬托翠色。" },
  { id: "j8", cat: "jade", type: "necklace", name: "翡翠珠链项链", price: 22800, desc: "冰糯种圆珠108颗，可作项链或多圈手串。" },
  { id: "j9", cat: "jade", type: "earring", name: "翡翠蛋面耳钉", price: 6600, desc: "冰种绿蛋面，S925银镀白金耳针。" },
  { id: "j10", cat: "jade", type: "earring", name: "翡翠水滴耳坠", price: 8900, desc: "水滴形翠面，18K金耳钩，摇曳灵动。" },
  { id: "j11", cat: "jade", type: "bracelet", name: "翡翠圆珠手链", price: 4800, desc: "8mm圆珠串，弹力绳易佩戴。" },
  { id: "j12", cat: "jade", type: "anklet", name: "翡翠路路通脚链", price: 2600, desc: "路路通小件配红绳，寓意顺遂。" },

  // 金饰
  { id: "g1", cat: "gold", type: "bangle", name: "古法足金福字手镯", price: 18600, tag: "热销", desc: "足金999，约30g，古法哑光工艺。" },
  { id: "g2", cat: "gold", type: "bangle", name: "足金龙凤婚嫁手镯", price: 26800, tag: "婚嫁", desc: "龙凤呈祥纹样，约45g，婚嫁首选。" },
  { id: "g3", cat: "gold", type: "ring", name: "足金素圈戒指", price: 2980, desc: "经典素圈，可刻字，约5g。" },
  { id: "g4", cat: "gold", type: "ring", name: "18K金镶钻戒指", price: 4580, tag: "新品", desc: "18K黄金戒托，群镶小钻，精致百搭。" },
  { id: "g5", cat: "gold", type: "necklace", name: "18K金锁骨链", price: 2380, desc: "18K黄金，O字链，长度40+5cm可调。" },
  { id: "g6", cat: "gold", type: "necklace", name: "足金十字链项链", price: 8800, desc: "足金999，约12g，经典十字链。" },
  { id: "g7", cat: "gold", type: "pendant", name: "足金平安锁吊坠", price: 3680, desc: "足金长命锁造型，送宝宝寓意平安。" },
  { id: "g8", cat: "gold", type: "earring", name: "足金如意耳环", price: 3280, desc: "足金999，约4g，如意造型。" },
  { id: "g9", cat: "gold", type: "earring", name: "18K金圈圈耳环", price: 1980, desc: "18K黄金大圈耳环，通勤约会都适合。" },
  { id: "g10", cat: "gold", type: "bracelet", name: "生肖足金转运珠手链", price: 1680, desc: "足金转运珠搭配红绳，本命年好运相伴。" },
  { id: "g11", cat: "gold", type: "bracelet", name: "足金竹节手链", price: 6800, desc: "竹节造型，寓意节节高升，约9g。" },
  { id: "g12", cat: "gold", type: "anklet", name: "足金铃铛脚链", price: 2280, desc: "小铃铛点缀，行走间清脆悦耳。" },

  // 银饰
  { id: "s1", cat: "silver", type: "necklace", name: "S925银星月项链", price: 399, tag: "热销", desc: "星月造型，锆石点缀，送礼佳品。" },
  { id: "s2", cat: "silver", type: "necklace", name: "S925银蝴蝶锁骨链", price: 329, desc: "轻盈蝴蝶造型，长度40+5cm。" },
  { id: "s3", cat: "silver", type: "pendant", name: "复古银质长命锁", price: 899, desc: "足银打造，适合宝宝满月与周岁。" },
  { id: "s4", cat: "silver", type: "bangle", name: "纯银开口手镯", price: 599, desc: "足银999，开口可调，简约百搭。" },
  { id: "s5", cat: "silver", type: "ring", name: "叠戴银戒三件套", price: 329, tag: "新品", desc: "三款细戒，可单戴可叠戴。" },
  { id: "s6", cat: "silver", type: "ring", name: "S925银开口尾戒", price: 159, desc: "开口设计，尺寸可调。" },
  { id: "s7", cat: "silver", type: "earring", name: "S925银珍珠耳钉", price: 259, desc: "淡水珍珠，银针防过敏。" },
  { id: "s8", cat: "silver", type: "earring", name: "S925银流苏耳线", price: 199, desc: "长款流苏耳线，修饰脸型。" },
  { id: "s9", cat: "silver", type: "bracelet", name: "银饰幸运四叶草手链", price: 459, desc: "四叶草造型，寓意幸运常伴。" },
  { id: "s10", cat: "silver", type: "bracelet", name: "S925银串珠手链", price: 289, desc: "细链串珠，可叠戴手表。" },
  { id: "s11", cat: "silver", type: "anklet", name: "S925银小星星脚链", price: 199, tag: "新品", desc: "星星吊坠，夏日必备。" },
  { id: "s12", cat: "silver", type: "anklet", name: "S925银双层脚链", price: 269, desc: "双层叠戴效果，延长链可调。" },

  // 钻石
  { id: "d1", cat: "diamond", type: "ring", name: "1克拉经典六爪钻戒", price: 59800, tag: "求婚", desc: "GIA证书，F色VS1净度，3EX切工，铂金戒托。" },
  { id: "d2", cat: "diamond", type: "ring", name: "排钻对戒", price: 12800, desc: "男女对戒，女戒排钻，可刻字。" },
  { id: "d3", cat: "diamond", type: "ring", name: "群镶花朵钻戒", price: 8800, desc: "群镶效果如1克拉，性价比之选。" },
  { id: "d4", cat: "diamond", type: "necklace", name: "50分心形钻石项链", price: 16800, tag: "热销", desc: "心形主钻，18K白金链，长度45cm。" },
  { id: "d5", cat: "diamond", type: "necklace", name: "一字排钻锁骨链", price: 9800, desc: "共约50分，18K白金，简约大气。" },
  { id: "d6", cat: "diamond", type: "pendant", name: "30分单钻吊坠", price: 7800, desc: "经典四爪单钻，18K白金吊坠。" },
  { id: "d7", cat: "diamond", type: "earring", name: "钻石四爪耳钉", price: 6800, desc: "共约30分，18K白金四爪镶嵌。" },
  { id: "d8", cat: "diamond", type: "earring", name: "钻石水滴耳坠", price: 11800, desc: "水滴形群镶，18K白金，晚宴之选。" },
  { id: "d9", cat: "diamond", type: "bracelet", name: "满钻网球手链", price: 38800, tag: "新品", desc: "共约2克拉，18K白金，奢华闪耀。" },
  { id: "d10", cat: "diamond", type: "bracelet", name: "单钻细链手链", price: 3980, desc: "10分单钻，18K玫瑰金细链。" },
  { id: "d11", cat: "diamond", type: "bangle", name: "半圈镶钻手镯", price: 15800, desc: "18K白金，半圈排钻，开合设计。" },
  { id: "d12", cat: "diamond", type: "anklet", name: "钻石点缀脚链", price: 4580, desc: "18K白金细链，间隔镶嵌小钻。" },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
