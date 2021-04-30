function readfile(loc1,loc2){
    return JSON.parse(getfile(`./ticketData/${loc1}_${loc2}.json`))

}
function cacuFee(worker,planarr){

}
while(line<filelength){
    let sumplan = JSON.parse(readline('../PlanData.txt'))
    for(let i=1;i<sumplan.length;i++){
        SecDFS(workerData[i],sumplan[i])
    }
}


function SecDFS(worker,plan){
    
    let minFee=POSITIVE_INFINITY
    let minPlan=[]
    let set = new Set()
    function dfs2(curArr,set){
        if(curArr.length===plan.length){
            let fee = cacuFee(woker,curArr)
            if(fee && minfee>fee){
                minfee=fee
                minPlan=curArr.slice()
            }
            return 
        }
        for(let i=1;i<plan.length;i++){
            if(!set.has(i)){
                set.add(i)
                curArr.push(i)
                set.delete(i)
                curArr.pop()
            }
        }
    }
    
}
for(i in workerData){
    workerData[i].temp['projects']=SecDFS(workerData[i],plan[i])
}