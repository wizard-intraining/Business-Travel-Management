
// 统一把5.23设为0，其他日期以毫秒为单位累加
class Worker {
    // 没有skillNew的设为-1，有的话设为天数*1000*60*60*24
constructor(id,avaDate,originLoc,salary,skillOld,skillNew){
this.id=id
this.avaDate=avaDate
this.originLoc=originLoc
this.salary=salary
this.skillOld=skillOld
this.skillNew=skillNew
this.temp={
    curLoc:this.originLoc,
    route:[this.originLoc],
    train:[],
    projects:[],
    worktimeMS:0,
    trainfee:[],
    hotelfee:[]
}
}

reset(){
    this.temp={
        curLoc:this.originLoc,
        route:[this.originLoc],
        train:[],
        projects:[],
        worktimeMS:0,
        trainfee:[],
        hotelfee:[]
    }
}
travelTo(project){
    if(project.type===1 && this.skillNew===-1) return false 

    // 加火车时间之后再判断下面的是否超时

    this.temp.worktimeMS+=project.type===0?this.skillOld:this.skillNew
    workday=Math.ceil(this.temp.worktimeMS/(1000*60*60*24))

    // 是否超时1.员工工期，2.项目工期
    if(avaDate[0]+workday>avaDate[1]) return false
    if(vaDate[0]+workday>project.dueTime) return false

    // 如果符合再返回true并计入日程

    this.temp.curLoc=project.loc
    // this.
    // 累计费用（如果超出15天加钱）
}
getRoute(){
    return [this.temp.route,this.temp.train]
}
getFee(){
    workday=Math.ceil(this.temp.worktimeMS/(1000*60*60*24))
    return {
        workday:worktime,
        salary:worktime*this.salary,
        innerCityTransport:worktime*80,

        sum:worktime*(this.salary+80)

    }
    return this.temp.workday*(this.salary+80)+this.temp.hotelfee+this.temp.trainfee+this.temp.workday*100+(this.temp.workday>15?(this.temp.workday-15)*50 : 0)
}
backHome(){

    // 先加火车时间再计算是否超期

    workday=Math.ceil(this.temp.worktimeMS/(1000*60*60*24))
    if(avaDate[0]+workday>avaDate[1]) return false
    // this.temp.trainfee++
    // this.temp.train.push([trainName,date])
    this.temp.route.push(this.originLoc)
}


}

// 构造

let workersData=[
    ['w1',[2*1000*60*60*24,23*1000*60*60*24],'BJP',350,1.36*1000*60*60*24,-1],
    ['w2',[0*1000*60*60*24,17*1000*60*60*24],'BJP',300,1.71*1000*60*60*24,1*1000*60*60*24],
    ['w3',[17*1000*60*60*24,24*1000*60*60*24],'BJP',250,1.5*1000*60*60*24,-1],
    ['w4',[0*1000*60*60*24,24*1000*60*60*24],'BJP',300,1.33*1000*60*60*24,4*1000*60*60*24],
    ['w5',[0*1000*60*60*24,22*1000*60*60*24],'BJP',300,1.5*1000*60*60*24,4*1000*60*60*24],
    ['w6',[1*1000*60*60*24,22*1000*60*60*24],'NJH',250,1.29*1000*60*60*24,1*1000*60*60*24],
    ['w7',[2*1000*60*60*24,32*1000*60*60*24],'NJH',250,1.71*1000*60*60*24,-1]
]

// constructor(id,avaDate,originLoc,salary,skillOld,skillNew){
let workers=new Array(workersData.map((e)=>{ return new Worker(e[0], e[1],e[2],e[3],e[4],e[5] ) }))

console.log(workers)