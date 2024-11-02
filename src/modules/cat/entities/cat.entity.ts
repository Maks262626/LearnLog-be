import sequelize from 'sequelize';
import { Table, Column, Model } from 'sequelize-typescript';

@Table({tableName: 'cat'})
export class Cat extends Model {
  @Column
  name: string;

  @Column
  age: number;

  @Column
  breed: string;
}

export const catProviders = [{
  provide: "CATS_REPOSITORY",
  useValue: Cat,
  sequelize,
  modelName: 'Cat'
}]