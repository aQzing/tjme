const readings = {
  qian: {
    title: "乾 · Java 架构",
    body: "乾为天，代表系统视野。这里对应 Java 后端、分布式服务、企业级平台架构与稳定交付能力。",
    scene: "高级 Java 工程能力",
    link: "#capabilities",
    tone: "#4a90e2",
  },
  kun: {
    title: "坤 · 工程根基",
    body: "坤为地，代表承载。8 年企业级研发经验、业务建模、平台建设和长期稳定交付，是我做 AI 工程化的底盘。",
    scene: "经历与工程风格",
    link: "#about",
    tone: "#8b7d6b",
  },
  zhen: {
    title: "震 · 业务平台",
    body: "震为雷，代表行动与落地。综合营销、分销、数据中台、报表系统，都是从复杂需求到可运行平台的突破。",
    scene: "项目组合",
    link: "#projects",
    tone: "#f5a623",
  },
  xun: {
    title: "巽 · AI 辅助研发",
    body: "巽为风，代表流动与协作。Codex、Claude、Hermes 被我纳入需求澄清、代码生成、重构、测试和文档链路。",
    scene: "研发工作流",
    link: "#contact",
    tone: "#7ed321",
  },
  kan: {
    title: "坎 · Agent 工程化",
    body: "坎为水，代表穿透复杂问题。Spring AI、LangChain4j、Google ADK、工具调用、记忆和规划都在这里汇合。",
    scene: "Agent Lab",
    link: "#agent-lab",
    tone: "#50e3c2",
  },
  li: {
    title: "离 · 多模态应用",
    body: "离为火，代表识别与照亮。AI 多模态聊天、流程图助手和模型输出结构化，让需求、图形与业务工具连接起来。",
    scene: "AI 应用项目",
    link: "#projects",
    tone: "#ff6b6b",
  },
  gen: {
    title: "艮 · MCP 网关",
    body: "艮为山，代表边界与秩序。AI-MCP 网关把 HTTP 服务包装为 MCP 工具，并处理鉴权、参数校验、限流和审计。",
    scene: "MCP 与工具生态",
    link: "#agent-lab",
    tone: "#9013fe",
  },
  dui: {
    title: "兑 · 开放合作",
    body: "兑为泽，代表连接。适合高级 Java、AI Agent、Java 架构、企业 AI 应用、MCP/工具平台等方向交流合作。",
    scene: "联系与机会",
    link: "#contact",
    tone: "#bd10e0",
  },
};

const root = document.documentElement;
const buttons = document.querySelectorAll(".trigram");
const title = document.querySelector("#reading-title");
const body = document.querySelector("#reading-body");
const scene = document.querySelector("#reading-scene");
const link = document.querySelector("#reading-link");
const readingCard = document.querySelector(".reading-card");
const orbit = document.querySelector(".taiji-orbit");

function setReading(button) {
  const reading = readings[button.dataset.key];
  buttons.forEach((item) => {
    item.classList.remove("active");
    item.setAttribute("aria-pressed", "false");
  });
  button.classList.add("active", "pop");
  button.setAttribute("aria-pressed", "true");
  button.addEventListener("animationend", () => button.classList.remove("pop"), { once: true });

  title.textContent = reading.title;
  body.textContent = reading.body;
  scene.textContent = reading.scene;
  link.href = reading.link;
  readingCard.style.setProperty("--tone", reading.tone);
  readingCard.classList.remove("flash");
  void readingCard.offsetWidth;
  readingCard.classList.add("flash");
}

function spawnRipple(x, y, tone = "#35f2db") {
  const ripple = document.createElement("span");
  ripple.className = "ripple";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.setProperty("--tone", tone);
  document.body.appendChild(ripple);
  ripple.addEventListener("animationend", () => ripple.remove(), { once: true });
}

buttons.forEach((button) => {
  button.addEventListener("click", (event) => {
    setReading(button);
    spawnRipple(event.clientX, event.clientY, readings[button.dataset.key].tone);
  });
});

