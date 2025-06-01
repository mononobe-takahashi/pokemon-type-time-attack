import { GameConfig } from "./game-config";
import { random_sort } from "./utils";


type TPokemonType = 
  | 'ノーマル' | 'ほのお' | 'みず' | 'でんき' | 'くさ' | 'こおり'
  | 'かくとう' | 'どく' | 'じめん' | 'ひこう' | 'エスパー' | 'むし'
  | 'いわ' | 'ゴースト' | 'ドラゴン' | 'あく' | 'はがね' | 'フェアリー';

type TPokemonTypeEffective = {
  [key in TPokemonType]: {
    super: TPokemonType[] // 相手に対して効果ばつぐん
    normal: TPokemonType[] // 相手に対して等倍
    not_very_to: TPokemonType[] // 相手に対して効果いまひとつ
    not_very_from: TPokemonType[] // 相手から効果ばつぐん
    no: TPokemonType[] // 相手に対して効果なし
  };
};

type TMode = 'super' | 'normal' | 'not_very_to' | 'not_very_from' | 'no';
type TMultiMode = TMode | 'multi';


export class PokemonType {
  private readonly POKEMON_TYPES: TPokemonType[] = [
    'ノーマル','ほのお','みず','でんき','くさ',
    'こおり','かくとう','どく','じめん','ひこう',
    'エスパー','むし','いわ','ゴースト','ドラゴン',
    'あく','はがね','フェアリー',
  ];

