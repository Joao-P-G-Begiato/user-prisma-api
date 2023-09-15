const bcrypt = require ('bcrypt')
export default  class Cryptographer{
    static async crypt(string : string): Promise<string>{
        const crypt = await bcrypt.hash(string, 10)
        return crypt
    }

    static async check(string : string , hash:string):Promise<boolean> {
        const check = await bcrypt.compare(string, hash)
        return check
    }
}