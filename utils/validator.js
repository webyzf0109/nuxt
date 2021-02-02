
export function nameCheck(val) {
    if (!val) {
        return '请输入姓名'
    }
    let nameOne=val.substr(0,1);
    let nameTwo=val.substr(1,2);
    let nameThree=val.substr(2,3);
    let nameFour=val.substr(3,4);
    if(nameOne){
        if (escape(nameOne).indexOf("%u")<0) {
            return '身份证件姓名只能输入中文'
        } 
    }else{
        return '请输入正确的身份证件姓名'
    }
    if(nameTwo){
        if (escape(nameTwo).indexOf("%u")<0) {
            return '身份证件姓名只能输入中文'
        } 
    }else{
        return '请输入正确的身份证件姓名'
    }
    if(nameThree){
        if (escape(nameThree).indexOf("%u")<0) {
            return '身份证件姓名只能输入中文'
        } 
    }
    if(nameFour){
        if (escape(nameFour).indexOf("%u")<0) {
            return '身份证件姓名只能输入中文'
        } 
    }
    return 'ok'
}

export function phoneCheck(val) {
    let reg = /(^1[3|4|5|6|7|8|9]\d{9}$)|(^09\d{8}$)/
    if (!val) {
        return '请输入手机号码'
    }
    if (!reg.test(val)) {
        return '请输入正确的手机号码'
    } else {
        return 'ok'
    }
}

export function emailCheck(val) {
    let reg = /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/
    if (!val) {
        return '请输入邮箱'
    }
    if (!reg.test(val)) {
        return '请输入正确的邮箱'
    } else {
        return 'ok'
    }
}

export function idNoCheck(val,minAge,maxAge) {
    let reg = /(^\d{18}$)|(^\d{17}(\d|X|x)$)/
    if (!val) {
        return '请输入身份证号'
    }
    if (!reg.test(val)) {
        return '请输入正确的身份证号'
    } else {
        if (!reg.test(val)) {
            return '请输入正确的身份证号'
        } else {
            if (val.length == 18) {
                if (val.substring(6, 10) > new Date().getFullYear()-minAge-1) {
                    return `身份证未满${minAge}周岁`
                }
                if (val.substring(6, 10) < new Date().getFullYear()-maxAge) {
                    return `身份证年龄过大`
                }
            }
            return 'ok'
        }
    }
}