  private readonly pokemon_type_effective: TPokemonTypeEffective = {
    ノーマル: {
      super: [],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり', 'ひこう', 'エスパー', 'むし', 'いわ', 'ドラゴン', 'あく', 'フェアリー'],
      not_very_to: ['いわ', 'はがね'],
      not_very_from: ['かくとう'],
      no: ['ゴースト'],
    },
    ほのお: {
      super: ['くさ', 'こおり', 'むし', 'はがね'],
      normal: ['ノーマル', 'でんき', 'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'ゴースト', 'あく', 'フェアリー'],
      not_very_to: ['ほのお', 'みず', 'いわ', 'ドラゴン'],
      not_very_from: ['みず', 'じめん', 'いわ'],
      no: [],
    },
    みず: {
      super: ['ほのお', 'じめん', 'いわ'],
      normal: ['ノーマル', 'かくとう', 'ひこう', 'エスパー', 'むし', 'ゴースト', 'あく', 'フェアリー'],
      not_very_to: ['みず', 'くさ', 'ドラゴン'],
      not_very_from: ['でんき', 'くさ'],
      no: [],
    },
    でんき: {
      super: ['みず', 'ひこう'],
      normal: ['ノーマル', 'ほのお', 'かくとう', 'どく', 'エスパー', 'むし', 'ゴースト', 'あく', 'フェアリー'],
      not_very_to: ['でんき', 'くさ', 'ドラゴン'],
      not_very_from: ['じめん'],
      no: ['じめん'],
    },
    くさ: {
      super: ['みず', 'じめん', 'いわ'],
      normal: ['ノーマル', 'かくとう', 'エスパー', 'ゴースト', 'あく', 'フェアリー'],
      not_very_to: ['ほのお', 'くさ', 'どく', 'ひこう', 'むし', 'ドラゴン', 'はがね'],
      not_very_from: ['ほのお', 'こおり', 'どく', 'ひこう', 'むし'],
      no: [],
    },
    こおり: {
      super: ['くさ', 'じめん', 'ひこう', 'ドラゴン'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'かくとう', 'どく', 'エスパー', 'むし', 'ゴースト', 'あく', 'フェアリー'],
      not_very_to: ['ほのお', 'みず', 'こおり', 'はがね'],
      not_very_from: ['ほのお', 'かくとう', 'いわ', 'はがね'],
      no: [],
    },
    かくとう: {
      super: ['ノーマル', 'こおり', 'いわ', 'あく', 'はがね'],
      normal: ['ほのお', 'みず', 'でんき', 'くさ', 'じめん', 'かくとう', 'ドラゴン'],
      not_very_to: ['どく', 'ひこう', 'エスパー', 'むし', 'フェアリー'],
      not_very_from: ['ひこう', 'エスパー', 'フェアリー'],
      no: ['ゴースト'],
    },
    どく: {
      super: ['くさ', 'フェアリー'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'こおり', 'かくとう', 'ひこう', 'エスパー', 'むし', 'ドラゴン', 'あく'],
      not_very_to: ['どく', 'じめん', 'いわ', 'ゴースト'],
      not_very_from: ['じめん', 'エスパー'],
      no: ['はがね'],
    },
    じめん: {
      super: ['ほのお', 'でんき', 'どく', 'いわ', 'はがね'],
      normal: ['ノーマル', 'みず', 'くさ', 'こおり', 'エスパー', 'ゴースト', 'あく', 'フェアリー', 'かくとう', 'むし', 'ドラゴン'],
      not_very_to: ['くさ', 'むし'],
      not_very_from: ['みず', 'くさ', 'こおり'],
      no: ['ひこう'],
    },
    ひこう: {
      super: ['くさ', 'かくとう', 'むし'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'こおり', 'どく', 'エスパー', 'いわ', 'ゴースト', 'ドラゴン', 'あく', 'フェアリー'],
      not_very_to: ['でんき', 'いわ', 'はがね'],
      not_very_from: ['でんき', 'こおり', 'いわ'],
      no: [],
    },
    エスパー: {
      super: ['かくとう', 'どく'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり', 'じめん', 'ひこう', 'いわ', 'ドラゴン', 'フェアリー'],
      not_very_to: ['エスパー', 'はがね'],
      not_very_from: ['むし', 'ゴースト', 'あく'],
      no: ['あく'],
    },
    むし: {
      super: ['くさ', 'エスパー', 'あく'],
      normal: ['ノーマル', 'みず', 'でんき', 'こおり', 'じめん', 'むし', 'いわ', 'ドラゴン'],
      not_very_to: ['ほのお', 'かくとう', 'どく', 'ひこう', 'ゴースト', 'はがね', 'フェアリー'],
      not_very_from: ['ほのお', 'ひこう', 'いわ'],
      no: [],
    },
    いわ: {
      super: ['ほのお', 'こおり', 'ひこう', 'むし'],
      normal: ['ノーマル', 'みず', 'でんき', 'くさ', 'エスパー', 'ゴースト', 'ドラゴン', 'あく', 'フェアリー'],
      not_very_to: ['かくとう', 'じめん', 'はがね'],
      not_very_from: ['かくとう', 'じめん', 'みず', 'くさ', 'はがね'],
      no: [],
    },
    ゴースト: {
      super: ['エスパー', 'ゴースト'],
      normal: ['ほのお', 'みず', 'でんき', 'くさ', 'こおり', 'かくとう', 'どく', 'じめん', 'ひこう', 'いわ', 'ドラゴン', 'あく', 'フェアリー'],
      not_very_to: ['あく'],
      not_very_from: ['ゴースト', 'あく'],
      no: ['ノーマル'],
    },
    ドラゴン: {
      super: ['ドラゴン'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'かくとう', 'どく', 'じめん', 'ひこう', 'エスパー', 'むし', 'いわ', 'ゴースト', 'あく'],
      not_very_to: ['はがね'],
      not_very_from: ['こおり', 'ドラゴン', 'フェアリー'],
      no: ['フェアリー'],
    },
    あく: {
      super: ['エスパー', 'ゴースト'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'くさ', 'こおり', 'どく', 'じめん', 'ひこう', 'いわ', 'ドラゴン', 'あく'],
      not_very_to: ['かくとう', 'あく', 'フェアリー'],
      not_very_from: ['かくとう', 'むし', 'フェアリー'],
      no: [],
    },
    はがね: {
      super: ['こおり', 'いわ', 'フェアリー'],
      normal: ['ノーマル', 'でんき', 'かくとう', 'ひこう', 'エスパー', 'ゴースト', 'ドラゴン', 'あく'],
      not_very_to: ['ほのお', 'みず', 'でんき', 'はがね'],
      not_very_from: ['ほのお', 'かくとう', 'じめん'],
      no: [],
    },
    フェアリー: {
      super: ['かくとう', 'ドラゴン', 'あく'],
      normal: ['ノーマル', 'ほのお', 'みず', 'でんき', 'こおり', 'じめん', 'ひこう', 'むし', 'いわ', 'ゴースト', 'フェアリー'],
      not_very_to: ['ほのお', 'どく', 'はがね'],
      not_very_from: ['どく', 'はがね'],
      no: ['ドラゴン'],
    },
  };

  // 引数で渡されたタイプ一覧または全タイプからランダムに１つタイプを返す
  private get_type = (filter_types?: TPokemonType[]) => {
    const types = filter_types && 0 < filter_types.length ? filter_types : this.POKEMON_TYPES;
    return types[Math.floor(Math.random() * types.length)];
  }

  private get_set_types = (count: number, types: TPokemonType[]) => {
    return random_sort(types).filter((_, idx) => idx < count)
  }

  // 複数のランダムタイプ生成（デフォルトは10）
  private get_types = (count: number = 10) => {
    return Array.from({ length: count }, () => this.get_type());
  }

  // 問タイプのモードにおける解タイプを取得
  private get_answer_type_by_mode = (type: TPokemonType, mode: TMode) => {
    // タイプ相性変数から問タイプのモードの一致する解タイプ一覧を取得
    const types_by_mode = this.pokemon_type_effective[type][mode]

    return {
      answer: types_by_mode ? types_by_mode[Math.floor(Math.random() * types_by_mode.length)] : null,
      answers: types_by_mode,
    }
  }

  private get_exclude_answers_types(types: TPokemonType[], num: number = 3) {
    const filter_types = this.POKEMON_TYPES.filter(f => !types.includes(f));
    return this.get_set_types(num, filter_types)
  }


  private generate_problem(type: TPokemonType, mode: TMode) {
    const answer = this.get_answer_type_by_mode(type, mode)
    const others = this.get_exclude_answers_types(answer.answers)
    const sorted_options = Array.from([answer.answer, ...others], (f, idx) => ({type: f, rand: Math.random() }))
      .sort((a, b) => a.rand - b.rand)
    
    return {
      question: type,
      mode: mode,
      answer: answer.answer,
      options: sorted_options.map(m => m.type ?? 'なし'),
    }
  }

  /**
   * @param mode string（super, normal, not_very_to, not_very_from, no, multiのいずれか）
   * @param count number（問題数）
   */
  public generate_problems = (mode: TMultiMode, count: number = 10) => {
    // 問題数分のタイプを取得
    const types = this.get_types(count);

    // 問タイプでループして、モードに適した解タイプを取得する
    const problems = types.map((type) => {
      return this.generate_problem(type, mode !== 'multi' ? mode : GameConfig.get_multi_mode() as TMode)
    });

    return problems;
  }
}

const type = new PokemonType();
// type.generate_problems('super', 5).map(p => console.log(JSON.stringify(p)))
// type.generate_problems('normal', 5).map(p => console.log(JSON.stringify(p)))
// type.generate_problems('not_very_from', 5).map(p => console.log(JSON.stringify(p)))
// type.generate_problems('not_very_to', 5).map(p => console.log(JSON.stringify(p)))
// type.generate_problems('no', 5).map(p => console.log(JSON.stringify(p)))
// type.generate_problems('multi', 5).map(p => console.log(JSON.stringify(p)))

['super', 'normal', 'not_very_to', 'not_very_from', 'no'].map(mode => {
  console.log("＊"+ mode)
  type.generate_problems(mode as TMode, 5).map(p => console.log(JSON.stringify(p)))
})