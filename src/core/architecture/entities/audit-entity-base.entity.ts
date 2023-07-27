import { EntityId } from '../types/enity-id.type';

export class AuditEntityBase {
  id: EntityId;

  timestamp: Date;

  action: string;

  actionDoneBy: EntityId;

  entityId: EntityId;

  actionDescription: string;

  oldValue: object;

  newValue: object;
}
