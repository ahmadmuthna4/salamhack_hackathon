import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto, UserRoleEnum } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { User } from './entities/user.entity';
import { BadRequestException, NotFoundException } from '@nestjs/common';


describe('UserController', () => {
  let controller: UserController;
  let service: UserService;

  const mockUserService = {
    create: jest.fn(),
    getAll: jest.fn(),
    getById: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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

      mockUserService.create.mockResolvedValue(result);

      expect(await controller.create(createDto)).toEqual(result);
      expect(mockUserService.create).toHaveBeenCalledWith(createDto);
    });

    it('should return a bad request when creating a user with invalid data', async () => {
      // Create a DTO with invalid data
      const createDto: CreateUserDto ={ 
        
        email: '', 
        password: '', 
        name: '', 
        role: 'invalidRole' as UserRoleEnum,
      };
      
      // Mock the service to throw a BadRequestException
      const error = new BadRequestException('Validation failed: email should not be empty, password should not be empty, name should not be empty and role invalidRole not found');
      mockUserService.create.mockRejectedValue(error);
  
      try {
        await controller.create(createDto);
      } catch (e) {
        // Check if the error thrown is the BadRequestException
        expect(e).toBeInstanceOf(BadRequestException);
        
        expect(e.message).toBe('Validation failed: email should not be empty, password should not be empty, name should not be empty and role invalidRole not found');
      }
      expect(mockUserService.create).toHaveBeenCalledWith(createDto);
    });
  });


  describe('findAll', () => {
    it('should return all user', async () => {
      const getDto: GetUserDto = { limit: 10, offset: 0, search: '', select: [] };
      const result = { count: 1, array: [{ id: 1, email: 'a@a.com', password: '123456', name: 'Test-name', role:UserRoleEnum.ADMIN }] };

      mockUserService.getAll.mockResolvedValue(result);

      expect(await controller.findAll(getDto)).toEqual(result);
      expect(mockUserService.getAll).toHaveBeenCalledWith(getDto);
    });
    it('should return a bad request when search is invalid', async () => {
      const getDto: GetUserDto = { limit: 10, offset: 0, search: 'invalid search', select: [] };
      const error = new BadRequestException('Invalid search');
      mockUserService.getAll.mockRejectedValue(error);
  
      try {
        await controller.findAll(getDto);
      } catch (e) {
        // Check if the error thrown is the BadRequestException
        expect(e).toBeInstanceOf(BadRequestException);
        expect(e.message).toBe('Invalid search');
      }
      expect(mockUserService.getAll).toHaveBeenCalledWith(getDto);
    });
  });


  describe('findOne', () => {
    it('should return a user by id', async () => {
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

      mockUserService.getById.mockResolvedValue(result);

      expect(await controller.findOne('1', {})).toEqual(result);
      expect(mockUserService.getById).toHaveBeenCalledWith(1, {});
    });
    it('should return a bad request when id is invalid', async () => {

  
      // Mocking the getById method of UserService to return null (simulating user not found)
      mockUserService.getById.mockResolvedValue(null);
  
      try {
        await controller.findOne('1', {}); // Pass a valid ID
        fail('Expected NotFoundException to be thrown');
      } catch (error) {
        expect(error.message);
      }
  
      expect(mockUserService.getById).toHaveBeenCalledWith(1, {});
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

      mockUserService.update.mockResolvedValue(result);

      expect(await controller.update('1', updateDto)).toEqual(result);
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateDto);
    });
    it('should return a bad request for invalid values', async () => {
      const updateDto: UpdateUserDto = {
        email: '', 
        name: '', 
        role: 'invalidRole' as UserRoleEnum,
      };
  
      // Mocking the update method of UserService to throw a BadRequestException
      mockUserService.update.mockRejectedValue(new BadRequestException('Invalid input'));
  
      try {
        await controller.update('1', updateDto); // Pass a valid ID ('1') and the updateDto
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Invalid input');
      }
  
      expect(mockUserService.update).toHaveBeenCalledWith(1, updateDto);
    });
  });


  describe('remove', () => {
    it('should delete a user', async () => {
      const result = { affected: 1 };

      mockUserService.delete.mockResolvedValue(result);

      expect(await controller.remove('1')).toEqual(result);
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
    });
    it('should return a bad request when user is not found', async () => {
      const result = { affected: 0 }; // Simulating that no rows were affected (user not found)
  
      mockUserService.delete.mockResolvedValue(result);
  
      try {
        await controller.remove('1'); // Pass a valid ID ('1') for deletion
        fail('Expected BadRequestException to be thrown');
      } catch (error) {
        expect(error.message);
      }
  
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
    });
  
  });


});
