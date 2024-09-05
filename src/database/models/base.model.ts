import { Model } from 'objection';

export class BaseModel extends Model {
    readonly id: string;
}
