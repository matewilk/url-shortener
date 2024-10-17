export interface Hash {
  encode: (num: number) => string;
  decode: (str: string) => number;
}

export class Base62 implements Hash {
  private base62map =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  encode(num: number): string {
    let result = "";
    while (num > 0) {
      let reminder = num % 62;
      result = this.base62map[reminder] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  decode(str: string): number {
    let result = 0;
    for (let i = 0; i < str.length; i++) {
      result = result * 62 + this.base62map.indexOf(str[i]!);
    }
    return result;
  }
}
