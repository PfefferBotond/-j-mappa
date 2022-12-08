import {
  Get,
  Controller,
  Render,
  Query,
  Param,
  Post,
  Body,
  Redirect,
} from '@nestjs/common';
import db from './db';
import { paintingDto } from './painting.dto';

@Controller()
export class AppController {
  @Get()
  @Render('list')
  async listpaintings(@Query('year') year = 1990) {
    const [rows] = await db.execute(
      'SELECT id, title FROM paintings WHERE year > ?',
      [year],
    );
    return {
      paintings: rows,
    };
  }

  @Get('paintings/new')
  @Render('form')
  newPaintingForm() {
    return {};
  }

  @Post('paintings/new')
  @Redirect()
  async newPainting(@Body() painting: paintingDto) {
    painting.on_display = painting.on_display == 1;
    const [result]: any = await db.execute(
      'INSERT INTO paintings (title, year, on_display) VALUES (?, ?, ?)',
      [painting.title, painting.year, painting.on_display],
    );
    return {
      url: '/paintings/' + result.insertId,
    };
  }

  @Get('paintings/:id/edit')
  @Render('form')
  newEditForm() {
    return {};
  }

  @Post('paintings/:id/edit')
  @Redirect()
  async newEdit(@Body() painting: paintingDto, @Param('id') id: number) {
    painting.on_display = painting.on_display == 1;
    const [result]: any = await db.execute(
      'UPDATE paintings SET title = ?, year = ?, on_display = ? WHERE id = ?',
      [painting.title, painting.year, painting.on_display, id],
    );
    return {
      url: '/paintings/' + id,
    };
  }

  @Get('paintings/:id')
  @Render('show')
  async showPainting(@Param('id') id: number) {
    const [rows] = await db.execute(
      'SELECT title, year, on_display FROM paintings WHERE id = ?',
      [id],
    );
    return { painting: rows[0] };
  }

  @Post('paintings/:id')
  @Redirect()
  async deletePainting(@Param('id') id: number) {
    await db.execute('DELETE FROM paintings WHERE id = ?', [id]);
    return {
      url: '/',
    };
  }

  root() {
    return {};
  }
}
