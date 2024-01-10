class validator {
    static validatTaskInfo(taskInfo){
       for (var i=0; i<taskInfo.length; i++){
        if(
            taskInfo[i].title===null || 
            taskInfo[i].description===null ||
            typeof taskInfo[i].completionFlag!=="boolean" ||
            taskInfo[i].id===null){
            return false;
        }
        }
        return true; //retrn true after checking all tasks
       }

    static duplicateInfo(taskInfo,taskData){
        for (var i=0; i<taskInfo.length; i++){
            for (var j=0;j<taskData.length; j++){
                if(
                    taskInfo[i].title==taskData[j].title ||
                    taskInfo[i].description==taskData[j].description ||
                    taskInfo[i].id==taskData[j].id)
                    {
                    return false;//Duplicate found
                }
            }
        }
        return true;//no duplicates found
    } 
}
module.exports = validator;