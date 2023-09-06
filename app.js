const express=require("express");
const path =require("path");
const {open}=require("sqlite")
const sqlite3 =require("sqlite3");
const format =require("date-fns/format");
const isMatch=require("date-fns/isMatch");
var isValid=require("date-fns/isValid");
const app=express();
app.use(express.json());

const dbPath=path.join(__dirname,"todoApplication.db");


let db=null;
const initializeDbAndServer=async()=>{
    try{
        db=await open({
            filename:dbPath,
            driver:sqlite3.Database,
        });
        app.listen(3000,()=>{
            console.log("Server Running at http://localhost:3000/");
        });
    } catch (error){
        console.log(`DB Error : ${error.message}`);
        process.exit(1);
    }
};
initializeDbAndServer();

const hasPriorityAndStatusProperties=(requestQuery)=>{
    return(
        requestQuery.priority!==undefined && requestQuery.status!==undefined;
    );
};

const hasPriorityProperty=(requestQuery)=>{
    return requestQuery.priority!==undefined;
};

const hasStatusProperty=(requestQuery)=>{
    return requestQuery.status!==undefined;
};

const hasCategoryAndStatusProperty=(requestQuery)=>{
    return (
        requestQuery.category!==undefined && requestQuery.status!==undefined
    );
};

const hasCategoryAndPriorityProperties=(requestQuery)=>{
    return (
        requestQuery.category!==undefined && requestQuery.priority!==undefined
    );
};

const hasSearchProperty=(requestQuery)=>{
    return requestQuery.search_q!==undefined;
};

const hasCategoryProperty=(requestQuery)=>{
    return requestQuery.category!==undefined;
};

const convertDataIntoResponseObject=(dbObject)=>{
    return {
        id:dbObject.id,
        todo:dbObject.todo,
        priority:dbObject.priority,
        category:dbObject.category,
        status:dbObject.status,
        dueDate:dbObject.due_date,
    };
};

//API-1

app.get("/todos/",async(request,response)=>{
    let data=null;
    let getTodoQuery="";
    const {search_q="",priority,status,category}=request.query;

    /** switch case */
    switch (true){
        //scenario 1

    case hasStatusProperty(request.query):
        if (status==="TO DO" || status==="IN PROGRESS" || status=== "DONE"){
            getTodoQuery=`
                SELECT*FROM todo WHERE status='${status}';`;
            data =await database.all(getTodoQuery);
            response.send(
             data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
            );
          }else{
            response.status(400);
            response.send("Invalid Todo Status");
          }
          break;
        //

        case hasPriorityProperty(request.query):
          if (priority==="HIGH" || priority==="MEDIUM" || priority=== "LOW"){
                getTodoQuery=`
            SELECT*FROM todo WHERE priority='${priority}';`;
            data =await database.all(getTodoQuery);
            response.send(data.map((eachItem)=>outPutResult(eachItem))
            );
        }else{
            response.status(400);
            response.send("Invalid Todo Priority");
        }
        break;
        //

        case hasPriorityAndStatusProperties(request.query):
        if (priority==="HIGH" || priority==="MEDIUM" || priority=== "LOW"){
         if(
            status==="TODO" || 
            status ==="IN PROGRESS" ||
            status === "DONE"
        ){
            getTodoQuery=`
            SELECT*FROM todo WHERE status='${status}' AND priority ='${priority}';`;
            data =await database.all(getTodoQuery);
            response.send(data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
            );
        }else{
            response.status(400);
            response.send("Invalid Todo Status");
        }
      } else{
        response.status(400);
        response.send("Invalid Todo Priority");
      }

      break;
    //

     case hasSearchProperty(request.query):
        getTodoQuery=`
        SELECT*FROM todo WHERE todo like '%${search_q}%';`;
        data =await database.all(getTodoQuery);
        response.send(data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
        );
        break;
    //
    case hasCategoryAndStatusProperty(request.query):
        if(
            status==="WORK" || 
            status ==="HOME" ||
            status === "LEARNING"
        ){
            if(
                status==="TO DO"||
                status==="IN PROGRESS"||
                status==="DONE"
            ){
                getTodoQuery=`
            SELECT*FROM todo WHERE category='${category}' AND status ='${status}';`;
            data =await database.all(getTodoQuery);
            response.send(data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
            );
        }else{
            response.status(400);
            response.send("Invalid Todo Status");
        }
      } else{
        response.status(400);
        response.send("Invalid Todo Category");
      }

       break;
    //

    case hasCategoryPriority(request.query):
        if(
          category==="WORK" || 
          category ==="HOME" ||
          category === "LEARNING"
        ){
          getTodoQuery=`
            SELECT*FROM todo WHERE category='${category}' AND status ='${priority}';`;
            data =await database.all(getTodoQuery);
            response.send(data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
            );
        }else{
            response.status(400);
            response.send("Invalid Todo Category");
        }

        break;
    //

    case hasCategoryAndPriorityProperty(request.query):
       if (priority==="HIGH" ||
           priority==="MEDIUM" || 
           priority=== "LOW"
           ){
            if(
                category==="WORK"||
                category==="HOME"||
                category==="LEARNING"
            ) {

            }
                getTodoQuery=`
            SELECT*FROM todo WHERE category='${category}' AND priority='${priority}';`;
            data =await db.all(getTodoQuery);
            response.send(data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
            );
        }else{
            response.status(400);
            response.send("Invalid Todo Priority");
        }
      } else{
        response.status(400);
        response.send("Invalid Todo Category");
      }

       break;
    //

    default:
        getTodoQuery=`select * from todo`;
        data =await db.all(getTodoQuery);
         response.send(data.map((eachItem)=>convertDataIntoResponseObject(eachItem))
        );
  }
});
//

