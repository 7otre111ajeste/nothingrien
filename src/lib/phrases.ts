// Multi-language support — top global languages.
// Each language ships with the full i18n strings, click phrases, and a translated word for "nothing".

export const LANGS = ["en","fr","es","pt","de","it","ru","zh","ja","ko","hi","ar"] as const;
export type Lang = typeof LANGS[number];

export const LANG_META: Record<Lang, { label: string; flag: string; nothing: string }> = {
  en: { label: "english",    flag: "🇬🇧", nothing: "nothing" },
  fr: { label: "français",   flag: "🇫🇷", nothing: "rien" },
  es: { label: "español",    flag: "🇪🇸", nothing: "nada" },
  pt: { label: "português",  flag: "🇧🇷", nothing: "nada" },
  de: { label: "deutsch",    flag: "🇩🇪", nothing: "nichts" },
  it: { label: "italiano",   flag: "🇮🇹", nothing: "niente" },
  ru: { label: "русский",    flag: "🇷🇺", nothing: "ничего" },
  zh: { label: "中文",        flag: "🇨🇳", nothing: "无" },
  ja: { label: "日本語",       flag: "🇯🇵", nothing: "無" },
  ko: { label: "한국어",       flag: "🇰🇷", nothing: "무" },
  hi: { label: "हिन्दी",       flag: "🇮🇳", nothing: "कुछ नहीं" },
  ar: { label: "العربية",     flag: "🇸🇦", nothing: "لا شيء" },
};

