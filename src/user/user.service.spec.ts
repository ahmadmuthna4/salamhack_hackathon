
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { League } from '../league/entities/league.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { UserRoleEnum } from './dto/create-user.dto';

describe('UserService', () => {
  let service: UserService;
  let repository: UserRepository;

  const mockUserRepository = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: UserRepository,
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    repository = module.get<UserRepository>(UserRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });



  describe('create', () => {
    it('should create a user', async () => {
      const createDto: CreateUserDto = {
        email: 'a@a.com', password: '123456', name: 'Test-name',
        role:UserRoleEnum.ADMIN
      };
      const result: User = {
        id: 1, ...createDto,
        role:UserRoleEnum.ADMIN,
        prediction:[],
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined
      };

      mockUserRepository.create.mockResolvedValue(result);

      expect(await service.create(createDto)).toEqual(result);
      expect(mockUserRepository.create).toHaveBeenCalledWith(createDto);
    });
    it('should return a bad request when creating a user with invalid data', async () => {
      // Create a DTO with invalid data
      const createDto: CreateUserDto = { 
        
        email: '', 
        password: '', 
        name: '', 
        role: 'invalidRole' as UserRoleEnum, 
        };
      
      
      // Mock the repository to throw a BadRequestException
      const error = new BadRequestException('Validation failed: email should not be empty, password should not be empty, name should not be empty and role invalidRole not found');
      mockUserRepository.create.mockRejectedValue(error);
  
      try {
        await service.create(createDto);
      } catch (e) {
        // Check if the error thrown is the BadRequestException
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message);
      }
      expect(mockUserRepository.create).toHaveBeenCalledWith(createDto);
    });
  });
 

  describe('getAll', () => {
    it('should return all user', async () => {
      const getDto: GetUserDto = { limit: 10, offset: 0, search: '', select: [] };
      const result = { count: 1, array: [{ id: 1, email: 'a@a.com', password: '123456', name: 'Test-name', role:UserRoleEnum.ADMIN }] };

      mockUserRepository.getAll.mockResolvedValue(result);

      expect(await service.getAll(getDto)).toEqual(result);
      expect(mockUserRepository.getAll).toHaveBeenCalledWith(getDto);
    });

    it('should return a bad request when search is invalid', async () => {
      const getDto: GetUserDto = { limit: 10, offset: 0, search: 'invalid search', select: [] };
      const error = new BadRequestException('Invalid search');
      mockUserRepository.getAll.mockRejectedValue(error);
  
      try {
        await service.getAll(getDto);
      } catch (e) {
        // Check if the error thrown is the BadRequestException
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid search');
      }
      expect(mockUserRepository.getAll).toHaveBeenCalledWith(getDto);
    });

  });


  describe('getById', () => {
    it('should return a user by id', async () => {
      const expectedCountry: User = {
        id: 1,
        email: 'a@a.com', 
        password: '123456',
        name: 'Test-name',
        role:UserRoleEnum.ADMIN,
        prediction:[],
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined
      };

      mockUserRepository.getById.mockResolvedValue(expectedCountry);

      const returnedCountry = await service.getById(1, {});

      expect(returnedCountry).toEqual(expectedCountry);
      expect(mockUserRepository.getById).toHaveBeenCalledWith(1, {});
    });

    it('should handle user not found', async () => {
      mockUserRepository.getById.mockResolvedValue(null); // Simulating user not found

      try {
        await service.getById(6666666666, {}); // Pass a non-existent ID
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error.message);
      }

      expect(mockUserRepository.getById).toHaveBeenCalledWith(6666666666, {});
    });
  });


  describe('update', () => {
    it('should update a user', async () => {
      const updateDto: UpdateUserDto = {
        email: 'a@a.com', name: 'Test-name',
        role:UserRoleEnum.ADMIN
      };
      const result: User = {
        id: 1,
        email: 'a@a.com', 
        password: '123456',
        name: 'Test-name',
        role:UserRoleEnum.ADMIN,
        prediction:[],
        createdAt: undefined,
        updatedAt: undefined,
        deletedAt: undefined
      };

      mockUserRepository.update.mockResolvedValue(result);

      expect(await service.update(1, updateDto)).toEqual(result);
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
    it('should return a bad request for invalid values', async () => {
      const updateDto: UpdateUserDto = {
        email: '', 
        name: '', 
        role: 'invalidRole' as UserRoleEnum,
      };
  
  
      // Mocking the update method of UserRepository to throw a BadRequestException
      mockUserRepository.update.mockRejectedValue(new BadRequestException('Invalid input'));
  
      try {
        await service.update(1, updateDto); // Pass a valid ID (1) and the updateDto
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid input');
      }
  
      expect(mockUserRepository.update).toHaveBeenCalledWith(1, updateDto);
    });
  });

  
  describe('delete', () => {
    it('should delete a user', async () => {
      const result = { affected: 1 };

      mockUserRepository.delete.mockResolvedValue(result);

      expect(await service.delete(1)).toEqual(result);
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });
    it('should return a bad request when user is not found', async () => {
      const result = { affected: 0 }; // Simulating that no rows were affected (user not found)
  
      mockUserRepository.delete.mockResolvedValue(result);
  
      try {
        await service.delete(1); // Pass a valid ID ('1') for deletion
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error.message); 
      }
  
      expect(mockUserRepository.delete).toHaveBeenCalledWith(1);
    });

  });


});
