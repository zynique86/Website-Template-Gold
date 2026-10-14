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
  pearl: {
    name: "珍珠",
    en: "Pearl",
    page: "pearl.html",
    tagline: "珠圆玉润 · 温柔光华",
    intro: "甄选日本Akoya、南洋金珠、大溪地黑珍珠与优质淡水珍珠。正圆强光、皮光细腻，每一颗都经过多轮挑选与配对。",
    colors: ["#cdbfb4", "#fffaf4"],
  }
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

  // 珍珠
  { id: "p1", cat: "pearl", type: "necklace", name: "Akoya海水珍珠项链", price: 9800, tag: "热销", desc: "8-8.5mm正圆强光，18K金扣，长度45cm。" },
  { id: "p2", cat: "pearl", type: "necklace", name: "大溪地黑珍珠项链", price: 26800, tag: "珍藏", desc: "10-12mm孔雀绿伴彩，天然黑珍珠，一珠一证。" },
  { id: "p3", cat: "pearl", type: "pendant", name: "南洋金珠吊坠", price: 12800, tag: "新品", desc: "11mm浓金色南洋珠，18K金镶小钻。" },
  { id: "p4", cat: "pearl", type: "pendant", name: "澳白珍珠吊坠", price: 8800, desc: "10mm澳洲白珠，银白伴粉晕彩。" },
  { id: "p5", cat: "pearl", type: "earring", name: "淡水珍珠耳钉", price: 699, tag: "新品", desc: "7-7.5mm近圆强光，S925银耳针。" },
  { id: "p6", cat: "pearl", type: "earring", name: "巴洛克珍珠耳坠", price: 1280, desc: "异形巴洛克珠，每对独一无二。" },
  { id: "p7", cat: "pearl", type: "ring", name: "Akoya珍珠戒指", price: 5800, desc: "8mm Akoya主珠，18K白金群镶小钻。" },
  { id: "p8", cat: "pearl", type: "ring", name: "淡水珍珠开口戒", price: 459, desc: "双珠开口设计，尺寸可调。" },
  { id: "p9", cat: "pearl", type: "bracelet", name: "淡水珍珠手链", price: 899, desc: "6-7mm珍珠串，18K金扣。" },
  { id: "p10", cat: "pearl", type: "bracelet", name: "珍珠多层手链", price: 1580, desc: "三层小米珠叠戴，温柔精致。" },
  { id: "p11", cat: "pearl", type: "bangle", name: "珍珠银镯", price: 1880, desc: "足银开口镯，两端各镶一颗淡水珍珠。" },
  { id: "p12", cat: "pearl", type: "anklet", name: "珍珠脚链", price: 459, desc: "细链间隔小珍珠，夏日海边必备。" },
];

function findProduct(id) {
  return PRODUCTS.find((p) => p.id === id);
}

