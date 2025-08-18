
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;


namespace todoApp1.Models
{
    public class TaskList
    {
        [BsonId] // It marks a property in your C# class as the primary key (id) of the MongoDB document.
        [BsonRepresentation(BsonType.ObjectId)] // This attribute tells the MongoDB C# driver to serialize/deserialize the property as a MongoDB ObjectId.
        public string? Id { get; set; }

        public string? TaskName { get; set; }

        public string? Status { get; set; } = "pending";
    }
}
