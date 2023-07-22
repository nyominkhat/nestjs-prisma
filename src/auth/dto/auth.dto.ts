import {
  IsEmail,
  IsNotEmpty,
  IsStrongPassword,
  IsString,
} from 'class-validator';

export class Signup {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}

export class Signin {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsStrongPassword()
  @IsNotEmpty()
  password: string;
}
