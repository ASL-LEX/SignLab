import { Controller, Get, Res } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  clientUI(@Res() res) {
    return res.redirect('/index.html');
  }
}
