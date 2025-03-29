import { ConflictException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { User, UserRole } from '../../entities/user.entity';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) { }

  async register(registerDto: RegisterDto) {
    try {
      const { username, email, password } = registerDto;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = this.userRepository.create({
        username,
        email,
        password_hash: hashedPassword,
        role: UserRole.USER,
      });
      await this.userRepository.save(user);
      return { message: 'User registered successfully' };
    }
    catch (error) {
      if (
        error instanceof QueryFailedError &&
        error.message.includes('duplicate key value violates unique constraint')
      ) {

        throw new ConflictException({
          statusCode: HttpStatus.CONFLICT,
          message: 'A user with the provided field already exists.',
        });
      }
      throw error;

    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { email, password } = loginDto;
      const user = await this.userRepository.findOne({ where: { email } });
      if (!user || !(await bcrypt.compare(password, user.password_hash))) {
        throw new UnauthorizedException('Invalid credentials');
      }
      const payload = { userId: user.id, role: user.role };
      const token = this.jwtService.sign(payload);
      return { token, ...payload };
    }
    catch (error) {
      throw error;
    }
  }
}