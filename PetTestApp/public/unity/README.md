# Unity 项目集成指南

## 📁 目录结构
```
public/unity/
├── Build/
│   ├── unity.loader.js
│   ├── unity.data
│   ├── unity.framework.js
│   └── unity.wasm
└── README.md
```

## 🎮 Unity 项目设置

### 1. 创建 Unity 项目
- 使用 Unity 2022.3 LTS 或更新版本
- 选择 WebGL 平台

### 2. 创建宠物控制器脚本
```csharp
using UnityEngine;

public class PetController : MonoBehaviour
{
    private string currentPetType = "dog";
    private string currentMood = "happy";
    
    // 设置宠物类型
    public void SetPetType(string petType)
    {
        currentPetType = petType;
        UpdatePetVisual();
    }
    
    // 设置宠物心情
    public void SetPetMood(string mood)
    {
        currentMood = mood;
        UpdatePetVisual();
    }
    
    // 触发互动
    public void TriggerInteraction(string interactionType)
    {
        Debug.Log($"Pet interaction: {interactionType}");
        // 实现互动逻辑
    }
    
    private void UpdatePetVisual()
    {
        Debug.Log($"Pet updated - Type: {currentPetType}, Mood: {currentMood}");
        // 更新宠物外观
    }
}
```

### 3. 构建 WebGL
- File → Build Settings
- 选择 WebGL 平台
- 点击 "Build"
- 将构建文件复制到 `public/unity/Build/` 目录

### 4. 测试集成
- 运行 `npx expo run:ios`
- 在 VirtualPet 页面查看 Unity 内容

## 🔧 通信协议

### React Native → Unity
```javascript
// 设置宠物类型
sendMessage("PetController", "SetPetType", "dog");

// 设置心情
sendMessage("PetController", "SetPetMood", "happy");

// 触发互动
sendMessage("PetController", "TriggerInteraction", "play");
```

### Unity → React Native
```csharp
// 发送消息到 React Native
Application.ExternalCall("ReactNative", "onPetInteraction", "play");
```

## 📱 在 iOS 中预览

使用 `npx expo run:ios` 可以：
- ✅ 实时预览 Unity 内容
- ✅ 测试 Unity 与 React Native 的通信
- ✅ 调试 Unity 性能
- ✅ 热重载支持

## ⚠️ 注意事项

1. **不能使用 Expo Go**：Unity 需要原生编译
2. **文件大小**：WebGL 构建文件可能很大
3. **性能优化**：注意移动设备性能限制
4. **内存管理**：及时清理 Unity 资源 