class Plan {
    constructor(relationObj) {
        this.cando = true
        this.relationObj = relationObj
        this.schedule = []
    }
}
window.localStorage.clear()
function copyObj(obj) {
    let res = {}
    for (let k in obj) {
        res[k] = obj[k].slice()
    }
    return res
}




console.log('***',workers[0])
let temp
let planCt=1
function producePlanObj() {
    temp = []
    for (let i = 0; i < 8; i++) {
        temp[i] = []
    }
    console.log('@@@',projects[0])
    function dfs(curi) {
        if (curi == 35) {
            localStorage.setItem(`plan${planCt}`,JSON.stringify(temp))
            planCt++
            return
        }
        if(curi>35) return 
        for (let i = 1; i < 8; i++) {
            if(workers[i-1].skillNew==-1 && projects[curi].type==1) continue
            temp[i].push(curi)
            dfs(curi + 1)
            temp[i].pop()
        }
        return
    }
    // dfs(0)
}

producePlanObj()
console.log(localStorage)