app.get("/agenda/",async(request,response)=>{
    const {data}=request.query;

    if (isMatch(date,"yyyy-MM-dd")){
        const newData=format(new Data(date),"yyyy-MM-dd");

        const getDataQuery=`SELECT * FROM todo WHERE due_date='${newDate}';`;
        const dbResponse=await db.all(getDataQuery);

        response.send(
            dbResponse.map((eachItem)=>convertDataIntoResponseObject(eachItem))
        );
    } else{
        response.status(400);
        response.send("Invalid Due Date");
    }
});

app.post("/todos/",async(request,response)=>{
    const {id,todo,priority,status,category,dueDate}=request.body;

  if(priority==="HIGH" || priority=== "MEDIUM" || priority=== "LOW"){
    if (status==="TO DO" || status==="IN PROGRESS" || status ==="DONE"){
      if(
         category==="WORK" ||
        category==="HOME"||
        category==="LEARNING"
      ) {
        if(isMatch(dueDate,"yyyy-MM-dd")){
          const newDueDate=format(new Date(dueDate),"yyyy-MM-dd");

          const postQuery=`
             INSERT INTO
             todo(id,todo,priority,status,category,due_date)
             VALUES
             (${id},'${todo}','${priority}','${status}','${category}','${newDueDate}');`;
          await db.run(postQuery);
            response.send("Todo Successfully Added");
        } else{
            response.status(400);
            response.send("Invalid Due Date");
        }
      } else{
        response.status(400);
        response.send("Invalid Todo Priority");
      }
    } else{
        response.status(400);
        response.send("Invalid Todo Status");
    }
  }else{
      response.status(400);
      response.send("Invalid Todo Priority");
  }
});

//api-5
app.put('/todos/:todoId/',async(request,response)=>{
    const {todoId}=request.params;

    let updateColumn="";
    const requestBody=request.body;

    const previousTodoQuery=`SELECT * FROM todo WHERE id =${todoId};`;
    const previousTodo=await db.get(previousTodoQuery);

    const {
        todo=previousTodo.todo,
        priority=previousTodo.priority,
        status=previousTodo.status,
        category=previousTodo.category,
        dueDate=previousTodo.dueDate,
    }=request.body;

    let updateTodo;

    switch(true){
        case requestBody.status!==undefined:
            if(status==="TO DO"|| status ==="IN PROGRESS" || status==="DONE"){
                updateTodo=`
                    UPDATE
                    TODO
                    SET
                    todo='${todo}',
                    priority='${priority}',
                    status='${status}',
                    category='${category}',
                    due_date='${dueDate}'
                    WHERE id=${todoId};`;
                 await db.run(updateTodo);
                 response.send("Status Updated");
              } else{
                  response.status(400);
                  response.send("Invalid Todo Status");
              }

              break;
            // update

            case requestBody.category!==undefined:
                if(
                    category==="WORK"||
                    category==="HOME"||
                    category==="LEARNING"
                ) {
                    updateTodo=`
                        UPDATE
                        todo
                        SET 
                        todo='${todo}',
                        priority='${priority}',
                        status='${status}',
                        category='${category}',
                        due_date='${dueDate}',
                        WHERE id=${todoId};`;
                    await db.run(updateTodo);
                 response.send("Category Updated");
              } else{
                  response.status(400);
                  response.send("Invalid Todo Category");
              }
              break;
            //update
             
             case requestBody.dueDate!==undefined:
            if(isMatch(dueDate,"yyyy-MM-dd")){
                const newDate=format(new Date(dueDate),"yyyy-MM-dd");
                updateTodo=`
                    UPDATE
                    TODO
                    SET
                    todo='${todo}',
                    priority='${priority}',
                    status='${status}',
                    category='${category}',
                    due_date='${dueDate}'
                    WHERE id=${todoId};`;
                 await db.run(updateTodo);
                 response.send("Due Date Updated");
              } else{
                  response.status(400);
                  response.send("Invalid Due Date");
              }

              break;
    }
})

//
app.delete("/todos/:todoId/",async(request,response)=>{
    const {todoId}=request.params;
    const deleteTodoQuery=`
    DELETE FROM todo
    WHERE
    id=${todoId};`;

    await db.run(deleteTodoQuery);
    response.send("Todo Deleted");
});
module.exports=app;