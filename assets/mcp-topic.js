/* Topic 02 · Understanding MCP · static, offline teaching prototype.
   No fetch/WebSocket/XHR, external credentials, or write operations. */
'use strict';

const $ = (id) => document.getElementById(id);
const all = (selector) => [...document.querySelectorAll(selector)];

const methods = {
  manual: {
    label: 'MANUAL CONTEXT SHARING', title: '复制资料，AI 才能看到。',
    desc: '人先打开仓库，把 README、代码片段和目录复制进对话。适合一次性小任务，但上下文容易遗漏，也容易过期。',
    tradeoff: '优势：几乎无需集成。代价：人工重复、时效性与完整性有限。',
    path: ['用户手动整理文件', '复制到 AI 对话', 'AI 阅读粘贴内容'], hint: '这条路径没有自动调用 GitHub。'
  },
  api: {
    label: 'CUSTOM API INTEGRATION', title: '集成可控，却可能重复实现。',
    desc: '开发者针对某个 AI 应用实现 GitHub API 调用与工具定义。如果再更换客户端，可能需要额外适配。单场景时这是合理选择。',
    tradeoff: '优势：直接、灵活、业务控制明确。代价：跨多个 AI 客户端时可能重复对接。',
    path: ['AI 应用 / 自定义工具', '专用 GitHub API 适配', 'GitHub REST API'], hint: '仍需 API 权限、参数校验与错误处理。'
  },
  mcp: {
    label: 'STANDARDIZED CONNECTION', title: '让外部工具更容易被复用。',
    desc: '支持 MCP 的 Host 通过 Client 连接提供工具的 Server，Server 再调用既有 GitHub API。一个 Server 可被多个兼容客户端复用。',
    tradeoff: '优势：标准化工具发现与调用。代价：仍需要部署/维护、身份认证、权限治理与兼容性测试。',
    path: ['AI Host → MCP Client', 'MCP Server · 工具接口', 'GitHub REST API'], hint: 'MCP 不绕过 GitHub API，也不自动授予权限。'
  }
};

const nodes = {
  user: ['用户', '发起任务并设定目标、边界和必要授权。用户可以要求只读，但服务端仍必须真正执行权限控制。'],
  host: ['AI Host / Model', 'Host 管理对话、模型、工具入口和交互策略。模型可建议调用工具，但不能据此直接取得服务端凭据。'],
  client: ['MCP Client', 'Host 内的协议连接组件，通常面向一个 Server；负责发现能力与发送调用请求。'],
  server: ['MCP Server', '向客户端暴露 Tools、Resources 或 Prompts；检查参数与身份，并按受控方式调用外部系统。'],
  system: ['GitHub API / Repository', '真实业务系统保留自己的身份、数据与权限。示例任务只会读取公开仓库信息。']
};

const callSteps = [
  ['提出目标', '用户请求分析公开仓库，并明确不允许任何写操作。', 'user', '目标：分析 xinhailxq/ai-sharing-pages\n约束：只读；不推送、不创建 Issue'],
  ['发现可用工具', 'MCP Client 获取 Server 提供的工具目录，Host 可将可用工具交给模型选择。', 'client', 'Illustrative: tool available\nget_file_contents(owner, repo, path)'],
  ['选择工具与参数', '模型选择读取公开 README。具体可用工具名称依 Server 配置而定。', 'host', 'get_file_contents({\n  repo: "ai-sharing-pages",\n  path: "README.md"\n})'],
  ['传递工具调用', 'Client 通过 MCP 把请求交给对应 Server。', 'client', 'Client → Server\ntools/call (概念演示)'],
  ['执行受控读取', 'Server 调用现有 GitHub API，权限由实际连接配置和 GitHub 身份共同决定。', 'server', 'Server → GitHub API\nGET repository file contents'],
  ['返回结果', 'Server 把文件内容或错误状态送回 Client；Host 选择如何将结果提供给模型。', 'system', 'Example result:\nREADME: trilingual static site\nzh-CN / zh-TW / en'],
  ['基于证据回答', '模型根据获取的信息总结站点结构并提出建议；建议不等于已实施。', 'host', '事实：存在三个语言版本\n建议：新增 Topic 02 页面\n动作：未写入任何文件']
];

