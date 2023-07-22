import {
  IsString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class CreatePost {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}

export class UpdatePost {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  description: string;
}
