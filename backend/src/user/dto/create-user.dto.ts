import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsEnum } from 'class-validator';

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ enum: ['superuser', 'admin', 'regular'], required: false })
    @IsOptional()
    @IsEnum(['superuser', 'admin', 'regular'])
    role?: 'superuser' | 'admin' | 'regular';
}
