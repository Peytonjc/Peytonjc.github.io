const MICRO_READINGS = [
  {
    id: "mr-0001",
    topic: "morning routine",
    text: "朝六時に起きて、窓を開けると冷たい空気が入ってきます。顔を洗ってから温かいお茶を飲んで、台所を軽く片づけています。そのあと近くの公園までゆっくり散歩します。犬と歩いている人や、花に水をやっている人を見かけると、心が静かになります。こんな朝なら一日を落ち着く気持ちで始められると思います。帰り道で深く息をすると、頭の中まで明るくなります。",
    grammar_points: ["〜てから", "〜ています", "〜と思います"],
    key_vocab: [
      { word: "散歩", reading: "さんぽ", meaning: "walk" },
      { word: "空気", reading: "くうき", meaning: "air" },
      { word: "落ち着く", reading: "おちつく", meaning: "to feel calm" }
    ]
  },
  {
    id: "mr-0002",
    topic: "commute",
    text: "駅までの道は毎日同じですが、天気で気分が少し変わります。雨の日は傘を持って早めに出て、ぬれない道を選んで歩いています。晴れの日は小さい店の前で花を見ることが多いです。電車の中では音楽を聞きながら、今日の予定を手帳に書いています。短い通勤時間でも心の準備ができると思います。駅に着くころには表情も自然にやわらかくなっています。",
    grammar_points: ["〜ながら", "〜ています", "〜と思います"],
    key_vocab: [
      { word: "天気", reading: "てんき", meaning: "weather" },
      { word: "傘", reading: "かさ", meaning: "umbrella" },
      { word: "準備", reading: "じゅんび", meaning: "preparation" }
    ]
  },
  {
    id: "mr-0003",
    topic: "lunch break",
    text: "昼休みになると、会社の近くの小さな公園へ行きます。ベンチに座ってお弁当を食べてから、温かいコーヒーをゆっくり飲んでいます。最近は短い本を毎日少しずつ読んでいて、分からない言葉はノートに書いておきます。外の風を感じながら休むと、午後の仕事にも集中できると思います。食後に少し歩くので、体も重くなりにくいです。",
    grammar_points: ["〜てから", "〜んでいて", "〜と思います"],
    key_vocab: [
      { word: "昼休み", reading: "ひるやすみ", meaning: "lunch break" },
      { word: "弁当", reading: "べんとう", meaning: "boxed lunch" },
      { word: "午後", reading: "ごご", meaning: "afternoon" }
    ]
  },
  {
    id: "mr-0004",
    topic: "after work",
    text: "仕事が終わったあと、家に帰る前にスーパーへ寄ります。野菜や豆腐など、今夜使う物だけを買うようにしています。前は甘いお菓子もよく買っていましたが、今は必要な物を考えて選んでいます。買い物メモを見てからかごに入れると、無駄が少なくなります。小さい工夫ですが生活が整うと思います。冷蔵庫の中も見やすくなって、料理の時間が短くなりました。",
    grammar_points: ["〜ようにしています", "〜ています", "〜と思います"],
    key_vocab: [
      { word: "豆腐", reading: "とうふ", meaning: "tofu" },
      { word: "必要", reading: "ひつよう", meaning: "necessary" },
      { word: "生活", reading: "せいかつ", meaning: "daily life" }
    ]
  },
  {
    id: "mr-0005",
    topic: "cooking dinner",
    text: "夜は台所で簡単な料理を作ります。今日は野菜を切って、鍋でスープを作っています。火を止めてから味を見て、塩を少し足しました。ご飯ができるまでの間に皿を並べて、机の上もきれいにしています。時間がある日に自分で作ると、体にも心にもやさしい食事になると思います。温かい湯気を見るだけでも、疲れがゆっくり取れていきます。",
    grammar_points: ["〜ています", "〜てから", "〜と思います"],
    key_vocab: [
      { word: "台所", reading: "だいどころ", meaning: "kitchen" },
      { word: "鍋", reading: "なべ", meaning: "pot" },
      { word: "味", reading: "あじ", meaning: "flavor" }
    ]
  },
  {
    id: "mr-0006",
    topic: "evening study",
    text: "夕食のあと、机の上を片づけてから日本語の勉強を始めます。新しい文法を読んで、例文をノートに書いています。難しい時は五分だけ休んで、お茶を飲みながらもう一度見直します。毎日少しでも続けるようにしています。前より文章の形が分かるようになってきたので、この調子で進めたいと思います。勉強の前に深呼吸をすると、集中が続きやすくなりました。",
    grammar_points: ["〜てから", "〜ながら", "〜ようにしています", "〜と思います"],
    key_vocab: [
      { word: "机", reading: "つくえ", meaning: "desk" },
      { word: "文法", reading: "ぶんぽう", meaning: "grammar" },
      { word: "例文", reading: "れいぶん", meaning: "example sentence" }
    ]
  },
  {
    id: "mr-0007",
    topic: "rainy day",
    text: "朝から雨が降っていて、町の音がいつもより静かに聞こえます。今日は洗濯を外に干せないので、部屋の中に置いています。窓の近くで本を読んでいると、時間がゆっくり進むように感じます。昼ご飯のあとに温かいスープを作って、午後は無理をしないようにしています。雨の日は急がない過ごし方が合うと思います。明るい色のタオルを使うと、部屋の雰囲気が少し元気になります。",
    grammar_points: ["〜ていて", "〜ように感じます", "〜ようにしています", "〜と思います"],
    key_vocab: [
      { word: "洗濯", reading: "せんたく", meaning: "laundry" },
      { word: "窓", reading: "まど", meaning: "window" },
      { word: "過ごし方", reading: "すごしかた", meaning: "way of spending time" }
    ]
  },
  {
    id: "mr-0008",
    topic: "weekend cleaning",
    text: "週末の朝は、部屋の掃除から始めることが多いです。音楽を小さくかけながら、机や棚の上をゆっくりふいています。古い紙を整理してから、必要な物だけを元の場所へ戻します。終わったあとに窓を開けると、空気まで軽くなるように思います。短い時間でも掃除をすると気分がはっきりします。終わったあとに温かいお茶を飲むのも、週末の楽しみです。",
    grammar_points: ["〜ことが多いです", "〜ながら", "〜てから", "〜ように思います"],
    key_vocab: [
      { word: "掃除", reading: "そうじ", meaning: "cleaning" },
      { word: "棚", reading: "たな", meaning: "shelf" },
      { word: "整理", reading: "せいり", meaning: "organizing" }
    ]
  },
  {
    id: "mr-0009",
    topic: "bookstore visit",
    text: "午後に駅前の本屋へ行って、新しい小説を一冊買いました。店の二階には静かな読書の場所があって、少し座ってページをめくっています。気になる場面を読んでから家に帰ると、夜の楽しみが増えます。最近は寝る前に十分だけ読むようにしています。本を選ぶ時間は自分の気持ちを整える時間だと思います。読み終わった本を棚に並べると、静かな達成感があります。",
    grammar_points: ["〜んでから", "〜ています", "〜ようにしています", "〜と思います"],
    key_vocab: [
      { word: "本屋", reading: "ほんや", meaning: "bookstore" },
      { word: "小説", reading: "しょうせつ", meaning: "novel" },
      { word: "読書", reading: "どくしょ", meaning: "reading books" }
    ]
  },
  {
    id: "mr-0010",
    topic: "night walk",
    text: "夕方の食事のあと、近所を少し歩いています。昼より人が少なくて、道の空気もやわらかく感じます。公園の前を通ると、子どもの声のかわりに虫の音が聞こえてきます。歩きながら今日あったことを思い出して、明日の予定を考えています。短い散歩ですが、一日の終わりを静かに受け止める時間になると思います。家に戻って白い灯りを見ると、安心して休む準備ができます。",
    grammar_points: ["〜ています", "〜ながら", "〜と思います"],
    key_vocab: [
      { word: "近所", reading: "きんじょ", meaning: "neighborhood" },
      { word: "虫", reading: "むし", meaning: "insect" },
      { word: "終わり", reading: "おわり", meaning: "ending" }
    ]
  }
];
