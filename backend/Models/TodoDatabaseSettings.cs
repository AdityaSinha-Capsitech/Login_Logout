namespace todoApp1.Models
{
    public class TodoDatabaseSettings
    {
        public required string ConnectionString { get; set; }

        public required string DatabaseName { get; set; } 
        public required string TaskCollectionName { get; set; } 
    }
}