document.addEventListener("pointermove", (event) => {
  root.style.setProperty("--mx", `${event.clientX}px`);
  root.style.setProperty("--my", `${event.clientY}px`);
});

document.addEventListener("pointerdown", (event) => {
  document.body.classList.add("is-pressing");
  spawnRipple(event.clientX, event.clientY, "#ff3434");
});

document.addEventListener("pointerup", () => {
  document.body.classList.remove("is-pressing");
});

document.querySelectorAll("a, button, .tilt-card").forEach((element) => {
  element.addEventListener("pointerenter", () => document.body.classList.add("is-hovering"));
  element.addEventListener("pointerleave", () => document.body.classList.remove("is-hovering"));
});

document.querySelectorAll(".tilt-card").forEach((card) => {
  card.addEventListener("pointermove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 12}deg) translateY(-6px)`;
  });
  card.addEventListener("pointerleave", () => {
    card.style.transform = "";
  });
});

if (orbit) {
  orbit.addEventListener("pointermove", (event) => {
    const rect = orbit.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    orbit.style.transform = `rotateX(${y * -8}deg) rotateY(${x * 8}deg)`;
  });
  orbit.addEventListener("pointerleave", () => {
    orbit.style.transform = "";
  });
}

document.querySelectorAll(".section, .article-card, .project-card, .timeline li").forEach((element) => {
  element.classList.add("reveal");
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.14 },
);

document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));

const canvas = document.querySelector(".energy-canvas");
const context = canvas.getContext("2d");
let width = 0;
let height = 0;
let pointer = { x: window.innerWidth * 0.72, y: window.innerHeight * 0.46 };
const particles = [];

function resizeCanvas() {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * ratio;
  canvas.height = height * ratio;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
}

function createParticles() {
  particles.length = 0;
  const amount = Math.min(76, Math.max(38, Math.floor(window.innerWidth / 18)));
  for (let index = 0; index < amount; index += 1) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.34,
      vy: (Math.random() - 0.5) * 0.34,
      r: Math.random() * 1.6 + 0.6,
      hue: Math.random() > 0.5 ? "53, 242, 219" : "255, 52, 52",
    });
  }
}

function drawParticles() {
  context.clearRect(0, 0, width, height);
  particles.forEach((particle, index) => {
    const dx = pointer.x - particle.x;
    const dy = pointer.y - particle.y;
    const distance = Math.hypot(dx, dy);
    if (distance < 190) {
      particle.vx -= dx * 0.000006;
      particle.vy -= dy * 0.000006;
    }

    particle.x += particle.vx;
    particle.y += particle.vy;
    particle.vx *= 0.994;
    particle.vy *= 0.994;

    if (particle.x < -20) particle.x = width + 20;
    if (particle.x > width + 20) particle.x = -20;
    if (particle.y < -20) particle.y = height + 20;
    if (particle.y > height + 20) particle.y = -20;

    context.beginPath();
    context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
    context.fillStyle = `rgba(${particle.hue}, 0.75)`;
    context.fill();

    for (let otherIndex = index + 1; otherIndex < particles.length; otherIndex += 1) {
      const other = particles[otherIndex];
      const linkDistance = Math.hypot(particle.x - other.x, particle.y - other.y);
      if (linkDistance < 118) {
        context.beginPath();
        context.moveTo(particle.x, particle.y);
        context.lineTo(other.x, other.y);
        context.strokeStyle = `rgba(255, 248, 234, ${0.12 * (1 - linkDistance / 118)})`;
        context.lineWidth = 1;
        context.stroke();
      }
    }
  });

  requestAnimationFrame(drawParticles);
}

document.addEventListener("pointermove", (event) => {
  pointer = { x: event.clientX, y: event.clientY };
});

window.addEventListener("resize", () => {
  resizeCanvas();
  createParticles();
});

resizeCanvas();
createParticles();
drawParticles();
