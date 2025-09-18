import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["messages", "input", "status", "send"]

  connect() {
    this.typingElement = null
    this.knowledgeBase = this.buildKnowledgeBase()
    this.fallbackResponses = this.buildFallbackResponses()
    this.greet()

    if (this.hasInputTarget) {
      this.inputTarget.focus()
    }
  }

  submit(event) {
    event.preventDefault()
    const question = this.inputTarget.value.trim()

    if (!question) {
      return
    }

    this.addMessage(question, "user")
    this.inputTarget.value = ""
    this.respondTo(question)
  }

  greet() {
    const welcome = "ようこそ、寄生虫の世界へ。感染経路から研究の最前線まで、気になるテーマを教えてください。"
    const hint = "気になっている生物名や症状、予防策などをキーワードで入力すると、寄生虫コンシェルジュが解説します。"

    this.addMessage(welcome, "bot")
    this.addMessage(hint, "bot")
  }

  respondTo(question) {
    this.toggleInteraction(false)
    this.showTypingIndicator()

    const response = this.generateResponse(question)
    const delay = 600 + Math.random() * 900

    window.setTimeout(() => {
      this.hideTypingIndicator()
      this.addMessage(response, "bot")
      this.toggleInteraction(true)
    }, delay)
  }

  toggleInteraction(enabled) {
    this.inputTarget.disabled = !enabled

    if (this.hasSendTarget) {
      this.sendTarget.disabled = !enabled
    }

    if (this.hasStatusTarget) {
      this.statusTarget.textContent = enabled ? "オンライン" : "考え中…"
    }

    if (enabled) {
      this.inputTarget.focus()
    }
  }

  showTypingIndicator() {
    if (this.typingElement) {
      return
    }

    const wrapper = document.createElement("div")
    wrapper.classList.add("message", "bot-message", "typing-indicator")

    const bubble = document.createElement("div")
    bubble.classList.add("message-bubble")

    for (let index = 0; index < 3; index += 1) {
      const dot = document.createElement("span")
      dot.classList.add("typing-dot")
      bubble.appendChild(dot)
    }

    wrapper.appendChild(bubble)
    this.messagesTarget.appendChild(wrapper)
    this.typingElement = wrapper
    this.scrollToBottom()
  }

  hideTypingIndicator() {
    if (!this.typingElement) {
      return
    }

    this.typingElement.remove()
    this.typingElement = null
  }

  addMessage(text, author) {
    const wrapper = document.createElement("div")
    wrapper.classList.add("message", `${author}-message`)

    const bubble = document.createElement("div")
    bubble.classList.add("message-bubble")
    bubble.textContent = text

    const meta = document.createElement("time")
    meta.classList.add("message-meta")
    const timestamp = new Date()
    meta.dateTime = timestamp.toISOString()
    meta.textContent = timestamp.toLocaleTimeString("ja-JP", {
      hour: "2-digit",
      minute: "2-digit",
    })

    wrapper.appendChild(bubble)
    wrapper.appendChild(meta)

    this.messagesTarget.appendChild(wrapper)
    this.scrollToBottom()
  }

  scrollToBottom() {
    this.messagesTarget.scrollTop = this.messagesTarget.scrollHeight
  }

  generateResponse(question) {
    const normalized = question.toLowerCase()

    if (/こんにちは|こんばんは|おはよう|hi|hello|hey/.test(normalized)) {
      return "こんにちは。寄生虫にまつわる疑問があれば、遠慮なく聞いてください。"
    }

    if (/ありがとう|助か/i.test(normalized)) {
      return "お役に立ててうれしいです。気になることがあれば、引き続きどうぞ。"
    }

    if (/さようなら|またね|bye|see you/.test(normalized)) {
      return "またお会いしましょう。感染症対策はこまめな手洗いと正しい食品管理から。"
    }

    for (const entry of this.knowledgeBase) {
      if (entry.keywords.some((pattern) => pattern.test(normalized))) {
        return entry.response
      }
    }

    return this.randomFallback()
  }

  buildKnowledgeBase() {
    return [
      {
        keywords: [/生活環/, /ライフサイクル/, /life cycle/],
        response: "多くの寄生虫は複数の宿主を経由する生活環を持っています。例として、マラリア原虫は蚊とヒトを行き来しながら増殖し、成熟段階でそれぞれの体内環境を巧みに利用します。",
      },
      {
        keywords: [/予防/, /対策/, /防ぎ/],
        response: "寄生虫感染の基本的な予防策は、手洗い・食材の十分な加熱・安全な飲料水の確保です。特に魚介類は-20℃以下で24時間以上冷凍することでアニサキスなどのリスクを大幅に下げられます。",
      },
      {
        keywords: [/症状/, /体調/, /具合/, /symptom/],
        response: "寄生虫の種類によって症状はさまざまですが、腹痛・下痢・発熱・皮膚のかゆみなどがよく報告されています。強い症状や心配がある場合は自己判断せず医療機関を受診しましょう。",
      },
      {
        keywords: [/アニサキス/, /anisakis/],
        response: "アニサキスは主にサバやイカなどの生食で感染します。摂取後数時間で胃の激痛を引き起こすことがあり、内視鏡で虫体を摘出する治療が一般的です。加熱または冷凍で予防が可能です。",
      },
      {
        keywords: [/エキノコックス/, /echinococcus/],
        response: "エキノコックスはキツネなどの糞便を介して卵が撒かれ、ヒトが経口感染すると肝臓に嚢胞を作ります。北海道などの流行地域では野山で拾った山菜や水を生で口にしないことが重要です。",
      },
      {
        keywords: [/マラリア/, /plasmodium/],
        response: "マラリア原虫はハマダラカが媒介します。熱帯への渡航時には防蚊対策と抗マラリア薬の予防内服が推奨され、早期診断・治療で重症化を防ぎます。",
      },
      {
        keywords: [/寄生蜂/, /ゾンビ蟻/, /操/, /コントロール/, /操作/],
        response: "行動操作型寄生虫として有名なのがハリガネムシやゾンビアリ現象です。寄生虫は宿主の神経伝達を巧みに操り、次の宿主へ感染しやすい行動を引き出します。生態学の研究ではホルモン制御や遺伝子発現の変化が注目されています。",
      },
      {
        keywords: [/駆除/, /治療/, /薬/, /駆虫/, /treatment/],
        response: "駆虫薬には虫体の代謝や筋肉機能を狙うものが多く、メトロニダゾール、アルベンダゾール、プラジカンテルなどが代表例です。薬剤選択は寄生虫の種類と感染部位で異なるため、専門医の指示が必要です。",
      },
      {
        keywords: [/寄生虫学/, /研究/, /最新/, /アップデート/, /study/],
        response: "寄生虫学は医療だけでなく、生態系のバランスや進化の研究にも欠かせない分野です。近年はゲノム解析が進み、薬剤耐性や寄生適応の遺伝的背景が解明されつつあります。",
      },
      {
        keywords: [/寄生虫.*面白い/, /好き/, /興味/, /なんで.*大事/],
        response: "寄生虫は宿主との共生関係を通じて進化のダイナミクスを教えてくれる存在です。厳しい環境で生き抜く戦略や、宿主との複雑な相互作用は、生命の多様性そのものと言えます。",
      },
    ]
  }

  buildFallbackResponses() {
    return [
      "詳しい情報を探しています。もう少し具体的なキーワードや気になる寄生虫の名前を教えてください。",
      "寄生虫の生活史、症状、予防策など、知りたい観点を伝えていただければ、より的確にお答えできます。",
      "面白い観点ですね。関連する宿主や感染場所を教えていただくと、さらに深掘りした説明ができますよ。",
      "専門的な内容の場合は文献名や地域を指定すると調査のヒントになります。ぜひ追加情報をお願いします。",
    ]
  }

  randomFallback() {
    const index = Math.floor(Math.random() * this.fallbackResponses.length)
    return this.fallbackResponses[index]
  }
}
