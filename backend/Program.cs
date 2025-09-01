using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.IdentityModel.Tokens;
using MongoDB.Driver;
using System.Text;
using todoApp1.Models;
using todoApp1.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer(); //?
builder.Services.AddSwaggerGen(); //?

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
builder.Services.AddTransient<IEmailSender, EmailSender>();


builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null);


builder.Services.AddOpenApi(); //?




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
        ValidateIssuer = true,
        ValidIssuer = issuer,
        ValidateAudience = true,
        ValidAudience = audience,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(secretKey))
    };

});

//builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
//    .AddCookie(options => {
//    options.ExpireTimeSpan = TimeSpan.FromMinutes(20);
//    options.SlidingExpiration = true;
//    options.Cookie.SameSite = SameSiteMode.None; 
//    options.AccessDeniedPath = "/Forbidden/";
//});


builder.Services.AddAuthorization();
var app = builder.Build();


// Configure the HTTP request pipeline?
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCookiePolicy(new CookiePolicyOptions());
app.UseCors("AllowFrontend");// allow to communicate between differnet ports

app.UseHttpsRedirection();// allow to switch from http to https

app.UseAuthentication();// used for authentication
app.UseAuthorization();// used for authorization

app.MapControllers();// mapping routes

app.Run();// terminal call- ending of pipeline
