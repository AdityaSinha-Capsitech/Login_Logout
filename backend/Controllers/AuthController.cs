using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
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

    public class AuthController : ControllerBase
    {

        private readonly JwtService _jwtProvider;
        private readonly UserService _userService;
        private readonly IEmailSender _emailSender;

        public AuthController(JwtService jwtProvider, UserService userService, IEmailSender emailSender)
        {

            _jwtProvider = jwtProvider;
            _userService = userService;
            _emailSender = emailSender;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            //Console.WriteLine($"user{user}");
            try
            {
                if (user == null)
                {
                    return BadRequest("Data is required.");
                }

                var name = user.Name;
                var emailId = user.Email;
                var role = user.Role;

                //Console.WriteLine($"email{emailId} {name} {role}");
                if (await _userService.isEmailIdExists(emailId))
                {
                    return Conflict("User already exists!");
                }
                var newUser = new User
                {
                    Name = name,
                    Email = emailId,
                    Password = _userService.PasswordHassing(user.Password),
                    Role = user.Role,
                    EmailVerificationToken = Guid.NewGuid().ToString(),
                    EmailVerificationTokenExpire = DateTime.UtcNow.AddHours(24)
                };

                var users = await _userService.CreateUserAsync(newUser);

                //var verifyLink = $"{Request.Scheme}://{Request.Host}/api/verify-email?token={newUser.EmailVerificationToken}&andemail={newUser.Email}";

                //await _emailSender.SendEmailAsync(newUser.Email, "To verify your mail id",
                //    $"Please click on this verify link to verify your email id: <a href='{verifyLink}'>Verify link </a>");
                 
                var token = _jwtProvider.createToken(name, emailId, role);

                return Ok(new { token, users });
                //return Ok(new { message = "signup success" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpGet("verify-email")]
        public async Task<IActionResult> VerifyEmail(string token, string email)
        {
            var user = await _userService.GetUserByEmail(email);

            if (user == null)
            {
                return BadRequest("Email is not valid!");
            }

            if (user.EmailConfirmed)
            {
                return BadRequest("Email already verified!");
            }

            if (user.EmailVerificationToken != token || user.EmailVerificationTokenExpire < DateTime.UtcNow)
            {
                return BadRequest("Invalid verification token!");
            }

            user.EmailConfirmed = true;
            user.EmailVerificationToken = null;
            user.EmailVerificationTokenExpire = DateTime.MinValue;

            return Ok("Email verified successfully!");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginReq login)
        {
            try
            {

                Console.WriteLine($"email {login.Email}");
                if (login.Email == null)
                {
                    return BadRequest("Data is required.");
                }

                var user = await _userService.GetUserByEmail(login.Email);
                if (user == null)
                {
                    return BadRequest("No user found!");
                }
                if (user.Role != login.Role)
                {
                    return StatusCode(500, new { error = "Not valid User!" });
                }


                if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
                {
                    return StatusCode(401, new { error = "Invalid password" });
                }


                var token = _jwtProvider.createToken(user.Name, user.Email, user.Role);
                return Ok(new { user, message = "login success", token });
                //return Ok(new { user, message = "login success" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { error = ex.Message });
            }
        }

        [HttpPost("login-cookie")]
         public async Task<IActionResult> LoginCookie([FromBody] LoginReq login)
        {
            if (login.Email == null)
            {
                return BadRequest("Data is required.");
            }

            var user = await _userService.GetUserByEmail(login.Email);
            if (user == null)
            {
                return BadRequest("No user found!");
            }
            if (user.Role != login.Role)
            {
                return StatusCode(500, new { error = "Not valid User!" });
            }


            if (!BCrypt.Net.BCrypt.Verify(login.Password, user.Password))
            {
                return StatusCode(401, new { error = "Invalid password" });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name,user.Name),
                new Claim(ClaimTypes.Role,user.Role),
                new Claim(ClaimTypes.Email,user.Email)

            };


            var claimIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

            var authProperties = new AuthenticationProperties {
                IsPersistent=true,
                ExpiresUtc = DateTimeOffset.UtcNow.AddHours(1)
            };


            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, new ClaimsPrincipal(claimIdentity), authProperties);



            return Ok(new { login = "success" });

        }



    }

    public class LoginReq
    {
        public string Email { get; set; }
        public string Password { get; set; }

        public string Role { get; set; }
    }


}
