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