// 分类页主题：窗框造型、诗句、镇店之宝、选购指南
const CATEGORY_THEMES = {
  jade: {
    seal: "翠",
    frame: "moon",
    poem: ["一眼千年", "君子比德于玉"],
    stats: ["一物一证", "缅甸A货", "手工雕琢"],
    spotlight: "j3",
    story: "整块满绿原石掏制，阳绿色调均匀浓郁，起胶起光。老师傅耗时四十余天打磨，圈口圆润贴腕，是可传三代的家族珍藏。",
    specs: [["产地", "缅甸 · 老坑"], ["种水", "冰种 · 满绿"], ["圈口", "56 - 58 mm"], ["证书", "NGTC 国检证书"]],
    guide: [
      ["种", "看种老", "种是质地的细腻程度，玻璃种、冰种、糯种依次递减。种越老，越通透起光。"],
      ["水", "看水头", "水头指透明度。对着光看，光线透入越深，水头越足，行话叫“水长”。"],
      ["色", "看颜色", "以浓、阳、正、和为佳。阳绿、帝王绿最珍贵，飘花、紫罗兰各有韵味。"],
      ["证", "认A货", "天然未经处理才是A货。认准国检机构证书，B货、C货经过酸洗或染色。"],
    ],
  },
  gold: {
    seal: "金",
    frame: "arch",
    poem: ["真金不怕火炼", "富贵传家"],
    stats: ["足金999", "古法手作", "按克计价"],
    spotlight: "g2",
    story: "以古法錾刻工艺打造龙凤呈祥纹样，龙鳞凤羽根根分明。哑光金面温润内敛，是三书六礼中不可缺少的“三金”之一。",
    specs: [["成色", "足金 999‰"], ["克重", "约 45 g"], ["工艺", "古法錾刻 · 哑光"], ["寓意", "龙凤呈祥 · 婚嫁"]],
    guide: [
      ["足", "认成色", "足金含金量不低于990‰，千足金不低于999‰。18K金约含金75%，硬度更高，适合镶嵌。"],
      ["古", "懂古法", "古法金沿用锤揲、錾刻、花丝等传统手艺，表面哑光、质感厚重，越戴越亮。"],
      ["克", "看克重", "金饰多按克重计价，另加工费。购买时留意标签克重与工费是否分开标注。"],
      ["养", "会保养", "避免与硬物碰撞，远离汞与漂白水。哑光金可定期回店免费抛光翻新。"],
    ],
  },
  silver: {
    seal: "银",
    frame: "hex",
    poem: ["皎皎如月", "清辉满怀"],
    stats: ["S925纯银", "亲肤防敏", "轻奢百搭"],
    spotlight: "s3",
    story: "足银打造的传统长命锁，正面錾“长命百岁”，背面刻如意云纹，下坠小银铃。送给宝宝满月与周岁，寄托一生平安。",
    specs: [["成色", "足银 999‰"], ["尺寸", "约 3.8 × 3.2 cm"], ["工艺", "手工錾刻"], ["服务", "可免费刻字"]],
    guide: [
      ["纯", "认纯度", "S925表示含银92.5%，加入少量铜增加硬度；足银999更纯更软，多用于传统饰品。"],
      ["亮", "防氧化", "银饰接触空气会发黑，这是正常现象。用擦银布轻擦即可恢复光亮。"],
      ["存", "会收纳", "不戴时放入密封袋单独保存，避开潮湿与化妆品，能大大延缓氧化。"],
      ["搭", "巧叠戴", "细链、素圈适合叠戴，同一只手不超过三件，简约更显质感。"],
    ],
  },
  diamond: {
    seal: "钻",
    frame: "octagon",
    poem: ["钻石恒久远", "一颗永流传"],
    stats: ["GIA认证", "3EX切工", "终身保养"],
    spotlight: "d1",
    story: "1克拉F色VS1净度主钻，3EX完美切工让每一道光线都折射回眼底。铂金六爪经典镶嵌，把主钻高高托起，见证一生一次的承诺。",
    specs: [["重量", "1.00 ct"], ["颜色 / 净度", "F / VS1"], ["切工", "3EX 无荧光"], ["证书", "GIA 国际证书"]],
    guide: [
      ["克", "Carat 克拉", "钻石重量单位，1克拉 = 0.2克。同等品质下，克拉数越大价格增幅越快。"],
      ["色", "Color 颜色", "从D到Z，D色最白最稀有。F-H色肉眼几乎难辨差别，性价比更高。"],
      ["净", "Clarity 净度", "FL无瑕到I级，VS级内含物需10倍放大镜才能看到，日常佩戴已足够完美。"],
      ["切", "Cut 切工", "唯一由人工决定的C。3EX（切工、抛光、对称均为极好）火彩最佳。"],
    ],
  },
  pearl: {
    seal: "珠",
    frame: "shell",
    poem: ["沧海月明珠有泪", "珠圆玉润"],
    stats: ["海水珍珠", "AAA级光泽", "一珠一证"],
    spotlight: "p2",
    story: "来自法属波利尼西亚的大溪地黑珍珠，在黑蝶贝中孕育三年以上。墨黑底色泛着孔雀绿与紫红伴彩，十余颗经过数千颗挑选配对，粒粒圆润同色。",
    specs: [["产地", "大溪地 · 海水"], ["直径", "10 - 12 mm"], ["伴彩", "孔雀绿"], ["证书", "国检珍珠证书"]],
    guide: [
      ["光", "看光泽", "光泽最重要。好的珍珠表面像镜子，能清晰映出人影，光泽锐利不发雾。"],
      ["圆", "看圆度", "正圆最稀有、最贵；近圆、椭圆次之。巴洛克异形珠则以独特造型取胜。"],
      ["瑕", "看皮光", "表面越光滑、斑点越少越好。轻微生长纹是天然证明，不必苛求完美。"],
      ["径", "看大小", "同品质下越大越贵。淡水珠多为5-9mm，Akoya 6-9mm，南洋珠可达10-15mm。"],
    ],
  }
};
