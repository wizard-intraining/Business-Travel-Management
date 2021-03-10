class Project(){
    // type:老项目是0;新项目是1
constructor(id,loc,type){
    this.loc=loc
    this.id=id
    this.type=type
    this.dueTime=this.type===0? (10*1000*60*60*24):(31*1000*60*60*24)

}
}

let projectsData=[
    [1],
    
]

let projects=new Set()

