const config = window.AI_SHARING_CONFIG;
const lang = config.lang;
const app = document.getElementById('app');
const activeAttr = code => code === lang ? ' aria-current="page"' : '';
const langLinks = () => `<nav class="lang-switcher" aria-label="Language">
  <a href="${config.langLinks.zhCN}" lang="zh-CN"${activeAttr('zh-CN')}>简中</a>
  <a href="${config.langLinks.zhTW}" lang="zh-TW"${activeAttr('zh-TW')}>繁中</a>
  <a href="${config.langLinks.en}" lang="en"${activeAttr('en')}>EN</a>
</nav>`;

function renderLanding() {
  const d = window.AI_SHARING_CONTENT.landing;
  document.body.className = 'landing';
  app.innerHTML = `<div class="container">
    <header class="nav">
      <div class="brand">AI Sharing</div>
      <div class="nav-actions">${langLinks()}<a class="repo" href="https://github.com/xinhailxq/ai-sharing-pages" target="_blank" rel="noreferrer">GitHub Repository</a></div>
    </header>
    <main>
      <section class="hero"><span class="eyebrow">PUBLIC KNOWLEDGE &amp; PRACTICE</span><h1>${d.hero}</h1><p>${d.intro}</p></section>
      <section class="topics"><h2 class="section-title">${d.topics}</h2><a class="card" href="${config.topicHref}"><div><span class="tag">Topic 01 · ChatGPT Products</span><h2>${d.title}</h2><p>${d.summary}</p></div><div class="visual"><div class="trio"><div class="pill">Chat</div><div class="pill">Work</div><div class="pill">Codex</div></div></div></a></section>
    </main>
    <footer>AI Sharing · Maintained by xinhailxq</footer>
  </div>`;
}

