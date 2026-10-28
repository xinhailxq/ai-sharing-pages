/* Topic 02 v3 · Traditional Chinese / Taiwan runtime glossary. All UI behaviors use shared mcp-v3.js. */
window.AI_SHARING_V3_HANT_PAIRS="万萬与與专專业業两兩个個为為么麼义義于於产產仅僅从從们們优優会會传傳体體储儲关關内內册冊写寫冲衝决決几幾凭憑击擊则則创創别別务務动動协協单單却卻参參发發变變后後吗嗎听聽员員团團围圍图圖场場声聲处處备備复復够夠学學实實审審对對导導将將尝嘗层層属屬帮幫幂冪并並库庫应應开開异異强強当當录錄径徑态態总總惯慣户戶扑撲执執扩擴护護报報担擔拟擬拥擁择擇换換据據数數断斷无無时時暂暫术術机機权權条條来來构構标標样樣档檔桥橋检檢槛檻没沒测測满滿潜潛灵靈点點状狀独獨环環现現画畫着著码碼础礎确確离離种種称稱简簡约約级級纯純线線组組织織终終经經结結给給络絡绝絕统統继繼续續维維缓緩编編网網职職联聯聪聰节節范範获獲虑慮虚虛补補装裝见見观觀规規触觸计計认認让讓议議记記许許设設访訪证證评評识識诊診试試话話询詢该該语語误誤说說请請读讀谁誰调調谈談负負责責败敗费費资資轮輪载載较較输輸边邊达達过過运運还還这這进進连連迟遲适適选選递遞采採释釋鉴鑒钮鈕销銷错錯键鍵长長门門闭閉问問间間阅閱队隊际際险險随隨隐隱难難页頁项項须須题題额額风風驱驅验驗骤驟";
window.AI_SHARING_V3_HANT_PHRASES={
  "数据库": "資料庫",
  "数据": "資料",
  "代码": "程式碼",
  "工作流": "工作流程",
  "文件": "檔案",
  "文件存储": "檔案儲存",
  "图片": "圖片",
  "图像": "影像",
  "页面": "頁面",
  "交付页": "交付頁面",
  "服务端": "伺服器端",
  "客户端": "用戶端",
  "工具调用": "工具呼叫",
  "调用": "呼叫",
  "用户": "使用者",
  "访问": "存取",
  "网络": "網路",
  "配置": "設定",
  "日志": "日誌",
  "智能": "智慧",
  "反馈": "回饋",
  "信息": "資訊",
  "通过": "透過",
  "应用": "應用程式",
  "下一步": "下一步",
  "演示": "示範",
  "构建": "建構",
  "真实": "真實",
  "模拟": "模擬",
  "人工审批": "人工核准",
  "审批": "核准",
  "问题": "問題",
  "为什么": "為什麼",
  "说明": "說明",
  "状态": "狀態",
  "系统": "系統",
  "验证": "驗證",
  "上传": "上傳",
  "成功": "成功",
  "安全": "安全",
  "已完成": "已完成",
  "结果": "結果",
  "示例": "範例",
  "界面": "介面",
  "检查": "檢查",
  "执行": "執行",
  "场景": "情境",
  "模块": "模組",
  "回执": "回條",
  "操作": "操作",
  "交付": "交付",
  "体验": "體驗"
};
// Taiwan-specific engineering vocabulary: longer phrases take priority.
window.AI_SHARING_V3_HANT_PHRASES["交互"]="互動";
window.AI_SHARING_V3_HANT_PHRASES["源代码"]="原始碼";
window.AI_SHARING_V3_HANT_PHRASES["实时"]="即時";
window.AI_SHARING_V3_HANT_PHRASES["只读"]="唯讀";
window.AI_SHARING_V3_HANT_PHRASES["重置"]="重設";
window.AI_SHARING_V3_TRANSLATE=(function(){
  const p=window.AI_SHARING_V3_HANT_PAIRS;
  const pairs={};for(let i=0;i<p.length;i+=2)pairs[p[i]]=p[i+1];
  const entries=Object.entries(window.AI_SHARING_V3_HANT_PHRASES).sort((a,b)=>b[0].length-a[0].length);
  return function(value){if(typeof value!=='string')return value;
    let v=value;
    const placeholders=[];
    for(const [key,val] of entries){
      if(!v.includes(key))continue;
      const id=String.fromCharCode(0xE000+placeholders.length);placeholders.push(val);
      v=v.split(key).join(id);
    }
    v=[...v].map(c=>pairs[c]||c).join('');
    return v.replace(/[\uE000-\uF8FF]/g,c=>placeholders[c.charCodeAt(0)-0xE000]||c);
  };
})();
