using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Bson;
using MongoDB.Driver;
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
        public async Task<List<Models.TaskList>> getAllTask() 
        {
            var result = await _taskService.GetAsync();

            return result;
        }

        [Authorize(Roles = "User")]
        [HttpPost]
        public async Task<List<Models.TaskList>> create([FromBody] TaskList TaskName)
        {
            
            //Console.WriteLine("taskName", name);
            await _taskService.CreateAsync(TaskName);
            var result = await _taskService.GetAsync();

            return result;
        }

        [Authorize(Roles = "User")]
        [HttpDelete("delete/{id}")]
        public async Task<List<Models.TaskList>> delete(string id)
        {
            //Console.WriteLine("id", id);
        

            await _taskService.DeleteTaskAsync(id);

            var result = await _taskService.GetAsync();

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
           public async Task<long> getCount()
        {
            long result = await _taskService.totalTask();


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
    }
}
