import {
  Table,
  Column,
  DataType,
  ForeignKey,
  BelongsTo,
  Model,
} from "sequelize-typescript";
import { ApiDocs, RequestRequired, ResponseRequired, UpdateRequired } from "../documentation/decorators";

@ApiDocs(true)
@Table({
  tableName: "thing",
})
export class Thing extends Model<Thing> {
  @ResponseRequired(true)
  @RequestRequired(true)
  @UpdateRequired(true)
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;
}
