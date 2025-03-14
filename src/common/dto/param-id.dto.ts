import { IsNotEmpty, IsNumberString } from 'class-validator';

export class ParamIdDto {
  @IsNotEmpty()
  @IsNumberString()
  id: number;
}
