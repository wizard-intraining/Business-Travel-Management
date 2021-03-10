class Plan{
    constructor(relationObj){
        this.cando=true
        this.relationObj=relationObj
        this.schedule=[]
    }
}

function copyObj(obj){
    let res={}
    for(let k in obj){
        res[k]=obj[k].slice()
    }
    return res
}


let relationSet=[]


function producePlanObj(){
    let temp={}
    for(let i=0;i<workers.length;i++){
        temp[workers.id]=[]
    }
    function dfs(curi){
        if(curi==8){
            relationSet.push(copyObj(temp))
            return
        }
        for(let i=1;i<8;i++){
            temp[`w${i}`].push(projects[curi])
            dfs(curi+1)
            temp[`w${i}`].pop(projects[curi])
        }
        return 
    }
    
}


