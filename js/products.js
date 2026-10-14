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

const PRODUCTS = [
  // 翡翠
  { id: "j1", cat: "jade", name: "冰种飘绿平安扣吊坠", price: 12800, tag: "热销", shape: "ring", desc: "冰种质地，飘绿自然，18K金镶嵌。附NGTC鉴定证书。" },
  { id: "j2", cat: "jade", name: "满绿翡翠手镯", price: 168000, tag: "珍藏", shape: "bangle", desc: "满绿阳绿，圈口56-58mm，一镯一证。" },
  { id: "j3", cat: "jade", name: "糯冰种观音吊坠", price: 26800, shape: "drop", desc: "糯冰种底，雕工细腻，寓意平安护佑。" },
  { id: "j4", cat: "jade", name: "紫罗兰翡翠戒指", price: 9800, tag: "新品", shape: "gem", desc: "春色紫罗兰蛋面，18K白金群镶小钻。" },
  { id: "j5", cat: "jade", name: "翡翠蛋面耳钉", price: 6600, shape: "studs", desc: "冰种绿蛋面，S925银镀白金耳针。" },
  { id: "j6", cat: "jade", name: "翡翠叶子项链", price: 15800, shape: "drop", desc: "寓意事业有成，金叶衬托翠色。" },

  // 金饰
  { id: "g1", cat: "gold", name: "古法足金福字手镯", price: 18600, tag: "热销", shape: "bangle", desc: "足金999，约30g，古法哑光工艺。" },
  { id: "g2", cat: "gold", name: "足金龙凤婚嫁套装", price: 52800, tag: "婚嫁", shape: "gem", desc: "项链、手镯、耳环、戒指四件套，约80g。" },
  { id: "g3", cat: "gold", name: "生肖足金转运珠", price: 1680, shape: "ring", desc: "足金转运珠搭配红绳，本命年好运相伴。" },
  { id: "g4", cat: "gold", name: "18K金锁骨链", price: 2380, tag: "新品", shape: "drop", desc: "18K黄金，O字链，长度40+5cm可调。" },
  { id: "g5", cat: "gold", name: "足金如意耳环", price: 3280, shape: "studs", desc: "足金999，约4g，如意造型。" },
  { id: "g6", cat: "gold", name: "足金素圈戒指", price: 2980, shape: "ring", desc: "经典素圈，可刻字，约5g。" },

  // 银饰
  { id: "s1", cat: "silver", name: "S925银星月项链", price: 399, tag: "热销", shape: "drop", desc: "星月造型，锆石点缀，送礼佳品。" },
  { id: "s2", cat: "silver", name: "纯银开口手镯", price: 599, shape: "bangle", desc: "足银999，开口可调，简约百搭。" },
  { id: "s3", cat: "silver", name: "S925银珍珠耳钉", price: 259, shape: "studs", desc: "淡水珍珠，银针防过敏。" },
  { id: "s4", cat: "silver", name: "叠戴银戒三件套", price: 329, tag: "新品", shape: "ring", desc: "三款细戒，可单戴可叠戴。" },
  { id: "s5", cat: "silver", name: "银饰幸运四叶草手链", price: 459, shape: "gem", desc: "四叶草造型，寓意幸运常伴。" },
  { id: "s6", cat: "silver", name: "复古银质长命锁", price: 899, shape: "drop", desc: "足银打造，适合宝宝满月与周岁。" },

  // 钻石
  { id: "d1", cat: "diamond", name: "1克拉经典六爪钻戒", price: 59800, tag: "求婚", shape: "gem", desc: "GIA证书，F色VS1净度，3EX切工，铂金戒托。" },
  { id: "d2", cat: "diamond", name: "50分心形钻石项链", price: 16800, tag: "热销", shape: "drop", desc: "心形主钻，18K白金链，长度45cm。" },
  { id: "d3", cat: "diamond", name: "钻石网红耳钉", price: 6800, shape: "studs", desc: "共约30分，18K白金四爪镶嵌。" },
  { id: "d4", cat: "diamond", name: "排钻对戒", price: 12800, shape: "ring", desc: "男女对戒，女戒排钻，可刻字。" },
  { id: "d5", cat: "diamond", name: "满钻网球手链", price: 38800, tag: "新品", shape: "bangle", desc: "共约2克拉，18K白金，奢华闪耀。" },
  { id: "d6", cat: "diamond", name: "群镶花朵钻戒", price: 8800, shape: "gem", desc: "群镶效果如1克拉，性价比之选。" },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}
