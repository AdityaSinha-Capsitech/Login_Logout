using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Bson.IO;
using MongoDB.Driver;
using System.Threading.Tasks;
using todoApp1.Models;
using todoApp1.Services;

namespace todoApp1.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]/")]
    public class TaskController : ControllerBase
    {
        private readonly TaskService _taskService;

        public  TaskController(TaskService taskService) { 
           _taskService = taskService;
        }

        [Authorize(Roles = "User")]
        [HttpGet]
        public async Task<List<Models.TaskList>> getAllTask([FromQuery] string userId) 
        {

            var result = await _taskService.GetAsync(userId);

            return result;
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<List<Models.TaskList>> create([FromBody] TaskList TaskName)
        {
            
            //Console.WriteLine("taskName", name);
            await _taskService.CreateAsync(TaskName);
            var result = await _taskService.GetAsync(TaskName.UserId);

            return result;
        }

        [Authorize(Roles = "User")]
        [HttpDelete("delete/{id}")]
        public async Task<List<Models.TaskList>> delete([FromQuery] string userId,string id)
        {
            //Console.WriteLine("id", id);
        

            await _taskService.DeleteTaskAsync(id);

            var result = await _taskService.GetAsync(userId);

            return result;
        }

        [Authorize(Roles = "User")]
        [HttpPatch("id")]
          public async Task<bool> UpdateTaskAsync(string id,string UpdatedTaskList)
        {

            await _taskService.UpdateTaskAsync( id, UpdatedTaskList);

            return true;
        }

        [Authorize(Roles = "User")]
        [HttpGet("count")]
           public async Task<long> getCount([FromQuery] string userId)
        {
            long result = await _taskService.totalTask(userId);


            return result;
        }

        [Authorize(Roles = "User")]
        [HttpGet("status")]
        public async Task<List<Models.TaskList>> getTaskByStatus([FromQuery] string status)
        {
            Console.WriteLine("here");
            var result = await _taskService.getTaskByStatus(status);

            Console.WriteLine("resultController", result);
            return result;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("admin")]
        public  string getAdminDash()
        {
            return "Welcome to Admin Dashboard!";
        }


        [Authorize(Roles = "Admin")]
        [HttpPost("editByAdmin")]
        public async Task<string> UpdateTask([FromBody] ReqData TaskName)
        {
            Console.WriteLine($"updated {TaskName.id} {TaskName.TaskName}");
            var result = await _taskService.UpdateTaskAsync(TaskName.id, TaskName.TaskName);

            if (result != true)
            {
                return "task updation failed!";
            }

            return "Task update successfully!";
        }

        [Authorize(Roles = "Admin")]
        [HttpGet("userTasksByAdmin")]
        public async Task<IActionResult> getAllTaskByAdmin()
        {

            var tasks = await _taskService.getAllTaskByAdminAsync();
            var result = tasks.Select(task => new TaskDto
            {
                Id = task["_id"].AsObjectId.ToString(),
                UserId = task["UserId"].AsObjectId.ToString(),
                TaskName = task["TaskName"].AsString,
                Status = task["Status"].AsString,
                Users = task["Users"].AsBsonArray.Select(u => new UserDto
                {
                    Id = u["_id"].AsObjectId.ToString(),
                    Name = u["name"].AsString,
                    Email = u["email"].AsString,
                    
                }).ToList()
            }).ToList();


            return Ok(result);
        }


        
    }

    public class ReqData
    {
        public string TaskName { get; set; }
        public string id { get; set; }

    }
    public class TaskDto
    {
        public string Id { get; set; }     
        public string UserId { get; set; }
        public string TaskName { get; set; }
        public string Status { get; set; }
        public List<UserDto> Users { get; set; }
    }
    public class UserDto
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
    }

}