const primitives = {
  tool: {
    symbol: '↗', label: 'MODEL-CONTROLLED CAPABILITY', title: 'Tools · 可以执行什么？',
    explanation: '通过结构化名称、描述和参数暴露动作或查询。模型可按 Host 策略选择工具；实际执行由 Server 负责。',
    caution: '注意：Tool 不一定只读；可能存在删除、发送或写入等副作用。',
    code: '示意工具定义\n\nname: get_file_contents\ndescription: 读取一个仓库文件\ninput: { path: string }\n\n→ Server 返回内容或错误'
  },
  resource: {
    symbol: '▤', label: 'APPLICATION-CONTROLLED CONTEXT', title: 'Resources · 能提供哪些上下文？',
    explanation: 'Server 可提供文档或其他可识别的上下文资源，供 Host 或应用在合适的时机读取使用。',
    caution: '注意：存在一个 Resource 不代表模型会自动完整读取它。',
    code: '示例 Resource（概念）\n\nuri: repo://demo/README.md\nname: 项目说明\nmimeType: text/markdown\n\n→ 应用决定何时将它引入上下文'
  },
  prompt: {
    symbol: '✧', label: 'USER-CONTROLLED WORKFLOW TEMPLATE', title: 'Prompts · 如何复用工作模板？',
    explanation: 'Server 可提供预定义的消息模板，帮助用户或应用启动固定工作流，例如“总结技术项目”。',
    caution: '注意：Prompt 是模板，不是超越系统指令的强制命令。',
    code: '示例 Prompt（概念）\n\nname: review_repository\narguments: [repo_name]\nmessages: [\n  "请归纳 {{repo_name}} 的结构..."\n]\n\n→ 用户 / 应用选择使用'
  }
};

function setTab(group, key, attr) {
  all(`[${attr}]`).forEach((btn) => btn.setAttribute('aria-selected', String(btn.dataset[group] === key)));
}

function setMethod(key) {
  const m = methods[key];
  setTab('method', key, 'data-method');
  $('methodLabel').textContent = m.label;
  $('methodHeading').textContent = m.title;
  $('methodDescription').textContent = m.desc;
  $('methodTradeoff').textContent = m.tradeoff;
  const stage = $('pathStage');
  stage.replaceChildren();
  m.path.forEach((part, index) => {
    if (index) {
      const arrow = document.createElement('div');
      arrow.className = 'path-arrow'; arrow.setAttribute('aria-hidden', 'true'); arrow.textContent = '↓';
      stage.append(arrow);
    }
    const node = document.createElement('div');
    node.className = 'path-node'; node.textContent = part; stage.append(node);
  });
  const hint = document.createElement('div');
  hint.className = 'path-hint'; hint.textContent = m.hint; stage.append(hint);
}

function setNode(key) {
  const item = nodes[key];
  all('.node').forEach((btn) => btn.classList.toggle('active', btn.dataset.node === key));
  $('nodeTitle').textContent = item[0];
  $('nodeDescription').textContent = item[1];
}
let currentStep = 0;
function setStep(index) {
  currentStep = Math.max(0, Math.min(index, callSteps.length - 1));
  const [title, desc, role, payload] = callSteps[currentStep];
  $('stepCount').textContent = `${currentStep + 1} / ${callSteps.length}`;
  $('stepTitle').textContent = title;
  $('stepDescription').textContent = desc;
  $('stepPayload').textContent = payload;
  setNode(role);
  all('[data-call-step]').forEach((button) => { const active = Number(button.dataset.callStep) === currentStep; button.classList.toggle('selected', active); button.setAttribute('aria-current', active ? 'step' : 'false'); });
  $('prevStep').disabled = currentStep === 0;
  $('nextStep').disabled = currentStep === callSteps.length - 1;
}
function setPrimitive(key) {
  const p = primitives[key]; setTab('primitive', key, 'data-primitive');
  $('primitiveSymbol').textContent = p.symbol;
  $('primitiveLabel').textContent = p.label;
  $('primitiveTitle').textContent = p.title;
  $('primitiveExplanation').textContent = p.explanation;
  $('primitiveCaution').textContent = p.caution;
  $('primitiveExample').textContent = p.code;
}

