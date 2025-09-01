using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Mscc.GenerativeAI;
using todoApp1.Models;


namespace todoApp1.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ChatbotController:ControllerBase
    {
        private readonly string _apiKey;


        public ChatbotController(IConfiguration config)
        {
            _apiKey = config["Gemini:apiKey"];
        }


        //[HttpPost("chat")]
        //public async Task<IActionResult> SearchQueries([FromBody] Chat queries)
        //{

        //    try
        //    {
              


        //        //return Ok(new { reply = response });

        //    }
        //    catch(Exception ex)
        //    {
        //        return StatusCode(500, new { error = "failed!" });

        //}

    }
}
