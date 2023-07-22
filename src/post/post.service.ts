import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePost, UpdatePost } from './dto';

interface User {
  sub: string;
  email: string;
}

@Injectable()
export class PostService {
  constructor(private readonly prisma: PrismaService) {}

  async getPosts(req: Request) {
    const { sub } = req.user as User;

    const posts = await this.prisma.post.findMany({
      where: {
        authorId: sub,
      },
    });

    if (posts.length === 0) {
      throw new NotFoundException();
    }

    return posts;
  }

  async getPost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    return post;
  }

  async createPost(req: Request, createPost: CreatePost) {
    const { sub } = req.user as User;

    if (!sub) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: {
        id: sub,
      },
    });

    if (!user) {
      throw new ForbiddenException();
    }

    const updatedPost = await this.prisma.post.create({
      data: {
        title: createPost.title,
        description: createPost.description,
        author: {
          connect: { id: sub },
        },
      },
    });

    return updatedPost;
  }

  async updatePost(
    updatePost: UpdatePost,
    id: string,
  ) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    const updatedPost = await this.prisma.post.update({
      where: {
        id: parseInt(id),
      },
      data: {
        ...updatePost,
      },
    });

    return updatedPost;
  }

  async deletePost(id: string) {
    const post = await this.prisma.post.findUnique({
      where: {
        id: parseInt(id),
      },
    });

    if (!post) {
      throw new NotFoundException();
    }

    await this.prisma.post.delete({
      where: {
        id: parseInt(id),
      },
    });
  }
}
