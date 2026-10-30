/* tjme v2 新功能：项目解剖台终端 / 实战手记渲染 / AI 分身对话 */
(function () {
  "use strict";
  const DATA = window.TJME_DATA || {};

  /* ============ 1. 项目解剖台：仿终端 ============ */
  const modal = document.querySelector("#terminal-modal");
  const termBody = document.querySelector("#terminal-body");
  const termTitle = document.querySelector("#terminal-title");
  const termInput = document.querySelector("#terminal-input");
  let currentProject = null;

  function termLine(html, cls) {
    const div = document.createElement("div");
    div.className = "tline" + (cls ? " " + cls : "");
    div.innerHTML = html;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
    return div;
  }

  function typeLine(text, cls, speed) {
    return new Promise((resolve) => {
      const div = termLine("", cls);
      let i = 0;
      const timer = setInterval(() => {
        div.textContent = text.slice(0, i + 1);
        i += 1;
        termBody.scrollTop = termBody.scrollHeight;
        if (i >= text.length) {
          clearInterval(timer);
          resolve();
        }
      }, speed || 14);
    });
  }

  function esc(s) {
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  async function bootTerminal(project) {
    termBody.innerHTML = "";
    const t = project.terminal;
    for (const line of t.boot) {
      await typeLine(line, line.startsWith("$") ? "tcmd" : "tsys", 10);
      await new Promise((r) => setTimeout(r, 120));
    }
    termLine('<span class="thint">—— 架构决策记录 · 输入 help 查看命令 ——</span>');
    for (const d of t.decisions) {
      await new Promise((r) => setTimeout(r, 160));
      termLine('<span class="ttag">' + esc(d.tag) + "</span> " + esc(d.title), "tdtitle");
      termLine(esc(d.detail), "tdetail");
    }
    termLine('<span class="thint">命令：stack（技术栈） · metrics（关键指标） · decisions（再看决策） · clear · exit</span>');
  }

  function openTerminal(projectId) {
    const project = DATA.projects.find((p) => p.id === projectId);
    if (!project || !modal) return;
    currentProject = project;
    termTitle.textContent = "zhangqing@" + projectId + " · " + project.name;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    bootTerminal(project);
    setTimeout(() => termInput && termInput.focus(), 100);
  }

  function closeTerminal() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
    if (termInput) termInput.value = "";
  }

  function runCommand(raw) {
    const cmd = (raw || "").trim().toLowerCase();
    if (!cmd) return;
    termLine('<span class="tprompt">visitor@tjme:~$</span> ' + esc(cmd), "tcmd");
    const t = currentProject && currentProject.terminal;
    if (!t) return;
    if (cmd === "help") {
      termLine("可用命令：stack · metrics · decisions · clear · exit");
    } else if (cmd === "stack") {
      termLine("技术栈：", "tdtitle");
      termLine(t.stack.map(esc).join("  ·  "), "tdetail");
    } else if (cmd === "metrics") {
      termLine("关键指标：", "tdtitle");
      t.metrics.forEach((m) => termLine(m[0] + "　→　" + esc(m[1]), "tdetail tmetric"));
    } else if (cmd === "decisions") {
      t.decisions.forEach((d) => {
        termLine('<span class="ttag">' + esc(d.tag) + "</span> " + esc(d.title), "tdtitle");
        termLine(esc(d.detail), "tdetail");
      });
    } else if (cmd === "clear") {
      termBody.innerHTML = "";
    } else if (cmd === "exit" || cmd === "q" || cmd === "quit") {
      closeTerminal();
    } else {
      termLine("command not found: " + esc(cmd) + "（试试 help）", "terr");
    }
  }

  document.querySelectorAll("[data-project]").forEach((card) => {
    card.addEventListener("click", () => openTerminal(card.dataset.project));
  });
  if (modal) {
    modal.querySelectorAll("[data-terminal-close]").forEach((el) => {
      el.addEventListener("click", closeTerminal);
    });
  }
  if (termInput) {
    termInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        runCommand(termInput.value);
        termInput.value = "";
      }
    });
  }
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && !modal.hidden) closeTerminal();
  });

  /* ============ 2. 实战手记 ============ */
  const notesGrid = document.querySelector("#notes-grid");
  if (notesGrid && Array.isArray(DATA.notes)) {
    DATA.notes.forEach((n) => {
      const card = document.createElement("article");
      card.className = "note-card reveal";
      card.innerHTML =
        '<div class="note-meta"><span class="note-gua">' +
        esc(n.gua) +
        '</span><time>' + esc(n.date) + '</time><span class="note-min">' + esc(String(n.minutes)) + ' min</span></div>' +
        "<h3>" + esc(n.title) + "</h3>" +
        "<p>" + esc(n.summary) + "</p>" +
        '<div class="note-tags">' +
        (n.tags || []).map((tg) => "<span>#" + esc(tg) + "</span>").join("") +
        "</div>";
      observer && observer.observe(card);
      notesGrid.appendChild(card);
    });
  }

  /* ============ 3. AI 分身（预置问答版，LLM 接口留桩） ============ */
  const msgBox = document.querySelector("#avatar-messages");
  const chipBox = document.querySelector("#avatar-chips");
  const avatarInput = document.querySelector("#avatar-input");
  const avatarSend = document.querySelector("#avatar-send");
  const avatarStatus = document.querySelector("#avatar-status");

  function addMsg(text, who) {
    if (!msgBox) return;
    const div = document.createElement("div");
    div.className = "amsg " + who;
    const bubble = document.createElement("div");
    bubble.className = "abubble";
    bubble.textContent = text;
    div.appendChild(bubble);
    msgBox.appendChild(div);
    msgBox.scrollTop = msgBox.scrollHeight;
  }

  /* LLM 接口桩：部署后端后把这里改为 fetch('/api/avatar/chat') */
  async function askAvatar(question) {
    if (window.TJME_AVATAR_ENDPOINT) {
      try {
        const res = await fetch(window.TJME_AVATAR_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question: question }),
        });
        const data = await res.json();
        return data.reply || DATA.avatarFallback;
      } catch (e) {
        return "（网络异常，请稍后再试）" + DATA.avatarFallback;
      }
    }
    /* 本地关键词匹配版 */
    await new Promise((r) => setTimeout(r, 420 + Math.random() * 400));
    const q = question.toLowerCase();
    let best = null;
    let bestScore = 0;
    (DATA.avatarQA || []).forEach((item) => {
      let score = 0;
      item.keywords.forEach((kw) => {
        if (q.includes(kw.toLowerCase())) score += kw.length;
      });
      if (score > bestScore) {
        bestScore = score;
        best = item;
      }
    });
    return best ? best.reply : DATA.avatarFallback;
  }

  let avatarBusy = false;
  async function sendAvatar() {
    if (!avatarInput || avatarBusy) return;
    const q = avatarInput.value.trim();
    if (!q) return;
    avatarInput.value = "";
    addMsg(q, "user");
    avatarBusy = true;
    if (avatarStatus) avatarStatus.textContent = "推演中…";
    const reply = await askAvatar(q);
    addMsg(reply, "bot");
    avatarBusy = false;
    if (avatarStatus) avatarStatus.textContent = "分身在线";
    if (avatarInput) avatarInput.focus();
  }

  if (avatarSend) avatarSend.addEventListener("click", sendAvatar);
  if (avatarInput) {
    avatarInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") sendAvatar();
    });
  }
  if (chipBox) {
    const chips = ["做过什么项目？", "Java 功底如何？", "Agent 经验有哪些？", "MCP 网关是什么？", "挑战我"];
    chips.forEach((c) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "chip";
      b.textContent = c;
      b.addEventListener("click", () => {
        if (avatarInput) {
          avatarInput.value = c;
          sendAvatar();
        }
      });
      chipBox.appendChild(b);
    });
  }
  if (msgBox) {
    addMsg("你好，我是张庆的分身 ☯ 可以问我他的项目经历、Java 功底、Agent 经验，或输入「挑战我」听听他踩过的坑。", "bot");
  }
})();