function cardsHtml(cards) {
  return cards.map((c,i)=>`<article class="card ${['chat','work','codex'][i]} reveal"><div class="tag">${c[0]}</div><h3>${c[1]}</h3><p>${c[2]}</p><ul>${c[3].map(x=>`<li>${x}</li>`).join('')}</ul></article>`).join('');
}
function flowsHtml(flows) {
  return flows.map((f,i)=>{const cls=['chat','work','codex'][i];return `<div class="task-view ${i===0?'active ':''}${cls}-view" data-view="${cls}"><div class="flow"><h3>${f[0]}</h3><div class="steps">${f[1].map((x,n)=>`<div class="step"><span class="num">${n+1}</span><span>${x}</span></div>`).join('')}</div></div><div class="outcome"><h3>${f[2]}</h3><div class="big">${f[3]}</div><p>${f[4]}</p></div></div>`}).join('');
}
function renderTopic() {
  const d=window.AI_SHARING_CONTENT.topic;
  document.body.className='topic';
  const boundaryCards=d.boundary_cards.map(x=>`<article class="diagram-card"><h3>${x[0]}</h3><p>${x[1]}</p><strong>${x[2]}</strong></article>`).join('');
  const choices=d.choices.map((x,i)=>`<label class="choice"><input type="radio" name="goal" value="${x[0]}" ${i===0?'checked':''}><span><strong>${x[1]}</strong><br><small>${x[2]}</small></span></label>`).join('');
  const rows=d.table_rows.map(r=>`<tr>${r.map(x=>`<td>${x}</td>`).join('')}</tr>`).join('');
  const faqs=d.faqs.map(x=>`<details><summary>${x[0]}</summary><p>${x[1]}</p></details>`).join('');
  const rules=d.rules.map(x=>`<div class="rule"><strong>${x[0]}</strong>${x[1]}</div>`).join('');
  app.innerHTML = `<header class="topbar"><div class="container nav"><a class="brand" href="${config.homeHref}">AI Sharing · 01</a><div class="nav-actions"><nav class="nav-links"><a href="#products">${d.nav[0]}</a><a href="#same-task">${d.nav[1]}</a><a href="#chat-boundary">${d.nav[2]}</a><a href="#chooser">${d.nav[3]}</a></nav>${langLinks()}<button class="theme-toggle" id="themeToggle">${d.theme}</button></div></div></header>
  <main id="top">
    <section class="hero"><div class="container"><span class="eyebrow">Chat · Work · Codex</span><h1>${d.hero}</h1><p>${d.hero_intro}</p><div class="hero-quote"><div class="quote chat">${d.quotes[0]}</div><div class="quote work">${d.quotes[1]}</div><div class="quote codex">${d.quotes[2]}</div></div></div></section>
    <section id="products"><div class="container"><div class="section-head reveal"><div class="kicker">${d.position_kicker}</div><h2>${d.position_title}</h2><p>${d.position_intro}</p></div><div class="cards3">${cardsHtml(d.cards)}</div></div></section>
    <section id="same-task"><div class="container"><div class="section-head reveal"><div class="kicker">${d.same_kicker}</div><h2>${d.same_title}</h2><p>${d.same_intro}</p></div><div class="same-task reveal"><div class="prompt">${d.prompt}</div><div class="tabs" role="tablist"><button class="tab" aria-selected="true" data-product="chat">${d.tabs[0]}</button><button class="tab" aria-selected="false" data-product="work">${d.tabs[1]}</button><button class="tab" aria-selected="false" data-product="codex">${d.tabs[2]}</button></div>${flowsHtml(d.flows)}</div></div></section>
    <section id="chat-boundary"><div class="container"><div class="section-head reveal"><div class="kicker">${d.boundary_kicker}</div><h2>${d.boundary_title}</h2><p>${d.boundary_intro}</p></div><div class="diagram reveal">${boundaryCards}</div><div class="boundary reveal"><strong>${d.boundary_note}</strong> ${d.boundary_text}</div></div></section>
    <section><div class="container"><div class="section-head reveal"><div class="kicker">${d.case_kicker}</div><h2>${d.case_title}</h2><p>${d.case_intro}</p></div><div class="case"><div class="panel reveal"><h3>${d.case_left_title}</h3><pre><code>git clone https://github.com/user/repo.git
cp presentation.pptx repo/topic/
git add .
git commit -m "Add presentation"
git push</code></pre><p>${d.case_left_text}</p></div><div class="panel reveal"><h3>${d.case_right_title}</h3><pre><code>read local file
→ create_blob
→ create_tree
→ create_commit
→ update_ref</code></pre><p>${d.case_right_text}</p></div></div></div></section>
    <section id="chooser"><div class="container"><div class="section-head reveal"><div class="kicker">${d.chooser_kicker}</div><h2>${d.chooser_title}</h2><p>${d.chooser_intro}</p></div><div class="decision reveal"><div class="decision-card"><div class="choices">${choices}</div></div><div class="recommend" id="recommend" data-result="chat"><small>${d.recommend_label}</small><h3 id="resultName">Chat</h3><p id="resultReason">${d.reasons.chat}</p></div></div></div></section>
    <section><div class="container"><div class="section-head reveal"><div class="kicker">${d.compare_kicker}</div><h2>${d.compare_title}</h2></div><div class="reveal table-wrap"><table class="comparison"><thead><tr>${d.table_headers.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows}</tbody></table></div><div class="faq reveal">${faqs}</div></div></section>
    <section><div class="container"><div class="final reveal"><div class="kicker">${d.final_kicker}</div><h2>${d.final_title}</h2><div class="rules">${rules}</div></div></div></section>
    <section><div class="container sources"><h2>${d.sources}</h2><ul><li><a href="https://help.openai.com/en/articles/20001275/" target="_blank" rel="noreferrer">ChatGPT Work and Codex</a></li><li><a href="https://help.openai.com/en/articles/8437071-data-analysis-with-chatgpt" target="_blank" rel="noreferrer">Data analysis with ChatGPT</a></li><li><a href="https://help.openai.com/en/articles/11487775-connectors-in" target="_blank" rel="noreferrer">Apps in ChatGPT</a></li><li><a href="https://help.openai.com/en/articles/11369540/" target="_blank" rel="noreferrer">Using Codex with your ChatGPT plan</a></li></ul><p>${d.source_note}</p></div></section>
  </main><footer><div class="container">${d.footer}</div></footer>`;

  document.querySelectorAll('.tab').forEach(tab=>tab.addEventListener('click',()=>{document.querySelectorAll('.tab').forEach(x=>x.setAttribute('aria-selected','false'));document.querySelectorAll('.task-view').forEach(x=>x.classList.remove('active'));tab.setAttribute('aria-selected','true');document.querySelector(`[data-view="${tab.dataset.product}"]`).classList.add('active')}));
  document.querySelectorAll('input[name="goal"]').forEach(input=>input.addEventListener('change',()=>{const r=input.value,box=document.getElementById('recommend');box.dataset.result=r;document.getElementById('resultName').textContent={chat:'Chat',work:'Work',codex:'Codex'}[r];document.getElementById('resultReason').textContent=d.reasons[r]}));
  const toggle=document.getElementById('themeToggle'),saved=localStorage.getItem('ai-sharing-theme');if(saved)document.documentElement.dataset.theme=saved;toggle.addEventListener('click',()=>{const next=document.documentElement.dataset.theme==='dark'?'light':'dark';document.documentElement.dataset.theme=next;localStorage.setItem('ai-sharing-theme',next)});
  const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('visible')}),{threshold:.1});document.querySelectorAll('.reveal').forEach(el=>observer.observe(el));
}

if(config.page==='landing')renderLanding();else renderTopic();