// Click phrases — keep short, witty, in spirit of the "nothing" movement.
export const phrases: Record<Lang, string[]> = {
  en: [
    "still nothing.","wow. nothing happened.","groundbreaking.","a perfect nothing.",
    "your therapist would be proud.","nothing again? amazing.","you are doing great. doing nothing.",
    "the void approves.","this is the peak of human achievement.","press it again. trust me.",
    "no notification. no point. no problem.","you have unlocked: nothing.","the universe stays the same.",
    "100% nothing, 0% regret.","monks meditate for years to feel this.","doing nothing is also a choice.",
    "you are the chosen one. of nothing.","this could be your job, honestly.","less than zero stuff happened.",
    "the button approves of you.","nothing was harmed.","we counted it. it was nothing.",
    "investors are watching.","your dopamine: confused.","boredom: elevated.","productivity: undefined.",
    "another flawless nothing.","the algorithm cannot save you here.","you have transcended.",
    "the silence is loud.","absolutely zero loot.","you opened the app. for this.",
    "okay one more. last one. promise.","still here. still nothing.","this nothing is yours.",
    "nothing speaks every language.","welcome to the void.","press to receive: nothing.",
    "the world stops, briefly.","you've reached enlightenment level: 0.",
  ],
  fr: [
    "toujours rien.","wow. il s'est rien passé.","révolutionnaire.","un rien parfait.",
    "ta psy serait fière.","encore rien ? incroyable.","tu fais du bon boulot. à rien faire.",
    "le vide approuve.","le sommet de l'humanité.","réappuie. fais-moi confiance.",
    "pas de notif. pas de but. pas de soucis.","tu as débloqué : rien.","l'univers reste pareil.",
    "100% rien, 0% regret.","des moines méditent des années pour ça.","ne rien faire est aussi un choix.",
    "tu es l'élu. de rien.","ça pourrait être ton job, sincèrement.","moins que zéro chose s'est produite.",
    "le bouton t'approuve.","personne n'a été blessé.","on a compté. c'était rien.",
    "les investisseurs regardent.","ta dopamine : confuse.","ennui : élevé.","productivité : indéfinie.",
    "encore un rien impeccable.","l'algo peut pas te sauver ici.","tu as transcendé.",
    "le silence est fort.","absolument zéro loot.","tu as ouvert l'app. pour ça.",
    "ok un dernier. le dernier. promis.","toujours là. toujours rien.","ce rien est à toi.",
    "rien parle toutes les langues.","bienvenue dans le vide.","appuie pour recevoir : rien.",
    "le monde s'arrête, brièvement.","éveil niveau : 0.",
  ],
  es: [
    "todavía nada.","wow. no pasó nada.","revolucionario.","una nada perfecta.",
    "tu terapeuta estaría orgullosa.","¿otra vez nada? increíble.","lo haces genial. no haciendo nada.",
    "el vacío aprueba.","la cima de la humanidad.","púlsalo otra vez. confía.",
    "sin notificación. sin sentido. sin problema.","desbloqueaste: nada.","el universo sigue igual.",
    "100% nada, 0% arrepentimiento.","los monjes meditan años por esto.","no hacer nada también es una elección.",
    "eres el elegido. de nada.","esto podría ser tu trabajo, en serio.","menos que cero cosas pasaron.",
    "el botón te aprueba.","nadie salió herido.","lo contamos. fue nada.","tu dopamina: confundida.",
    "aburrimiento: alto.","productividad: indefinida.","otra nada impecable.","has trascendido.",
    "el silencio es fuerte.","cero loot absoluto.","abriste la app. para esto.",
    "ok una más. la última. lo juro.","sigues aquí. sigue siendo nada.","esta nada es tuya.",
    "nada habla todos los idiomas.","bienvenido al vacío.","pulsa para recibir: nada.",
    "el mundo se detiene, brevemente.","iluminación nivel: 0.","tu nada ha llegado.",
  ],
  pt: [
    "ainda nada.","uau. não aconteceu nada.","revolucionário.","um nada perfeito.",
    "sua terapeuta ficaria orgulhosa.","de novo nada? incrível.","você está indo bem. não fazendo nada.",
    "o vazio aprova.","o pico da humanidade.","aperta de novo. confia.",
    "sem notificação. sem sentido. sem problema.","você desbloqueou: nada.","o universo segue igual.",
    "100% nada, 0% arrependimento.","monges meditam anos por isso.","não fazer nada também é uma escolha.",
    "você é o escolhido. de nada.","isso podia ser seu trabalho, sério.","menos que zero coisas aconteceram.",
    "o botão te aprova.","ninguém se machucou.","contamos. era nada.","sua dopamina: confusa.",
    "tédio: elevado.","produtividade: indefinida.","outro nada impecável.","você transcendeu.",
    "o silêncio é alto.","zero loot absoluto.","você abriu o app. pra isso.",
    "ok mais um. o último. prometo.","ainda aqui. ainda nada.","este nada é seu.",
    "nada fala todas as línguas.","bem-vindo ao vazio.","aperte para receber: nada.",
    "o mundo para, brevemente.","iluminação nível: 0.",
  ],
  de: [
    "immer noch nichts.","wow. nichts ist passiert.","bahnbrechend.","ein perfektes nichts.",
    "deine therapeutin wäre stolz.","schon wieder nichts? unglaublich.","du machst das großartig. nichts tun.",
    "die leere stimmt zu.","der gipfel der menschheit.","drück nochmal. vertrau mir.",
    "keine notification. kein sinn. kein problem.","du hast freigeschaltet: nichts.","das universum bleibt gleich.",
    "100% nichts, 0% reue.","mönche meditieren jahre dafür.","nichts tun ist auch eine wahl.",
    "du bist der auserwählte. des nichts.","das könnte dein job sein, ehrlich.","weniger als null dinge sind passiert.",
    "der knopf stimmt dir zu.","niemand wurde verletzt.","wir haben es gezählt. es war nichts.",
    "deine dopamin: verwirrt.","langeweile: hoch.","produktivität: undefiniert.","noch ein makelloses nichts.",
    "du hast transzendiert.","die stille ist laut.","absolut null loot.","du hast die app geöffnet. dafür.",
    "okay noch einer. der letzte. versprochen.","immer noch da. immer noch nichts.","dieses nichts gehört dir.",
    "nichts spricht jede sprache.","willkommen in der leere.","drücken um zu empfangen: nichts.",
    "die welt steht kurz still.","erleuchtungsstufe: 0.",
  ],
  it: [
    "ancora niente.","wow. non è successo niente.","rivoluzionario.","un niente perfetto.",
    "il tuo terapeuta sarebbe fiero.","di nuovo niente? incredibile.","stai andando alla grande. a fare niente.",
    "il vuoto approva.","l'apice dell'umanità.","premi di nuovo. fidati.",
    "nessuna notifica. nessun senso. nessun problema.","hai sbloccato: niente.","l'universo resta uguale.",
    "100% niente, 0% rimpianti.","i monaci meditano anni per questo.","non fare niente è anche una scelta.",
    "sei il prescelto. del niente.","potrebbe essere il tuo lavoro, davvero.","meno di zero cose sono successe.",
    "il pulsante ti approva.","nessuno si è fatto male.","l'abbiamo contato. era niente.",
    "la tua dopamina: confusa.","noia: elevata.","produttività: indefinita.","un altro niente impeccabile.",
    "hai trasceso.","il silenzio è forte.","zero loot assoluto.","hai aperto l'app. per questo.",
    "ok un altro. l'ultimo. promesso.","ancora qui. ancora niente.","questo niente è tuo.",
    "niente parla ogni lingua.","benvenuto nel vuoto.","premi per ricevere: niente.",
    "il mondo si ferma, brevemente.","illuminazione livello: 0.",
  ],
  ru: [
    "всё ещё ничего.","вау. ничего не произошло.","революционно.","идеальное ничего.",
    "твой терапевт гордился бы.","снова ничего? потрясающе.","ты молодец. ничего не делаешь.",
    "пустота одобряет.","вершина человечества.","нажми ещё раз. поверь мне.",
    "без уведомлений. без смысла. без проблем.","ты разблокировал: ничего.","вселенная не изменилась.",
    "100% ничего, 0% сожалений.","монахи медитируют годами ради этого.","ничего не делать — тоже выбор.",
    "ты избранный. из ничего.","это могло бы быть твоей работой.","меньше нуля вещей произошло.",
    "кнопка тебя одобряет.","никто не пострадал.","мы посчитали. это было ничего.",
    "твой дофамин: в замешательстве.","скука: высокая.","продуктивность: не определена.",
    "ещё одно безупречное ничего.","ты вышел за пределы.","тишина громкая.","абсолютно ноль лута.",
    "ты открыл приложение. ради этого.","ладно ещё один. последний. обещаю.","всё ещё здесь. всё ещё ничего.",
    "это ничего твоё.","ничего говорит на всех языках.","добро пожаловать в пустоту.",
    "нажми, чтобы получить: ничего.","мир ненадолго остановился.","просветление уровень: 0.",
  ],
  zh: [
    "还是无。","哇。什么也没发生。","划时代。","完美的无。",
    "你的心理医生会为你骄傲。","又是无？太棒了。","你做得很好。什么也不做。",
    "虚空赞同。","人类成就的巅峰。","再按一次。相信我。",
    "无通知。无意义。无问题。","你解锁了：无。","宇宙不变。",
    "100% 无，0% 遗憾。","僧人冥想多年才能感受到。","什么也不做也是一种选择。",
    "你是被选中的。无的选民。","这真的可以是你的工作。","少于零的事情发生了。",
    "按钮赞同你。","无人受伤。","我们数了。是无。","多巴胺：困惑。",
    "无聊：升高。","生产力：未定义。","又一次完美的无。","你超脱了。",
    "寂静很响亮。","绝对零战利品。","你打开了应用。就为这个。",
    "好，再来一次。最后一次。我保证。","还在这里。还是无。","这份无属于你。",
    "无说所有语言。","欢迎来到虚空。","按下接收：无。","世界短暂停止。","开悟等级：0。",
  ],
  ja: [
    "まだ無。","わあ。何も起きなかった。","画期的だ。","完璧な無。",
    "セラピストが誇るだろう。","また無？すごい。","よくやってる。何もしないことを。",
    "虚無が認める。","人類の頂点。","もう一度押して。信じて。",
    "通知なし。意味なし。問題なし。","アンロックした：無。","宇宙は変わらない。",
    "100%の無、0%の後悔。","僧侶は何年も瞑想してこれを感じる。","何もしないのも選択。",
    "君は選ばれし者。無の。","これが君の仕事になり得る。","ゼロ未満の出来事。",
    "ボタンが君を認める。","誰も傷つかなかった。","数えた。無だった。",
    "ドーパミン：混乱中。","退屈：上昇。","生産性：未定義。","また完璧な無。",
    "君は超越した。","沈黙が大きい。","ルートはゼロ。","アプリを開いた。これのために。",
    "じゃあもう一回。最後。約束。","まだここに。まだ無。","この無は君のもの。",
    "無は全ての言語を話す。","虚無へようこそ。","押して受け取れ：無。",
    "世界が一瞬止まる。","悟りレベル：0。",
  ],
  ko: [
    "여전히 무.","와. 아무 일도 없었다.","획기적이다.","완벽한 무.",
    "치료사가 자랑스러워할 것이다.","또 무? 놀랍다.","잘하고 있어. 아무것도 안 하기를.",
    "공허가 인정한다.","인류의 정점.","다시 눌러. 날 믿어.",
    "알림 없음. 의미 없음. 문제 없음.","해제했다: 무.","우주는 그대로다.",
    "100% 무, 0% 후회.","스님들이 수년간 명상해서 느끼는 것.","아무것도 안 하는 것도 선택.",
    "넌 선택받은 자. 무의.","이게 네 직업이 될 수도.","0보다 적은 일이 일어났다.",
    "버튼이 널 인정한다.","아무도 다치지 않았다.","세어봤다. 무였다.",
    "도파민: 혼란.","지루함: 상승.","생산성: 미정의.","또 하나의 완벽한 무.",
    "초월했다.","침묵이 크다.","전리품 절대 영.","앱을 열었다. 이걸 위해.",
    "좋아 한 번 더. 마지막. 약속.","아직 여기. 아직 무.","이 무는 너의 것.",
    "무는 모든 언어를 한다.","공허에 온 것을 환영.","눌러서 받아라: 무.",
    "세상이 잠시 멈춘다.","깨달음 단계: 0.",
  ],
  hi: [
    "अभी भी कुछ नहीं।","वाह। कुछ नहीं हुआ।","क्रांतिकारी।","एक पूर्ण कुछ नहीं।",
    "तुम्हारे थेरेपिस्ट को गर्व होगा।","फिर कुछ नहीं? अद्भुत।","अच्छा कर रहे हो। कुछ नहीं करके।",
    "शून्य अनुमोदन करता है।","मानवता का शिखर।","फिर दबाओ। मुझ पर भरोसा करो।",
    "कोई नोटिफिकेशन नहीं। कोई मतलब नहीं। कोई समस्या नहीं।","तुमने अनलॉक किया: कुछ नहीं।","ब्रह्मांड वैसा ही है।",
    "100% कुछ नहीं, 0% पछतावा।","भिक्षु इसे महसूस करने के लिए वर्षों ध्यान करते हैं।","कुछ न करना भी एक विकल्प है।",
    "तुम चुने हुए हो। कुछ नहीं के।","ईमानदारी से, यह तुम्हारी नौकरी हो सकती है।","शून्य से कम चीजें हुईं।",
    "बटन तुम्हें मानता है।","किसी को चोट नहीं लगी।","हमने गिना। यह कुछ नहीं था।",
    "तुम्हारा डोपामिन: भ्रमित।","ऊब: उच्च।","उत्पादकता: अपरिभाषित।","एक और निर्दोष कुछ नहीं।",
    "तुमने पार कर लिया।","मौन तेज़ है।","बिल्कुल शून्य लूट।","तुमने ऐप खोला। इसके लिए।",
    "ठीक है एक और। आखिरी। वादा।","अभी भी यहाँ। अभी भी कुछ नहीं।","यह कुछ नहीं तुम्हारा है।",
    "कुछ नहीं हर भाषा बोलता है।","शून्य में स्वागत है।","दबाओ प्राप्त करने के लिए: कुछ नहीं।",
    "दुनिया क्षण भर रुकती है।","ज्ञानोदय स्तर: 0।",
  ],
  ar: [
    "لا شيء بعد.","واو. لم يحدث شيء.","ثوري.","لا شيء مثالي.",
    "معالجك سيكون فخوراً.","لا شيء مجدداً؟ مذهل.","تبلي حسناً. لا تفعل شيئاً.",
    "الفراغ يوافق.","قمة الإنسانية.","اضغط مجدداً. ثق بي.",
    "بلا إشعار. بلا معنى. بلا مشكلة.","لقد فتحت: لا شيء.","الكون كما هو.",
    "100% لا شيء، 0% ندم.","الرهبان يتأملون سنين لهذا.","عدم فعل شيء أيضاً اختيار.",
    "أنت المختار. للا شيء.","هذا قد يكون عملك، صدقاً.","أقل من صفر شيء حدث.",
    "الزر يوافق عليك.","لم يُؤذَ أحد.","عددناه. كان لا شيء.",
    "دوبامينك: مرتبك.","الملل: مرتفع.","الإنتاجية: غير محددة.","لا شيء آخر مثالي.",
    "لقد تجاوزت.","الصمت عالٍ.","غنيمة صفر تماماً.","فتحت التطبيق. لأجل هذا.",
    "حسناً واحد آخر. الأخير. أعدك.","لا تزال هنا. لا يزال لا شيء.","هذا اللاشيء لك.",
    "لا شيء يتكلم كل اللغات.","أهلاً بك في الفراغ.","اضغط لتستقبل: لا شيء.",
    "العالم يتوقف لحظياً.","مستوى التنوير: 0.",
  ],
};

