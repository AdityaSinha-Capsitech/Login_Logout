using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using todoApp1.Models;

namespace todoApp1.Services
{
    public class TaskService
    {
        private readonly IMongoCollection<TaskList> _tasksCollection;

        public TaskService(IOptions<TodoDatabaseSettings> mongoSettings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(mongoSettings.Value.DatabaseName);
            _tasksCollection = database.GetCollection<TaskList>(mongoSettings.Value.TaskCollectionName);
        }

        // get all data
        public async Task<List<TaskList>> GetAsync() =>
            await _tasksCollection.Find(_ => true).ToListAsync();

        // create task
        public async Task CreateAsync(TaskList newItem) =>
            await _tasksCollection.InsertOneAsync(newItem);

        //for task deletion
        public async Task DeleteTaskAsync(string taskId)
        {
            var filter = Builders<TaskList>.Filter.Eq(t => t.Id, taskId);
            var result = await _tasksCollection.DeleteOneAsync(filter);

        }


        // for updation
        public async Task<bool> UpdateTaskAsync(string id, string UpdatedTaskList)
        {



            var updated = Builders<TaskList>.Update.Set(t => t.TaskName, UpdatedTaskList);

            var result = await _tasksCollection.UpdateOneAsync(
                t => t.Id == id,
                updated
                );

            return result != null;


        }

        // get task by id
        public async Task<TaskList?> GetByIdAsync(string id) =>
          await _tasksCollection.Find(x => x.Id == id).FirstOrDefaultAsync();



        //total no. of tasks 

        public async Task<long> totalTask()
        {

            var pipeline = new[]
            {
                new BsonDocument("$count","tasks")
            };

            var result = await _tasksCollection.Aggregate<BsonDocument>(pipeline).FirstOrDefaultAsync();

            if(result != null)
            {
                return result["tasks"].AsInt32;
            }

            return 0;
        }

        //get task by status

        public async Task<List<TaskList>> getTaskByStatus(string status)
        {

            var matchItem = new BsonDocument("$match", new BsonDocument("Status", status));


            var pipeline = new[]
            {
                matchItem
            };


            var result = await _tasksCollection.Aggregate<TaskList>(pipeline).ToListAsync();

            Console.WriteLine("result", result);
            return result;
        }
    }


}
