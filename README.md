# 金玉良缘珠宝 · 网站模板

一个纯静态（HTML / CSS / JavaScript）的珠宝行业网站模板，无需构建工具，直接打开即可运行。

## 页面

| 页面 | 文件 |
| --- | --- |
| 首页 | `index.html` |
| 翡翠 | `jade.html` |
| 金饰 | `gold.html` |
| 银饰 | `silver.html` |
| 钻石 | `diamond.html` |
| 珍珠 | `pearl.html` |
| 购物车 | `cart.html` |
| 下单付款 | `checkout.html` |

## 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

也可以直接部署到 GitHub Pages、Vercel、Netlify 等任意静态托管。

## 修改商品

所有分类与商品数据都在 `js/products.js`，修改名称、价格、描述即可。商品图片目前用 SVG 插画代替，接入真实图片时可在 `js/main.js` 的 `productArt()` 中改为 `<img>`。

## 关于支付

`checkout.html` 是**模拟支付**：提交后显示订单号与支付成功页，不会产生任何真实扣款。上线前需要后端对接微信支付、支付宝或银联等商户接口。购物车数据保存在浏览器 `localStorage` 中。

## 首页开场动画

首页默认播放「水墨书写」开场，每次打开浏览器只播一次。另外三个方案（锦盒开启、朱门开启、卷轴展开）保留备用：

- 单独查看：`index.html#box`、`#gate`、`#ink`、`#scroll`，或打开 `intro-demo.html` 选择。
- 更换默认：把 `index.html` 里 `window.INTRO = ...("ink")` 的 `"ink"` 改成 `"box"`、`"gate"` 或 `"scroll"`；改成 `""` 则不播放开场。
