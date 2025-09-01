using Microsoft.Extensions.Options;
using MongoDB.Driver;
using todoApp1.Models;

namespace todoApp1.Services
{
    public class UserService
    {
        private readonly IMongoCollection<User> _userCollection;

        public UserService(IOptions<TodoDatabaseSettings> mongoSettings, IMongoClient mongoClient)
        {
            var database = mongoClient.GetDatabase(mongoSettings.Value.DatabaseName);
            _userCollection = database.GetCollection<User>("Users");
        }


        public async Task<User> CreateUserAsync(User user)
        {
            try
            {
                //user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password);

                await _userCollection.InsertOneAsync(user);
                return user;
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating user: " + ex.Message);
            }
        }

        public async Task<User> GetUserByEmail(string email)
        {

            var user =await _userCollection.Find(u => u.Email == email).FirstOrDefaultAsync(); 
                if(user == null)
                {
                Console.WriteLine($"user is null {user}");
                }
            return user;
        }


        public async Task<bool> isEmailIdExists(string email)
        {
           
            var result = await _userCollection.CountDocumentsAsync(u => u.Email == email);
            //Console.WriteLine($"result {result}");
            return result > 0;
        }

        public string PasswordHassing(string password)
        {
            var hsPassword = BCrypt.Net.BCrypt.HashPassword(password);

            return hsPassword;
        }


    }
}
