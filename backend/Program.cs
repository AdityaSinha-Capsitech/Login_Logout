using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;
using todoApp1.Models;
using todoApp1.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer(); //?
//This method registers services that expose metadata about your application's endpoints, such as their HTTP methods, routes, and parameters. Swagger relies on this metadata to generate accurate API documentation. Without it, Swagger won't be able to discover and document your Minimal API endpoints. 


//When Is It Required?

//Minimal APIs Only: If your application exclusively uses Minimal APIs (defined using MapGet(), MapPost(), etc.), you must call AddEndpointsApiExplorer() to enable Swagger to generate documentation for these endpoints.

//Controllers Only: If your application uses controllers (defined with [ApiController] and action methods), Swagger can generate documentation without AddEndpointsApiExplorer(), as AddControllers() internally calls AddApiExplorer(), which provides the necessary metadata. 
//Code Maze

//Both Minimal APIs and Controllers: If your application uses both Minimal APIs and controllers, you need to call both AddEndpointsApiExplorer() and AddSwaggerGen() to ensure that Swagger can generate documentation for all endpoints.






builder.Services.AddSwaggerGen(); 
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod();
              
    });
});

// Add services to the container.
builder.Services.Configure<TodoDatabaseSettings>(
    builder.Configuration.GetSection("TaskStoreDatabase"));



builder.Services.AddSingleton<IMongoClient>(s =>
{
    var settings = builder.Configuration
        .GetSection("TaskStoreDatabase")
        .Get<TodoDatabaseSettings>();

    return new MongoClient(settings.ConnectionString);
});


builder.Services.AddSingleton<TaskService>();
builder.Services.AddSingleton<JwtService>();
builder.Services.AddSingleton<UserService>();


builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);


builder.Services.AddOpenApi(); //?

// What Does AddOpenApi() Do?

//Calling AddOpenApi() registers the necessary services to generate an OpenAPI document for your API. This document describes your API's endpoints, request/response formats, and
//other metadata, which can be used for documentation, client generation, and testing.


var jwtSettings = builder.Configuration.GetSection("Jwt");
var issuer = jwtSettings["Issuer"];
var audience = jwtSettings["Audience"];
var secretKey = jwtSettings["Key"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme; // which authentication handler to use by default to validate the incoming request and create the HttpContext.User.
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme; // used when the app needs to challenge an unauthenticated user like not valid tokens. It tells to ASP.net issue the authentication handler
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer =true,
        ValidIssuer = issuer,
        ValidateAudience =true,
        ValidAudience= audience,
        ValidateLifetime =true,
        ValidateIssuerSigningKey=true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey)),
        ClockSkew = TimeSpan.Zero //Setting ClockSkew = TimeSpan.Zero means that the token must be exactly valid at the time of validation, with no allowance for clock differences.
    };

});

builder.Services.AddAuthorization();
var app = builder.Build();

// Configure the HTTP request pipeline?
if (app.Environment.IsDevelopment())
{

    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");// allow to communicate between differnet ports

app.UseHttpsRedirection();// allow to switch from http to https

app.UseAuthentication();// used for authentication
app.UseAuthorization();// used for authorization

app.MapControllers();// mapping routes

app.Run();// terminal call- ending of pipeline
