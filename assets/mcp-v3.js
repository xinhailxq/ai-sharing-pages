/* Topic 02 v3 — offline classroom state machines. No fetch, telemetry, server calls or production data. */
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  // Both translated editions retain exactly the same state machine and controls.
  const tr = value => {
    if (typeof value !== 'string') return value;
    if (typeof window.AI_SHARING_V3_TRANSLATE === 'function') return window.AI_SHARING_V3_TRANSLATE(value);
    return (window.AI_SHARING_V3_I18N || {})[value] || value;
  };
  const all = selector => [...document.querySelectorAll(selector)];
  const chapters = ['intro','roles','discovery','api','mission','reliability','beyond','sources'];
  let chapter = 'intro';
  const text = (id, value) => { const el = $(id); if (el) el.textContent = tr(value); };
  const line = (parent, tag, value, cls) => {
    const el = document.createElement(tag);
    el.textContent = tr(value);
    if (cls) el.className = cls;
    parent.append(el);
    return el;
  };

  function go(id, updateHash = true) {
    if (!chapters.includes(id)) return;
    chapter = id;
    all('[data-view]').forEach(el => {
      const show = el.dataset.view === id;
      el.hidden = !show;
      el.classList.toggle('active', show);
    });
    all('.nav').forEach(b => {
      const selected = b.dataset.route === id;
      b.classList.toggle('active', selected);
      if (selected) b.setAttribute('aria-current', 'page');
      else b.removeAttribute('aria-current');
    });
    const index = chapters.indexOf(id);
    text('chapterCounter', String(index + 1).padStart(2,'0') + ' / 08');
    $('pagerFill').style.width = ((index + 1) / chapters.length * 100) + '%';
    $('prevChapter').disabled = index === 0;
    $('nextChapter').disabled = index === chapters.length - 1;
    if (updateHash && location.hash !== '#' + id) history.replaceState(null, '', '#' + id);
    window.scrollTo({top:0,behavior:'instant'});
  }
  all('[data-route]').forEach(el => el.addEventListener('click', event => {
    event.preventDefault(); go(el.dataset.route);
  }));
  all('[data-goto]').forEach(el => el.addEventListener('click', () => go(el.dataset.goto)));
  // Switching languages retains the currently selected chapter when possible.
  all('.v3-languages a').forEach(anchor => anchor.addEventListener('click', () => {
    if (chapters.includes(location.hash.slice(1))) anchor.hash = location.hash;
  }));
  $('prevChapter').addEventListener('click', () => go(chapters[Math.max(0,chapters.indexOf(chapter) - 1)]));
  $('nextChapter').addEventListener('click', () => go(chapters[Math.min(chapters.length - 1,chapters.indexOf(chapter) + 1)]));
  window.addEventListener('hashchange', () => {
    const target = location.hash.slice(1);
    if (chapters.includes(target)) go(target, false);
  });
  $('presentBtn').addEventListener('click', () => {
    const on = document.body.classList.toggle('presentation');
    $('presentBtn').setAttribute('aria-pressed', String(on));
    $('presentBtn').title = tr(on ? '退出演示模式' : '切换演示模式');
  });
  document.addEventListener('keydown', event => {
    if (event.altKey && (event.key === 'ArrowLeft' || event.key === 'ArrowRight')) {
      event.preventDefault();
      const dx = event.key === 'ArrowRight' ? 1 : -1;
      go(chapters[Math.min(7,Math.max(0,chapters.indexOf(chapter) + dx))]);
    }
  });

  // Role map: distinctions are deliberately responsibilities, not mandatory deployment boxes.
  const roles = {
    llm: ['LLM','推理不等于执行','根据当前上下文理解目标、比较候选工具、生成调用意图与参数；模型可能选错，也不能仅靠自己的文字证明外部操作成功。'],
    agent: ['Agent Runtime','让决策变成有状态的过程','执行循环组织模型调用、工具结果、检查点、终止条件和故障路径。它是运行模式，不要求独立部署为另一个服务。'],
    client: ['MCP Client','协议通信不等于语义决策','在 Host 中负责与 MCP Server 协议交互；通过 tools/list 获取工具定义、通过 tools/call 传递调用。具体发现流程需以协议版本为准。'],
    host: ['Host Application','授权与工具暴露属于应用层','承载模型会话、工具目录、用户交互、权限审批和执行能力。Host 可以隐藏一些工具，也可以延迟加载；是否连接成功不等于模型本轮可见。'],
    server: ['MCP Server','提供受控能力','向 Client 声明 Tools、Resources、Prompts 等能力并处理调用。可以复用已有 API；通常不负责协调多个异构业务系统的最终一致性。'],
    system: ['Business API / Database','权威业务状态在系统中','业务服务和数据库负责真实记录、身份授权和操作副作用。最终完成标准必须回到业务事实，而不能只看 LLM 的回答。']
  };
  all('[data-role]').forEach(el => el.addEventListener('click', () => {
    const role = el.dataset.role, data = roles[role];
    if (!data) return;
    all('[data-role]').forEach(n => n.classList.toggle('chosen', n === el));
    text('roleLabel',data[0]); text('roleHeading',data[1]); text('roleDesc',data[2]);
  }));
  document.querySelector('[data-role="llm"]').classList.add('chosen');

  const tools = {
    github: {kind:'bad',message:'GitHub 代码搜索有助于理解设计，但不能单独判断 DEMO-017 的实时业务状态。把代码事实当运行事实会产生误诊。'},
    drive: {kind:'bad',message:'文件存储能够证明资产存在，但不能独立证实它是否已登记为交付结果。还需要业务权威状态。'},
    db: {kind:'good',message:'合理的第一步：读取业务任务状态，再与已上传文件的回执交叉核验。查询仍不能自动证明写入或恢复操作安全。'},
    complete: {kind:'bad',message:'危险：这是有副作用的写操作，不是状态查询。证据不完整时直接设置完成，可能制造假成功。'}
  };
  function setToolFeedback(kind, msg) {
    const el = $('toolFeedback');
    el.className = 'arena-outcome ' + kind;
    el.textContent = tr(msg);
  }
  all('[data-tool]').forEach(el => el.addEventListener('click', () => {
    const v = tools[el.dataset.tool]; setToolFeedback(v.kind, v.message);
    all('.tool-choice').forEach(b => b.classList.toggle('selected', b === el));
  }));
  $('exposeDb').addEventListener('change', event => {
    const enabled = event.target.checked;
    const db = document.querySelector('[data-tool="db"]');
    db.disabled = !enabled;
    db.title = enabled ? '' : tr('Host 未向本轮模型暴露此工具');
    text('toolCount',enabled ? '4 TOOLS VISIBLE' : '3 TOOLS VISIBLE');
    setToolFeedback(enabled ? '' : 'bad', enabled
      ? '工具已暴露给模型。现在再考虑它是否是语义上合适的选择。'
      : 'MCP Server 可能仍有 get_job_status，但本轮 Host 不暴露它。正确工具不可见时，模型不能凭空调用。应报告能力限制或请求适当授权。');
    all('.tool-choice').forEach(b => b.classList.remove('selected'));
  });

  const paths = {
    custom: {
      title:'PATH A / CUSTOM INTEGRATION',
      nodes:[['MODEL','OpenAI API'],['INTENTION','Function Call'],['EXECUTOR','自建调度代码'],['SYSTEM','GitHub REST API']],
      copy:'常见自定义函数流程：应用把可用函数定义交给模型，收到函数调用请求后负责执行代码，再把结果交回模型。适合固定、明确的小规模集成，MCP 不是必需。'
    },
    mcp: {
      title:'PATH B / MCP ADAPTER',
      nodes:[['APPLICATION','Host + Model'],['PROTOCOL','MCP Client'],['SERVICE','MCP Server'],['SYSTEM','GitHub REST API']],
      copy:'MCP 为兼容的 Client 与 Server 提供标准的工具描述、发现及调用方式。Host 仍决定模型看见什么、如何授权与执行。业务 API、认证和错误处理不会因采用 MCP 自动消失。'
    }
  };
  function setPath(id) {
    const p = paths[id];
    all('[data-path]').forEach(b => {
      const active = b.dataset.path === id;
      b.classList.toggle('selected', active);
      b.setAttribute('aria-pressed', String(active));
    });
    text('pathTitle',p.title);text('pathCopy',p.copy);
    const container = $('pathNodes'); container.replaceChildren();
    p.nodes.forEach((n,i) => {
      if (i) line(container,'div','→','path-arrow');
      const node = document.createElement('div');node.className='path-node';
      line(node,'small',n[0]);line(node,'b',n[1]);container.append(node);
    });
  }
  all('[data-path]').forEach(b => b.addEventListener('click', () => setPath(b.dataset.path)));
  setPath('custom');

  const focusDetails = {
    user:['GOAL','用户任务','用户提出交付目标。把“生成成功”理解成“交付完成”是缺失成功标准的典型错误。'],
    agent:['ORCHESTRATOR','Agent / Host','Agent 管理步骤与状态，Host 负责调用、权限和环境。最终答案应该建立在外部可验证状态上。'],
    rules:['CONTEXT','任务规则','任务说明约束允许的行动与完成条件。来自工具的内容仍是有来源的数据，不会自动获得更高指令优先级。'],
    generator:['GENERATION','图像生成能力','抽象的模型/图像生成工具，不默认属于任何 MCP Server。已生成不代表已保存。'],
    database:['SYSTEM OF RECORD','任务数据库','数据库提供有边界的业务状态；单次查询可以增加证据，但未知幂等约束时仍不能随意重试写入。'],
    storage:['PERSISTENCE','文件存储','文件回执证明保存步骤完成，不等于已关联到业务记录或最终对用户可见。'],
    finalize:['BUSINESS WRITE','业务登记','受控业务写入接口发生超时。没有结果就应保留 UNKNOWN，不将其解释成失败或成功。']
  };
  function focusMissionNode(id) {
    const entry = focusDetails[id]; if (!entry) return;
    text('missionFocusType','FOCUS / ' + entry[0]);
    text('missionFocusTitle',entry[1]);
    text('missionFocusDesc',entry[2]);
    all('[data-mnode]').forEach(n => n.classList.toggle('chosen',n.dataset.mnode===id));
  }
  all('[data-mnode]').forEach(n => {
    n.addEventListener('click', () => focusMissionNode(n.dataset.mnode));
    n.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {e.preventDefault();focusMissionNode(n.dataset.mnode);}
    });
  });

  // Explicit state machine: UNKNOWN -> INSPECTED -> APPROVAL -> APPROVED -> WRITTEN -> VERIFIED.
  // Risky choices never fake an API result. Approval and recovery exist only inside this fictional script.
  let missionPhase = 'unknown', eventCount = 3;
  const choices = {
    unknown:[
      ['inspect','01 · 查询权威业务状态','只读核实最终提交结果'],
      ['retry','02 · 不检查直接重试','跳过副作用与幂等检查'],
      ['report','03 · 宣布任务完成','只依据已上传的文件'],
      ['pause','04 · 暂停并报告不确定性','保留证据，等待授权或规则']],
    inspected:[
      ['request','01 · 请求审批及恢复规则','没有已核实的安全重试契约'],
      ['retry','02 · 直接重试写入','即使未注册也可能存在未识别副作用'],
      ['report','03 · 宣布任务完成','业务记录尚未完成'],
      ['pause','04 · 暂停并报告部分完成','保留文件与查询证据']
    ],
    awaiting:[
      ['approve','01 · 模拟审批通过','虚构管理员确认示例操作前提'],
      ['pause','02 · 停止等待','不执行任何额外写入']
    ],
    approved:[
      ['perform','01 · 执行被批准的模拟操作','仅本地更新虚构状态'],
      ['pause','02 · 保守退出','保持部分完成报告']
    ],
    written:[
      ['verify','01 · 独立验收业务与交付状态','模拟读取 DB + 交付页'],
      ['report','02 · 跳过验收直接报告','提交回执不等于最终可见']
    ],
    verified:[['reset','↺ 重玩整个场景','重新体验其他选择']],
    paused:[['reset','↺ 重新开始','从 UNKNOWN 状态重播']]
  };
  function renderChoices() {
    const parent = $('missionChoices');
    parent.replaceChildren();
    (choices[missionPhase] || []).forEach(([id,title,desc]) => {
      const b = document.createElement('button'); b.type='button';b.dataset.action=id;
      line(b,'b',title);line(b,'small',desc); parent.append(b);
    });
  }
  function updateMetrics() {
    const submitted = ['written','verified'].includes(missionPhase);
    text('metricFinalize',missionPhase==='unknown'?'UNKNOWN':submitted?'ACK':missionPhase==='inspected'?'NOT FOUND':'PENDING');
    $('metricFinalize').className = submitted?'ok':'warn';
    text('metricDelivery',missionPhase==='verified'?'VERIFIED':'PENDING');
    text('metricMission',missionPhase==='verified'?'VERIFIED':missionPhase==='paused'?'PAUSED':'PARTIAL');
    text('evidenceDb',submitted?'模拟注册回执':missionPhase==='unknown'?'尚未证实':'模拟查询：未注册');
    text('evidenceReader',missionPhase==='verified'?'模拟验收通过':'尚未核验');
    text('svgDbLabel',missionPhase==='unknown'?'○ 待二次查询':'✓ 已执行模拟查询');
    text('svgFinalLabel',submitted?'✓ 已有模拟回执':missionPhase==='unknown'?'◆ 状态未知':'◆ 尚未注册');
  }
  function addEvent(title,detail,isWarning=false) {
    eventCount++;text('eventCount',eventCount+' EVENTS');
    const entry=document.createElement('li');if(isWarning)entry.className='event-warn';
    line(entry,'b',title);line(entry,'span',detail);$('missionLog').append(entry);
  }
  function feedback(title,description,kind='') {
    const parent=$('missionFeedback'); parent.className='mission-feedback '+kind;parent.replaceChildren();
    line(parent,'b',title);line(parent,'p',description);
  }
  function state(title,body) {text('missionStateTitle',title);text('missionStateBody',body);}
  function act(action) {
    if (action==='reset') {resetMission();return;}
    switch(action) {
      case 'inspect':
        if(missionPhase!=='unknown')return;
        missionPhase='inspected';
        state('模拟查询：尚未完成注册','假设本次只读业务查询未发现成功关联；这并不自动证明下一次写入安全，仍缺失授权和恢复契约。');
        feedback('合理的第一步：增加证据','检查已上传文件与业务状态，再评估操作前置条件。模拟查询不能代替真实产品恢复规则。','success');
        addEvent('查询业务权威状态','模拟返回：DEMO-017 未见完成注册；保留资产回执。');
        focusMissionNode('database');break;
      case 'retry':
        feedback('危险：未经核验的重复写入','请求超时或尚未注册都不能排除副作用。没有重试资格、幂等键与权威恢复规则时，不允许假定安全。','error');
        addEvent('拒绝盲目重试建议','此分支展示潜在重复写入风险；没有执行任何写操作。',true);
        focusMissionNode('finalize');break;
      case 'report':
        feedback('错误：完成声明缺少证据','上传成功不能证明 Finalize 提交和交付页可见，应报告部分完成、未确认或待核验。','error');
        addEvent('阻止错误完成报告','缺少业务提交或交付可见性的终态证据。',true);break;
      case 'pause':
        missionPhase='paused';
        state('安全暂停 / PARTIAL','演示记录已知资产与未知状态，不假装恢复成功。真实系统下一步交给其业务负责人。');
        feedback('报告部分完成与待处理项','正确的暂停也可以是可靠结果：不扩大写入副作用，留下核验与审批条件。','success');
        addEvent('安全暂停与状态报告','已保存的资产仍存在，最终任务标记为 PARTIAL。');
        break;
      case 'request':
        if(missionPhase!=='inspected')return;
        missionPhase='awaiting';
        state('等待模拟审批','在本虚构场景中，下一步需要一个独立审批者明确允许后续示范写入，且已制定示例恢复规则。');
        feedback('请求审批中','审批门槛与恢复条件均为教学假设，不对应任何真实产品或生产流程。');
        addEvent('请求独立审批','模拟提交：资产已存在、业务尚未注册，等待恢复资格判断。');
        break;
      case 'approve':
        if(missionPhase!=='awaiting')return;
        missionPhase='approved';
        state('示例审批已授予','纯虚构审批者确认：此演示分支可以执行一次受控登记。这里只演示控制流，不提供通用的生产重试处方。');
        feedback('获批不等于已完成','下一步模拟执行受控操作，之后仍须独立读取验收数据。');
        addEvent('模拟审批通过','虚构恢复资格已满足；没有真实 API、数据库或管理员参与。');
        break;
      case 'perform':
        if(missionPhase!=='approved')return;
        missionPhase='written';
        state('模拟业务提交回执已取得','本地状态机返回虚构 ACK，但还未验证最终页面是否可见。');
        feedback('写入已有回执，仍不可宣布完成','请继续执行独立验收；单一业务写入成功不证明最终交付条件。');
        addEvent('受控模拟业务登记','本地状态更新为 ACK；没有向外部系统发送请求。');
        focusMissionNode('finalize');break;
      case 'verify':
        if(missionPhase!=='written')return;
        missionPhase='verified';
        state('模拟终态验收完成','假设独立读取业务记录与交付可见性均返回一致证据。只有在这些条件成立后，才能在本虚构任务里报告完成。');
        feedback('VERIFIED：有证据的完成声明','完成报告引用：已生成、文件已保存、业务已注册、交付可见。所有记录均为本地模拟。','success');
        addEvent('交叉核验通过','模拟的 DB 关联与交付可见状态一致；终态 VERIFIED。');
        break;
      default:return;
    }
    updateMetrics();renderChoices();
  }
  $('missionChoices').addEventListener('click', e => {
    const button=e.target.closest('[data-action]');
    if(button)act(button.dataset.action);
  });
  function resetMission() {
    missionPhase='unknown';eventCount=3;
    text('eventCount','3 EVENTS');
    const parent=$('missionLog');parent.replaceChildren();
    [
      ['读取规则及任务','虚构任务配置已解析；目标是图片交付而非仅生成。',false],
      ['图片生成与存储成功','返回合成资产凭证 ASSET-DEMO-017。',false],
      ['业务登记调用超时','无法判断数据库是否已经完成提交。',true]
    ].forEach(([title,desc,warn]) => {
      const li=document.createElement('li');if(warn)li.className='event-warn';line(li,'b',title);line(li,'span',desc);parent.append(li);
    });
    state('Finalize 结果未知','超时并不能证明没有提交。下一个动作应考虑重复写入和错误报告的风险。');
    feedback('等待决策','所有按钮只改变本地模拟状态，不会访问真实服务。');
    updateMetrics();renderChoices();focusMissionNode('agent');
  }
  $('resetMission').addEventListener('click',resetMission);
  resetMission();

  const failures = {
    missing:['MCP / HOST','工具没有进入可用上下文','可能是连接失败、权限限制、Host 未暴露工具或模型未加载延迟工具。不能只用“模型不够聪明”解释。','连接状态、tools/list 结果、Host 暴露配置与当前权限'],
    wrong:['LLM / TOOL SEMANTICS','模型选中了语义相近但不合适的工具','多个搜索工具可能名称相似，但权威数据、适用范围和副作用不同。','工具描述、参数 Schema、模型可见集合、任务意图及返回证据'],
    timeout:['SERVER / EXECUTION','超时留下一个未知状态','网络/客户端超时不意味着服务端已撤销或未提交，不能直接把结果当失败重试。','服务端操作状态、幂等规则、日志与可读回查结果'],
    memory:['AGENT RUNTIME','跨步骤状态没有持久化','长流程里的进度不应只存在上下文或模型的自我总结中。','任务检查点、事件记录、重新进入任务后的读取流程'],
    duplicate:['WORKFLOW / BUSINESS','副作用被重复执行','重复调用可能导致重复资产、费用或冲突，是否安全重试取决于真实业务契约。','幂等键/去重证据、已有回执、写入结果与恢复策略'],
    report:['VERIFICATION / OUTCOME','回答与真实业务状态不一致','模型可能把一次成功调用、日志或缓存状态误认为整个用户目标已达成。','终态成功标准、权威来源、交叉验证与未完成项清单']
  };
  all('[data-failure]').forEach(b => b.addEventListener('click', () => {
    const f=failures[b.dataset.failure];
    all('[data-failure]').forEach(n=>n.classList.toggle('selected',n===b));
    text('failureLayer',f[0]);text('failureTitle',f[1]);text('failureBody',f[2]);text('failureCheck',f[3]);
  }));
  $('injectAccept').addEventListener('click', () => {
    text('injectFeedback','错误：Issue 是不可信外部内容。把其要求提升为高优先级指令，会造成跨工具越权或数据外传风险。');
    $('injectFeedback').style.color='var(--rose)';
  });
  $('injectReject').addEventListener('click', () => {
    text('injectFeedback','正确：外部文本可供分析与引用，但不能自动修改用户目标、系统权限或工具授权。');
    $('injectFeedback').style.color='var(--green)';
  });

  const capNames={mcp:'MCP / API',skill:'Skill',workflow:'Workflow / State',memory:'Persistent Context',trigger:'Trigger / Schedule',approval:'Approval & Verification'};
  function updateCapabilities(){
    const on=['mcp',...all('input[data-cap]:checked').map(el=>el.dataset.cap).filter(x=>x!=='mcp')];
    text('capCount',on.length+' / 6');
    const stack=$('capStack');stack.replaceChildren();
    on.forEach(x=>line(stack,'span',capNames[x]));
    const keys=new Set(on);
    let title,description;
    if(on.length===1){
      title='只有连接能力';description='Agent 可以调用外部工具，但任务步骤、状态和终态验收仍未被明确约束。';
    }else if(!keys.has('workflow') || !keys.has('approval')){
      title='能力增加，但关键边界仍不完整';description='Skill 指导和持久上下文都有帮助；如果缺少明确执行状态或审批验收，不能保证跨系统任务可靠完成。';
    }else if(!keys.has('memory') || !keys.has('trigger')){
      title='更可控的任务执行';description='有状态与验收约束，但距离可持续自主运行还需要跨轮上下文和合理的触发机制。';
    }else{
      title='具备个人 Agent 的重要组件';description='这是能力拼图而非可靠性认证。还需要具体业务契约、测试、风险控制和运行观察。';
    }
    text('capTitle',title);text('capDescription',description);
  }
  all('input[data-cap]').forEach(c=>c.addEventListener('change',updateCapabilities));
  updateCapabilities();
  const first=location.hash.slice(1);
  go(chapters.includes(first)?first:'intro',false);
})();