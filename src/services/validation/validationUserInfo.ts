export default class ValidationUserInfo{
    static emailVerify(email:string):boolean{
        const length = email.length
        const dotVerify = email.includes(".") && email.lastIndexOf(".") != length-1 
        const atSignVerify = email.includes("@") && email.indexOf("@") < email.lastIndexOf(".") && email.lastIndexOf("@") != length-1 && email.indexOf("@") > 1
        return length > 5 && dotVerify && atSignVerify
    }
    static nameVerify(name:string):boolean{
        const numberRegex = /[0-9]/
        const specialCharacterRegex =  /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\]/
        const valid = !numberRegex.test(name) && !specialCharacterRegex.test(name)
        return name.length > 3 && valid
    }
    static passwordVeirfy(password:string):boolean{
        const numberRegex = /[0-9]/
        const specialCharacterRegex =  /^(?=.*['"@!#$%^¨&*()~/\\])/
        const lowerCaseRegex = /[a-z]/
        const upperCaseRegex = /[A-Z]/
        const valid = numberRegex.test(password) && specialCharacterRegex.test(password) && lowerCaseRegex.test(password) && upperCaseRegex.test(password)
        return valid
    }
}

