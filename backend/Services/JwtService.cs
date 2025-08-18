using DnsClient;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace todoApp1.Services
{
    public class JwtService
    {
        private readonly IConfiguration _config;

        public JwtService(IConfiguration config)
        {
            _config = config;
        }

        public string createToken(string Name, string EmailId, string Roles)
        {
            var claims = new[] {
                new Claim(JwtRegisteredClaimNames.Sub,Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()), // Unique ID of the token Helps with blacklisting, tracking
                new  Claim(ClaimTypes.Name, Name),
                new Claim(ClaimTypes.Role,Roles),
                new  Claim(ClaimTypes.Email, EmailId)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                       issuer: _config["Jwt:Issuer"],
                       audience: _config["Jwt:Audience"],
                       claims,
                       expires: DateTime.UtcNow.AddMinutes(Convert.ToDouble(_config["Jwt:ExpiresInMinutes"])),
                       signingCredentials: cred

                );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