type Strings = {
  streak: string; total: string; best: string; session: string;
  daily_badge: string; daily_done: string;
  boosts: string; boost_double: string; boost_shield: string; boost_vip: string;
  leaderboard: string; home: string; shop: string;
  period_24h: string; period_7d: string; period_30d: string; period_all: string;
  cat_streak: string; cat_session: string; cat_total: string; cat_received: string; cat_sent: string;
  you: string; rank: string;
  manifesto_title: string; manifesto_body: string;
  button: string; soon: string; pro: string; search: string;
  received_toast: string; nothings_recv: string; nothings_sent: string;
  profile: string; settings: string; avatar: string; upload: string; remove: string;
  quote: string; quote_ph: string; username: string; save: string; saved: string;
  username_taken: string; invalid_username: string; sign_out: string; member_since: string;
  my_stats: string; achievements: string; visit_profile: string; back: string;
  send_one_nothing: string; sent_count: string; received_count: string; language: string;
};

export const i18n: Record<Lang, Strings> = {
  en: { streak:"streak", total:"total", best:"best session", session:"session", daily_badge:"daily check-in", daily_done:"see you tomorrow", boosts:"boosts", boost_double:"double", boost_shield:"streak shield", boost_vip:"vip", leaderboard:"leaderboard", home:"home", shop:"shop", period_24h:"24h", period_7d:"7d", period_30d:"30d", period_all:"all time", cat_streak:"streak", cat_session:"session", cat_total:"total", cat_received:"received", cat_sent:"sent", you:"you", rank:"your rank", manifesto_title:"the nothing manifesto", manifesto_body:"we live in a world that begs you to do something. to optimize, to post, to grind. nothing is a quiet rebellion. press the button. it does nothing. that is the whole point. and it is glorious.", button:"nothing", soon:"coming soon", pro:"nothing pro", search:"search", received_toast:"you received a nothing", nothings_recv:"received", nothings_sent:"sent", profile:"profile", settings:"settings", avatar:"avatar", upload:"upload", remove:"remove", quote:"quote", quote_ph:"say nothing, beautifully…", username:"username", save:"save", saved:"saved", username_taken:"username taken", invalid_username:"3-20 chars, letters/numbers/_", sign_out:"sign out", member_since:"joined", my_stats:"stats", achievements:"achievements", visit_profile:"view profile", back:"back", send_one_nothing:"send 1 nothing", sent_count:"sent", received_count:"received", language:"language" },
  fr: { streak:"série", total:"total", best:"record session", session:"session", daily_badge:"check-in du jour", daily_done:"à demain", boosts:"boosts", boost_double:"double", boost_shield:"bouclier de série", boost_vip:"vip", leaderboard:"classement", home:"accueil", shop:"boutique", period_24h:"24h", period_7d:"7j", period_30d:"30j", period_all:"all time", cat_streak:"série", cat_session:"session", cat_total:"total", cat_received:"reçus", cat_sent:"envoyés", you:"toi", rank:"ton rang", manifesto_title:"le manifeste du rien", manifesto_body:"on vit dans un monde qui te supplie de faire quelque chose. d'optimiser, de poster, de produire. rien est une rébellion silencieuse. appuie sur le bouton. il ne fait rien. c'est tout l'intérêt. et c'est glorieux.", button:"rien", soon:"bientôt", pro:"nothing pro", search:"chercher", received_toast:"tu as reçu un rien", nothings_recv:"reçus", nothings_sent:"envoyés", profile:"profil", settings:"paramètres", avatar:"avatar", upload:"uploader", remove:"retirer", quote:"citation", quote_ph:"ne dis rien, joliment…", username:"username", save:"sauvegarder", saved:"sauvegardé", username_taken:"username déjà pris", invalid_username:"3-20 car, lettres/chiffres/_", sign_out:"déconnexion", member_since:"inscrit", my_stats:"stats", achievements:"succès", visit_profile:"voir le profil", back:"retour", send_one_nothing:"envoyer 1 rien", sent_count:"envoyés", received_count:"reçus", language:"langue" },
  es: { streak:"racha", total:"total", best:"mejor sesión", session:"sesión", daily_badge:"check-in diario", daily_done:"hasta mañana", boosts:"impulsos", boost_double:"doble", boost_shield:"escudo de racha", boost_vip:"vip", leaderboard:"clasificación", home:"inicio", shop:"tienda", period_24h:"24h", period_7d:"7d", period_30d:"30d", period_all:"siempre", cat_streak:"racha", cat_session:"sesión", cat_total:"total", cat_received:"recibidos", cat_sent:"enviados", you:"tú", rank:"tu rango", manifesto_title:"el manifiesto de nada", manifesto_body:"vivimos en un mundo que te suplica hacer algo. optimizar, postear, producir. nada es una rebelión silenciosa. pulsa el botón. no hace nada. ese es todo el punto. y es glorioso.", button:"nada", soon:"próximamente", pro:"nothing pro", search:"buscar", received_toast:"recibiste una nada", nothings_recv:"recibidos", nothings_sent:"enviados", profile:"perfil", settings:"ajustes", avatar:"avatar", upload:"subir", remove:"quitar", quote:"cita", quote_ph:"no digas nada, bellamente…", username:"usuario", save:"guardar", saved:"guardado", username_taken:"usuario tomado", invalid_username:"3-20 car, letras/números/_", sign_out:"cerrar sesión", member_since:"miembro desde", my_stats:"estadísticas", achievements:"logros", visit_profile:"ver perfil", back:"atrás", send_one_nothing:"enviar 1 nada", sent_count:"enviados", received_count:"recibidos", language:"idioma" },
  pt: { streak:"sequência", total:"total", best:"melhor sessão", session:"sessão", daily_badge:"check-in diário", daily_done:"até amanhã", boosts:"impulsos", boost_double:"duplo", boost_shield:"escudo de sequência", boost_vip:"vip", leaderboard:"ranking", home:"início", shop:"loja", period_24h:"24h", period_7d:"7d", period_30d:"30d", period_all:"sempre", cat_streak:"sequência", cat_session:"sessão", cat_total:"total", cat_received:"recebidos", cat_sent:"enviados", you:"você", rank:"sua posição", manifesto_title:"o manifesto do nada", manifesto_body:"vivemos num mundo que implora você fazer algo. otimizar, postar, produzir. nada é uma rebelião silenciosa. aperte o botão. ele não faz nada. essa é a ideia. e é glorioso.", button:"nada", soon:"em breve", pro:"nothing pro", search:"buscar", received_toast:"você recebeu um nada", nothings_recv:"recebidos", nothings_sent:"enviados", profile:"perfil", settings:"configurações", avatar:"avatar", upload:"enviar", remove:"remover", quote:"citação", quote_ph:"não diga nada, lindamente…", username:"usuário", save:"salvar", saved:"salvo", username_taken:"usuário em uso", invalid_username:"3-20 car, letras/números/_", sign_out:"sair", member_since:"membro desde", my_stats:"estatísticas", achievements:"conquistas", visit_profile:"ver perfil", back:"voltar", send_one_nothing:"enviar 1 nada", sent_count:"enviados", received_count:"recebidos", language:"idioma" },
  de: { streak:"serie", total:"gesamt", best:"beste sitzung", session:"sitzung", daily_badge:"tägliches check-in", daily_done:"bis morgen", boosts:"boosts", boost_double:"doppel", boost_shield:"serien-schild", boost_vip:"vip", leaderboard:"bestenliste", home:"start", shop:"shop", period_24h:"24h", period_7d:"7t", period_30d:"30t", period_all:"immer", cat_streak:"serie", cat_session:"sitzung", cat_total:"gesamt", cat_received:"erhalten", cat_sent:"gesendet", you:"du", rank:"dein rang", manifesto_title:"das nichts-manifest", manifesto_body:"wir leben in einer welt, die dich anfleht, etwas zu tun. zu optimieren, zu posten, zu schuften. nichts ist eine leise rebellion. drück den knopf. er tut nichts. das ist der ganze sinn. und es ist herrlich.", button:"nichts", soon:"bald", pro:"nothing pro", search:"suchen", received_toast:"du hast ein nichts erhalten", nothings_recv:"erhalten", nothings_sent:"gesendet", profile:"profil", settings:"einstellungen", avatar:"avatar", upload:"hochladen", remove:"entfernen", quote:"zitat", quote_ph:"sag nichts, schön…", username:"benutzername", save:"speichern", saved:"gespeichert", username_taken:"name vergeben", invalid_username:"3-20 zeichen, buchstaben/zahlen/_", sign_out:"abmelden", member_since:"dabei seit", my_stats:"statistiken", achievements:"erfolge", visit_profile:"profil ansehen", back:"zurück", send_one_nothing:"1 nichts senden", sent_count:"gesendet", received_count:"erhalten", language:"sprache" },
  it: { streak:"serie", total:"totale", best:"miglior sessione", session:"sessione", daily_badge:"check-in giornaliero", daily_done:"a domani", boosts:"boost", boost_double:"doppio", boost_shield:"scudo serie", boost_vip:"vip", leaderboard:"classifica", home:"home", shop:"shop", period_24h:"24h", period_7d:"7g", period_30d:"30g", period_all:"sempre", cat_streak:"serie", cat_session:"sessione", cat_total:"totale", cat_received:"ricevuti", cat_sent:"inviati", you:"tu", rank:"tua posizione", manifesto_title:"il manifesto del niente", manifesto_body:"viviamo in un mondo che ti implora di fare qualcosa. ottimizzare, postare, produrre. niente è una ribellione silenziosa. premi il pulsante. non fa niente. è proprio questo il punto. ed è glorioso.", button:"niente", soon:"presto", pro:"nothing pro", search:"cerca", received_toast:"hai ricevuto un niente", nothings_recv:"ricevuti", nothings_sent:"inviati", profile:"profilo", settings:"impostazioni", avatar:"avatar", upload:"carica", remove:"rimuovi", quote:"citazione", quote_ph:"non dire niente, in bellezza…", username:"username", save:"salva", saved:"salvato", username_taken:"username già preso", invalid_username:"3-20 car, lettere/numeri/_", sign_out:"esci", member_since:"iscritto", my_stats:"statistiche", achievements:"obiettivi", visit_profile:"vedi profilo", back:"indietro", send_one_nothing:"invia 1 niente", sent_count:"inviati", received_count:"ricevuti", language:"lingua" },
  ru: { streak:"серия", total:"всего", best:"лучшая сессия", session:"сессия", daily_badge:"ежедневный визит", daily_done:"до завтра", boosts:"усиления", boost_double:"двойной", boost_shield:"щит серии", boost_vip:"vip", leaderboard:"рейтинг", home:"главная", shop:"магазин", period_24h:"24ч", period_7d:"7д", period_30d:"30д", period_all:"всё время", cat_streak:"серия", cat_session:"сессия", cat_total:"всего", cat_received:"получено", cat_sent:"отправлено", you:"ты", rank:"твой ранг", manifesto_title:"манифест ничего", manifesto_body:"мы живём в мире, который умоляет нас что-то делать. оптимизировать, постить, пахать. ничего — это тихий бунт. нажми кнопку. она ничего не делает. в этом весь смысл. и это великолепно.", button:"ничего", soon:"скоро", pro:"nothing pro", search:"поиск", received_toast:"ты получил ничего", nothings_recv:"получено", nothings_sent:"отправлено", profile:"профиль", settings:"настройки", avatar:"аватар", upload:"загрузить", remove:"удалить", quote:"цитата", quote_ph:"скажи ничего, красиво…", username:"имя пользователя", save:"сохранить", saved:"сохранено", username_taken:"имя занято", invalid_username:"3-20 симв., буквы/цифры/_", sign_out:"выйти", member_since:"с нами с", my_stats:"статистика", achievements:"достижения", visit_profile:"профиль", back:"назад", send_one_nothing:"отправить 1 ничего", sent_count:"отправлено", received_count:"получено", language:"язык" },
  zh: { streak:"连续", total:"总计", best:"最佳会话", session:"会话", daily_badge:"每日签到", daily_done:"明天见", boosts:"加成", boost_double:"双倍", boost_shield:"连续护盾", boost_vip:"vip", leaderboard:"排行榜", home:"首页", shop:"商店", period_24h:"24小时", period_7d:"7天", period_30d:"30天", period_all:"全部", cat_streak:"连续", cat_session:"会话", cat_total:"总计", cat_received:"收到", cat_sent:"发送", you:"你", rank:"你的排名", manifesto_title:"无的宣言", manifesto_body:"我们生活在一个恳求你做些什么的世界。优化、发帖、奋斗。无是一种安静的反叛。按下按钮。它什么也不做。这就是全部意义。而且它是辉煌的。", button:"无", soon:"即将推出", pro:"nothing pro", search:"搜索", received_toast:"你收到了一个无", nothings_recv:"收到", nothings_sent:"发送", profile:"个人资料", settings:"设置", avatar:"头像", upload:"上传", remove:"移除", quote:"引言", quote_ph:"漂亮地什么都不说…", username:"用户名", save:"保存", saved:"已保存", username_taken:"用户名已用", invalid_username:"3-20字符，字母/数字/_", sign_out:"登出", member_since:"加入于", my_stats:"统计", achievements:"成就", visit_profile:"查看资料", back:"返回", send_one_nothing:"发送 1 个无", sent_count:"发送", received_count:"收到", language:"语言" },
  ja: { streak:"連続", total:"合計", best:"最高セッション", session:"セッション", daily_badge:"デイリーチェックイン", daily_done:"また明日", boosts:"ブースト", boost_double:"ダブル", boost_shield:"連続シールド", boost_vip:"vip", leaderboard:"ランキング", home:"ホーム", shop:"ショップ", period_24h:"24時間", period_7d:"7日", period_30d:"30日", period_all:"全期間", cat_streak:"連続", cat_session:"セッション", cat_total:"合計", cat_received:"受信", cat_sent:"送信", you:"あなた", rank:"あなたの順位", manifesto_title:"無のマニフェスト", manifesto_body:"私たちは何かをすることを懇願する世界に生きている。最適化、投稿、努力。無は静かな反抗。ボタンを押せ。何もしない。それが全ての意味。そしてそれは栄光だ。", button:"無", soon:"近日公開", pro:"nothing pro", search:"検索", received_toast:"無を受け取りました", nothings_recv:"受信", nothings_sent:"送信", profile:"プロフィール", settings:"設定", avatar:"アバター", upload:"アップロード", remove:"削除", quote:"引用", quote_ph:"美しく、何も言わないで…", username:"ユーザー名", save:"保存", saved:"保存しました", username_taken:"使用済み", invalid_username:"3-20文字、英数字/_", sign_out:"ログアウト", member_since:"参加日", my_stats:"統計", achievements:"実績", visit_profile:"プロフィール表示", back:"戻る", send_one_nothing:"無を1つ送る", sent_count:"送信", received_count:"受信", language:"言語" },
  ko: { streak:"연속", total:"총", best:"최고 세션", session:"세션", daily_badge:"일일 체크인", daily_done:"내일 봐요", boosts:"부스트", boost_double:"더블", boost_shield:"연속 방패", boost_vip:"vip", leaderboard:"랭킹", home:"홈", shop:"상점", period_24h:"24시간", period_7d:"7일", period_30d:"30일", period_all:"전체", cat_streak:"연속", cat_session:"세션", cat_total:"총", cat_received:"받음", cat_sent:"보냄", you:"너", rank:"너의 순위", manifesto_title:"무의 선언", manifesto_body:"우리는 무언가를 하라고 애원하는 세상에 산다. 최적화, 게시, 노력. 무는 조용한 반항이다. 버튼을 눌러라. 아무것도 하지 않는다. 그것이 전부다. 그리고 그것은 영광스럽다.", button:"무", soon:"곧 출시", pro:"nothing pro", search:"검색", received_toast:"무를 받았습니다", nothings_recv:"받음", nothings_sent:"보냄", profile:"프로필", settings:"설정", avatar:"아바타", upload:"업로드", remove:"제거", quote:"인용", quote_ph:"아름답게, 아무 말 없이…", username:"사용자명", save:"저장", saved:"저장됨", username_taken:"이미 사용 중", invalid_username:"3-20자, 문자/숫자/_", sign_out:"로그아웃", member_since:"가입일", my_stats:"통계", achievements:"업적", visit_profile:"프로필 보기", back:"뒤로", send_one_nothing:"무 1개 보내기", sent_count:"보냄", received_count:"받음", language:"언어" },
  hi: { streak:"लगातार", total:"कुल", best:"सर्वोत्तम सत्र", session:"सत्र", daily_badge:"दैनिक चेक-इन", daily_done:"कल मिलते हैं", boosts:"बूस्ट", boost_double:"दोगुना", boost_shield:"स्ट्रीक शील्ड", boost_vip:"वीआईपी", leaderboard:"लीडरबोर्ड", home:"होम", shop:"दुकान", period_24h:"24घं", period_7d:"7द", period_30d:"30द", period_all:"हमेशा", cat_streak:"लगातार", cat_session:"सत्र", cat_total:"कुल", cat_received:"प्राप्त", cat_sent:"भेजा", you:"तुम", rank:"तुम्हारी रैंक", manifesto_title:"कुछ नहीं का घोषणापत्र", manifesto_body:"हम एक ऐसी दुनिया में रहते हैं जो तुमसे कुछ करने की भीख माँगती है। अनुकूलित करो, पोस्ट करो, मेहनत करो। कुछ नहीं एक शांत विद्रोह है। बटन दबाओ। यह कुछ नहीं करता। यही पूरा बिंदु है। और यह शानदार है।", button:"कुछ नहीं", soon:"जल्द आ रहा है", pro:"नथिंग प्रो", search:"खोज", received_toast:"तुम्हें एक कुछ नहीं मिला", nothings_recv:"प्राप्त", nothings_sent:"भेजा", profile:"प्रोफ़ाइल", settings:"सेटिंग्स", avatar:"अवतार", upload:"अपलोड", remove:"हटाएं", quote:"उद्धरण", quote_ph:"कुछ मत कहो, खूबसूरती से…", username:"यूज़रनेम", save:"सहेजें", saved:"सहेजा गया", username_taken:"यूज़रनेम लिया गया", invalid_username:"3-20 अक्षर, अक्षर/अंक/_", sign_out:"साइन आउट", member_since:"सदस्य", my_stats:"आँकड़े", achievements:"उपलब्धियाँ", visit_profile:"प्रोफ़ाइल देखें", back:"वापस", send_one_nothing:"1 कुछ नहीं भेजें", sent_count:"भेजा", received_count:"प्राप्त", language:"भाषा" },
  ar: { streak:"سلسلة", total:"المجموع", best:"أفضل جلسة", session:"جلسة", daily_badge:"تسجيل يومي", daily_done:"إلى الغد", boosts:"تعزيزات", boost_double:"مضاعف", boost_shield:"درع السلسلة", boost_vip:"vip", leaderboard:"المتصدرون", home:"الرئيسية", shop:"المتجر", period_24h:"24س", period_7d:"7أ", period_30d:"30ي", period_all:"دائماً", cat_streak:"سلسلة", cat_session:"جلسة", cat_total:"المجموع", cat_received:"المستلمة", cat_sent:"المرسلة", you:"أنت", rank:"رتبتك", manifesto_title:"بيان اللاشيء", manifesto_body:"نحن نعيش في عالم يتوسل إليك أن تفعل شيئاً. أن تحسّن، أن تنشر، أن تكدّ. اللاشيء ثورة هادئة. اضغط الزر. لا يفعل شيئاً. هذه هي الفكرة كلها. وهي رائعة.", button:"لا شيء", soon:"قريباً", pro:"nothing pro", search:"بحث", received_toast:"استلمت لا شيء", nothings_recv:"المستلمة", nothings_sent:"المرسلة", profile:"الملف الشخصي", settings:"الإعدادات", avatar:"الصورة الرمزية", upload:"رفع", remove:"إزالة", quote:"اقتباس", quote_ph:"لا تقل شيئاً، بجمال…", username:"اسم المستخدم", save:"حفظ", saved:"تم الحفظ", username_taken:"الاسم مأخوذ", invalid_username:"3-20 حرف، أحرف/أرقام/_", sign_out:"تسجيل الخروج", member_since:"عضو منذ", my_stats:"الإحصائيات", achievements:"الإنجازات", visit_profile:"عرض الملف", back:"رجوع", send_one_nothing:"إرسال 1 لا شيء", sent_count:"مرسلة", received_count:"مستلمة", language:"اللغة" },
};
