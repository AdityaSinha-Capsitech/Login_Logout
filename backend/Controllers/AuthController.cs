    using Microsoft.AspNetCore.Authorization;
    using Microsoft.AspNetCore.Http.HttpResults;
    using Microsoft.AspNetCore.Identity.Data;
    using Microsoft.AspNetCore.Mvc;
    using System.Security.Claims;
    using todoApp1.Models;
    using todoApp1.Services;

    namespace todoApp1.Controllers
    {
        [ApiController]
    
        public class AuthController:ControllerBase
        {
        
            private readonly JwtService _jwtProvider;
            private readonly UserService _userService;

            public AuthController(JwtService jwtProvider, UserService userService)
            {
           
                _jwtProvider = jwtProvider;
                _userService = userService;
            }

            [HttpPost("register")]
            public async Task<IActionResult> Register([FromBody] User user)
            {
                //Console.WriteLine($"user{user}");
                try
                {
                    if(user == null)
                    {
                        return BadRequest("Data is required.");
                    }
              
                    var name = user.Name;
                    var emailId = user.Email;
                    var role = user.Role;

                    //Console.WriteLine($"email{emailId} {name} {role}");
                    if (await _userService.isEmailIdExists(emailId))
                    {
                        return Conflict( "User already exists!" );
                    }


                    var users = await _userService.CreateUserAsync(user);


                    var token = _jwtProvider.createToken(name, emailId, role);

                    return Ok(new {token});
                }
                catch (System.Exception ex)
                {
                    return StatusCode(500, new { error = ex.Message });
                }
            }

            [HttpPost("login")]
            public async Task<IActionResult> Login([FromBody] LoginReq login)
            {
                try
                {
                    Console.WriteLine($"email {login.Email}");
                    var user = await _userService.GetUserByEmail(login.Email);

                    if (user.Role != login.Role)
                    {
                        return StatusCode(500, new { error = "Not valid User!" });
                    }


                    if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                    {
                        return StatusCode(401, new { error = "Invalid password" });
                    }

                
                    var token = _jwtProvider.createToken(user.Name,user.Email,user.Role);
                    return Ok(new { user, message = "login success", token });
                }
                catch (System.Exception ex)
                {
                    return StatusCode(500, new { error = ex.Message });
                }
            }



        }

        public class LoginReq {
            public string Email { get; set; }
            public string Password { get; set; }

            public string Role { get; set; }
        }


    }
