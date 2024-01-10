const express = require("express");
const taskData = require("./task.json");
const fs= require("fs");
const path = require("path");
const validator = require("./helpers/validator.js");

const app = express();
//Middleware defination
app.use(express.json());

let port =3000;
app.listen(port,function(err){
    if(err) {
        console.log("Server is down");
    }else{
        console.log(`server is running on port ${port}`);
    }
})

//GET /tasks: Retrieve all tasks.
app.get("/tasks",(req,res)=>{
    return res.status(200).send(taskData);
});

//GET /tasks/:id: Retrieve a single task by its ID.
app.get("/tasks/:taskId",(req,res)=>{
    let taskIdPassed = req.params.taskId
    taskList=taskData.devTasks
    let result=0;
    for(const course of taskList){
        if (course.id==taskIdPassed){
            result = course;
            break;
        }
    }
    return res.status(200).send(result);

});
//POST /tasks: Create a new task.


app.post("/tasks/",(req,res)=>{
    let newTask = req.body
    console.log("Req Body:",newTask)
    newTask.createdAt = new Date();
    if (validator.validatTaskInfo([newTask])){
        if(validator.duplicateInfo([newTask],taskData.devTasks)){
       let taskDataModified=JSON.parse(JSON.stringify(taskData));
        taskDataModified.devTasks.push(newTask);        
        let writePath = path.join(__dirname,'.',"task.json");
        fs.writeFileSync(writePath,JSON.stringify(taskDataModified),{encoding:"utf-8",flag:"w"});
        return res.status(200).send("Task has been Added");
         } else {
            return res.status(500).send("Duplicate Request Paramaters");
            }
    } else {
        return res.status(500).send("Mandatory Parameters are Empty");
    }
}
);

//Put (update) on existing task id

app.put("/tasks/:taskid",(req,res)=>{
    taskId = req.params.taskid
    let newTask=req.body;
    newTask.createdAt = new Date(); //Add created date time to the task
    
    let taskUpdated=false;    
        
        for (var i=0; i<taskData.devTasks.length; i++){
            if (taskData.devTasks[i].id==taskId){
                //update the entire task with new data
                taskData.devTasks[i]={...taskData.devTasks[i], ...newTask};
                taskUpdated= true;
                break;
            }           
        }
        if(taskUpdated){
           let writePath = path.join(__dirname,'.',"task.json");
            fs.writeFileSync(writePath,JSON.stringify(taskData),{encoding:"utf-8",flag:"w"})
            return res.status(200).send("Task has been Updated");
        } else {
            return res.status(400).send("Task id is not available");
        }
});

//Delete a task by its ID.

app.delete("/tasks/:taskid",(req,res)=>{
    taskId = req.params.taskid;
    let taskDeleted = false;

    for (var i=0; i<taskData.devTasks.length; i++){
        if(taskData.devTasks[i].id == taskId){
            taskData.devTasks.splice(i,1);  
            taskDeleted = true;
            break;
        }
    }
    if(taskDeleted){
        let writePath = path.join(__dirname,'.',"task.json");
            fs.writeFileSync(writePath,JSON.stringify(taskData),{encoding:"utf-8",flag:"w"})
            return res.status(200).send("Task has been Deleted");
    }else {
        return res.status(400).send("Task id is not available");
    }
})
//Optional Extension
//filtering and sorting for the GET /tasks endpoint
///http://localhost:3000/tasks/?completionFlag=false&sort=createdAt

app.get("/tasks",(req,res)=>{
    const completionFlagParam=req.query.completionFlag;
    let filteredTasks = [];
    
    //filter by completionFlag
    if(completionFlagParam !== undefined && (completionFlagParam==true || completionFlagParam==false)){
        for(var i=0;i<taskData.devTasks.length; i++){
            if(taskData.devTasks[i].completionFlag == completionFlagParam){
                filteredTasks.push(taskData.devTasks[i]);
            }
        }
        //sort the filtered data
        const sortParam = req.query.sort;
        if (sortParam !==undefined && sortParam ===createdAt) {
            filteredTasks.sort((a,b)=>new Date(a.createdAt)-new Date(b.createdAt));
        }
        return res.status(200).json(filteredTasks)
        }
        else {
        return res.status(400).send("No Data Retrieved");
    }

});