# 📊 数据类型与模型字典 (DATA_SCHEMA.md)

## 1. 资产接口定义 (Asset Interface)
```typescript
interface Asset {
  id: string;
  type: 'garment' | 'model' | 'background';
  src: string;
  title: string;
  description: string;
  // --- 衣物特有属性 ---
  productNum?: string; // 产品编号
  productPrice?: string; // 产品价格
  productCategory?: string[]; // 产品类别（上装、下装、内搭、饰品）
  composition?: string; // 成分信息
  pos1-5?: string; // 关键位置提醒（1领口，2袖口等）
  backImg/leftImg/rightImg?: string; // 角度图路径
  // --- 模特特有属性 ---
  gender?: string;
  age?: string; // 年龄层
  ethnicity?: string; // 族裔
  style?: string; // 风格定位
  // --- 修改追踪 ---
  creator: string;
  createTime: string;
  modifier: string;
  modifyTime: string;
}
```

## 2. 业务类型字典 (Business Lines)
- `business`: 商务通勤逻辑，追求挺括感。
- `outdoor`: 户外运动逻辑，追求体积感。

---
*最后更新：2026-03-05*