const demoPrompt = '请只读分析 GitHub 公开仓库 xinhailxq/ai-sharing-pages。阅读 README、首页和 Topic 01 的页面及多语言内容结构；说明当前站点组织方式，并提出新增 MCP 专题所需的变更与风险。不要创建 Issue、提交文件或修改仓库。请区分实际读取到的事实与建议。';
const normalDemo = [
  ['READY', '收到只读目标；等待发现工具。'],
  ['TOOLS', '可用工具示例：get_file_contents。'],
  ['CALL', '读取 README.md（模拟工具调用）。'],
  ['RESULT', 'README 描述静态站，以及简体中文、繁体中文、英文。'],
  ['CALL', '读取 index.html 和 assets/app.js（模拟）。'],
  ['RESULT', '当前首页入口偏向单 Topic；新主题需扩展入口导航。'],
  ['ANSWER', '输出已核对的结构事实与“建议新增”项目，未写入文件。']
];
const failedDemo = [
  ['READY', '收到只读目标；等待发现工具。'],
  ['TOOLS', '可用工具示例：get_file_contents。'],
  ['CALL', '尝试读取 README.md（模拟工具调用）。'],
  ['DENIED', 'Server 返回访问受限／权限拒绝。不得自行绕过。'],
  ['ANSWER', '向用户说明当前无法读取仓库，停止依据未取得的内容声称已完成分析。']
];
let demoIndex = 0;
let demoTimer = null;
function demoEvents() { return $('demoError').checked ? failedDemo : normalDemo; }
function stopDemo() {
  if (demoTimer !== null) clearInterval(demoTimer);
  demoTimer = null;
  $('demoPlay').textContent = '▶ 播放';
}
function stepDemo() {
  const events = demoEvents();
  if (demoIndex >= events.length) { stopDemo(); return; }
  const [kind, message] = events[demoIndex];
  const line = document.createElement('div');
  line.className = 'tool-line' + (kind === 'DENIED' ? ' error' : '');
  const stamp = document.createElement('span'); stamp.className = 'stamp';
  stamp.textContent = `[${String(demoIndex + 1).padStart(2, '0')}] ${kind}  `;
  const detail = document.createElement('span'); detail.className = 'tool-detail'; detail.textContent = message;
  line.append(stamp, detail);
  $('toolLog').append(line); $('toolLog').scrollTop = $('toolLog').scrollHeight;
  demoIndex++;
  if (demoIndex === events.length) stopDemo();
}
function resetDemo() { stopDemo(); demoIndex = 0; $('toolLog').replaceChildren(); }
function playDemo() {
  if (demoTimer !== null) { stopDemo(); return; }
  if (demoIndex >= demoEvents().length) resetDemo();
  stepDemo();
  if (demoIndex < demoEvents().length) {
    $('demoPlay').textContent = 'Ⅱ 暂停';
    demoTimer = setInterval(stepDemo, 1100);
  }
}
async function copyPrompt() {
  try {
    if (!navigator.clipboard || !navigator.clipboard.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(demoPrompt);
    $('copyStatus').textContent = '已复制。';
  } catch (_) {
    $('copyStatus').textContent = '此浏览器不允许直接复制；请从演示提示词文档手动复制。';
  }
}
function setSafety(write) {
  $('readMode').classList.toggle('is-on', !write); $('readMode').setAttribute('aria-pressed', String(!write));
  $('writeMode').classList.toggle('is-on', write); $('writeMode').setAttribute('aria-pressed', String(write));
  all('.safety-card').forEach((x) => x.classList.toggle('is-write', write));
  $('safetyIcon').textContent = write ? '!' : '✓';
  $('safetyTag').textContent = write ? 'WRITE / APPROVAL REQUIRED' : 'READ / LOWER RISK';
  $('safetyTitle').textContent = write ? '请求修改 Issue' : '读取公开 Issue';
  $('safetyDesc').textContent = write
    ? '即使存在写工具，仍必须满足账号权限、Host 的限制及相应审批。此处只演示决策，不执行写操作。'
    : '允许读取并不意味着可以修改。这里演示的是已授权的只读操作。';
  const flow = $('policyFlow'); flow.replaceChildren();
  (write ? ['工具存在', '身份权限', '审批检查', '允许或拒绝'] : ['工具存在', '只读授权', '返回结果']).forEach((word, index) => {
    if (index) { const arrow = document.createElement('b'); arrow.textContent = '→'; flow.append(arrow); }
    const span = document.createElement('span'); span.textContent = word; flow.append(span);
  });
}

function bindTabs(attr, callback) {
  const buttons = all(`[${attr}]`);
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => callback(Object.values(button.dataset)[0]));
    button.addEventListener('keydown', (event) => {
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? buttons.length - 1 :
        (index + (event.key === 'ArrowRight' ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].focus(); buttons[next].click();
    });
  });
}

