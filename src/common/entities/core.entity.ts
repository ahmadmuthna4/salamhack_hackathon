import {
    CreateDateColumn,
    DeleteDateColumn,
    Index,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';

export abstract class CoreEntity {
    
@PrimaryGeneratedColumn()
id:number;

    @CreateDateColumn()
    @Index()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;


    @DeleteDateColumn({ name: 'deleted_at' }) // Specify the name of the delete date column
    deletedAt: Date; // Optional: You can add this property for type checking or custom logic
}
