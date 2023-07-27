import { EntityId } from '../types/enity-id.type';

export class EntityBase {
  id: EntityId;

  deleted_at: Date;

  created_at: Date;

  created_by: EntityId;

  updated_by: EntityId;

  deleted_by: EntityId;

  status: string;
}