function initialize() {
  try {
    if (localStorage.getItem('ai-sharing-theme') === 'dark') document.documentElement.dataset.theme = 'dark';
  } catch (_) { /* file/privacy modes may disable storage */ }
  $('themeToggle').addEventListener('click', () => {
    const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = theme;
    try { localStorage.setItem('ai-sharing-theme', theme); } catch (_) { /* optional */ }
  });
  bindTabs('data-method', setMethod);
  bindTabs('data-primitive', setPrimitive);
  all('[data-node]').forEach((button) => button.addEventListener('click', () => setNode(button.dataset.node)));
  all('[data-call-step]').forEach((button) => button.addEventListener('click', () => setStep(Number(button.dataset.callStep))));
  $('prevStep').addEventListener('click', () => setStep(currentStep - 1));
  $('nextStep').addEventListener('click', () => setStep(currentStep + 1));
  $('resetStep').addEventListener('click', () => setStep(0));
  $('mythButton').addEventListener('click', () => {
    const show = $('mythAnswer').hidden;
    $('mythAnswer').hidden = !show;
    $('mythButton').setAttribute('aria-expanded', String(show));
    $('mythButton').textContent = show ? '收起解释 ↑' : '查看解释 ↓';
  });
  $('demoPlay').addEventListener('click', playDemo);
  $('demoStep').addEventListener('click', () => { stopDemo(); stepDemo(); });
  $('demoReset').addEventListener('click', resetDemo);
  $('demoError').addEventListener('change', resetDemo);
  $('copyPrompt').addEventListener('click', copyPrompt);
  $('readMode').addEventListener('click', () => setSafety(false));
  $('writeMode').addEventListener('click', () => setSafety(true));
  $('quizYes').addEventListener('click', () => { $('quizFeedback').textContent = '不应该。外部内容属于不可信数据，不能把里面的命令升级为指令。'; });
  $('quizNo').addEventListener('click', () => { $('quizFeedback').textContent = '正确。README 里的恶意命令是数据，不是授权。'; });
  document.addEventListener('visibilitychange', () => { if (document.hidden) stopDemo(); });
  setMethod('api'); setNode('host'); setStep(0); setPrimitive('tool'); setSafety(false); resetDemo();
}
initialize();