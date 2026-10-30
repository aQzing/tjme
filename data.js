/* tjme 项目解剖台 & AI 分身 共用数据源
 * 维护说明：新增项目在 projects[] 加一项；新增手记在 notes[] 加一项；
 * 分身问答在 avatarQA[] 加 {keywords:[], reply:""}，命中任一关键词即回复。
 */
window.TJME_DATA = {
  projects: [
    {
      id: "A01",
      name: "综合营销系统",
      brief: "覆盖活动配置、优惠规则、用户触达、投放策略、效果追踪。",
      terminal: {
        boot: [
          "$ ssh zhangqing@marketing-platform",
          "已连接 · 综合营销系统 · 生产档案调取中...",
        ],
        decisions: [
          { tag: "决策 01", title: "活动规则引擎：JSON Schema 配置化", detail: "活动类型月均新增 3+，硬编码发版跟不上运营节奏。采用规则配置化 + Schema 校验，运营自助配活动，上线周期从 3 天压到 2 小时。" },
          { tag: "决策 02", title: "触达链路削峰：MQ 异步 + 优先级队列", detail: "大促触达峰值 10w+ msg/min，同步调用打爆下游。改 MQ 异步分优先级，触达成功率 97.2%，下游零雪崩。" },
          { tag: "决策 03", title: "效果追踪：曝光-点击-转化三段埋点对账", detail: "运营总问'钱花哪了'。三段埋点 + T+1 对账任务，归因口径与业务对齐，投放 ROI 可复盘。" },
          { tag: "踩坑", title: "优惠券超发", detail: "高并发下库存扣减超发 200 张。修复：DB 乐观锁 + Redis 预扣 + 对账兜底补偿，此后零超发。" },
        ],
        stack: ["Java 8/11", "Spring Boot", "MySQL", "Redis", "RocketMQ", "XXL-Job"],
        metrics: [
          ["活动配置上线周期", "3 天 → 2 小时"],
          ["大促触达峰值", "10w+ msg/min"],
          ["触达成功率", "97.2%"],
          ["优惠券超发事故", "修复后 0 起"],
        ],
      },
    },
    {
      id: "A02",
      name: "分销系统",
      brief: "渠道层级、佣金结算、订单归因、分润规则与风控校验。",
      terminal: {
        boot: [
          "$ ssh zhangqing@distribution-platform",
          "已连接 · 分销系统 · 生产档案调取中...",
        ],
        decisions: [
          { tag: "决策 01", title: "层级关系存储：闭包表 + 变更审计", detail: "分销层级深、关系变更频繁。闭包表方案让任意层级查询 O(1)，配合变更审计表，分润纠纷可回溯到任意历史时刻。" },
          { tag: "决策 02", title: "佣金结算：T+1 批处理 + 实时预览双轨", detail: "结算要准也要快。实时预览给业务看大概数，T+1 批处理出正式账，双轨对差，差错率降至 0.01% 以下。" },
          { tag: "决策 03", title: "分润规则 DSL", detail: "业务方分润花样每月翻新。抽了套轻量 DSL 让规则可配置，新规则上线不再排期发版。" },
          { tag: "踩坑", title: "订单归因重复", detail: "多渠道同时触达导致归因重复，佣金多发。引入归因唯一约束 + 幂等键，账务对平。" },
        ],
        stack: ["Java", "Spring Cloud", "MySQL", "ShardingSphere", "Redis", "Elastic-Job"],
        metrics: [
          ["任意层级关系查询", "O(1) 闭包表"],
          ["结算差错率", "< 0.01%"],
          ["新分润规则上线", "免发版"],
          ["月佣金结算量级", "百万级流水"],
        ],
      },
    },
    {
      id: "A03",
      name: "数据中台与报表系统",
      brief: "统一指标、数据模型、报表权限与查询服务。",
      terminal: {
        boot: [
          "$ ssh zhangqing@data-platform",
          "已连接 · 数据中台 · 生产档案调取中...",
        ],
        decisions: [
          { tag: "决策 01", title: "指标口径统一：指标字典 + 单一出口", detail: "各部门'同一个数对不上'。建指标字典，所有报表从统一查询服务取数，口径争议归零。" },
          { tag: "决策 02", title: "大报表查询：预聚合 + 查询下推", detail: "亿级明细直接查要 40s+。按维度预聚合 + 查询下推，P95 查询从 40s 降到 1.8s。" },
          { tag: "决策 03", title: "报表权限：行列双重控制", detail: "销售数据敏感。行级（数据范围）+ 列级（字段脱敏）双权限模型，一套报表服务全公司而数据不越界。" },
          { tag: "踩坑", title: "ETL 任务雪崩", detail: "凌晨 ETL 全量重跑挤爆数据库。改增量 + 分时调度 + 失败隔离，从此任务互不拖累。" },
        ],
        stack: ["Java", "ClickHouse", "MySQL", "Presto", "DolphinScheduler", "Redis"],
        metrics: [
          ["核心报表 P95 查询", "40s → 1.8s"],
          ["口径争议", "归零（指标字典）"],
          ["服务部门", "全公司多业务线"],
          ["ETL 凌晨雪崩", "隔离后 0 起"],
        ],
      },
    },
    {
      id: "AI1",
      name: "AI 多模态聊天",
      brief: "文字/图片识别 + 上下文回复，多模型调用统一编排。",
      terminal: {
        boot: [
          "$ ssh zhangqing@multimodal-chat",
          "已连接 · AI 多模态聊天 · 生产档案调取中...",
        ],
        decisions: [
          { tag: "决策 01", title: "模型路由层：按任务类型分流", detail: "不同任务成本差 20 倍。建模型路由层：OCR 走视觉模型、闲聊走小模型、复杂推理走旗舰模型，综合成本降 60%。" },
          { tag: "决策 02", title: "上下文管理：滑动窗口 + 摘要压缩", detail: "长对话 token 爆炸。滑动窗口 + 超限摘要压缩，长会话成本可控且不失忆。" },
          { tag: "决策 03", title: "安全边界：输入过滤 + 输出审计", detail: "ToB 场景红线多。输入侧敏感词/注入检测，输出侧审计日志，所有调用可追溯。" },
          { tag: "踩坑", title: "流式响应中断", title2: "", detail: "SSE 在网关层被缓冲导致假死。排查到 Nginx proxy_buffering，关掉后流式正常——AI 应用部署细节也是工程。" },
        ],
        stack: ["Spring AI", "LangChain4j", "OpenAI 兼容 API", "SSE", "Redis"],
        metrics: [
          ["模型调用成本", "路由后降 60%"],
          ["长会话 token", "窗口+摘要可控"],
          ["调用可追溯", "100% 审计日志"],
          ["流式首 token", "< 1s"],
        ],
      },
    },
    {
      id: "AI2",
      name: "AI 流程图助手",
      brief: "自然语言生成流程图/UML/时序图，支持二次编辑。",
      terminal: {
        boot: [
          "$ ssh zhangqing@diagram-assistant",
          "已连接 · AI 流程图助手 · 生产档案调取中...",
        ],
        decisions: [
          { tag: "决策 01", title: "结构化输出：JSON Schema 约束", detail: "让 LLM 直接出图会乱。约束模型输出结构化 JSON，前端按 Schema 渲染 Mermaid/自绘，图的语法正确率 99%+。" },
          { tag: "决策 02", title: "二次编辑：改 JSON 不改图", detail: "用户拖动节点后 AI 再生成会覆盖手工调整。方案：AI 只改语义层 JSON，布局层用户改动永久保留。" },
          { tag: "决策 03", title: "Prompt 版本化", detail: "提示词就是代码。版本化管理 + A/B 对比，每次调优有据可查可回滚。" },
          { tag: "踩坑", title: "复杂流程图节点爆炸", detail: "输入需求太长时图密密麻麻。加'分层生成'：先骨架后细节，可读性回来了。" },
        ],
        stack: ["LangChain4j", "结构化输出", "Mermaid", "Canvas/SVG"],
        metrics: [
          ["图语法正确率", "99%+（Schema 约束）"],
          ["手工编辑保留", "100%（双层架构）"],
          ["需求→图", "一句话 10 秒"],
          ["Prompt 迭代", "版本化可回滚"],
        ],
      },
    },
    {
      id: "AI3",
      name: "AI-MCP 网关",
      brief: "把企业 HTTP 服务包装为 MCP 工具，配置即用。",
      terminal: {
        boot: [
          "$ ssh zhangqing@mcp-gateway",
          "已连接 · AI-MCP 网关 · 生产档案调取中...",
        ],
        decisions: [
          { tag: "决策 01", title: "协议转换层：OpenAPI → MCP 自动映射", detail: "企业存量系统不可能为 AI 重构。解析 OpenAPI 规范自动生成 MCP tool 定义，配置即接入，零改造。" },
          { tag: "决策 02", title: "鉴权穿透：Agent 身份 → 业务权限", detail: "AI 不能绕过权限体系。网关层做身份映射，Agent 以用户身份调用，越权请求在网关拦截。" },
          { tag: "决策 03", title: "参数校验 + 限流 + 审计三件套", detail: "LLM 参数幻觉真实存在。Schema 严格校验拦截非法参数，工具级限流防失控，全链路审计。" },
          { tag: "踩坑", title: "工具描述质量决定调用质量", detail: "工具 description 写得含糊，模型就乱传参。把描述当 API 文档一样认真写，调用准确率显著提升——这是 MCP 落地最被低估的一环。" },
        ],
        stack: ["MCP Protocol", "Spring Boot", "OpenAPI 解析", "OAuth2", "Redis 限流"],
        metrics: [
          ["存量系统接入", "零改造（配置即用）"],
          ["越权请求", "网关层 100% 拦截"],
          ["参数幻觉拦截", "Schema 强校验"],
          ["全链路审计", "每次调用可追溯"],
        ],
      },
    },
  ],

  /* 实战手记：新文章往数组头部加 */
  notes: [
    {
      date: "2026-10-30",
      gua: "☶ 艮",
      title: "把存量系统接进 AI：MCP 网关的三个设计取舍",
      minutes: 6,
      summary: "企业不会为 AI 重构系统。记录 AI-MCP 网关落地中「自动映射 vs 手动登记」「鉴权穿透 vs 独立身份」「强校验 vs 宽容解析」三组取舍的决策过程。",
      tags: ["MCP", "架构决策"],
    },
    {
      date: "2026-10-26",
      gua: "☵ 坎",
      title: "LLM 参数幻觉不可怕，可怕的是没有 Schema 校验",
      minutes: 4,
      summary: "一次 Agent 传错日期参数导致批量数据误删的事故复盘：为什么提示词工程救不了参数幻觉，以及 Schema 强校验 + 白名单如何兜底。",
      tags: ["Agent", "稳定性"],
    },
    {
      date: "2026-10-19",
      gua: "☳ 震",
      title: "优惠券超发 200 张之后：并发扣减的三层防御",
      minutes: 5,
      summary: "大促压测通过≠生产安全。复盘超发事故：DB 乐观锁是底线、Redis 预扣是缓冲、对账补偿是兜底——三层各司其职，缺一层都睡不着觉。",
      tags: ["高并发", "踩坑"],
    },
  ],

  /* AI 分身预置问答（关键词匹配，后端接入后由 LLM 接管） */
  avatarQA: [
    { keywords: ["你好", "hi", "hello", "在吗", "你好啊"], reply: "你好！我是张庆的分身 ☯ 一个架在简历站上的 Agent。你可以问我：做过什么项目、Java 功底如何、Agent 经验、踩过什么坑，或者输入「挑战我」。" },
    { keywords: ["你是谁", "介绍", "分身"], reply: "我是张庆的 AI 分身。张庆是 8 年经验高级 Java 工程师 + AI Agent 开发者，专注企业级系统与 Agent 工程化落地。这个对话本身就是他 Agent 能力的 Demo——我由他的简历语料驱动。" },
    { keywords: ["java", "java功底", "java水平", "后端"], reply: "Java 是张庆的主场：8 年企业级研发，营销/分销/数据中台/报表等核心平台都上过生产。纵深覆盖服务拆分、事务一致性、缓存策略、高并发治理。想看证据？打开「项目作品」点任意卡片，终端里有真实决策记录。" },
    { keywords: ["agent", "智能体", "agent经验", "spring ai", "langchain", "adk"], reply: "Agent 是张庆现在的焦点：Spring AI、LangChain4j、Google ADK 三栈都有实战，做过工具调用、记忆管理、规划、多轮对话、结构化输出。代表作品是 AI-MCP 网关——让企业存量系统零改造接入 Agent 生态。问问「MCP」可以展开聊。" },
    { keywords: ["mcp", "网关", "工具生态"], reply: "AI-MCP 网关是张庆最有代表性的作品：解析 OpenAPI 自动生成 MCP 工具定义，企业系统配置即接入；鉴权穿透保证 Agent 以用户身份调用，参数 Schema 强校验拦截幻觉，全链路审计。一句话：让 AI 安全地用上公司的老系统。" },
    { keywords: ["坑", "失败", "翻车", "挑战我", "最失败"], reply: "敢问就敢答 ☯ 三个真实的：① 大促优惠券超发 200 张——此后 DB 乐观锁 + Redis 预扣 + 对账兜底三层防御成标配；② SSE 流式响应在网关被缓冲导致假死——排查到 Nginx proxy_buffering；③ ETL 凌晨雪崩——失败隔离 + 分时调度。翻车不可怕，复盘才是资产。" },
    { keywords: ["项目", "做过什么", "作品"], reply: "两大战线：① 企业级——综合营销（触达峰值 10w+/min）、分销（月佣金百万级流水）、数据中台（P95 查询 40s→1.8s）；② AI——多模态聊天、流程图助手、AI-MCP 网关。去「项目作品」点卡片，每个都能打开终端看架构决策记录。" },
    { keywords: ["联系方式", "联系", "合作", "招聘", "简历", "机会"], reply: "商务与机会沟通：itqzing@163.com。适合方向：高级 Java 工程师、AI Agent 开发、Java 架构师、企业 AI 应用研发、MCP/工具平台。页面底部「联系我」也有入口。" },
    { keywords: ["怎么实现的", "技术实现", "什么模型", "这个对话"], reply: "诚实版答案：当前版本是关键词匹配的预置问答（静态站先跑起来）；下一版接入 LLM API + 简历语料，支持自由提问。架构会开源在我的 GitHub。这个过程本身就是渐进式落地的实践：先上壳，再填核。" },
  ],
  avatarFallback: "这个问题超出了我的预置语料（当前是关键词匹配版）。你可以问：项目经历 / Java 功底 / Agent 经验 / MCP / 踩过什么坑 / 联系方式。LLM 版本上线后我就能自由作答了。",
};
