import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  HttpCode,
  Param,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { PostService } from './post.service';
import { CreatePost, UpdatePost } from './dto';

@Controller('posts')
export class PostController {
  constructor(private postService: PostService) {}

  // get all posts
  @Get()
  getPosts(@Req() req: Request) {
    return this.postService.getPosts(req);
  }

  // get a post
  @Get(':id')
  getPost(@Req() req: Request, @Param('id') id: string) {
    return this.postService.getPost(id);
  }

  // create a post
  @Post()
  @HttpCode(HttpStatus.CREATED)
  createPost(
    @Req() req: Request,
    @Body() createPost: CreatePost,
  ) {
    return this.postService.createPost(req, createPost);
  }

  // update a post
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  updatePost(
    @Param('id') id: string,
    @Body() updatePost: UpdatePost,
  ) {
    return this.postService.updatePost(updatePost, id);
  }

  // delete a post
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  deletePost(@Param('id') id: string) {
    return this.postService.deletePost(id);
  }
}
