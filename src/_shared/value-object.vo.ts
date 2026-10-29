/**
 * 値オブジェクトの抽象基底クラス
 */
export abstract class ValueObject<T> {

    /**
     * ブランド名。
     * 構造が偶然一致した他の値オブジェクトとはっきり区別するため。タグ。
     */
    abstract readonly brand: string;

    /**
     * 値。不変。
     */
    protected readonly _value: T;

    /**
     * コンストラクタ
     * @param value 
     */
    constructor(value: T) {
        this._value = Object.freeze(value);
    }

    /**
     * 等価性の判定。
     * 
     * @param other 
     */
    public equals(other?: ValueObject<T>): boolean {
        if (!other) return false;
        if (this === other) return true;
        if (this.brand !== other.brand) return false;

        return this.equalsValue(this._value, other._value);
    }

    /**
     * 値比較。これ以上の判定が必要な場合はオーバーライド。
     * 
     * @param a 
     * @param b 
     * @returns 
     */
    protected equalsValue(a: T, b: T): boolean {
        return Object.is(a, b);
    }
}