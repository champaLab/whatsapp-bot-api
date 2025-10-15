export default (BigInt.prototype as any).toJSON = function () {
    try {
        return parseInt(this.toString())
    } catch (e) { }

    return this.toString()
}