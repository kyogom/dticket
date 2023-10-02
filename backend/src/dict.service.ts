const dict = {
  'ようこそ%sさん': {
    ja: 'ようこそ%sさん',
    en: '%s, Welcome to DiscordTicket',
  },
};

class DictService {
  private lang: string;
  constructor(lang: string) {
    this.lang = lang;
  }
  t = (key: keyof typeof dict, s: string[]) => {
    return this.replaceString(
      this.lang === 'ja' ? dict[key]['ja'] : dict[key]['en'],
      s,
    );
  };

  replaceString(str: string, replacements: string[]): string {
    let index = 0;
    return str.replace(/%s/g, () => replacements[index++]);
  }
}

export default DictService;
